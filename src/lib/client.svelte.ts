import {t} from './i18n';
const browser = typeof window !== 'undefined';
export const session = $state<{user:any;notes:any[];rooms:any[];draftOwner:string;loaded:boolean;error:string}>({user:null,notes:[],rooms:[],draftOwner:'',loaded:false,error:''});
export const noteSync = $state({pending:0,syncing:false,error:''});
export const ui = $state({createOpen:false,joinOpen:false});

type Draft = {owner:string;data:any;updated:number;pending:boolean};
const memoryDrafts = new Map<string,Draft>();
let syncing:Promise<void>|undefined;
export function noteKey(room:string,wine:string){return `sip:note:${room}:${wine}`;}

export async function api(path:string,body?:unknown,method?:string,options:RequestInit={}){
 const r=await fetch('/api/'+path,{...options,method:method??(body?'POST':'GET'),headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});
 const data=await r.json();if(!r.ok)throw new Error(data.error||data.message||'Das hat gerade nicht geklappt.');return data;
}

function readDraft(key:string):Draft|undefined {
 if(!browser)return;
 try {const draft=JSON.parse(localStorage.getItem(key)||'null');if(draft?.owner&&Number.isFinite(draft.updated)&&draft.data){const memory=memoryDrafts.get(key);return memory&&memory.updated>=draft.updated?memory:draft;}}catch{}
 return memoryDrafts.get(key);
}
export function readNoteDraft(key:string){const draft=readDraft(key);return draft?JSON.stringify(draft):null;}
function storeDraft(key:string,draft:Draft){memoryDrafts.set(key,draft);try{localStorage.setItem(key,JSON.stringify(draft));}catch{}}
function pendingDrafts(){
 const keys=new Set(memoryDrafts.keys());
 if(browser)try{for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key?.startsWith('sip:note:'))keys.add(key);}}catch{}
 return [...keys].flatMap(key=>{const match=key.match(/^sip:note:([A-Z2-9]{6}):(secco|juwel|riesling|rot)$/);const draft=readDraft(key);return match&&draft?.pending&&draft.owner===session.draftOwner?[{key,room:match[1],wine:match[2],draft}]:[];});
}
function mergeDrafts(notes:any[]){
 // A participant can join on several devices. Show the latest note once per wine and tasting.
 const latest=new Map<string,any>();
 for(const note of notes){const key=noteKey(note.room,note.wine);const previous=latest.get(key);if(!previous||Date.parse(note.updated_at)>Date.parse(previous.updated_at))latest.set(key,{...note,pending:false});}
 const pending=pendingDrafts();noteSync.pending=pending.length;
 for(const {key,room,wine,draft} of pending){const saved=latest.get(key);const joined=session.rooms.find(r=>r.code===room);latest.set(key,{...saved,room,wine,data:draft.data,updated_at:new Date(draft.updated).toISOString(),room_name:saved?.room_name||joined?.name||'Weinprobe '+room,room_settings:saved?.room_settings||joined?.settings||{},pending:true});}
 return [...latest.values()].sort((a,b)=>Date.parse(b.updated_at)-Date.parse(a.updated_at));
}
export async function refreshSession(){
 if(!browser)return;
 try{const d=await api('me');session.user=d.user;session.rooms=d.rooms;session.draftOwner=d.draftOwner;session.notes=mergeDrafts(d.notes);session.error='';}catch(e){session.error=(e as Error).message;}
 session.loaded=true;
}
export function saveNoteDraft(room:string,wine:string,data:unknown){
 if(!browser||!session.draftOwner)return;
 const key=noteKey(room,wine);const updated=Math.max(Date.now(),(readDraft(key)?.updated||0)+1);
 storeDraft(key,{owner:session.draftOwner,data,updated,pending:true});
 session.notes=mergeDrafts(session.notes);noteSync.error='';
}
export function syncPendingNotes():Promise<void>{
 if(syncing)return syncing;
 if(!browser||!session.draftOwner||!pendingDrafts().length)return Promise.resolve();
 syncing=(async()=>{
  noteSync.syncing=true;noteSync.error='';const owner=session.draftOwner;let saved=false;
  try{
   // One queue serializes edits, including edits made while a previous request is in flight.
   while(owner===session.draftOwner){
    const next=pendingDrafts()[0];if(!next)break;
    const controller=new AbortController();const deadline=setTimeout(()=>controller.abort(),10000);
    try{await api('rooms/'+next.room+'/notes',{wine:next.wine,data:next.draft.data},'POST',{keepalive:true,signal:controller.signal});}finally{clearTimeout(deadline);}
    if(owner!==session.draftOwner)break;
    const current=readDraft(next.key);
    if(current?.owner===owner&&current.updated===next.draft.updated)storeDraft(next.key,{...current,pending:false});
    saved=true;session.notes=mergeDrafts(session.notes);
   }
  }catch{noteSync.error=t('notes.syncError');}
  finally{if(saved&&owner===session.draftOwner)await refreshSession();noteSync.pending=pendingDrafts().length;noteSync.syncing=false;syncing=undefined;if(noteSync.pending&&!noteSync.error&&owner===session.draftOwner)queueMicrotask(()=>void syncPendingNotes());}
 })();
 return syncing;
}
