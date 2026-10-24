<script lang="ts">
 import type {AtlasProfile} from '#lib/content.ts';
 let {title,profile}:{title:string;profile:AtlasProfile}=$props();
</script>
<section class="article-facts" aria-label={'Kurzprofil: '+title}>
 <span class="eyebrow">Auf einen Blick</span>
 <dl>{#each profile.facts as fact}<div><dt>{fact.label}</dt><dd>{fact.value}</dd></div>{/each}</dl>
</section>
<style>
 .article-facts{margin:24px 0 29px;padding:20px 22px;border:1px solid var(--line);border-radius:13px;background:var(--soft);color:var(--ink)}.article-facts>.eyebrow{font-size:9px;color:var(--muted)}dl{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px 26px;margin:17px 0 0}dl>div{min-width:0}dt{font-size:11px;line-height:1.6;color:var(--muted);margin-bottom:5px}dd{font-size:14px;line-height:1.7;font-weight:500;margin:0;overflow-wrap:anywhere;font-variant-numeric:tabular-nums}
 @media(max-width:520px){.article-facts{padding:18px}dl{grid-template-columns:minmax(0,1fr);gap:15px}dd{font-size:13px}}
</style>
