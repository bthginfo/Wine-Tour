<script lang="ts">
 import GrapeCluster from './GrapeCluster.svelte';
 import type {Article} from '#lib/content.ts';import WorldMap from './WorldMap.svelte';
 let {article,compact=false}:{article:Article;compact?:boolean}=$props();
 const profile=$derived(article.atlas);const tone=$derived(profile?.color==='red'?'#8a5264':profile?.color==='family'?'#a78a57':'#b4b876');

</script>
{#if profile}<section class="atlas-visual" class:learning-visual={!compact} class:atlas-compact={compact} aria-label={compact?undefined:'Kurzprofil '+article.title}>
 {#if !compact}<div class="visual-heading"><span class="eyebrow">{profile.kind==='region'?'AUF EINEN BLICK':profile.kind==='producer'?'DAS WEINGUT':'DIE REBSORTE'}</span><h3>{profile.kind==='region'?article.title:profile.kind==='producer'?'Ort, Reben und Handschrift.':'Namen, Herkunft und Charakter.'}</h3></div>{/if}
 <div class="atlas-profile-layout">
  {#if profile.kind==='grape'}<div class="atlas-grape-art" style={'--grape-tone:'+tone}>
   <GrapeCluster color={tone}/>
  </div>{:else if profile.point}<WorldMap latitude={profile.point.latitude} longitude={profile.point.longitude} label={profile.kind==='producer'?profile.country:article.title} {compact}/>{/if}
  {#if !compact}<dl class="atlas-facts">{#each profile.facts as fact}<div><dt>{fact.label}</dt><dd>{fact.value}</dd></div>{/each}</dl>{/if}
 </div>
 {#if compact}<span class="atlas-card-origin">{profile.kind==='grape'?(profile.color==='red'?'Rote Traube':profile.color==='family'?'Sortenfamilie':'Weiße Traube'):profile.country}</span>{:else}
  {#if profile.aromas?.length}<div class="atlas-aroma-words"><small>Mögliche Duftassoziationen</small><div>{#each profile.aromas as aroma}<span>{aroma}</span>{/each}</div><p>Wortschatz zum Vergleichen. Herkunft, Reife und Ausbau verändern den einzelnen Wein.</p></div>{/if}
  {#if profile.kind!=='grape'}<p class="atlas-visual-caption">Geografische Lage im Überblick.</p>{/if}
 {/if}
</section>{/if}
