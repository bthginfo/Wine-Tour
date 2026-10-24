import {test,expect} from '@playwright/test';
import {readTastingVisit,ongoingTasting} from '../src/lib/tasting-return';
const rooms=[{code:'CLOSE8',name:'Beendete Probe',step:22,closed:true},{code:'FRESH8',name:'Eine neuere Probe',step:0,closed:false},{code:'TASTE8',name:'Unser Abend mit vier Weinen',step:14,closed:false}];
async function open(page:any,path:string){await page.goto(path);await expect(page.locator('.app-shell')).toHaveAttribute('data-ready','true');}
async function api(page:any,path:string,data?:any){return page.evaluate(async({path,data}:any)=>{const r=await fetch('/api/'+path,{method:data?'POST':'GET',headers:data?{'content-type':'application/json'}:{},body:data?JSON.stringify(data):undefined});return{status:r.status,body:await r.json()};},{path,data});}

test('resume selects the last visited open membership and never trusts a different browser identity',()=>{
 expect(ongoingTasting(rooms,'TASTE8')?.code).toBe('TASTE8');expect(ongoingTasting(rooms,'CLOSE8')?.code).toBe('FRESH8');expect(ongoingTasting(rooms.filter(r=>r.closed))).toBeUndefined();expect(ongoingTasting(rooms,'UNKNWN')?.code).toBe('FRESH8');
 expect(readTastingVisit(JSON.stringify({owner:'mia',code:'TASTE8'}),'mia')?.code).toBe('TASTE8');expect(readTastingVisit(JSON.stringify({owner:'ben',code:'TASTE8'}),'mia')).toBeUndefined();expect(readTastingVisit('{bad','mia')).toBeUndefined();expect(readTastingVisit(JSON.stringify({owner:'mia',code:'../../admin'}),'mia')).toBeUndefined();
});

test('the ongoing tasting is the primary home action on mobile and desktop, with a storage-free fallback',async({browser})=>{
 for(const blocked of [false,true]){const context=await browser.newContext();await context.addInitScript(({blocked})=>{if(blocked){Object.defineProperty(Storage.prototype,'getItem',{value(){throw Error('blocked');}});Object.defineProperty(Storage.prototype,'setItem',{value(){throw Error('blocked');}});}else localStorage.setItem('sip:tasting:return',JSON.stringify({owner:'return-review',code:'TASTE8'}));},{blocked});const page=await context.newPage();
  await page.route('**/api/me',r=>r.fulfill({json:{user:null,notes:[],rooms,draftOwner:'return-review'}}));await page.route('**/api/content',r=>r.fulfill({json:{records:{}}}));
  for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});await open(page,'/');const link=page.getByRole('link',{name:'Zur laufenden Weinprobe',exact:true});await expect(link).toHaveAttribute('href','/tasting/'+(blocked?'FRESH8':'TASTE8'));await expect(link).toBeInViewport({ratio:1});await expect(page.locator('.hero-card')).toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
  await context.close();
 }
});

test('an anonymous guest returns from home and wine knowledge to the current live slide without rejoining',async({browser})=>{
 test.setTimeout(120000);const hc=await browser.newContext(),gc=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),h=await hc.newPage(),g=await gc.newPage();let logged=false;
 try{
  await open(h,'/');expect((await api(h,'auth/login',{username:process.env.SIP_ADMIN_USERNAME,password:process.env.SIP_ADMIN_PASSWORD})).status).toBe(200);logged=true;
  const created=await api(h,'rooms',{name:'Test · Zurück zur Weinprobe'});expect(created.status).toBe(200);const code=created.body.code;
  await open(g,'/tasting/'+code);await g.getByLabel('Dein Name',{exact:true}).fill('Mia');await g.getByRole('button',{name:'Ich bin dabei',exact:true}).click();await expect(g.locator('.story-card')).toBeVisible();
  let room=(await api(h,'rooms/'+code)).body.room;expect((await api(h,'rooms/'+code+'/advance',{step:14,version:room.version,requestId:crypto.randomUUID()})).status).toBe(200);await expect(g.locator('[data-visual="riesling-season"]')).toBeVisible();
  await g.locator('.tasting-titlebar a[href="/"]').click();await expect(g.locator('.tasting-return')).toContainText('Test · Zurück zur Weinprobe');await expect(g.getByRole('link',{name:'Zur laufenden Weinprobe',exact:true})).toBeInViewport();
  room=(await api(h,'rooms/'+code)).body.room;expect((await api(h,'rooms/'+code+'/advance',{step:15,version:room.version,requestId:crypto.randomUUID()})).status).toBe(200);
  await g.getByRole('link',{name:'Zur laufenden Weinprobe',exact:true}).click();await expect(g.locator('[data-visual="balance"]')).toBeVisible();await expect(g.getByLabel('Dein Name',{exact:true})).toHaveCount(0);
  await g.locator('.tasting-titlebar a[href="/"]').click();await g.locator('.bottom-nav a[href="/entdecken"]').click();await g.getByLabel('Weinwissen durchsuchen').fill('Kork');await g.locator('.article-card').first().click();await g.locator('.bottom-nav a[href="/"]').click();await expect(g.getByRole('link',{name:'Zur laufenden Weinprobe',exact:true})).toHaveAttribute('href','/tasting/'+code);
  await g.reload();await expect(g.getByRole('link',{name:'Zur laufenden Weinprobe',exact:true})).toBeVisible();await g.getByRole('link',{name:'Zur laufenden Weinprobe',exact:true}).click();await expect(g.locator('[data-visual="balance"]')).toBeVisible();
  await open(g,'/tasting/'+code+'?wine=riesling');await g.getByLabel('Deine Worte',{exact:true}).fill('Meine Notiz bleibt auch nach einem Abstecher erhalten.');await expect(g.locator('.save-status')).toContainText('Gespeichert');await g.locator('.tasting-titlebar a[href="/"]').click();await g.getByRole('link',{name:'Zur laufenden Weinprobe',exact:true}).click();await open(g,'/tasting/'+code+'?wine=riesling');await expect(g.getByLabel('Deine Worte',{exact:true})).toHaveValue('Meine Notiz bleibt auch nach einem Abstecher erhalten.');
  // Hosts also return to their own last visited room, even when a newer one exists.
  const newer=await api(h,'rooms',{name:'Test · Weitere laufende Probe'});expect(newer.status).toBe(200);await open(h,'/host/'+code);await h.locator('.tasting-titlebar a[href="/"]').click();await expect(h.getByRole('link',{name:'Zur Host-Ansicht',exact:true})).toHaveAttribute('href','/host/'+code);await h.getByRole('link',{name:'Zur Host-Ansicht',exact:true}).click();await expect(h.locator('.host-console')).toBeVisible();
  room=(await api(h,'rooms/'+code)).body.room;expect((await api(h,'rooms/'+code+'/advance',{step:22,closed:true,version:room.version,requestId:crypto.randomUUID()})).status).toBe(200);await open(g,'/');await expect(g.locator('.tasting-return')).toHaveCount(0);await expect(g.locator('.recent-session')).toContainText('Beendet');
 }finally{if(logged)await api(h,'auth/logout',{});await hc.close();await gc.close();}
});
