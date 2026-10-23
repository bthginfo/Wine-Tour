// Run once when introducing localization; generated IDs are stable hashes of German source copy.
import {parse} from 'svelte/compiler';
import {readFile,writeFile,readdir,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const dictionary={};
const key=s=>{const k='m_'+createHash('sha1').update(s).digest('hex').slice(0,10);dictionary[k]=s;return k;};
async function files(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?files(dir+'/'+e.name):[dir+'/'+e.name]))).flat();}
for(const file of (await files('src')).filter(f=>f.endsWith('.svelte'))){
 let source=await readFile(file,'utf8');
 if(source.includes("from '#lib/i18n.ts'"))continue;
 // Keep stored cellar style values language-independent when translating labels.
 source=source.replace(/<option>(Weiß|Rosé|Rot|Prickelnd|Sonstiges)<\/option>/g,'<option value="$1">$1</option>');
 const ast=parse(source,{modern:true});const edits=[];
 function visit(n){if(!n||typeof n!=='object')return;
  if(n.type==='Text'&&/[a-zA-ZäöüÄÖÜß]/.test(n.data)){
   const text=n.data.trim();if(text){const raw=source.slice(n.start,n.end);const leading=raw.match(/^\s*/)[0],trailing=raw.match(/\s*$/)[0];edits.push({start:n.start,end:n.end,value:leading+`{t('${key(text)}')}`+trailing});}return;
  }
  if(n.type==='Attribute'){
   if(['placeholder','aria-label','title','alt'].includes(n.name)&&n.value?.length===1&&n.value[0].type==='Text'&&/[a-zA-ZäöüÄÖÜß]/.test(n.value[0].data))edits.push({start:n.start,end:n.end,value:n.name+`={t('${key(n.value[0].data)}')}`});
   return;
  }
  for(const [k,v] of Object.entries(n)){if(['instance','module','css','metadata','attributes'].includes(k)){if(k==='attributes'&&Array.isArray(v))v.forEach(visit);continue;}if(Array.isArray(v))v.forEach(visit);else if(v&&typeof v==='object')visit(v);}
 }
 visit(ast.fragment);
 if(edits.length){edits.sort((a,b)=>b.start-a.start);for(const e of edits)source=source.slice(0,e.start)+e.value+source.slice(e.end);source=source.replace('<script lang="ts">',"<script lang=\"ts\">\n import {t} from '#lib/i18n.ts';");await writeFile(file,source);}
}
await mkdir('src/lib/locales/de',{recursive:true});await writeFile('src/lib/locales/de/ui.json',JSON.stringify(dictionary,null,2)+'\n');console.log(Object.keys(dictionary).length+' static UI messages extracted.');
