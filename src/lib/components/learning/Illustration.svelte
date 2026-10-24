<script lang="ts">
 import {onMount} from 'svelte';
 import {fade} from 'svelte/transition';
 import {prefersReducedMotion} from 'svelte/motion';
 import {illustrationSvg,type ArtworkKind} from '#lib/illustration-art.ts';
 let {kind,stage=0}:{kind:ArtworkKind;stage?:number}=$props();
 const id=$props.id();let root:HTMLDivElement;let visible=$state(false);
 onMount(()=>{const observer=new IntersectionObserver(entries=>visible=entries.some(entry=>entry.isIntersecting),{threshold:.1});observer.observe(root);return()=>observer.disconnect();});
</script>
<div class="scene-artwork" class:in-view={visible} bind:this={root} data-artwork={kind} aria-hidden="true">{#key kind+':'+stage}<div in:fade={{duration:prefersReducedMotion.current?0:150}}>{@html illustrationSvg(kind,stage,id)}</div>{/key}</div>
<style>
 .scene-artwork{width:100%;min-width:0;margin:12px 0 14px;isolation:isolate}.scene-artwork :global(svg){display:block;width:100%;height:auto;max-height:260px}.scene-artwork :global(.art-bubble){animation:art-rise 3.8s var(--bubble-delay) ease-in-out infinite;animation-play-state:paused}.scene-artwork.in-view :global(.art-bubble){animation-play-state:running}@keyframes art-rise{0%,100%{transform:translateY(0);opacity:.35}50%{transform:translateY(-18px);opacity:.85}}
 @media(prefers-reduced-motion:reduce){.scene-artwork :global(*){animation:none!important}}
</style>
