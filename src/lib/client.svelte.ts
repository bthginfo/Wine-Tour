const browser=typeof window!=='undefined';
export const session=$state<{user:any;notes:any[];rooms:any[];loaded:boolean;error:string}>({user:null,notes:[],rooms:[],loaded:false,error:''});
export async function api(path:string,body?:unknown,method?:string){const r=await fetch('/api/'+path,{method:method??(body?'POST':'GET'),headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});const data=await r.json();if(!r.ok)throw new Error(data.error||'Das hat gerade nicht geklappt.');return data;}
export async function refreshSession(){if(!browser)return;try{const d=await api('me');session.user=d.user;session.notes=d.notes;session.rooms=d.rooms;session.error='';}catch(e){session.error=(e as Error).message;}session.loaded=true;}
export const ui=$state({createOpen:false,joinOpen:false});
export function noteKey(room:string,wine:string){return `sip:note:${room}:${wine}`;}
