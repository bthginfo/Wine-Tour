import type {Article, Wine, Step} from '../content';
import {tastingWine} from '../tasting-wine';
import {learningScene,type LearningScene} from '../learning-scene';
import {additionalReading} from '../additional-reading';
import companions from '../locales/de/story-companions.json' with {type:'json'};
import companionMedia from '../story-media.json' with {type:'json'};
import regionProfiles from '../locales/de/region-profiles.json' with {type:'json'};

export type TastingNote = {text:string;aromas:string[];rating:number;sweetness:number;acidity:number};
export type NoteRecord = {room:string;wine:string;data:Partial<TastingNote>;updated_at:string};
export type ImageCredit = {text:string;url?:string};
export type PdfCompanion={title:string;image:string;caption:string;credit:ImageCredit;milestones:{year:string;title:string;body:string}[]};
export type PdfLandscape={title:string;caption:string;parts:{title:string;body:string}[]};
export type PdfArticle = Pick<Article,'slug'|'title'|'intro'|'paragraphs'|'sections'|'fact'|'visual'|'image'|'imagePosition'|'imageFit'> & {credit:ImageCredit;label:string;additionalInfo?:{title:string;body:string}[];scene?:LearningScene;profile?:{label:string;value:string}[];companion?:PdfCompanion;landscape?:PdfLandscape};
export type PdfEntry = {type:'article';wine:number;article:PdfArticle;interlude:boolean}|{type:'notes';wine:number;note:TastingNote}|{type:'pending';wine:number;sections:{title:string;body:string}[]};
export type TastingBook = {name:string;code:string;participant:string;exportedAt:string;wines:(Wine & {vintage:string})[];entries:PdfEntry[]};
const score=(n:unknown)=>typeof n==='number'&&Number.isFinite(n)?Math.max(0,Math.min(5,Math.round(n))):0;
export function cleanNote(value:Partial<TastingNote>|null|undefined):TastingNote {
 return {text:typeof value?.text==='string'?value.text:'',aromas:Array.isArray(value?.aromas)?value.aromas.filter((a):a is string=>typeof a==='string'):[],rating:score(value?.rating),sweetness:score(value?.sweetness),acidity:score(value?.acidity)};
}
export function makeTastingBook(args:{includeAdditionalInfo?:boolean;room:{name:string;code:string;settings:Record<string,any>};participant:string;wines:Wine[];articles:Article[];steps:Step[];notes:NoteRecord[];draftOwner:string;readDraft:(key:string)=>string|null;imageSrc:(key:string)=>string;creditFor:(a:Article)=>ImageCredit}):TastingBook {
 const {room}=args;const config=room.settings||{};
 const wines=args.wines.map(w=>tastingWine(w,config));
 const entries:PdfEntry[]=[];
 const legacyRedSections=[{title:config.redRegion||'Die Region',body:config.redRegionText||''},{title:config.redProducer||'Das Weingut',body:config.redProducerText||''},{title:config.redGrape||'Die Rebsorte',body:config.redGrapeText||''}].filter(s=>s.body);
 let legacyRedIncluded=false;
 for(const step of args.steps){
  if(step.type==='story'||step.type==='break'){
   // Preserve earlier room-specific text alongside the new authored chapters.
   if(step.wine===3&&!legacyRedIncluded&&legacyRedSections.length&&!args.steps.some(s=>s.wine===3&&s.type==='pending')){entries.push({type:'pending',wine:3,sections:legacyRedSections});legacyRedIncluded=true;}
   const a=args.articles.find(a=>a.slug===step.slug);if(!a)continue;
   // Share editorial explanations as extra reading. Room-specific host notes and research links never enter the PDF.
   const companion=companions[a.slug as keyof typeof companions];
   const photo=companion?companionMedia[companion.photo as keyof typeof companionMedia]:undefined;
   const landscape=regionProfiles[a.slug as keyof typeof regionProfiles];
   entries.push({type:'article',wine:step.wine,interlude:step.type==='break',article:{slug:a.slug,title:a.title,intro:a.intro,paragraphs:[...a.paragraphs],sections:a.sections?.map(s=>({...s})),fact:a.fact,visual:a.visual,image:args.imageSrc(a.image),imagePosition:a.imagePosition,imageFit:a.imageFit,credit:args.creditFor(a),scene:learningScene(a.visual,a.slug),...(args.includeAdditionalInfo===false?{}:{additionalInfo:additionalReading(a)}),label:step.type==='break'?'Weinwissen zwischendurch':step.label,...(a.atlas?{profile:a.atlas.facts.map(fact=>({label:fact.label,value:fact.value}))}:{}),...(landscape?{landscape:structuredClone(landscape)}:{}),...(companion&&photo?{companion:{title:companion.title,image:photo.url,caption:companion.caption,credit:{text:companion.credit,url:photo.source},milestones:companion.milestones.map(m=>({...m}))}}:{})}});
  }else if(step.type==='notes'){
   const records=args.notes.filter(n=>n.room===room.code&&n.wine===wines[step.wine].id).sort((a,b)=>Date.parse(b.updated_at)-Date.parse(a.updated_at));
   let note=cleanNote(records[0]?.data);
   // An unsent local edit remains authoritative even if an older request arrived at the server later.
   try{const draft=JSON.parse(args.readDraft(`sip:note:${room.code}:${wines[step.wine].id}`)||'null');if(args.draftOwner&&draft?.owner===args.draftOwner&&draft.pending&&Number.isFinite(draft.updated))note=cleanNote(draft.data);}catch{}
   entries.push({type:'notes',wine:step.wine,note});
  }else if(step.type==='pending'&&step.part===0){
   const sections=[{title:config.redRegion||'Die Region',body:config.redRegionText||''},{title:config.redProducer||'Das Weingut',body:config.redProducerText||''},{title:config.redGrape||'Die Rebsorte',body:config.redGrapeText||''}].filter(s=>s.body);
   entries.push({type:'pending',wine:step.wine,sections});
  }
 }
 return JSON.parse(JSON.stringify({name:room.name,code:room.code,participant:args.participant,exportedAt:new Date().toISOString(),wines,entries}));
}
export function bookFilename(book:TastingBook){const slug=(s:string)=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70);return `sip-happens-${slug(book.name)||'weinprobe'}-${slug(book.participant)||'meine-notizen'}.pdf`;}
