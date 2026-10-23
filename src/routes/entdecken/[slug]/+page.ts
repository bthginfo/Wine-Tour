import { error } from '@sveltejs/kit';
import { articleBySlug } from '#lib/content.ts';
export function load({params}:{params:{slug:string}}){if(params.slug==='quellen')return {article:null};const article=articleBySlug(params.slug);if(!article)error(404,'Dieser Artikel wurde nicht gefunden.');return {article};}
