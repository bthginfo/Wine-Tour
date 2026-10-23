import {json} from '@sveltejs/kit';import {readEditorial} from '#lib/server/editorial.ts';
export async function GET(){return json({records:await readEditorial()},{headers:{'Cache-Control':'no-store'}});}
