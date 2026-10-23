import { json,error,isHttpError } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { z } from 'zod';
z.config(z.locales.de());
import { db } from '#lib/server/db.ts';
import { token,hash,guest,user,requireUser,requireAdmin,host,rate,passwordHash,verifyPassword,setCookie } from '#lib/server/security.ts';
import { randomInt,randomUUID } from 'node:crypto';
import { steps } from '#lib/content.ts';
const credentials=z.object({username:z.string().trim().min(3,'Der Benutzername braucht mindestens 3 Zeichen.').max(24,'Der Benutzername darf höchstens 24 Zeichen haben.').regex(/^[a-zA-Z0-9_äöüÄÖÜß-]+$/,'Nutze Buchstaben, Zahlen, _ oder -.'),password:z.string().min(10,'Nimm bitte mindestens 10 Zeichen.').max(128)});
const noteSchema=z.object({text:z.string().max(6000).default(''),aromas:z.array(z.string().max(40)).max(25).default([]),rating:z.number().int().min(0).max(5).default(0),sweetness:z.number().int().min(0).max(5).default(0),acidity:z.number().int().min(0).max(5).default(0)});
const bottleSchema=z.object({name:z.string().trim().min(1,'Trage bitte den Namen des Weins ein.').max(120,'Der Weinname darf höchstens 120 Zeichen haben.'),producer:z.string().max(120).default(''),region:z.string().max(120).default(''),year:z.string().max(12).default(''),quantity:z.number().int().min(0).max(10000),location:z.string().max(120).default(''),memo:z.string().max(3000).default(''),style:z.enum(['Weiß','Rosé','Rot','Prickelnd','Sonstiges']).default('Weiß')});
function publicRoom(r:any,includeHost=false){const settings={...r.settings};if(!includeHost)delete settings.redStory;return {code:r.code,name:r.name,step:r.step,version:r.version,closed:r.closed,settings};}
async function room(code:string){const r=await db()`SELECT * FROM sip.rooms WHERE code=${code}`;if(!r[0])error(404,'Dieses Tasting gibt es nicht. Schau bitte noch einmal auf den Code.');return r[0];}
async function participant(e:RequestEvent,code:string){const g=await guest(e);const u=await user(e);const rows=await db()`SELECT m.guest_id,m.name FROM sip.members m JOIN sip.guests g ON g.id=m.guest_id WHERE m.room=${code} AND (m.guest_id=${g} OR (${u?.id??null}::text IS NOT NULL AND g.user_id=${u?.id??null})) ORDER BY (m.guest_id=${g}) DESC LIMIT 1`;return rows[0]??null;}
async function dispatch(e:RequestEvent){
 const p=e.params.path??'';const method=e.request.method;const sql=db();
 let b:any={};if(method!=='GET'){const text=await e.request.text();if(text.length>25000)error(413,'Die Eingabe ist zu lang.');try{b=JSON.parse(text||'{}');}catch{error(400,'Die Eingabe konnte nicht gelesen werden.');}}
 if(p==='health') {await sql`SELECT 1 FROM sip.rooms LIMIT 1`;return json({ok:true});}
 if(p==='me'){
  const u=await user(e);const g=await guest(e);
  const notes=await sql`SELECT n.room,n.wine,n.data,n.updated_at,r.name AS room_name,(r.settings - 'redStory') AS room_settings FROM sip.notes n JOIN sip.guests g ON g.id=n.guest_id JOIN sip.rooms r ON r.code=n.room WHERE n.guest_id=${g} OR (${u?.id??null}::text IS NOT NULL AND g.user_id=${u?.id??null}) ORDER BY n.updated_at DESC`;
  const rooms=await sql`SELECT r.code,r.name,r.step,r.closed,r.host_hash FROM sip.members m JOIN sip.rooms r ON r.code=m.room JOIN sip.guests g ON g.id=m.guest_id WHERE m.guest_id=${g} OR (${u?.id??null}::text IS NOT NULL AND g.user_id=${u?.id??null}) ORDER BY r.created_at DESC LIMIT 12`;
  return json({user:u,draftOwner:g,notes,rooms:rooms.map(({host_hash,...r})=>({...r,isHost:u?.role==='admin'}))});
 }
 if(p==='auth/logout'&&method==='POST'){const t=e.cookies.get('sip_session');if(t)await sql`DELETE FROM sip.sessions WHERE token_hash=${hash(t)}`;e.cookies.delete('sip_session',{path:'/'});e.cookies.delete('sip_guest',{path:'/'});return json({ok:true});}
 if((p==='auth/register'||p==='auth/login')&&method==='POST'){
  const c=credentials.parse(b);const normalized=c.username.toLocaleLowerCase('de-DE');await rate(e,'auth-network',200);await rate(e,'auth-account:'+normalized,10);const g=await guest(e);let u:any;
  if(p.endsWith('register')){
   const existing=await sql`SELECT id FROM sip.users WHERE normalized=${normalized}`;if(existing[0])error(409,'Dieser Username ist schon vergeben. Probier einen anderen.');
   const id=randomUUID();const pass=passwordHash(c.password);
   const rows=await sql`INSERT INTO sip.users(id,username,normalized,password) VALUES(${id},${c.username},${normalized},${pass}) ON CONFLICT(normalized) DO NOTHING RETURNING id,username`;if(!rows[0])error(409,'Dieser Username ist schon vergeben.');u=rows[0];
  } else {const rows=await sql`SELECT * FROM sip.users WHERE normalized=${normalized}`;if(!rows[0]){passwordHash(c.password);error(401,'Username oder Passwort stimmt nicht.');}if(!verifyPassword(c.password,rows[0].password))error(401,'Username oder Passwort stimmt nicht.');u=rows[0];}
  // Only attach an anonymous guest. A previous account can never be reassigned.
  await sql`UPDATE sip.guests SET user_id=${u.id} WHERE id=${g} AND (user_id IS NULL OR user_id=${u.id})`;
  const t=token();await sql`INSERT INTO sip.sessions(token_hash,user_id,expires_at) VALUES(${hash(t)},${u.id},now()+interval '30 days')`;setCookie(e,'sip_session',t);return json({user:{id:u.id,username:u.username,role:u.role||'member'}});
 }
 if(p==='rooms'&&method==='POST'){
  const owner=await requireAdmin(e);await rate(e,'create',20);const g=await guest(e);const name=z.string().trim().min(1,'Gib deinem Tasting einen Namen.').max(80,'Der Tasting-Name darf höchstens 80 Zeichen haben.').parse(b.name||'Ein Abend, vier Weine');let code='';
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';for(let i=0;i<6;i++)code+=chars[randomInt(chars.length)];const t=token();
  await sql.transaction([sql`INSERT INTO sip.rooms(code,name,host_hash,owner_id) VALUES(${code},${name},${hash(t)},${owner.id})`,sql`INSERT INTO sip.members(room,guest_id,name) VALUES(${code},${g},'Host')`,sql`INSERT INTO sip.events(room,type,payload,request_id) VALUES(${code},'TastingCreated',${JSON.stringify({step:0})}::jsonb,${randomUUID()})`]);
  return json({code});
 }
 const match=p.match(/^rooms\/([A-Z2-9]{6})(?:\/(join|advance|stream|notes|settings|members))?$/);
 if(match){const [,code,action]=match;
  if(!action&&method==='GET'){const r=await room(code);const m=await participant(e,code);const t=e.cookies.get('sip_host_'+code);const u=await user(e);const isHost=u?.role==='admin';if(isHost&&!m){const g=await guest(e);await sql`INSERT INTO sip.members(room,guest_id,name) VALUES(${code},${g},'Host') ON CONFLICT DO NOTHING`;}return json({room:publicRoom(r,isHost),member:m?{name:m.name}:isHost?{name:'Host'}:null,isHost});}
  if(action==='join'&&method==='POST'){
   await rate(e,'join',200);const r=await room(code);if(r.closed)error(409,'Dieses Tasting ist beendet. Deine bisherigen Notizen findest du unter „Notizen“.');const name=z.string().trim().min(1,'Gib bitte deinen Namen ein.').max(40,'Dein Name darf höchstens 40 Zeichen haben.').parse(b.name);const g=await guest(e);
   await sql.transaction([sql`INSERT INTO sip.members(room,guest_id,name) VALUES(${code},${g},${name}) ON CONFLICT(room,guest_id) DO UPDATE SET name=excluded.name`,sql`INSERT INTO sip.events(room,type,payload,request_id) VALUES(${code},'ParticipantJoined','{}'::jsonb,${randomUUID()})`]);return json({room:publicRoom(r)});
  }
  if(action==='members'&&method==='GET'){await host(e,code);return json({members:await sql`SELECT name,joined_at FROM sip.members WHERE room=${code} ORDER BY joined_at`});}
  if(action==='advance'&&method==='POST'){
   await host(e,code);const command=z.object({step:z.number().int().min(0).max(steps.length-1),version:z.number().int().min(0),requestId:z.string().uuid(),closed:z.boolean().optional()}).parse(b);
   const existing=await sql`SELECT id FROM sip.events WHERE room=${code} AND request_id=${command.requestId}`;if(existing[0])return json({room:publicRoom(await room(code),true)});
   // Projection and event are committed in one statement. A stale command cannot overwrite a newer step.
   const rows=await sql`WITH changed AS (UPDATE sip.rooms SET step=${command.step},version=version+1,closed=COALESCE(${command.closed??null}::boolean,closed) WHERE code=${code} AND version=${command.version} RETURNING *) INSERT INTO sip.events(room,type,payload,request_id) SELECT code,'TastingAdvanced',jsonb_build_object('step',step,'version',version,'closed',closed),${command.requestId} FROM changed RETURNING id`;
   if(!rows[0])error(409,'Der Stand hat sich geändert. Bitte versuch es noch einmal.');return json({room:publicRoom(await room(code),true)});
  }
  if(action==='settings'&&method==='POST'){
   await host(e,code);const settings=z.object({redName:z.string().max(120),redProducer:z.string().max(120),redRegion:z.string().max(120),redGrape:z.string().max(120),redRegionText:z.string().max(6000).default(''),redProducerText:z.string().max(6000).default(''),redGrapeText:z.string().max(6000).default(''),redStory:z.string().max(8000),redSource:z.string().max(500).refine(v=>!v||/^https?:\/\//.test(v)),rieslingLabel:z.string().max(160),vintages:z.array(z.string().max(20)).length(4)}).parse(b);
   await sql`WITH changed AS (UPDATE sip.rooms SET settings=${JSON.stringify(settings)}::jsonb,version=version+1 WHERE code=${code} RETURNING *) INSERT INTO sip.events(room,type,payload,request_id) SELECT code,'TastingConfigured',jsonb_build_object('step',step,'version',version,'settings',settings),${randomUUID()} FROM changed`;return json({room:publicRoom(await room(code),true)});
  }
  if(action==='notes'&&method==='POST'){
   const membership=await participant(e,code);if(!membership)error(403,'Tritt zuerst dem Tasting bei.');const g=membership.guest_id;const wine=z.enum(['secco','juwel','riesling','rot']).parse(b.wine);const data=noteSchema.parse(b.data);
   await sql`INSERT INTO sip.notes(guest_id,room,wine,data) VALUES(${g},${code},${wine},${JSON.stringify(data)}::jsonb) ON CONFLICT(guest_id,room,wine) DO UPDATE SET data=excluded.data,updated_at=now()`;return json({ok:true});
  }
  if(action==='stream'&&method==='GET'){
   const roomRecord=await room(code);const viewer=await user(e);const allowHost=viewer?.role==='admin';const membership=await participant(e,code);if(!membership)error(403,'Tritt zuerst dem Tasting bei.');const g=membership.guest_id;
   let cursor=Number(e.request.headers.get('last-event-id')||e.url.searchParams.get('cursor')||0);if(!Number.isSafeInteger(cursor)||cursor<0)cursor=0;const enc=new TextEncoder();let timer:ReturnType<typeof setTimeout>;let cancelled=false;
   const stream=new ReadableStream({async start(controller){const started=Date.now();const send=(s:string)=>{if(!cancelled)controller.enqueue(enc.encode(s));};
    const poll=async()=>{if(cancelled)return;try {const events=await sql`SELECT id,type,payload FROM sip.events WHERE room=${code} AND id>${cursor} ORDER BY id LIMIT 100`;for(const event of events){if(event.payload.settings&&!allowHost){event.payload={...event.payload,settings:{...event.payload.settings}};delete event.payload.settings.redStory;}cursor=Number(event.id);send(`id: ${cursor}\nevent: tasting\ndata: ${JSON.stringify(event)}\n\n`);}send(': keepalive\n\n');if(Date.now()-started>22000){cancelled=true;controller.close();return;}timer=setTimeout(poll,1000);}catch{cancelled=true;controller.close();}};await poll();},cancel(){cancelled=true;clearTimeout(timer);}});
   return new Response(stream,{headers:{'Content-Type':'text/event-stream','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'}});
  }
 }
 if(p==='cellar'){
  const u=await requireUser(e);if(method==='GET')return json({bottles:await sql`SELECT id,data FROM sip.cellar WHERE user_id=${u.id} ORDER BY updated_at DESC`});
  if(method==='POST'){const data=bottleSchema.parse(b.data);const id=b.id?z.string().uuid().parse(b.id):randomUUID();const r=await sql`INSERT INTO sip.cellar(id,user_id,data) VALUES(${id},${u.id},${JSON.stringify(data)}::jsonb) ON CONFLICT(id) DO UPDATE SET data=excluded.data,updated_at=now() WHERE sip.cellar.user_id=${u.id} RETURNING id`;if(!r[0])error(403,'Diese Flasche gehört zu einem anderen Konto.');return json({id});}
  if(method==='DELETE'){const id=z.string().uuid().parse(b.id);await sql`DELETE FROM sip.cellar WHERE id=${id} AND user_id=${u.id}`;return json({ok:true});}
 }
 error(404,'Hier gibt es nichts zu laden.');
}
async function handler(e:RequestEvent){try{return await dispatch(e);}catch(err){if(err instanceof z.ZodError)return json({error:err.issues[0]?.message??'Bitte prüfe deine Eingabe.'},{status:400});if(isHttpError(err))return json({error:err.body.message},{status:err.status});console.error('API request failed',err instanceof Error?err.name:'UnknownError');return json({error:'Das Speichern klappt gerade nicht. Bitte versuch es noch einmal.'},{status:503});}}
export const GET=handler;export const POST=handler;export const DELETE=handler;
