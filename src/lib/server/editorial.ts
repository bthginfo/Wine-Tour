import {articleSchema,wineSchema,homeSchema} from '../editorial-schema';
export {articleSchema,wineSchema,homeSchema} from '../editorial-schema';
import { db } from './db';
import { articles,wines } from '#lib/content.ts';import {atlasArticles} from '#lib/atlas-content.ts';
export function validateContent(key:string,data:unknown){if(key==='page:home')return homeSchema.parse(data);if(key.startsWith('article:')&&[...articles,...atlasArticles].some(a=>'article:'+a.slug===key))return articleSchema.parse(data);if(key.startsWith('wine:')&&wines.some(w=>'wine:'+w.id===key))return wineSchema.parse(data);throw new Error('Unbekannter Inhalt');}
export async function readEditorial(includeHost=false){const rows=await db()`SELECT key,data,version,updated_at FROM sip.editorial`;return Object.fromEntries(rows.map(r=>{const data={...r.data};if(!includeHost)delete data.host;return [r.key,{data,version:r.version,updatedAt:r.updated_at}];}));}
