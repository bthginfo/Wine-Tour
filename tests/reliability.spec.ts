import {test,expect} from '@playwright/test';

async function open(page:any,path:string){await page.goto(path);await expect(page.locator('.app-shell')).toHaveAttribute('data-ready','true');}
async function request(page:any,path:string,data?:any){return page.evaluate(async({path,data}:any)=>{const r=await fetch('/api/'+path,{method:data?'POST':'GET',headers:data?{'Content-Type':'application/json'}:{},body:data?JSON.stringify(data):undefined});return {status:r.status,body:await r.json()};},{path,data});}

test('notes survive leaving the editor, concurrent saves and account switches without exposing another account',async({browser})=>{
 test.setTimeout(150000);
 const hc=await browser.newContext();const gc=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const bc=await browser.newContext();
 const h=await hc.newPage();const g=await gc.newPage();const b=await bc.newPage();const errors:string[]=[];g.on('pageerror',error=>errors.push(error.message));
 try{
  await open(h,'/');expect((await request(h,'auth/login',{username:process.env.SIP_ADMIN_USERNAME||'juliu1',password:process.env.SIP_ADMIN_PASSWORD})).status).toBe(200);
  const created=await request(h,'rooms',{name:'Test · Verlässliche Notizen'});expect(created.status).toBe(200);const code=created.body.code;
  const settings={redName:'Rotes Finale im Test',redProducer:'Betrieb im Test',redRegion:'Region im Test',redGrape:'Traube im Test',redStory:'',redSource:'',rieslingLabel:'',vintages:['','','','']};expect((await request(h,'rooms/'+code+'/settings',settings)).status).toBe(200);
  let identityUnavailable=true;await gc.route('**/api/me',route=>identityUnavailable?route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Verbindung im Test unterbrochen.'})}):route.continue());
  await open(g,'/tasting/'+code);await g.getByLabel('Dein Name',{exact:true}).fill('Kim');await g.getByRole('button',{name:'Ich bin dabei',exact:true}).click();await expect(g.locator('.story-card')).toBeVisible();
  await open(g,'/tasting/'+code+'?wine=rot');const words=g.getByLabel('Deine Worte',{exact:true});await expect(words).toBeDisabled();await expect(g.locator('.note-load-error')).toBeVisible();await g.screenshot({path:'/workspace/shared/sip-audit/note-load-error.png',fullPage:true,animations:'disabled'});identityUnavailable=false;await g.locator('.note-load-error').getByRole('button',{name:'Erneut laden',exact:true}).click();await expect(words).toBeEnabled();await gc.unroute('**/api/me');
  // Older Safari supports AbortController but has no AbortSignal.timeout convenience method.
  await g.evaluate(()=>Object.defineProperty(AbortSignal,'timeout',{value:undefined,configurable:true}));
  let unavailable=true;let delayNext=false;let saving=false;
  await gc.route('**/api/rooms/'+code+'/notes',async route=>{if(unavailable){await route.abort();return;}if(delayNext){delayNext=false;saving=true;await new Promise(resolve=>setTimeout(resolve,1200));}await route.continue();});
  await words.fill('Mein Entwurf bleibt auch nach dem Seitenwechsel da.');await expect(g.locator('.save-status')).toContainText('Wird später übertragen.');
  await g.locator('.tasting-titlebar a').click();await expect(g).toHaveURL(/\/$/);await g.locator('.bottom-nav').getByRole('link',{name:'Notizen',exact:true}).click();
  await expect(g.locator('.note-summary')).toContainText('Mein Entwurf bleibt');await expect(g.locator('.note-sync-status')).toBeVisible();await g.getByLabel('Notizen durchsuchen').fill('Rotes Finale');await expect(g.locator('.note-summary')).toHaveCount(1);
  unavailable=false;await g.evaluate(()=>window.dispatchEvent(new Event('online')));await expect(g.locator('.note-sync-status')).toHaveCount(0);
  expect((await request(g,'me')).body.notes.find((n:any)=>n.room===code).data.text).toBe('Mein Entwurf bleibt auch nach dem Seitenwechsel da.');
  // A second edit during a slow save must reach the server after the older snapshot.
  await g.getByRole('link',{name:'Bearbeiten',exact:true}).click();await expect(words).toBeEnabled();delayNext=true;await words.fill('Eine frühere Fassung.');await expect.poll(()=>saving).toBeTruthy();await words.fill('Die letzte Fassung bleibt erhalten.');
  await g.locator('.tasting-titlebar a').click();await g.locator('.bottom-nav').getByRole('link',{name:'Notizen',exact:true}).click();await expect(g).toHaveURL(/\/notizen$/);await expect(g.locator('.note-summary')).toContainText('Die letzte Fassung bleibt erhalten.');await expect(g.locator('.note-sync-status')).toHaveCount(0);
  expect((await request(g,'me')).body.notes.find((n:any)=>n.room===code).data.text).toBe('Die letzte Fassung bleibt erhalten.');
  const suffix=Date.now();const password='Verlaesslich-Test-2026!';const aName='test_a_'+suffix;const bName='test_b_'+suffix;
  await open(g,'/konto');await g.getByLabel('Username',{exact:true}).fill(aName);await g.getByLabel('Passwort',{exact:true}).fill(password);await g.getByRole('button',{name:'Konto anlegen & Notizen behalten',exact:true}).click();await expect(g).toHaveURL(/\/notizen$/);
  const aMe=(await request(g,'me')).body;const aGuest=(await gc.cookies()).find(c=>c.name==='sip_guest')!;
  await open(b,'/');expect((await request(b,'auth/register',{username:bName,password})).status).toBe(200);
  // Switching without logout and a legacy mismatched guest/session pair are both isolated.
  expect((await request(g,'auth/login',{username:bName,password})).status).toBe(200);const switched=(await request(g,'me')).body;expect(switched.user.username).toBe(bName);expect(switched.notes).toHaveLength(0);expect(switched.rooms).toHaveLength(0);expect(switched.draftOwner).not.toBe(aMe.draftOwner);
  await open(g,'/notizen');await expect(g.locator('.note-summary')).toHaveCount(0);
  await bc.addCookies([aGuest]);const legacy=(await request(b,'me')).body;expect(legacy.user.username).toBe(bName);expect(legacy.notes).toHaveLength(0);expect(legacy.draftOwner).not.toBe(aMe.draftOwner);
  // An expired account session cannot fall back to the account's longer-lived guest cookie.
  await bc.clearCookies({name:'sip_session'});await bc.addCookies([aGuest]);const expired=(await request(b,'me')).body;expect(expired.user).toBeNull();expect(expired.notes).toHaveLength(0);expect(expired.rooms).toHaveLength(0);
  expect((await request(g,'auth/login',{username:aName,password})).status).toBe(200);expect((await request(g,'me')).body.notes.find((n:any)=>n.room===code).data.text).toBe('Die letzte Fassung bleibt erhalten.');
  // Completion has one clear host action and no disabled forward button or unrelated wine card.
  const advanced=await request(h,'rooms/'+code+'/advance',{step:22,version:1,requestId:crypto.randomUUID()});expect(advanced.status).toBe(200);await open(h,'/host/'+code);await expect(h.locator('.finish-card')).toBeVisible();await expect(h.locator('.tasting-aside')).toHaveCount(0);await expect(h.locator('.selection-list')).toHaveCount(0);
  await h.getByRole('button',{name:'Tasting für neue Gäste schließen',exact:true}).click();await expect(h.getByRole('dialog',{name:'Tasting schließen?'})).toBeVisible();await h.getByRole('button',{name:'Tasting schließen',exact:true}).click();await expect(h.locator('.live-badge')).toContainText('Beendet');
  expect(errors).toEqual([]);
 }finally{await hc.close();await gc.close();await bc.close();}
});
