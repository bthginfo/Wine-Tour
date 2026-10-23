<script lang="ts">
 import {Citrus,Leaf,Tag,ShieldCheck,Thermometer,Layers,FlaskConical}from'lucide-svelte';import Glass from'./Glass.svelte';import RegionMap from'./RegionMap.svelte';
 let{kind,slug}:{kind?:string;slug:string}=$props();const Mark=$derived(kind==='aromas'?Citrus:kind==='closures'?ShieldCheck:kind==='temperature'?Thermometer:kind==='label'?Tag:kind==='storage'?Leaf:kind==='pinot'?Layers:FlaskConical);
</script>
<div class="article-thumb" data-kind={kind} aria-hidden="true">{#if kind==='region'}<RegionMap {slug} compact/>{:else if kind==='bubbles'||kind==='skins'}<span class="thumb-orbit"></span><Glass color={slug==='rotwein'?'#944960':kind==='skins'?'#c58b96':'#d9c995'} bubbles={0}/><div class="thumb-detail"><span></span><span></span><span></span></div>{:else}<span class="thumb-orbit"></span><div class="thumb-symbol"><Mark size={46} strokeWidth={1.3}/></div><span class="thumb-line one"></span><span class="thumb-line two"></span>{/if}</div>
