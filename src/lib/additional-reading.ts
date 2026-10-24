import type {ArticleSection} from './content';
import {hostSpeechChapters} from './host-speech';

type ReadingSource={intro?:string;paragraphs?:string[];sections?:ArticleSection[];fact?:string;host?:string[];additionalInfo?:ArticleSection[]};
const normalize=(text:string)=>text.normalize('NFC').replace(/\s+/g,' ').trim().toLocaleLowerCase('de-DE');

/** The editorial explanations are shared reading; room-specific host notes stay separate. */
export function additionalReading(article:ReadingSource):ArticleSection[]{
 const known=new Set([article.intro||'',article.fact||'',...(article.paragraphs||[]),...(article.sections||[]).map(s=>s.body)].flatMap(text=>[text,...text.split(/\n+/)]).map(normalize));
 const chapters=article.additionalInfo??hostSpeechChapters(article.host||[]).map(c=>({title:c.title==='Grundwissen'?'':c.title,body:c.text}));
 return chapters.flatMap(chapter=>{
  const parts=chapter.body.split(/\n+/).map(p=>p.trim()).filter(p=>{const key=normalize(p);if(!key||known.has(key))return false;known.add(key);return true;});
  return parts.length?[{title:chapter.title,body:parts.join('\n\n')}]:[];
 });
}
