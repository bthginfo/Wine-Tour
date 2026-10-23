import {error,redirect} from '@sveltejs/kit';
import {articleBySlug} from '#lib/content.ts';
import {atlasArticleBySlug,canonicalAtlasSlug} from '#lib/atlas-content.ts';
export function load({params}:{params:{slug:string}}){if(params.slug==='quellen')return {article:null};const slug=canonicalAtlasSlug(params.slug);if(slug!==params.slug)redirect(308,'/entdecken/'+slug);const article=articleBySlug(slug)||atlasArticleBySlug(slug);if(!article)error(404,'Dieser Artikel wurde nicht gefunden.');return {article};}
