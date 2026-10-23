<script lang="ts">
 import type {Article} from '#lib/content.ts';import WorldMap from './WorldMap.svelte';
 let {article,compact=false}:{article:Article;compact?:boolean}=$props();
 const profile=$derived(article.atlas);const tone=$derived(profile?.color==='red'?'#8a5264':profile?.color==='family'?'#a78a57':'#b4b876');
 const paint=$derived('atlas-grape-'+article.slug+(compact?'-card':'-detail'));
</script>
{#if profile}<section class="atlas-visual" class:learning-visual={!compact} class:atlas-compact={compact} aria-label={compact?undefined:'Kurzprofil '+article.title}>
 {#if !compact}<div class="visual-heading"><span class="eyebrow">{profile.kind==='region'?'AUF EINEN BLICK':profile.kind==='producer'?'DAS WEINGUT':'DIE REBSORTE'}</span><h3>{profile.kind==='region'?article.title:profile.kind==='producer'?'Ort, Reben und Handschrift.':'Namen, Herkunft und Charakter.'}</h3></div>{/if}
 <div class="atlas-profile-layout">
  {#if profile.kind==='grape'}<div class="atlas-grape-art" style={'--grape-tone:'+tone}>
   <svg viewBox="0 0 220 220" role="img" aria-label={'Schematische Darstellung einer '+(profile.color==='red'?'dunklen':'hellen')+' Weintraube'}>
    <defs><radialGradient id={paint} cx="32%" cy="25%" r="78%"><stop offset="0" stop-color="var(--grape-tone)"/><stop offset="1" stop-color="var(--grape-tone)" stop-opacity=".68"/></radialGradient></defs>
    <ellipse cx="111" cy="198" rx="54" ry="8" class="atlas-grape-shadow"/>
    <path d="M111 55Q111 30 131 18M112 42Q151 11 171 42Q147 71 115 50" fill="none" stroke="var(--viz-leaf)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M109 50Q88 25 60 41Q63 70 100 66" fill="var(--viz-leaf)" opacity=".17" stroke="var(--viz-leaf)" stroke-width="2"/>
    {#each [[77,82],[111,76],[145,86],[68,115],[104,110],[140,120],[84,146],[120,153],[103,182]] as [x,y]}<circle cx={x} cy={y} r="23" fill={'url(#'+paint+')'} stroke="var(--visual-surface)" stroke-width="2.5"/>{/each}
   </svg>
  </div>{:else if profile.point}<WorldMap latitude={profile.point.latitude} longitude={profile.point.longitude} label={profile.kind==='producer'?profile.country:article.title} {compact}/>{/if}
  {#if !compact}<dl class="atlas-facts">{#each profile.facts as fact}<div><dt>{fact.label}</dt><dd>{fact.value}</dd></div>{/each}</dl>{/if}
 </div>
 {#if compact}<span class="atlas-card-origin">{profile.kind==='grape'?(profile.color==='red'?'Rote Traube':profile.color==='family'?'Sortenfamilie':'Weiße Traube'):profile.country}</span>{:else}
  {#if profile.aromas?.length}<div class="atlas-aroma-words"><small>Mögliche Duftassoziationen</small><div>{#each profile.aromas as aroma}<span>{aroma}</span>{/each}</div><p>Wortschatz zum Vergleichen. Herkunft, Reife und Ausbau verändern den einzelnen Wein.</p></div>{/if}
  {#if profile.kind!=='grape'}<p class="atlas-visual-caption">Geografische Lage im Überblick.</p>{/if}
 {/if}
</section>{/if}
