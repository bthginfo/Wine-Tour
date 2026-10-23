<script lang="ts">
 import {onMount,onDestroy,untrack} from 'svelte';
 import {hostSpeechChapters,hostSpeechChunks,hostSpeechFingerprint,hostNarrationVersion,speechClock} from '#lib/host-speech.ts';
 import copy from '#lib/locales/de/host-player.json';
 import audioCatalog from '#lib/locales/de/host-audio.json';
 import Icon from './Icon.svelte';
 let {paragraphs,enabled}:{paragraphs:string[];enabled:boolean}=$props();
 type Recording={url:string;duration:number;chapters:{title:string;start:number}[]};
 type AudioEntry={voices:Record<string,Recording>};
 const catalog=audioCatalog as Record<string,AudioEntry>;
 let supported=$state(false),ready=$state(false),status=$state<'ready'|'playing'|'paused'|'ended'>('ready');
 let voices=$state<SpeechSynthesisVoice[]>([]),selected=$state(''),error=$state(''),hint=$state('');
 let recordings=$state<AudioEntry|undefined>(),position=$state(0),rate=$state(1),volume=$state(1),loading=$state(false);
 let audio=$state<HTMLAudioElement>(),mounted=$state(false);
 let synthesis:SpeechSynthesis|undefined,utterance:SpeechSynthesisUtterance|undefined;
 let run=0,pendingSeek:number|undefined,clock:ReturnType<typeof setInterval>|undefined,lastTick=0,activeEnd=0,dragResume=false;
 const chapters=$derived(hostSpeechChapters(paragraphs));
 const chunks=$derived.by(()=>{
  let seconds=0;const list:{text:string;start:number;end:number;chapter:number}[]=[];
  chapters.forEach((chapter,index)=>hostSpeechChunks([chapter.text],360).forEach(text=>{
   const start=seconds;seconds+=(text.length+1)/14.5;list.push({text,start,end:seconds,chapter:index});
  }));return list;
 });
 const recording=$derived(recordings?.voices[selected]);
 const duration=$derived(recording?.duration||chunks.at(-1)?.end||0);
 const timeline=$derived(recording?.chapters||chapters.map((chapter,index)=>({title:chapter.title,start:chunks.find(c=>c.chapter===index)?.start||0})));
 const currentChapter=$derived(Math.max(0,timeline.findLastIndex(c=>position+.15>=c.start)));
 const canPlay=$derived(ready&&enabled&&duration>0&&(!!recording||supported));
 const playing=$derived(status==='playing');
 const extraCount=$derived(chapters.filter(c=>c.title!==copy.main).length);
 const voiceLabel=$derived(selected==='audio:florian'?copy.florian:selected==='audio:seraphina'?copy.seraphina:voices.find(v=>v.voiceURI===selected)?.name||copy.device);
 function voiceScore(voice:SpeechSynthesisVoice){return (/^de-DE$/i.test(voice.lang)?20:0)+(/natural|neural|premium|enhanced|Google Deutsch|Katja|Anna/i.test(voice.name)?12:0)+(voice.default?3:0);}
 function refreshVoices(){
  voices=(synthesis?.getVoices()||[]).filter(voice=>/^de(?:-|$)/i.test(voice.lang)).sort((a,b)=>voiceScore(b)-voiceScore(a));
  if(!selected)selected=recordings?.voices['audio:florian']?'audio:florian':voices[0]?.voiceURI||'device';
 }
 function cancelNative(){run++;synthesis?.cancel();utterance=undefined;}
 function halt(){cancelNative();audio?.pause();loading=false;}
 function stop(){dragResume=false;halt();position=0;pendingSeek=undefined;status='ready';if(audio)try{audio.currentTime=0;}catch{}}
 function pause(){if(!playing&&!loading)return;halt();status='paused';}
 function nativePlay(at:number){
  if(!synthesis)return;cancelNative();const current=run,engine=synthesis;let index=Math.max(0,chunks.findIndex(c=>c.end>at));
  const voice=voices.find(v=>v.voiceURI===selected)||voices[0];status='playing';lastTick=performance.now();
  const next=()=>{
   if(current!==run)return;const chunk=chunks[index++];
   if(!chunk){position=duration;status='ended';utterance=undefined;return;}
   const offset=Math.max(0,Math.min(chunk.text.length-1,Math.floor((at-chunk.start)*14.5)));
   const wordStart=offset>0?Math.max(0,chunk.text.lastIndexOf(' ',offset)+1):0;
   const message=new SpeechSynthesisUtterance(chunk.text.slice(wordStart));
   message.lang=voice?.lang||'de-DE';message.rate=rate*1.04;message.pitch=1.06;message.volume=volume;if(voice)message.voice=voice;
   position=chunk.start+wordStart/14.5;activeEnd=chunk.end;lastTick=performance.now();utterance=message;
   message.onboundary=event=>{if(current===run&&event.charIndex>=0){position=chunk.start+(wordStart+event.charIndex)/14.5;lastTick=performance.now();}};
   message.onend=()=>{if(current!==run)return;position=chunk.end;at=chunk.end;next();};
   message.onerror=event=>{if(current!==run)return;halt();status='paused';if(!['canceled','interrupted'].includes(event.error))error=copy.deviceError;};
   try{engine.speak(message);engine.resume();}catch{halt();status='paused';error=copy.deviceError;}
  };next();
 }
 async function play(){
  if(!canPlay)return;error='';if(position>=duration-.1)position=0;
  if(recording&&audio){
   const current=++run;loading=true;
   try{
    if(audio.error){pendingSeek=position;audio.load();}
    audio.playbackRate=rate;audio.volume=volume;audio.muted=volume===0;
    if(audio.readyState)audio.currentTime=position;else pendingSeek=position;
    await audio.play();if(current!==run){audio.pause();return;}status='playing';loading=false;
   }catch{if(current===run){loading=false;status='paused';error=copy.audioError;}}
  }else nativePlay(position);
 }
 function seek(value:number){
  let target=Math.max(0,Math.min(duration,Number(value)));if(!Number.isFinite(target))return;
  if(duration-target<.11)target=duration;
  position=target;error='';
  if(target>=duration){halt();status='ended';if(audio?.readyState)audio.currentTime=duration;return;}
  if(recording&&audio){if(audio.readyState)try{audio.currentTime=target;}catch{pendingSeek=target;}else pendingSeek=target;if(status==='ended')status='paused';}
  else if(playing)nativePlay(target);else if(status==='ended')status='paused';
 }
 function changeVoice(value:string){stop();selected=value;hint='';try{localStorage.setItem('sip:hostAudioVoice',value);localStorage.setItem('sip:hostVoice',value);localStorage.setItem('sip:hostNarrationVersion',hostNarrationVersion);}catch{}}
 function changeRate(value:number){rate=value;if(audio)audio.playbackRate=rate;if(playing&&!recording)nativePlay(position);try{localStorage.setItem('sip:hostRate',String(rate));}catch{}}
 function changeVolume(value:number){volume=value;if(audio){audio.volume=volume;audio.muted=volume===0;}if(playing&&!recording)nativePlay(position);try{localStorage.setItem('sip:hostVolume',String(volume));}catch{}}
 function beginSeek(){if(!recording&&playing){dragResume=true;pause();}}
 function endSeek(){if(dragResume){dragResume=false;void play();}}
 function metadata(){if(audio&&pendingSeek!==undefined){audio.currentTime=Math.min(pendingSeek,duration);pendingSeek=undefined;}}
 function audioError(){
  if(!recording)return;halt();status='paused';error=copy.audioFallback;
 }
 function topic(offset:number){const target=currentChapter+offset;if(target>=0&&target<timeline.length)seek(timeline[target].start);}
 onMount(()=>{
  supported='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
  if(supported){synthesis=window.speechSynthesis;refreshVoices();synthesis.addEventListener('voiceschanged',refreshVoices);}
  try{const saved=Number(localStorage.getItem('sip:hostRate'));if([.75,1,1.15,1.25,1.5,1.75,2].includes(saved))rate=saved;}catch{}
  try{const saved=localStorage.getItem('sip:hostVolume');if(saved!==null&&Number.isFinite(Number(saved))&&Number(saved)>=0&&Number(saved)<=1)volume=Number(saved);}catch{}
  mounted=true;
  clock=setInterval(()=>{if(status==='playing'&&!recording){const now=performance.now();position=Math.min(activeEnd-.01,position+(now-lastTick)/1000*rate*1.04);lastTick=now;}},200);
  window.addEventListener('pagehide',stop);
  return()=>{if(clock)clearInterval(clock);synthesis?.removeEventListener('voiceschanged',refreshVoices);window.removeEventListener('pagehide',stop);};
 });
 onDestroy(halt);
 $effect(()=>{if(!enabled)stop();});
 $effect(()=>{
  if(!mounted)return;
  const source=[...paragraphs];let disposed=false;
  // A CMS edit invalidates an old recording immediately, including on the current slide.
  untrack(()=>{stop();ready=false;recordings=undefined;});
  hostSpeechFingerprint(source).then(key=>{
   if(disposed)return;recordings=catalog[key];let saved='',legacy='',version='';try{saved=localStorage.getItem('sip:hostAudioVoice')||'';legacy=localStorage.getItem('sip:hostVoice')||'';version=localStorage.getItem('sip:hostNarrationVersion')||'';}catch{}
   // Upgrade old prepared/device defaults once. Explicit choices made in this player persist.
   if(recordings&&version!==hostNarrationVersion){saved=saved==='audio:katja'?'audio:seraphina':'audio:florian';try{localStorage.setItem('sip:hostAudioVoice',saved);localStorage.setItem('sip:hostNarrationVersion',hostNarrationVersion);}catch{}}
   selected=recordings?.voices[saved]||voices.some(v=>v.voiceURI===saved)?saved:recordings?.voices['audio:florian']?'audio:florian':voices.find(v=>v.voiceURI===legacy)?.voiceURI||voices[0]?.voiceURI||'device';ready=true;
  }).catch(()=>{if(!disposed){ready=true;refreshVoices();}});
  return()=>{disposed=true;};
 });
</script>
<svelte:window onpointerup={endSeek} onpointercancel={endSeek}/>
{#if enabled}
 <section class="host-speech" aria-label={copy.region}>
  {#if recording}<audio bind:this={audio} src={recording.url} preload="none" onloadedmetadata={metadata} ontimeupdate={()=>{if(audio&&pendingSeek===undefined)position=audio.currentTime;}} onpause={()=>{if(playing)status='paused';}} onended={()=>{position=duration;status='ended';loading=false;}} onwaiting={()=>{if(playing)loading=true;}} onplaying={()=>loading=false} onerror={audioError}></audio>{/if}
  <div class="speech-heading"><span class="speech-symbol" class:playing><Icon name="sound" size={20}/></span><div><strong>{copy.title}</strong><span>{copy.main}{extraCount?' + '+extraCount+' '+(extraCount===1?copy.extra:copy.extras):''}</span><span class="speech-current-voice">{voiceLabel}{!recording&&voiceLabel!==copy.device?' · '+copy.device:''}</span></div></div>
  <div class="speech-progress"><label class="sr-only" for="host-audio-seek">{copy.timeline}</label><input id="host-audio-seek" type="range" min="0" max={duration||1} step=".1" value={position} aria-valuetext={speechClock(position)+' '+copy.of+' '+speechClock(duration)+(recording?'':' · '+copy.approxTime)} disabled={!canPlay} onpointerdown={beginSeek} oninput={event=>seek(Number(event.currentTarget.value))}/><div><span>{!recording&&ready?copy.approx+' ':''}{speechClock(position)}</span><span>{speechClock(duration)}</span></div></div>
  <div class="speech-transport">
   <button type="button" class="speech-icon" disabled={!canPlay||position<=0} aria-label={copy.backTen} title={copy.backTen} onclick={()=>seek(position-10)}><Icon name="rewind" size={21}/><small>10</small></button>
   <button type="button" class="speech-play" disabled={!canPlay} aria-label={loading?copy.cancelLoad:playing?copy.pauseLabel:status==='paused'?copy.resumeLabel:copy.playLabel} onclick={playing||loading?pause:play}><Icon name={loading?'loader':playing?'pause':'play'} size={23}/><span>{loading?copy.loading:playing?copy.pause:status==='paused'?copy.resume:copy.play}</span></button>
   <button type="button" class="speech-icon" disabled={!canPlay||position>=duration} aria-label={copy.forwardTen} title={copy.forwardTen} onclick={()=>seek(position+10)}><Icon name="forward" size={21}/><small>10</small></button>
  </div>
  <div class="speech-secondary"><button type="button" disabled={!canPlay||currentChapter===0} aria-label={copy.previousTopic} title={copy.previousTopic} onclick={()=>topic(-1)}><Icon name="previous-track" size={17}/><span>{copy.back}</span></button><button type="button" disabled={!canPlay||!loading&&status==='ready'&&position===0} aria-label={copy.stopLabel} onclick={stop}><Icon name="stop" size={15}/>{copy.stop}</button><button type="button" disabled={!canPlay||currentChapter===timeline.length-1} aria-label={copy.nextTopic} title={copy.nextTopic} onclick={()=>topic(1)}><span>{copy.next}</span><Icon name="next-track" size={17}/></button></div>
  {#if timeline.length>1}<label class="speech-topic"><span>{copy.topic}</span><select aria-label={copy.topicLabel} value={currentChapter} disabled={!canPlay} onchange={event=>seek(timeline[Number(event.currentTarget.value)].start)}>{#each timeline as chapter,i}<option value={i}>{i+1}. {chapter.title}</option>{/each}</select></label>{/if}
  <details class="speech-settings"><summary><Icon name="settings" size={16}/><span>{copy.settings}</span><small>{String(rate).replace('.',',')}×</small><Icon name="next" size={15}/></summary><div class="speech-options"><label><span>{copy.voice}</span><select aria-label={copy.voice} value={selected} onchange={event=>changeVoice(event.currentTarget.value)}>{#if recordings}{#if recordings.voices['audio:florian']}<option value="audio:florian">{copy.florian}</option>{/if}{#if recordings.voices['audio:seraphina']}<option value="audio:seraphina">{copy.seraphina}</option>{/if}{/if}{#each voices as voice}<option value={voice.voiceURI}>{voice.name} · {copy.deviceSuffix}</option>{/each}{#if !voices.length&&!recordings}<option value="device">{copy.device}</option>{/if}</select></label><label><span>{copy.speed}</span><select aria-label={copy.speedLabel} value={rate} onchange={event=>changeRate(Number(event.currentTarget.value))}>{#each [.75,1,1.15,1.25,1.5,1.75,2] as speed}<option value={speed}>{String(speed).replace('.',',')}×</option>{/each}</select></label><label class="speech-volume"><span>{copy.volume}</span><input aria-label={copy.volume} type="range" min="0" max="1" step=".05" value={volume} oninput={event=>changeVolume(Number(event.currentTarget.value))}/><button type="button" aria-label={volume===0?copy.unmute:copy.mute} onclick={()=>changeVolume(volume===0?1:0)}><Icon name={volume===0?'muted':'sound'} size={18}/></button></label></div><p class="speech-note">{recording?copy.neuralHint:copy.deviceHint}</p></details>
  {#if ready&&!canPlay}<p class="speech-note">{copy.unavailable}</p>{/if}
  {#if hint}<p class="speech-note" role="status">{hint}</p>{/if}
  {#if error}<p class="error" role="alert">{error}</p>{/if}
  <span class="sr-only" role="status" aria-live="polite">{playing?copy.playingStatus:status==='paused'?copy.pausedStatus:status==='ended'?copy.endedStatus:''}</span>
 </section>
{/if}
<style>
 .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}
 .host-speech{padding:20px;margin:22px 0 25px;border:1px solid var(--line);border-radius:15px;background:var(--surface);color:var(--ink);min-width:0}.host-speech audio{display:none}.speech-heading{display:flex;gap:12px;align-items:center}.speech-symbol{display:grid;place-items:center;width:42px;height:42px;border:1px solid var(--line);border-radius:12px;flex:none;background:var(--soft)}.speech-heading>div{display:grid;gap:3px;min-width:0}.speech-heading strong{font-size:14px;line-height:1.5}.speech-heading>div>span{font-size:11px;color:var(--muted);line-height:1.6}.host-speech input[type=range]{accent-color:var(--ink);width:100%;min-width:0;height:44px;padding:0;cursor:pointer;border:0;background:transparent;box-shadow:none}.speech-progress{margin-top:12px}.speech-progress>div{display:flex;justify-content:space-between;gap:12px;font-variant-numeric:tabular-nums;font-size:11px;color:var(--muted);margin-top:-5px}.speech-transport{display:flex;align-items:center;justify-content:center;gap:20px;margin:16px 0 9px}.host-speech button{display:flex;align-items:center;justify-content:center;min-height:44px;min-width:44px;border-radius:9px;border:1px solid transparent;background:transparent;color:var(--ink);gap:7px;font-size:12px;line-height:1.4;cursor:pointer}.host-speech button:hover:not(:disabled){background:var(--soft);color:var(--ink)}.host-speech button:disabled{opacity:.4;cursor:default}.host-speech .speech-play{background:var(--ink);color:var(--surface);border-color:var(--ink);padding:12px 19px;min-height:52px;font-weight:650;min-width:135px;border-radius:28px}.host-speech .speech-play:hover:not(:disabled){background:var(--ink);color:var(--surface);filter:brightness(.9)}.speech-icon{position:relative;flex-direction:column;gap:0!important}.speech-icon small{font-size:9px;font-weight:650;line-height:1}.speech-secondary{display:flex;justify-content:space-between;gap:5px}.speech-secondary>button{padding:6px 8px;font-size:11px}.speech-topic{display:grid;gap:7px;margin-top:16px}.speech-topic>span,.speech-options label>span{font-size:11px;font-weight:600}.host-speech select{width:100%;min-width:0;max-width:100%;min-height:44px;font-size:12px;color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:10px 28px 10px 10px;text-overflow:ellipsis}.speech-settings{border-top:1px solid var(--line);margin-top:16px}.speech-settings summary{display:flex;align-items:center;gap:8px;cursor:pointer;list-style:none;min-height:48px;font-size:11px;color:var(--ink)}.speech-settings summary::-webkit-details-marker{display:none}.speech-settings summary>small{margin-left:auto;font-size:11px}.speech-settings[open] summary>:global(svg:last-child){transform:rotate(90deg)}.speech-options{display:grid;grid-template-columns:minmax(0,1fr) 100px;gap:14px}.speech-options label{display:grid;gap:7px;min-width:0}.speech-options .speech-volume{grid-column:1/-1;grid-template-columns:minmax(0,1fr) 44px;align-items:center;column-gap:8px}.speech-volume>span{grid-column:1/-1}.speech-volume>button{border-color:var(--line)}.host-speech .speech-note{font-size:11px!important;line-height:1.7!important;color:var(--muted);margin:10px 0 0!important}.host-speech .error{font-size:12px;line-height:1.7;margin:12px 0 0}.speech-symbol.playing>:global(svg){animation:speech-breathe 1.7s ease-in-out infinite}@keyframes speech-breathe{50%{opacity:.55}}
 @media(max-width:640px){.host-speech{padding:15px 12px}.speech-transport{gap:9px}.host-speech .speech-play{min-width:118px;padding:12px}.speech-heading strong{font-size:13px}.speech-secondary>button{padding:5px 6px}.speech-options{grid-template-columns:minmax(0,1fr)}.speech-volume{grid-column:1}.speech-heading>div>span{font-size:10px}}
 @media(prefers-reduced-motion:reduce){.speech-symbol.playing>:global(svg){animation:none}}
</style>
