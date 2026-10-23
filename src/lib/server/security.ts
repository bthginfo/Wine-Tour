import { randomBytes, createHash, scryptSync, timingSafeEqual } from 'node:crypto';
import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { db } from './db';
export const token = () => randomBytes(32).toString('base64url');
export const hash = (s:string) => createHash('sha256').update(s).digest('hex');
export function passwordHash(password:string){const salt=randomBytes(16).toString('hex');return salt+':'+scryptSync(password,salt,64).toString('hex');}
export function verifyPassword(password:string,stored:string){const [salt,h]=stored.split(':');const expected=Buffer.from(h,'hex');const actual=scryptSync(password,salt,64);return expected.length===actual.length&&timingSafeEqual(expected,actual);}
export function setCookie(e:RequestEvent,name:string,value:string,days=30){e.cookies.set(name,value,{path:'/',httpOnly:true,sameSite:'lax',secure:e.url.protocol==='https:',maxAge:days*86400});}
const requestUsers=new WeakMap<RequestEvent,Promise<any>>();
const requestGuests=new WeakMap<RequestEvent,{cookie:string;owner:string|undefined;id:string}>();
export async function guest(e:RequestEvent,accountId?:string){
 const owner=accountId??(await user(e))?.id;
 let cookie=e.cookies.get('sip_guest')||'';
 const cached=requestGuests.get(e);if(cached&&cached.cookie===cookie&&cached.owner===owner)return cached.id;
 let id=cookie?hash(cookie):'';
 const rows=id?await db()`SELECT user_id FROM sip.guests WHERE id=${id}`:[];
 // An expired session or direct account switch must never retain another account's guest access.
 const rotate=!cookie||!!(rows[0]?.user_id&&rows[0].user_id!==owner);
 if(rotate){cookie=token();id=hash(cookie);setCookie(e,'sip_guest',cookie,180);}
 if(rotate||!rows[0])await db()`INSERT INTO sip.guests(id) VALUES(${id}) ON CONFLICT DO NOTHING`;
 requestGuests.set(e,{cookie,owner,id});return id;
}
export async function user(e:RequestEvent){
 let lookup=requestUsers.get(e);
 if(!lookup){lookup=(async()=>{const t=e.cookies.get('sip_session');if(!t)return null;const rows=await db()`SELECT u.id,u.username,u.role FROM sip.sessions s JOIN sip.users u ON u.id=s.user_id WHERE s.token_hash=${hash(t)} AND s.expires_at>now()`;return rows[0]??null;})();requestUsers.set(e,lookup);}
 return lookup;
}
export async function requireUser(e:RequestEvent){const u=await user(e);if(!u)error(401,'Melde dich an, um deinen Keller zu öffnen.');return u;}
export async function requireAdmin(e:RequestEvent){const u=await user(e);if(!u||u.role!=='admin')error(403,'Bitte melde dich mit dem Host-Konto an.');return u;}
export async function host(e:RequestEvent,code:string){const u=await user(e);const rows=await db()`SELECT * FROM sip.rooms WHERE code=${code}`;const r=rows[0];if(!r)error(404,'Dieses Tasting wurde nicht gefunden.');if(u?.role==='admin'||(u&&r.owner_id===u.id))return r;error(403,'Für diese Aktion brauchst du den Host-Zugang.');}
export async function rate(e:RequestEvent,action:string,max=20){const ip=e.getClientAddress();const key=hash(action+':'+ip);const rows=await db()`INSERT INTO sip.ratelimits(key,count,resets_at) VALUES(${key},1,now()+interval '10 minutes') ON CONFLICT(key) DO UPDATE SET count=CASE WHEN sip.ratelimits.resets_at<now() THEN 1 ELSE sip.ratelimits.count+1 END,resets_at=CASE WHEN sip.ratelimits.resets_at<now() THEN now()+interval '10 minutes' ELSE sip.ratelimits.resets_at END RETURNING count`;if(rows[0].count>max)error(429,'Zu viele Versuche. Bitte versuch es in ein paar Minuten wieder.');}
