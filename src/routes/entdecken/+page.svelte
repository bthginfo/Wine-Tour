<script lang="ts">
 import {tick} from 'svelte';import {prefersReducedMotion} from 'svelte/motion';
 import {searchText} from '#lib/search.ts';import {catalog,resetCatalog} from '#lib/catalog.svelte.ts';
 import {atlasArticles,atlasCountries,enrichAtlasArticle} from '#lib/atlas-content.ts';
 import ArticleThumb from '#lib/components/learning/ArticleThumb.svelte';import AtlasVisual from '#lib/components/learning/AtlasVisual.svelte';
 import {t} from '#lib/i18n.ts';import {categories,type Article} from '#lib/content.ts';
 import {getArticles,thumbnailSrc} from '#lib/editorial.svelte.ts';import Icon from '#lib/components/Icon.svelte';
 const featured=['bordeaux','chardonnay','champagne','barolo','cabernet-sauvignon','marlborough','syrah-shiraz','douro','chianti-classico','assyrtiko','stellenbosch','niepoort'];
 const articles=$derived(getArticles(atlasArticles).map(enrichAtlasArticle));
 const countries=Object.entries(atlasCountries).sort((a,b)=>a[1].label.localeCompare(b[1].label,'de'));
 function searchable(a:Article,deep=false){const places=(a.countries||[]).flatMap(code=>{const c=atlasCountries[code as keyof typeof atlasCountries];return c?[c.label,...c.aliases]:[];});return searchText([a.title,a.eyebrow,a.intro,a.slug,...a.aliases||[],...places,a.atlas?.color==='red'?'rot rote Traube':a.atlas?.color==='white'?'weiß weisse weiße Traube':'',...(deep?[...a.paragraphs,...(a.sections||[]).map(s=>s.title+' '+s.body)]:[])].join(' '));}
 const filtered=$derived.by(()=>{
  const list=articles.filter(a=>(catalog.category==='Alles'||a.category===catalog.category)&&(catalog.country==='all'||a.countries?.includes(catalog.country)));
  const terms=searchText(catalog.search.trim()).split(/\s+/).filter(Boolean);
  const direct=list.filter(a=>terms.every(term=>searchable(a).includes(term)));const matches=direct.length||!terms.length?direct:list.filter(a=>terms.every(term=>searchable(a,true).includes(term)));
  return [...matches].sort((a,b)=>{if(!terms.length){const ai=featured.indexOf(a.slug),bi=featured.indexOf(b.slug);if(ai>=0||bi>=0)return (ai<0?999:ai)-(bi<0?999:bi);}else{const aa=searchText(a.title).startsWith(terms.join(' ')),bb=searchText(b.title).startsWith(terms.join(' '));if(aa!==bb)return aa?-1:1;}return a.title.localeCompare(b.title,'de');});
 });
 const visible=$derived(filtered.slice(0,catalog.limit));
 const active=$derived(!!catalog.search||catalog.category!=='Alles'||catalog.country!=='all');
 async function showMore(){const previous=visible.length;catalog.limit+=36;await tick();const next=document.querySelectorAll<HTMLAnchorElement>('.article-card')[previous];next?.focus({preventScroll:true});next?.scrollIntoView({block:'start',behavior:prefersReducedMotion.current?'auto':'smooth'});}
</script>
<svelte:head><title>{t('m_e05ca8e56f')}</title></svelte:head>
<div class="page-content"><div class="page-heading"><div><div class="eyebrow">{t('m_e4844a3ede')}</div><h1>{t('m_019af2f223')}<span class="accent">.</span></h1><p>{t('m_b5cf70447a')}</p></div><span class="small-badge"><Icon name="book" size={14}/>{articles.length} {t('m_577488a78c')}</span></div>
 <div class="catalog-tools"><div class="search-field"><Icon name="search"/><input type="search" aria-label={t('m_077dd62e73')} placeholder={t('catalog.searchPlaceholder')} bind:value={catalog.search} oninput={()=>catalog.limit=36}/></div><label class="catalog-country"><span>{t('catalog.country')}</span><select bind:value={catalog.country} onchange={()=>catalog.limit=36} aria-label={t('catalog.country') }><option value="all">{t('catalog.allCountries')}</option>{#each countries as [code,country]}<option value={code}>{country.label}</option>{/each}</select></label></div>
 {#if catalog.country!=='all'&&atlasCountries[catalog.country as keyof typeof atlasCountries]}<p class="catalog-country-context">{atlasCountries[catalog.country as keyof typeof atlasCountries].context}</p>{/if}
 <div class="filters" role="group" aria-label={t('m_8474e677b5')}>{#each categories as cat}<button class="filter" class:active={catalog.category===cat} aria-label={cat} aria-pressed={catalog.category===cat} onclick={()=>{catalog.category=cat;catalog.limit=36;}}>{cat}</button>{/each}</div>
 <div class="catalog-results"><p class="muted small" aria-live="polite">{visible.length<filtered.length?visible.length+' von '+filtered.length+' Artikeln':filtered.length+' Artikel'}{catalog.search?' für „'+catalog.search+'“':''}</p>{#if active}<button type="button" class="text-button" onclick={resetCatalog}>{t('catalog.reset')}</button>{/if}</div>
 <div class="article-grid" id="atlas-results">{#each visible as article (article.slug)}<a class="article-card" id={'artikel-'+article.slug} href={'/entdecken/'+article.slug} onclick={()=>catalog.lastOpenSlug=article.slug}><div class="article-card-image" class:producer-image={article.category==='Weingüter'}>{#if article.image}<img class="editorial-image" style={'--image-position:'+(article.imagePosition||'center')+';--image-position-mobile:'+(article.imagePositionMobile||article.imagePosition||'center')+';--image-fit:'+(article.imageFit||'cover')} src={thumbnailSrc(article.image)} alt={article.imageAlt||(article.category==='Regionen'?'Weinlandschaft: '+article.title:'Bild zum Thema '+article.title)} loading="lazy"/>{:else if article.atlas}<AtlasVisual {article} compact/>{:else}<ArticleThumb kind={article.visual} slug={article.slug}/>{/if}<span class="pill">{article.category}</span></div><div class="article-card-copy"><h3>{article.title}</h3><p>{article.intro}</p><span>{article.eyebrow}<Icon name="external" size={16}/></span></div></a>{/each}</div>
 {#if visible.length<filtered.length}<div class="catalog-more"><p>{visible.length} von {filtered.length} Artikeln</p><button type="button" class="button outline" aria-controls="atlas-results" onclick={showMore}>{t('catalog.more')}<Icon name="next" size={16}/></button></div>{/if}
 {#if !filtered.length}<div class="empty-state"><span class="teaser-icon lilac"><Icon name="search"/></span><h2>{t('m_35de559e26')}</h2><p>{t('m_4edda24cbf')}</p><button class="button outline" onclick={resetCatalog}>{t('m_ffbd9af24a')}</button></div>{/if}
</div>

<style>.catalog-country-context{font-size:13px;line-height:1.8;color:var(--muted);max-width:75ch;margin:-8px 0 24px}</style>
