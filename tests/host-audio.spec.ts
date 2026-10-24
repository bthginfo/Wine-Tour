import {test,expect,type Page} from '@playwright/test';
import {hostPronunciation,hostSpeechChapters,hostSpeechChunks} from '../src/lib/host-speech';
import {readCatalog} from '../scripts/catalog-data.cjs';
import recordings from '../src/lib/locales/de/host-audio.json' with {type:'json'};
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';

const room={code:'AUDI88',name:'Audio-Prüfung',step:7,version:0,closed:false,settings:{}};
async function fixture(page:Page,admin=true,override:()=>Record<string,any>=()=>({})){
 await page.route('**/api/me',r=>r.fulfill({json:{user:admin?{id:'audio-fixture',username:'Host',role:'admin'}:null,draftOwner:'audio-fixture',notes:[],rooms:[]}}));
 await page.route('**/api/admin/content',r=>r.fulfill({json:{records:override()}}));
 await page.route('**/api/content',r=>r.fulfill({json:{records:{}}}));
 await page.route(/\/api\/rooms\/AUDI88(?:\/.*)?$/,r=>{
  if(r.request().method()!=='GET')return r.abort();
  if(r.request().url().endsWith('/members'))return r.fulfill({json:{members:[]}});
  if(r.request().url().endsWith('/stream'))return r.fulfill({contentType:'text/event-stream',body:': audio fixture\n\n'});
  return r.fulfill({json:{room,member:{name:admin?'Host':'Gast'},isHost:admin}});
 });
}

test('narration includes every closed topic, matches the published copy, and fixes Rhine pronunciation',()=>{
 const {all}=readCatalog();const entries=Object.entries(recordings);expect(entries).toHaveLength(18);
 for(const [hash,entry] of entries){
  const a=all.find(a=>a.slug===entry.slug)!;expect(a).toBeTruthy();
  expect(createHash('sha256').update(a.host.map((p:string)=>p.trim()).filter(Boolean).join('\n\n')).digest('hex')).toBe(hash);
  const chapters=hostSpeechChapters(a.host);
  // The editor uses blank lines between entries. Paragraphs inside a topic use single newlines.
  expect(a.host.join('\n\n').split(/\n\s*\n/)).toEqual(a.host);
  for(const v of Object.values(entry.voices)){
   expect(v.synthesis).toBe('continuous-v2');expect(v.voice).toMatch(/FlorianMultilingualNeural|SeraphinaMultilingualNeural/);expect(v.chapters.map(c=>c.title)).toEqual(chapters.map(c=>c.title));expect(v.duration).toBeGreaterThan(100);expect(v.chapters.at(-1)!.start).toBeLessThan(v.duration);
  }
  for(const c of chapters){const spoken=hostSpeechChunks([c.text]).join(' ');expect(spoken).toBe(hostPronunciation(c.text));}
 }
 expect(hostPronunciation('Rheinebene, JUWEL und 10–12 °C.')).toBe('Rhein Ebene, Juwel und 10 bis 12 Grad Celsius.');
 expect(hostPronunciation('Juan Gil aus Jumilla. Etiqueta Plata.')).toBe('Chuan Chil aus Chumija. Etikéta Pláta.');
 const source=['Haupttext.','Zusatzthema\nAuch dieser ganze Text wird vorgelesen.','Noch ein Thema\nBis zum letzten Satz.'];
 expect(hostSpeechChapters(source).map(c=>c.text)).toEqual(['Haupttext.','Auch dieser ganze Text wird vorgelesen.','Bis zum letzten Satz.']);
});

test('old voice preferences upgrade to the new narration and a failed recording can retry without switching voices',async({page})=>{
 test.setTimeout(60000);await page.addInitScript(()=>{localStorage.setItem('sip:hostAudioVoice','audio:conrad');localStorage.setItem('sip:hostVoice','old-device-voice');});await fixture(page);
 const block='**/host-audio/**';await page.route(block,r=>r.abort());await page.goto('/host/AUDI88');
 const player=page.locator('.host-speech'),audio=player.locator('audio');await expect(audio).toHaveAttribute('src',/juwel-florian/);await expect(player.locator('.speech-current-voice')).toHaveText('Florian');
 expect(await audio.evaluate((el:HTMLMediaElement)=>el.paused)).toBe(true);await player.getByRole('button',{name:'Hintergrund für den Host vorlesen',exact:true}).click();await expect(player.getByRole('alert')).toBeVisible();
 await expect(audio).toHaveAttribute('src',/juwel-florian/);await expect(player.locator('.speech-current-voice')).toHaveText('Florian');
 await page.unroute(block);await player.getByRole('button',{name:'Vorlesen fortsetzen',exact:true}).click();await expect.poll(()=>audio.evaluate((el:HTMLMediaElement)=>el.currentTime)).toBeGreaterThan(.2);await expect(player.getByRole('alert')).toHaveCount(0);
 await player.getByRole('button',{name:'Vorlesen stoppen',exact:true}).click();
});

test('host neural audio pauses, seeks within closed topics, changes voice and stops on navigation',async({page})=>{
 test.setTimeout(90000);await page.setViewportSize({width:320,height:880});await fixture(page);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/host/AUDI88');await expect(page.locator('.app-shell')).toHaveAttribute('data-ready','true');
 const player=page.getByRole('region',{name:'Audioplayer für den Host-Hintergrund'});await expect(player).toContainText('Grundwissen + 6 Zusatzthemen');await expect(page.locator('.host-guide')).toContainText('Hinter JUWEL steht Juliane Eller');await expect(page.locator('.host-guide-heading')).toContainText('Zum Erzählen');await expect(player.locator('.speech-current-voice')).toHaveText('Florian');
 const audio=player.locator('audio');await expect(audio).toHaveAttribute('src',/juwel-florian/);expect(await audio.evaluate((el:HTMLMediaElement)=>el.paused&&el.currentTime===0)).toBe(true);
 await expect(page.locator('.host-topics details[open]')).toHaveCount(0);
 await player.getByRole('button',{name:'Hintergrund für den Host vorlesen',exact:true}).click();await expect(player.getByRole('button',{name:'Vorlesen pausieren',exact:true})).toBeVisible();
 await expect.poll(()=>audio.evaluate((el:HTMLMediaElement)=>el.currentTime)).toBeGreaterThan(.2);
 await player.getByRole('button',{name:'Vorlesen pausieren',exact:true}).click();const paused=await audio.evaluate((el:HTMLMediaElement)=>({paused:el.paused,time:el.currentTime}));expect(paused.paused).toBe(true);await page.waitForTimeout(350);expect(await audio.evaluate((el:HTMLMediaElement)=>el.currentTime)).toBeCloseTo(paused.time,1);
 const topics=player.getByLabel('Thema zum Vorlesen auswählen',{exact:true});await topics.selectOption('6');const entry=Object.values(recordings).find(v=>v.slug==='juwel')!.voices['audio:florian'];
 await expect.poll(()=>audio.evaluate((el:HTMLMediaElement)=>el.currentTime)).toBeCloseTo(entry.chapters[6].start,0);expect(await audio.evaluate((el:HTMLMediaElement)=>el.paused)).toBe(true);
 await player.getByRole('button',{name:'Vorlesen fortsetzen',exact:true}).click();await expect(player.getByRole('button',{name:'Vorlesen pausieren',exact:true})).toBeVisible();
 await player.getByRole('button',{name:'10 Sekunden zurück',exact:true}).click();expect(await audio.evaluate((el:HTMLMediaElement)=>el.currentTime)).toBeLessThan(entry.chapters[6].start-8);
 await player.getByRole('button',{name:'Vorlesen pausieren',exact:true}).click();await player.getByRole('button',{name:'10 Sekunden vor',exact:true}).click();
 await player.getByLabel('Abspielposition',{exact:true}).focus();await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');await expect.poll(()=>audio.evaluate((el:HTMLMediaElement)=>el.currentTime)).toBeGreaterThan(0);
 await player.locator('.speech-settings>summary').click();await player.getByLabel('Abspielgeschwindigkeit',{exact:true}).selectOption('1.5');expect(await audio.evaluate((el:HTMLMediaElement)=>el.playbackRate)).toBe(1.5);
 await player.getByRole('button',{name:'Stummschalten',exact:true}).click();expect(await audio.evaluate((el:HTMLMediaElement)=>el.volume)).toBe(0);await player.getByRole('button',{name:'Ton einschalten',exact:true}).click();
 await player.getByLabel('Deutsche Stimme',{exact:true}).selectOption('audio:seraphina');await expect(audio).toHaveAttribute('src',/juwel-seraphina/);await expect(player.getByLabel('Abspielposition',{exact:true})).toHaveValue('0');
 await player.getByRole('button',{name:'Hintergrund für den Host vorlesen',exact:true}).click();await expect(player.getByRole('button',{name:'Vorlesen pausieren',exact:true})).toBeVisible();await player.getByRole('button',{name:'Vorlesen stoppen',exact:true}).click();expect(await audio.evaluate((el:HTMLMediaElement)=>el.paused&&el.currentTime===0)).toBe(true);
 await player.getByRole('button',{name:'Hintergrund für den Host vorlesen',exact:true}).click();await expect(player.getByRole('button',{name:'Vorlesen pausieren',exact:true})).toBeVisible();await player.getByLabel('Lautstärke',{exact:true}).evaluate((el:HTMLInputElement)=>{el.value='.4';el.dispatchEvent(new Event('input',{bubbles:true}));});await audio.evaluate(el=>(window as any).__oldHostAudio=el);await page.getByRole('button',{name:'Vorschau weiter',exact:true}).click();expect(await page.evaluate(()=>(window as any).__oldHostAudio.paused)).toBe(true);await expect(page.getByLabel('Lautstärke',{exact:true})).toHaveValue('0.4');
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Host-Texte herunterladen',exact:true}).click();const file=await download;const guide=await readFile((await file.path())!,'utf8');expect(guide.match(/Hinter JUWEL steht Juliane Eller/g)).toHaveLength(1);expect(guide).toContain('### Der Geburtstag stammt aus der Buchhaltung');expect(guide).toContain('### Wie aus Rinde ein Flaschenverschluss wird');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
});

test('an edited host text invalidates old audio immediately; guests never receive a player',async({browser})=>{
 const context=await browser.newContext();await context.addInitScript(()=>{
  class Events {static last:any;listeners:Record<string,Function>={};onopen:any;onerror:any;constructor(){Events.last=this;(window as any).__publishContent=()=>this.listeners.tasting?.({data:JSON.stringify({type:'ContentPublished'})});}addEventListener(name:string,fn:Function){this.listeners[name]=fn;}close(){}}
  Object.defineProperty(window,'EventSource',{value:Events,configurable:true});
 });const host=await context.newPage();let edited=false;
 await fixture(host,true,()=>edited?{'article:juwel':{data:{host:['Der neue Text aus dem Editor.','Mein Zusatzthema\nDieser neue Zusatz gehört ebenfalls dazu.']},version:1}}:{});
 await host.goto('/host/AUDI88');await expect(host.locator('.host-speech audio')).toHaveAttribute('src',/juwel-florian/);
 edited=true;await host.evaluate(()=>(window as any).__publishContent());await expect(host.locator('.host-speech audio')).toHaveCount(0);await expect(host.getByLabel('Thema zum Vorlesen auswählen')).toContainText('Mein Zusatzthema');await expect(host.locator('.host-speech')).toContainText('Grundwissen + 1 Zusatzthema');
 const guest=await browser.newPage();await fixture(guest,false);await guest.goto('/tasting/AUDI88');await expect(guest.locator('.story-card')).toBeVisible();await expect(guest.locator('.host-speech')).toHaveCount(0);await expect(guest.locator('audio')).toHaveCount(0);
 await guest.close();await context.close();
});

test('device fallback pauses and resumes edited text, pronounces Rhein, and reads closed final topics',async({browser})=>{
 const context=await browser.newContext();await context.addInitScript(()=>{
  const state={messages:[] as any[],cancels:0};(window as any).__narrator=state;
  class Utterance{onend:any;onerror:any;onboundary:any;lang='';rate=1;pitch=1;volume=1;voice:any;constructor(public text:string){}}
  Object.defineProperty(window,'SpeechSynthesisUtterance',{value:Utterance,configurable:true});
  Object.defineProperty(window,'speechSynthesis',{value:{cancel(){state.cancels++;},resume(){},speak(message:any){state.messages.push(message);},getVoices(){return[{voiceURI:'de-test',name:'Deutsch natürlich',lang:'de-DE',default:true,localService:true}];},addEventListener(){},removeEventListener(){}},configurable:true});
 });const page=await context.newPage();await fixture(page,true,()=>({'article:juwel':{data:{host:['Die Rheinebene und JUWEL.','Zusatzwissen\nHier kommt noch mehr Geschichte.','Das letzte Thema\nAuch dieser letzte Absatz wird vollständig vorgelesen.']},version:1}}));
 await page.goto('/host/AUDI88');const player=page.locator('.host-speech');await expect(player.locator('audio')).toHaveCount(0);await player.getByRole('button',{name:'Hintergrund für den Host vorlesen',exact:true}).click();
 expect(await page.evaluate(()=>(window as any).__narrator.messages[0].text)).toBe('Die Rhein Ebene und Juwel.');
 await player.getByRole('button',{name:'Vorlesen pausieren',exact:true}).click();const count=await page.evaluate(()=>(window as any).__narrator.messages.length);await player.getByRole('button',{name:'Vorlesen fortsetzen',exact:true}).click();expect(await page.evaluate(()=>(window as any).__narrator.messages.length)).toBe(count+1);
 await player.getByLabel('Thema zum Vorlesen auswählen').selectOption('2');expect(await page.evaluate(()=>(window as any).__narrator.messages.at(-1).text)).toBe('Auch dieser letzte Absatz wird vollständig vorgelesen.');expect(await page.locator('.host-topics details[open]').count()).toBe(0);
 await player.locator('.speech-settings>summary').click();await player.getByRole('button',{name:'Stummschalten',exact:true}).click();expect(await page.evaluate(()=>(window as any).__narrator.messages.at(-1).volume)).toBe(0);
 await player.getByLabel('Abspielposition',{exact:true}).focus();await page.keyboard.press('End');await expect(player.getByRole('button',{name:'Hintergrund für den Host vorlesen',exact:true})).toBeVisible();await player.getByRole('button',{name:'Vorlesen stoppen',exact:true}).click();await expect(player.getByLabel('Abspielposition',{exact:true})).toHaveValue('0');await context.close();
});
