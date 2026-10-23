<script lang="ts">
 import Bottle from './Bottle.svelte';import Modal from './Modal.svelte';import{Expand}from'lucide-svelte';import type{Wine}from '#lib/content.ts';
 let{wine,credit=false,interactive=false}:{wine:Wine;credit?:boolean;interactive?:boolean}=$props();let open=$state(false);
</script>
{#if wine.bottleImage}<figure class="product-bottle">{#if interactive}<button type="button" class="bottle-enlarge" aria-label={wine.name+' · Flaschenbild vergrößern'} onclick={()=>open=true}><img src={wine.bottleImage} alt={wine.bottleAlt||wine.producer+' · '+wine.name} loading="lazy"/><span><Expand size={14}/></span></button>{:else}<img src={wine.bottleImage} alt={wine.bottleAlt||wine.producer+' · '+wine.name} loading="lazy"/>{/if}{#if credit}<figcaption>{wine.bottleCredit}{#if wine.bottleNote}<span>{wine.bottleNote}</span>{/if}</figcaption>{/if}</figure>{:else}<Bottle color={wine.color} label="ROT"/>{/if}
{#if interactive}<Modal bind:open title={wine.name}><figure class="bottle-closeup"><img src={wine.bottleImage} alt={wine.bottleAlt||wine.name}/><figcaption>{wine.bottleCredit}{#if wine.bottleNote}<span>{wine.bottleNote}</span>{/if}</figcaption></figure></Modal>{/if}
