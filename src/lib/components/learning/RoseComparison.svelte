<script lang="ts">
 import {onMount} from 'svelte';
 import {fade} from 'svelte/transition';
 import {prefersReducedMotion} from 'svelte/motion';
 import {getWines} from '#lib/editorial.svelte.ts';
 import copy from '#lib/locales/de/rose-comparison.json';
 import Glass from './Glass.svelte';
 let selected=$state(0);let root=$state<HTMLDivElement>();let visible=$state(false);
 const id=$props.id();const wines=$derived(getWines());const text=copy.visual;
 onMount(()=>{if(!root)return;const observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);},{threshold:.15});observer.observe(root);return()=>observer.disconnect();});
</script>

<div class="learning-visual rose-comparison" data-visual="rose-compare" bind:this={root} class:visual-visible={visible}>
 <div class="visual-heading"><span class="eyebrow">{text.eyebrow}</span><h3>{text.title}</h3></div>
 <div class="rose-comparison-glasses">
  {#each text.wines as item,i}
   {@const wine=wines.find(w=>w.id===item.id)}
   <div><Glass color="#dfa09d" bubbles={i===0?6:0}/><small>{wine?.region}</small><h4>{wine?.name||item.fallback}</h4><p>{wine?.producer}</p><strong>{item.detail}</strong></div>
  {/each}
 </div>
 <div class="diagram-options" role="group" aria-label={text.groupLabel}>
  {#each text.topics as topic,i}<button type="button" aria-pressed={selected===i} aria-controls={id} class:active={selected===i} onclick={()=>selected=i}>{topic.label}</button>{/each}
 </div>
 <div class="rose-comparison-explanation" id={id} aria-live="polite" aria-atomic="true">
  {#key selected}<div class="visual-explanation" in:fade={{duration:prefersReducedMotion.current?0:130}}><h4>{text.topics[selected].title}</h4><p>{text.topics[selected].body}</p></div>{/key}
 </div>
 <small class="visual-caption">{text.caption}</small>
</div>

<style>
 .rose-comparison-glasses{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin:24px 0}.rose-comparison-glasses>div{min-width:0;text-align:center;display:flex;flex-direction:column;align-items:center;padding:12px 10px 18px;border:1px solid var(--line);border-radius:13px;background:var(--surface)}.rose-comparison-glasses :global(.diagram-glass){height:140px;width:96px;margin-bottom:10px}.rose-comparison-glasses small{font-size:11px;color:var(--muted);margin-bottom:5px}.rose-comparison-glasses h4{font-size:16px;line-height:1.4}.rose-comparison-glasses p{font-size:12px;color:var(--muted);margin:5px 0 12px;line-height:1.6}.rose-comparison-glasses strong{font-size:11px;font-weight:600;margin-top:auto;padding:6px 9px;border-radius:7px;background:var(--mint)}.rose-comparison .diagram-options{gap:8px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.rose-comparison .diagram-options button{justify-content:center;min-width:0;min-height:44px;padding:10px 8px}.rose-comparison-explanation{min-height:150px}.rose-comparison :global(.glass-bubble){animation-play-state:paused}.rose-comparison.visual-visible :global(.glass-bubble){animation-play-state:running}
 @media(max-width:640px){.rose-comparison-glasses{gap:10px;margin:20px 0}.rose-comparison-glasses>div{padding:10px 7px 14px}.rose-comparison-glasses :global(.diagram-glass){height:112px;width:78px}.rose-comparison-glasses h4{font-size:14px}.rose-comparison-glasses strong{font-size:10px;line-height:1.6;padding:5px 6px}.rose-comparison-glasses p{font-size:11px}.rose-comparison .diagram-options button{font-size:12px;padding:10px 5px}.rose-comparison-explanation{min-height:195px}}
</style>
