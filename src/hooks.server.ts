import type { Handle } from '@sveltejs/kit/hooks';
import { json } from '@sveltejs/kit';
import { token,setCookie } from '#lib/server/security.ts';
export const handle:Handle = async ({event,resolve})=>{
 // Establish the browser identity with the HTML response, before parallel API calls start.
 if(!event.cookies.get('sip_guest'))setCookie(event,'sip_guest',token(),180);
 if(event.url.pathname.startsWith('/api/') && !['GET','HEAD','OPTIONS'].includes(event.request.method)) {
  if(event.request.headers.get('origin')!==event.url.origin) return json({error:'Diese Anfrage konnte nicht bestätigt werden.'},{status:403});
  if(Number(event.request.headers.get('content-length')||0)>25000)return json({error:'Die Eingabe ist zu lang.'},{status:413});
 }
 const r=await resolve(event);
 r.headers.set('X-Content-Type-Options','nosniff');r.headers.set('Referrer-Policy','strict-origin-when-cross-origin');r.headers.set('X-Frame-Options','DENY');
 if(event.url.pathname.startsWith('/api/'))r.headers.set('Cache-Control','no-store');
 return r;
};
