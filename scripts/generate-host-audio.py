"""Generate the authored German narration ahead of deployment (edge-tts==7.3.1).

Usage: node scripts/host-audio-source.cjs > /tmp/sip-host-source.json
       python scripts/generate-host-audio.py /tmp/sip-host-source.json /tmp/sip-host-audio
No cloud credentials, database access or production endpoint are required.
"""
import asyncio,hashlib,importlib,json,os,ssl,subprocess,sys
from pathlib import Path
import edge_tts
# Use the environment's CA trust, including its configured HTTPS proxy CA.
importlib.import_module('edge_tts.communicate')._SSL_CTX=ssl.create_default_context()
VOICES={'audio:katja':('de-DE-KatjaNeural','+4%','+2Hz'),'audio:conrad':('de-DE-ConradNeural','+3%','+1Hz')}
async def main():
 source=json.loads(Path(sys.argv[1]).read_text());root=Path(sys.argv[2]);root.mkdir(parents=True,exist_ok=True)
 semaphore=asyncio.Semaphore(3);manifest={}
 async def render(item,voice_id,config):
  async with semaphore:
   voice,rate,pitch=config;key=hashlib.sha256((item['fingerprint']+'\n'.join(c['text'] for c in item['chapters'])+voice+rate+pitch).encode()).hexdigest()[:20]
   folder=root/'segments';folder.mkdir(exist_ok=True);pcm=bytearray();chapters=[]
   for i,c in enumerate(item['chapters']):
    segment_key=hashlib.sha256((voice+rate+pitch+c['text']).encode()).hexdigest()
    mp3=folder/(segment_key+'.mp3');raw=folder/(segment_key+'.pcm')
    if not mp3.exists() or mp3.stat().st_size<100:
     for attempt in range(3):
      try:
       engine=edge_tts.Communicate(c['text'],voice,rate=rate,pitch=pitch,proxy=os.environ.get('HTTPS_PROXY'))
       await asyncio.wait_for(engine.save(str(mp3)),90);break
      except Exception:
       mp3.unlink(missing_ok=True)
       if attempt==2:raise
       await asyncio.sleep(1+attempt)
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(mp3),'-f','s16le','-ar','24000','-ac','1',str(raw)],check=True)
    chapters.append({'title':c['title'],'start':round(len(pcm)/48000,3)})
    pcm.extend(raw.read_bytes())
   total=root/f"{item['slug']}-{voice_id.split(':')[1]}-{key}.mp3"
   subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','s16le','-ar','24000','-ac','1','-i','pipe:0','-codec:a','libmp3lame','-b:a','96k','-metadata','title='+item['slug'],'-metadata','comment=Synthetische deutsche Stimme: '+voice,str(total)],input=bytes(pcm),check=True)
   duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(total)],text=True).strip())
   entry={'file':total.name,'duration':round(duration,3),'chapters':chapters,'voice':voice,'rate':rate,'pitch':pitch}
   manifest.setdefault(item['fingerprint'],{'slug':item['slug'],'voices':{}})['voices'][voice_id]=entry
   print(item['slug'],voice_id,round(duration),len(chapters),'chapters',flush=True)
 await asyncio.gather(*(render(item,voice,config) for item in source for voice,config in VOICES.items()))
 (root/'manifest.local.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
 print('Generated',len(manifest),'complete host backgrounds',flush=True)
asyncio.run(main())
