"""Pre-render the authored German host guides with edge-tts==7.3.1.

Usage: node scripts/host-audio-source.cjs > /tmp/sip-host-source.json
       python scripts/generate-host-audio.py /tmp/sip-host-source.json /tmp/sip-host-audio

Each guide is synthesized in one continuous request. Chapter titles are navigation
markers, never spoken fragments. Word timings come from that same audio stream.
Only authored catalogue text is read; no CMS, notes or database credentials.
"""
import asyncio,hashlib,importlib,json,os,ssl,subprocess,sys
from pathlib import Path
from xml.sax.saxutils import escape
import edge_tts
importlib.import_module('edge_tts.communicate')._SSL_CTX=ssl.create_default_context()
VOICES={'audio:florian':'de-DE-FlorianMultilingualNeural','audio:seraphina':'de-DE-SeraphinaMultilingualNeural'}
RATE='+0%'
PITCH='+0Hz'


def chapter_timings(item,events):
 text=' '.join(chapter['text'] for chapter in item['chapters']);folded=text.casefold()
 starts=[];cursor=0
 for chapter in item['chapters']:
  starts.append(cursor);cursor+=len(chapter['text'].casefold())+1
 # Align service word boundaries to the source, retaining exact audio offsets.
 located=[];cursor=0;missed=[]
 for event in events:
  word=event['text'].casefold();at=folded.find(word,cursor)
  if at<0:missed.append(event['text']);continue
  located.append((at,event['offset']/10_000_000));cursor=at+len(word)
 if missed or not located or cursor<len(folded.rstrip('.!? '))-3:
  raise ValueError(f"Incomplete timing alignment for {item['slug']}: {missed[:5]}, {cursor}/{len(text)}")
 chapters=[]
 for index,(chapter,start) in enumerate(zip(item['chapters'],starts)):
  matching=next((seconds for at,seconds in located if at>=start),None)
  if matching is None:raise ValueError('Missing chapter timing: '+chapter['title'])
  chapters.append({'title':chapter['title'],'start':0 if index==0 else round(matching,3)})
 return chapters


async def main():
 source=json.loads(Path(sys.argv[1]).read_text());root=Path(sys.argv[2]);root.mkdir(parents=True,exist_ok=True)
 cache=root/'continuous';cache.mkdir(exist_ok=True)
 semaphore=asyncio.Semaphore(6);manifest={}
 async def render(item,voice_id,voice):
  async with semaphore:
   text=' '.join(chapter['text'] for chapter in item['chapters'])
   # Keep a generous limit below the websocket message size. Never silently truncate.
   if len(escape(text).encode())>24000:raise ValueError('Guide too long for continuous synthesis: '+item['slug'])
   key=hashlib.sha256(('continuous-v2'+item['fingerprint']+text+voice+RATE+PITCH).encode()).hexdigest()[:20]
   raw=cache/(key+'.mp3');metadata=cache/(key+'.json')
   if not raw.exists() or not metadata.exists():
    print('Rendering',item['slug'],voice_id,flush=True)
    for attempt in range(3):
     temp=cache/(key+'.part');events=[]
     try:
      engine=edge_tts.Communicate(text,voice,rate=RATE,pitch=PITCH,boundary='WordBoundary',proxy=os.environ.get('HTTPS_PROXY'),receive_timeout=90)
      # The library's default 4 KB split can cut a sentence at a word boundary.
      # Our bounded authored guides fit one message, preserving narrative context.
      engine.texts=[escape(text).encode()]
      async def stream():
       with temp.open('wb') as output:
        async for event in engine.stream():
         if event['type']=='audio':output.write(event['data'])
         elif event['type']=='WordBoundary':events.append(event)
      await asyncio.wait_for(stream(),900)
      chapter_timings(item,events)
      temp.replace(raw);metadata.write_text(json.dumps(events,ensure_ascii=False));break
     except Exception:
      temp.unlink(missing_ok=True)
      if attempt==2:raise
      await asyncio.sleep(2+attempt)
   events=json.loads(metadata.read_text());chapters=chapter_timings(item,events)
   total=root/f"{item['slug']}-{voice_id.split(':')[1]}-{key}.mp3"
   # Preserve the original encoded stream; avoid lossy re-encoding and chapter joins.
   subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(raw),'-c:a','copy','-metadata','title='+item['slug'],'-metadata','comment=Synthetische deutsche Stimme: '+voice,str(total)],check=True)
   duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(total)],text=True).strip())
   if chapters[-1]['start']>=duration:raise ValueError('Chapter outside audio')
   entry={'file':total.name,'duration':round(duration,3),'chapters':chapters,'voice':voice,'rate':RATE,'pitch':PITCH,'synthesis':'continuous-v2'}
   manifest.setdefault(item['fingerprint'],{'slug':item['slug'],'voices':{}})['voices'][voice_id]=entry
   (root/'manifest.partial.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
   print('Ready',item['slug'],voice_id,round(duration),len(chapters),'chapters',flush=True)
 await asyncio.gather(*(render(item,voice_id,voice) for item in source for voice_id,voice in VOICES.items()))
 (root/'manifest.local.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
 print('Generated',len(manifest),'continuous guides',flush=True)

if __name__=='__main__':asyncio.run(main())
