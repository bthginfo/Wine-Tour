<script lang="ts">
 import copy from '#lib/locales/de/story-companions.json';
 import media from '#lib/story-media.json';
 let {slug}:{slug:string}=$props();
 const story=$derived(copy[slug as keyof typeof copy]);
 const photo=$derived(story?media[story.photo as keyof typeof media]:undefined);
</script>
{#if story&&photo}
 <section class="story-companion" aria-label={story.title}>
  <figure><img src={photo.url} alt={story.alt} loading="lazy" decoding="async" width={slug==='juwel'?713:1200} height={slug==='juwel'?950:slug==='von-winning'?776:675}/><figcaption>{story.caption}<small>{story.credit}</small></figcaption></figure>
  <div class="companion-history"><span class="eyebrow">{story.eyebrow}</span><h3>{story.title}</h3><ol>{#each story.milestones as milestone}<li><span class="milestone-year">{milestone.year}</span><h4>{milestone.title}</h4><p>{milestone.body}</p></li>{/each}</ol></div>
 </section>
{/if}
<style>
 .story-companion{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:28px;margin:32px 0 35px;align-items:start;color:var(--ink)}figure{margin:0;min-width:0;border-radius:13px;overflow:hidden;background:var(--visual-surface);border:1px solid var(--line)}figure img{display:block;width:100%;height:auto;max-height:420px;object-fit:contain;object-position:center;background:var(--visual-surface)}figcaption{padding:14px 16px;font-size:11px;line-height:1.7;color:var(--ink)}figcaption small{display:block;color:var(--muted);font-size:10px;margin-top:5px}.companion-history{padding:4px 0}.companion-history>.eyebrow{font-size:9px;line-height:1.8}.companion-history>h3{font:700 20px/1.45 Manrope,sans-serif;letter-spacing:-.5px;margin:8px 0 20px}.companion-history ol{list-style:none;padding:0;margin:0}.companion-history li{position:relative;padding:0 0 22px 22px;border-left:1px solid var(--line)}.companion-history li:last-child{padding-bottom:0;border-left-color:transparent}.companion-history li:before{content:'';position:absolute;left:-4px;top:6px;width:7px;height:7px;border-radius:50%;background:var(--ink)}.milestone-year{display:block;font-size:11px;line-height:1.6;color:var(--muted);font-variant-numeric:tabular-nums;font-weight:600;margin-bottom:4px}.companion-history h4{font-size:13px;line-height:1.6;font-weight:650}.companion-history p{font-size:12px!important;line-height:1.8!important;margin:5px 0 0!important;color:var(--muted)}
 @media(max-width:640px){.story-companion{grid-template-columns:minmax(0,1fr);gap:20px}.story-companion figure img{max-height:390px}.companion-history{padding:0 4px}.companion-history li{padding-bottom:20px}.companion-history>h3{font-size:20px}.companion-history p{font-size:13px!important}}
</style>
