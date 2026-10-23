// Usage: NODE_USE_ENV_PROXY=1 node --env-file=.env.blob scripts/publish-host-audio.mjs /tmp/sip-host-audio
// Uses the existing Blob store. Only a complete, current authored catalogue is published.
import {readFile,writeFile,rename} from 'node:fs/promises';
import {resolve,basename} from 'node:path';
import {execFileSync} from 'node:child_process';
import {head,put,BlobNotFoundError} from '@vercel/blob';

if(!process.env.BLOB_READ_WRITE_TOKEN)throw Error('BLOB_READ_WRITE_TOKEN is required');
if(!process.argv[2])throw Error('Pass the generated audio directory');
const root=resolve(process.argv[2]),manifest=JSON.parse(await readFile(resolve(root,'manifest.local.json'),'utf8'));
const source=JSON.parse(execFileSync(process.execPath,['scripts/host-audio-source.cjs'],{encoding:'utf8'}));
const expectedVoices=['audio:florian','audio:seraphina'];
if(Object.keys(manifest).length!==source.length)throw Error('Incomplete host audio catalogue');
const jobs=[];
for(const item of source){
 const entry=manifest[item.fingerprint];
 if(!entry||entry.slug!==item.slug||JSON.stringify(Object.keys(entry.voices).sort())!==JSON.stringify(expectedVoices))throw Error('Missing current recordings: '+item.slug);
 for(const [voice,recording] of Object.entries(entry.voices)){
  if(recording.synthesis!=='continuous-v2'||basename(recording.file)!==recording.file||!recording.file.endsWith('.mp3'))throw Error('Invalid recording: '+item.slug);
  if(JSON.stringify(recording.chapters.map(c=>c.title))!==JSON.stringify(item.chapters.map(c=>c.title)))throw Error('Chapters do not match: '+item.slug);
  let previous=-1;for(const chapter of recording.chapters){if(!Number.isFinite(chapter.start)||chapter.start<=previous||chapter.start>=recording.duration)throw Error('Invalid chapter timing');previous=chapter.start;}
  const bytes=await readFile(resolve(root,recording.file));if(bytes.length<1000)throw Error('Audio file is empty');
  jobs.push({key:item.fingerprint,slug:item.slug,voice,recording,bytes});
 }
}
const published={};
async function worker(){
 while(jobs.length){
  const {key,slug,voice,recording,bytes}=jobs.shift();const pathname='host-audio/'+recording.file;let blob;
  try{blob=await head(pathname);if(blob.size!==bytes.length)throw Error('Immutable Blob name has different bytes');}
  catch(error){if(!(error instanceof BlobNotFoundError))throw error;blob=await put(pathname,bytes,{access:'public',contentType:'audio/mpeg',addRandomSuffix:false,allowOverwrite:false,cacheControlMaxAge:31536000});}
  const {file,...metadata}=recording;
  published[key]??={slug,voices:{}};published[key].voices[voice]={url:blob.url,...metadata};
  console.log('Published',slug,voice);
 }
}
await Promise.all([worker(),worker(),worker()]);
const ordered=Object.fromEntries(source.map(item=>[item.fingerprint,published[item.fingerprint]]));
const text=JSON.stringify(ordered,null,2)+'\n';
await writeFile(resolve(root,'manifest.uploaded.json'),text);
const target='src/lib/locales/de/host-audio.json';await writeFile(target+'.tmp',text);await rename(target+'.tmp',target);
console.log('Published',source.length,'complete narrated guides');
