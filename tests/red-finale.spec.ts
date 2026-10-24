import {test,expect} from '@playwright/test';
import type {Article,Wine,Step} from '../src/lib/content';
import {tastingWine} from '../src/lib/tasting-wine';
import {makeTastingBook} from '../src/lib/pdf/model';
import {readCatalog} from '../scripts/catalog-data.cjs';
const {all:articles,wines,steps}=readCatalog() as {all:Article[];wines:Wine[];steps:Step[]};

test('the confirmed red wine replaces placeholders without moving notes or the finish',()=>{
 expect(steps).toHaveLength(23);
 expect(steps.filter(s=>s.wine===3&&s.type==='story').map(s=>s.slug)).toEqual(['jumilla','juan-gil','mourvedre-monastrell','rotwein']);
 expect(steps.some(s=>s.type==='pending')).toBe(false);
 expect(steps[21]).toMatchObject({wine:3,type:'notes'});expect(steps[22].type).toBe('finish');
 expect(wines.map(w=>w.id)).toEqual(['secco','juwel','riesling','rot']);
 expect(wines.map(w=>tastingWine(w,{}).vintage)).toEqual(['','2023','2023','2023']);
 expect(tastingWine(wines[3],{})).toMatchObject({producer:'Juan Gil',grape:'Monastrell',vintage:'2023'});
 expect(tastingWine(wines[3],{vintages:['','','','2024']})).toMatchObject({vintage:'2024'});
 expect(tastingWine(wines[3],{vintages:['','','','']})).toMatchObject({vintage:''});
 const note='MEINE-BISHERIGE-ROTWEIN-NOTIZ';
 const book=makeTastingBook({room:{code:'ROTG88',name:'Unsere Probe',settings:{}},participant:'Mia',wines,articles:readCatalog().all,steps,notes:[{room:'ROTG88',wine:'rot',data:{text:note},updated_at:new Date().toISOString()}],draftOwner:'red-review',readDraft:()=>null,imageSrc:s=>s,creditFor:()=>({text:''})});
 const red=book.entries.filter(e=>e.wine===3);
 expect(red.filter(e=>e.type==='article')).toHaveLength(4);expect(red.some(e=>e.type==='pending')).toBe(false);
 expect(JSON.stringify(red)).toContain(note);expect(JSON.stringify(red)).not.toContain('host');
 expect(book.wines[3].vintage).toBe('2023');
 const all=readCatalog().all as Article[];expect(all.filter(a=>a.aliases?.includes('Monastrell'))).toHaveLength(1);
 const markers={'jumilla':'Weitwerfen','juan-gil':'Gil Soundtrack Award','mourvedre-monastrell':'GSM'};
 for(const[slug,marker]of Object.entries(markers)){
  const a=all.find(a=>a.slug===slug)!;
  expect(a.fact).toContain(marker);
  expect([a.intro,...a.paragraphs,...a.sections!.map(s=>s.body),...a.host].join(' ')).not.toContain(marker);
 }
});

test('a host can privately read every red wine story and a guest gets the complete illustrated chapters',async({page,browser})=>{
 test.setTimeout(90000);const code='ROTG88',room={code,name:'Rotwein-Prüfung',step:0,version:2,closed:false,settings:{}};
 let writes=0;const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/api/me',r=>r.fulfill({json:{user:{username:'Host',role:'admin'},notes:[],rooms:[],draftOwner:'red-review'}}));
 for(const path of ['content','admin/content'])await page.route('**/api/'+path,r=>r.fulfill({json:{records:{}}}));
 await page.route(/\/api\/rooms\/ROTG88(?:\/.*)?$/,r=>{
  if(r.request().method()!=='GET'){writes++;return r.abort();}
  if(r.request().url().endsWith('/stream'))return r.fulfill({contentType:'text/event-stream',body:': private review\n\n'});
  if(r.request().url().endsWith('/members'))return r.fulfill({json:{members:[{name:'Host'},{name:'Mia'}]}});
  return r.fulfill({json:{room,member:{name:'Host'},isHost:true}});
 });
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('.wine-card').nth(3)).toHaveAttribute('href','/entdecken/juan-gil');await expect(page.locator('.wine-card').nth(3)).toContainText('Jumilla · Spanien');await expect(page.locator('.wine-card').nth(3).locator('.wine-style')).toContainText('2023');await expect(page.locator('.pending-tag')).toHaveCount(0);await expect(page.locator('.wine-card').first().locator('.wine-style')).not.toContainText('2023');await page.goto('/host/'+code);await expect(page.locator('.app-shell')).toHaveAttribute('data-ready','true');
 await page.locator('.selection-list').getByRole('button',{name:/04.*Etiqueta Plata/}).click();
 for(const slug of ['jumilla','juan-gil','mourvedre-monastrell','rotwein']){
  const a=articles.find(a=>a.slug===slug)!;
  await expect(page.locator('.story-content>h2')).toContainText(a.title);await expect(page.locator('.host-preview-banner')).toBeVisible();
  await expect(page.locator('.host-speech audio')).toHaveAttribute('src',new RegExp(slug+'-florian'));
  await page.getByRole('button',{name:'Alle Themen öffnen',exact:true}).click();await expect(page.locator('.host-topics details[open]')).toHaveCount(5);
  await expect(page.locator('.host-guide')).toContainText(a.host[0]);
  if(slug!=='rotwein')await page.getByRole('button',{name:'Vorschau weiter',exact:true}).click();
 }
 expect(writes).toBe(0);await page.locator('.tasting-controls .host-preview-return').click();await expect(page.locator('.story-content>h2')).toContainText('Pfalz');
 const guest=await browser.newContext({ignoreHTTPSErrors:!!process.env.TEST_BASE_URL,viewport:{width:320,height:850}}),g=await guest.newPage();g.on('pageerror',e=>errors.push(e.message));
 await g.route('**/api/me',r=>r.fulfill({json:{user:null,notes:[],rooms:[],draftOwner:'red-guest'}}));await g.route('**/api/content',r=>r.fulfill({json:{records:{}}}));
 await g.route(/\/api\/rooms\/ROTG88(?:\/.*)?$/,r=>r.request().url().endsWith('/stream')?r.fulfill({contentType:'text/event-stream',body:': guest\n\n'}):r.fulfill({json:{room:{...room,step:17},member:{name:'Mia'},isHost:false}}));
 try{
  await g.goto('/tasting/'+code);await expect(g.locator('.story-content>h2')).toContainText('Jumilla');await expect(g.getByRole('img',{name:'Karte der Iberischen Halbinsel mit Jumilla im Südosten Spaniens'})).toBeVisible();
  await expect(g.locator('.host-background')).toHaveCount(0);
  for(const title of ['Jumilla','Juan Gil','Monastrell','Rotwein']){
   await expect(g.locator('.story-content>h2')).toContainText(title);
   await g.locator('.reading-depth summary').click();await expect(g.locator('.article-sections>section')).toHaveCount(3);
   const prose=await g.locator('.story-content').textContent();expect(prose).not.toMatch(/noch nicht fest|noch ausgewählt|Website nennt/);
   expect(await g.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await g.getByRole('button',{name:'Weiter',exact:true}).click();
  }
  await expect(g.locator('.note-form')).toBeVisible();expect(errors).toEqual([]);
 }finally{await guest.close();}
});
