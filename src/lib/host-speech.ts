// Short utterances keep browser speech reliable for longer host background.
export function hostSpeechChunks(paragraphs:string[],limit=260):string[]{
 const result:string[]=[];
 for(const paragraph of paragraphs){
  const text=paragraph.replace(/https?:\/\/\S+/g,'').replace(/\*\*/g,'').replace(/\s*·\s*/g,'. ').replace(/\n+/g,'. ').replace(/\s+/g,' ').trim();
  let chunk='';
  for(const sentence of text.split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ„“])/u)){
   for(const word of sentence.split(/\s+/)){
    if(chunk&&chunk.length+word.length+1>limit){result.push(chunk);chunk='';}
    chunk+=(chunk?' ':'')+word;
   }
   if(chunk&&/[.!?]$/.test(chunk)&&chunk.length>limit*.65){result.push(chunk);chunk='';}
  }
  if(chunk)result.push(chunk);
 }
 return result.filter(Boolean);
}
