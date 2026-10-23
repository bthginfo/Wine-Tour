<script lang="ts">
 import Bottle from './Bottle.svelte';import type{Wine}from '#lib/content.ts';
 let{wine,credit=false}:{wine:Wine;credit?:boolean}=$props();
</script>
{#if wine.bottleImage}<figure class="product-bottle"><img src={wine.bottleImage} alt={wine.bottleAlt||wine.producer+' · '+wine.name} loading="lazy"/>{#if credit}<figcaption>{wine.bottleCredit}{#if wine.bottleNote}<span>{wine.bottleNote}</span>{/if}</figcaption>{/if}</figure>{:else}<Bottle color={wine.color} label="ROT"/>{/if}
