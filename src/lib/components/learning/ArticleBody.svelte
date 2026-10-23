<script lang="ts">
 import StoryCompanion from './StoryCompanion.svelte';
 import RegionProfile from './RegionProfile.svelte';
 import RoseComparison from './RoseComparison.svelte';
 import glossary from '#lib/locales/de/atlas/glossary.json';
 import WineStyleVisual from './WineStyleVisual.svelte';
 import AtlasVisual from './AtlasVisual.svelte';
 import type{Article}from'#lib/content.ts';import{getWines}from'#lib/editorial.svelte.ts';import LearningVisual from'./LearningVisual.svelte';import WineBottle from'../WineBottle.svelte';import Icon from'../Icon.svelte';
 let{article,compact=false}:{article:Article;compact?:boolean}=$props();const readingCopy=$derived([article.intro,...article.paragraphs,...(article.sections||[]).map(s=>s.body)].join(' ').toLocaleLowerCase('de-DE'));const terms=$derived(glossary.filter(entry=>entry.matches.some(word=>readingCopy.includes(word))));const featuredWine=$derived(article.visual==='producer'?getWines().find(w=>w.slugs[1]===article.slug):undefined);
</script>
<div class="article-body">
 <div class="prose article-opening">{#if article.paragraphs[0]}<p>{article.paragraphs[0]}</p>{/if}</div>
 {#if terms.length}<details class="wine-words"><summary><Icon name="book" size={15}/><span>Weinwörter kurz erklärt</span><Icon name="next" size={16}/></summary><dl>{#each terms as entry}<div><dt>{entry.term}</dt><dd>{entry.meaning}</dd></div>{/each}</dl></details>{/if}
 {#if article.visual==='rose-compare'}<RoseComparison/>{:else if article.visual==='atlas'&&article.atlas}<AtlasVisual {article}/>{:else if article.visual==='wine-style'}{#key article.slug}<WineStyleVisual slug={article.slug}/>{/key}{:else if article.visual&&article.visual!=='none'&&article.visual!=='producer'}{#key article.slug}<LearningVisual kind={article.visual} slug={article.slug}/>{/key}{:else if featuredWine}<section class="wine-passport" aria-label={'Unser Wein von '+featuredWine.producer}><WineBottle wine={featuredWine} interactive/><div><span class="eyebrow">UNSER WEIN</span><h3>{featuredWine.name}</h3><p>{featuredWine.producer}</p><dl><div><dt>Herkunft</dt><dd>{featuredWine.region}</dd></div><div><dt>Rebsorte</dt><dd>{featuredWine.grape}</dd></div><div><dt>Im Glas</dt><dd>{featuredWine.style}</dd></div></dl></div></section>{/if}
 <div class="prose article-opening">{#each article.paragraphs.slice(1) as p}<p>{p}</p>{/each}</div>
 <RegionProfile slug={article.slug}/>
 <StoryCompanion slug={article.slug}/>
 {#if article.sections?.length}{#if compact}<details class="reading-depth"><summary>Mehr über {article.category==='Weingüter'?'das Weingut':article.category==='Regionen'?'die Region':'dieses Thema'}<span>{article.sections.length} kurze Abschnitte</span><Icon name="next" size={17}/></summary><div class="article-sections">{#each article.sections as section,i}<section><span class="section-index">{String(i+1).padStart(2,'0')}</span><h3>{section.title}</h3><div class="prose">{#each section.body.split(/\n\s*\n/).filter(Boolean) as p}<p>{p}</p>{/each}</div></section>{/each}</div></details>{:else}<div class="article-sections">{#each article.sections as section,i}{@const background=article.atlas?.kind==='region'&&i>0||article.atlas?.kind==='grape'&&i===2}<section class:atlas-background={background}>{#if background}<details><summary><span class="section-index">{String(i+1).padStart(2,'0')}</span><span>{section.title}</span><Icon name="next" size={17}/></summary><div class="prose">{#each section.body.split(/\n\s*\n/).filter(Boolean) as p}<p>{p}</p>{/each}</div></details>{:else}<span class="section-index">{String(i+1).padStart(2,'0')}</span><h2>{section.title}</h2><div class="prose">{#each section.body.split(/\n\s*\n/).filter(Boolean) as p}<p>{p}</p>{/each}</div>{/if}</section>{/each}</div>{/if}{/if}
</div>
