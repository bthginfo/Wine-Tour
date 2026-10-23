import { neon } from '@neondatabase/serverless';
import { env } from 'node:process';
export function db(){ if(!env.DATABASE_URL) throw new Error('DATABASE_URL fehlt'); return neon(env.DATABASE_URL); }
