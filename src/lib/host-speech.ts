export type SpeechChapter = {title:string;text:string};
export const hostNarrationVersion='guide-v2';

/** Keep display copy intact; pronunciation fixes only affect the spoken version. */
export function hostPronunciation(text:string):string {
 return text.replace(/https?:\/\/\S+/g,'').replace(/\*\*/g,'')
  .replace(/Rheinebene(n)?/g,(_,plural)=>'Rhein Ebene'+(plural||''))
  .replace(/Juan Gil/g,'Chuan Chil').replace(/Jumilla/g,'Chumija').replace(/Etiqueta Plata/g,'Etikéta Pláta').replace(/\bDOP\b/g,'De Oh Pe').replace(/\ben vaso\b/g,'en Basso')
  .replace(/\bJUWEL\b/g,'Juwel').replace(/\bJUliane\b/g,'Juliane').replace(/\bELler\b/g,'Eller').replace(/\bVDP\b/g,'Vau De Pe')
  .replace(/\bIII\s+Freunde\b/gi,'Drei Freunde')
  .replace(/\bTCA\b/g,'Te Ce A').replace(/CO₂/g,'Kohlendioxid')
  .replace(/(\d)\s*[–-]\s*(\d)/g,'$1 bis $2').replace(/°\s*C\b/g,' Grad Celsius')
  .replace(/\s*·\s*/g,'. ').replace(/\n+/g,' ').replace(/\s+/g,' ').trim();
}

/** Closed accordion topics are included in full, independently of their visual state. */
export function hostSpeechChapters(paragraphs:string[]):SpeechChapter[] {
 const chapters:SpeechChapter[]=[];
 for(const raw of paragraphs){
  const text=raw.trim();if(!text)continue;const split=text.indexOf('\n');
  if(split>0&&split<110)chapters.push({title:text.slice(0,split),text:text.slice(split+1).trim()});
  else if(chapters.length&&chapters.at(-1)?.title==='Grundwissen')chapters.at(-1)!.text+='\n\n'+text;
  else chapters.push({title:'Grundwissen',text});
 }
 return chapters;
}

export function hostSpeechChunks(paragraphs:string[],limit=230):string[]{
 const result:string[]=[];
 for(const paragraph of paragraphs){
  const text=hostPronunciation(paragraph);let chunk='';
  for(const sentence of text.split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ„“])/u)){
   for(const word of sentence.split(/\s+/)){
    if(chunk&&chunk.length+word.length+1>limit){result.push(chunk);chunk='';}
    chunk+=(chunk?' ':'')+word;
   }
   if(chunk&&/[.!?]$/.test(chunk)){result.push(chunk);chunk='';}
  }
  if(chunk)result.push(chunk);
 }
 return result.filter(Boolean);
}

export async function hostSpeechFingerprint(paragraphs:string[]):Promise<string>{
 const source=paragraphs.map(p=>p.trim()).filter(Boolean).join('\n\n');
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(source));
 return Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');
}

export function speechClock(seconds:number):string{
 const value=Math.max(0,Math.floor(Number.isFinite(seconds)?seconds:0));
 return Math.floor(value/60)+':'+String(value%60).padStart(2,'0');
}
