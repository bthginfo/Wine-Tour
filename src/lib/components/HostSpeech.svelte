<script lang="ts">
 import {onMount,onDestroy} from 'svelte';
 import {t} from '#lib/i18n.ts';
 import {hostSpeechChunks} from '#lib/host-speech.ts';
 import Icon from './Icon.svelte';
 let {paragraphs,enabled}:{paragraphs:string[];enabled:boolean}=$props();
 let supported=$state(false);let speaking=$state(false);let voices=$state<SpeechSynthesisVoice[]>([]);let selected=$state('');let error=$state('');
 let synthesis:SpeechSynthesis|undefined;let utterance:SpeechSynthesisUtterance|undefined;let run=0;
 function stop(){run++;synthesis?.cancel();utterance=undefined;speaking=false;}
 function refreshVoices(){
  if(!synthesis)return;
  voices=synthesis.getVoices().filter(voice=>/^de(?:-|$)/i.test(voice.lang));
  if(voices.some(voice=>voice.voiceURI===selected))return;
  let saved='';try{saved=localStorage.getItem('sip:hostVoice')||'';}catch{}
  const preferred=voices.find(voice=>voice.voiceURI===saved)||[...voices].sort((a,b)=>score(b)-score(a))[0];selected=preferred?.voiceURI||'';
 }
 function score(voice:SpeechSynthesisVoice){return (/^de-DE$/i.test(voice.lang)?20:0)+(/natural|neural|premium|enhanced|Google Deutsch|Katja|Anna/i.test(voice.name)?10:0)+(voice.default?4:0)+(voice.localService?2:0);}
 function chooseVoice(){stop();try{localStorage.setItem('sip:hostVoice',selected);}catch{}}
 function start(){
  if(!enabled||!supported||!synthesis)return;
  stop();error='';const current=run;const chunks=hostSpeechChunks(paragraphs);if(!chunks.length)return;
  const engine=synthesis;const voice=voices.find(voice=>voice.voiceURI===selected);let index=0;speaking=true;
  const next=()=>{
   if(current!==run)return;
   if(index===chunks.length){speaking=false;utterance=undefined;return;}
   const message=new SpeechSynthesisUtterance(chunks[index++]);message.lang=voice?.lang||'de-DE';message.rate=.96;message.pitch=1;if(voice)message.voice=voice;utterance=message;
   message.onend=next;
   message.onerror=event=>{if(current!==run)return;stop();if(!['canceled','interrupted'].includes(event.error))error=t('host.speechError');};
   try{engine.speak(message);engine.resume();}catch{stop();error=t('host.speechError');}
  };
  next();
 }
 onMount(()=>{
  supported='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
  if(!supported)return;
  synthesis=window.speechSynthesis;refreshVoices();synthesis.addEventListener('voiceschanged',refreshVoices);window.addEventListener('pagehide',stop);
  return()=>{synthesis?.removeEventListener('voiceschanged',refreshVoices);window.removeEventListener('pagehide',stop);};
 });
 onDestroy(stop);
 $effect(()=>{if(!enabled)stop();});
</script>
{#if enabled}
 <div class="host-speech">
  <div class="host-speech-actions"><button type="button" class="button outline" disabled={!supported} aria-label={speaking?t('host.speechStopLabel'):t('host.speechStartLabel')} aria-pressed={speaking} onclick={speaking?stop:start}><Icon name={speaking?'stop':'play'} size={16}/>{speaking?t('host.speechStop'):t('host.speechStart')}</button>
   {#if voices.length>1}<label class="host-voice-label"><span>{t('host.speechVoice')}</span><select aria-label={t('host.speechVoice')} bind:value={selected} onchange={chooseVoice}>{#each voices as voice}<option value={voice.voiceURI}>{voice.name}</option>{/each}</select></label>{/if}
  </div>
  {#if !supported}<p class="host-speech-hint">{t('host.speechUnsupported')}</p>{/if}
  {#if error}<p class="error" role="alert">{error}</p>{/if}
  <span class="sr-only" role="status" aria-live="polite">{speaking?t('host.speechPlaying'):''}</span>
 </div>
{/if}
<style>
 .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}
 .host-speech{margin:20px 0 8px}.host-speech-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.host-speech-actions>.button{min-height:44px;background:var(--surface);color:var(--ink);border-color:var(--line)}.host-voice-label{display:flex;align-items:center;gap:9px;min-width:0;max-width:100%;font-size:12px;color:var(--muted)}.host-voice-label select{font-size:12px;padding:9px 28px 9px 10px;min-height:44px;min-width:0;max-width:240px;background:var(--surface);border:1px solid var(--line);color:var(--ink);border-radius:8px}.host-speech .host-speech-hint{font-size:12px;line-height:1.6;color:var(--muted);margin-top:9px}
 @media(max-width:640px){.host-voice-label{width:100%}.host-voice-label select{flex:1;max-width:100%}}
</style>
