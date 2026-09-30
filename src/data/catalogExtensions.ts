import type { Grape, Producer, Region, Wine, WineStyle } from '../types'
import { aromas, counts, grapes, producers, regionAncestors, regions, wines } from './catalog'

type Draft={
  recordType?:string
  baseId?:string
  slug?:string
  name?:string
  status?:string
  summary?:string
  description?:string
  locale?:string
  sourceUrls?:unknown
  fields?:unknown
}

type TranslationDraft={summary:string;description:string;fields:Record<string,unknown>}
const translations:Record<string,Record<string,Record<string,TranslationDraft>>>={}
export function catalogTranslation(recordType:string,id:string,locale:string){return translations[locale]?.[recordType]?.[id]}

const base={
  regions:structuredClone(regions),
  grapes:structuredClone(grapes),
  producers:structuredClone(producers),
  wines:structuredClone(wines),
}

const record=(value:unknown)=>value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{}
const text=(fields:Record<string,unknown>,key:string)=>typeof fields[key]==='string'?fields[key] as string:''
const list=(fields:Record<string,unknown>,key:string)=>Array.isArray(fields[key])?(fields[key] as unknown[]).filter((item):item is string=>typeof item==='string'):[]
const has=(fields:Record<string,unknown>,key:string)=>Object.prototype.hasOwnProperty.call(fields,key)
const invalidList=(fields:Record<string,unknown>,key:string)=>has(fields,key)&&(!Array.isArray(fields[key])||(fields[key] as unknown[]).some(item=>typeof item!=='string'))
const numeric=(value:unknown,fallback=0):number=>typeof value==='number'?value:typeof value==='string'&&value.trim()&&Number.isFinite(Number(value))?Number(value):fallback
const field=(fields:Record<string,unknown>,key:string,existing:string|undefined,fallback='')=>has(fields,key)?text(fields,key):existing??fallback
const aliasField=(fields:Record<string,unknown>,primary:string,alias:string,existing:string|undefined,fallback='')=>has(fields,primary)?text(fields,primary):has(fields,alias)?text(fields,alias):existing??fallback
const optionalInteger=(fields:Record<string,unknown>,key:string,fallback:number|null)=>{
  if(!has(fields,key))return fallback
  const value=fields[key]
  if(value===null||value==='')return null
  if(typeof value==='number'&&Number.isInteger(value))return value
  return typeof value==='string'&&/^\d{4}$/.test(value.trim())?Number(value):fallback
}
const sourceList=(draft:Draft)=>Array.isArray(draft.sourceUrls)?draft.sourceUrls.filter((item):item is string=>typeof item==='string'&&item.startsWith('https://')):[]

export function applyCatalogAdditions(entries:unknown[]){
  regions.splice(0,regions.length,...structuredClone(base.regions))
  grapes.splice(0,grapes.length,...structuredClone(base.grapes))
  producers.splice(0,producers.length,...structuredClone(base.producers))
  wines.splice(0,wines.length,...structuredClone(base.wines))
  for(const locale of Object.keys(translations))delete translations[locale]
  const issues:string[]=[]
  const rank=(draft:Draft)=>({region:0,grape:1,producer:2,wine:3}[draft.recordType??'']??9)+(draft.locale&&draft.locale!=='en'?10:0)
  const published=entries.filter((entry):entry is Draft=>Boolean(entry&&typeof entry==='object'&&(entry as Draft).status==='published')).sort((a,b)=>rank(a)-rank(b))
  for(const draft of published){
    const fields=record(draft.fields)
    const id=(draft.baseId||draft.slug||'').trim()
    const name=(draft.name||'').trim()
    const summary=(draft.summary||'').trim()
    const description=(draft.description||'').trim()
    const sources=sourceList(draft)
    if(draft.locale&& !['en','de','fr','es'].includes(draft.locale)){issues.push(`Published record ${id||name||'unknown'} has an invalid locale`);continue}
    const locale=['en','de','fr','es'].includes(draft.locale??'')?draft.locale!:'en'
    if(!['region','grape','producer','wine'].includes(draft.recordType??'')){issues.push(`Published record ${id||name||'unknown'} has an invalid record type`);continue}
    const sourceCollection=draft.recordType==='region'?regions:draft.recordType==='grape'?grapes:draft.recordType==='producer'?producers:wines
    const existingForDraft=sourceCollection.find(item=>item.id===id)
    const invalidSources=Array.isArray(draft.sourceUrls)&&draft.sourceUrls.some(item=>typeof item!=='string'||!item.startsWith('https://'))
    if(invalidSources){issues.push(`Published ${draft.recordType??'record'} ${id||name||'unknown'} has an invalid sourceUrls entry`);continue}
    if(!id||(!name&&!existingForDraft&&locale==='en')||(!summary&&!existingForDraft&&locale==='en')||(!sources.length&&!existingForDraft)){issues.push(`Published ${draft.recordType??'record'} ${id||name||'unknown'} is incomplete`);continue}
    if(locale!=='en'){
      if(!['region','grape','producer','wine'].includes(draft.recordType??'')){issues.push(`Published translation ${id} has an invalid record type`);continue}
      if(!sourceCollection.some(item=>item.id===id)){issues.push(`Published ${locale} translation ${id} has no base record`);continue}
      translations[locale]??={};translations[locale][draft.recordType!]??={}
      translations[locale][draft.recordType!][id]={summary,description,fields}
      continue
    }
    const resolvedName=name||String((existingForDraft as {name?:string}|undefined)?.name??id)
    const resolvedSummary=summary||String((existingForDraft as {summary?:string}|undefined)?.summary??'')
    if(draft.recordType==='region'){
      const existing=regions.find(item=>item.id===id)
      const rawLat=fields.lat,rawLng=fields.lng
      if(!existing&&(!has(fields,'lat')||!has(fields,'lng')||rawLat===''||rawLng==='')){issues.push(`Published region ${id} is missing coordinates`);continue}
      if((has(fields,'lat')&&rawLat!==''&&(!Number.isFinite(Number(rawLat))||Math.abs(Number(rawLat))>90))||(has(fields,'lng')&&rawLng!==''&&(!Number.isFinite(Number(rawLng))||Math.abs(Number(rawLng))>180))){issues.push(`Published region ${id} has invalid coordinates`);continue}
      const requestedRegionGrapes=list(fields,'grapeIds')
      if(invalidList(fields,'grapeIds')||requestedRegionGrapes.some(grapeId=>!grapes.some(item=>item.id===grapeId))){issues.push(`Published region ${id} has invalid grapeIds`);continue}
      const next:Region={id,name:resolvedName,country:field(fields,'country',existing?.country),lat:numeric(rawLat,existing?.lat??0),lng:numeric(rawLng,existing?.lng??0),summary:resolvedSummary,climate:field(fields,'climate',existing?.climate,description),soil:field(fields,'soil',existing?.soil),grapeIds:list(fields,'grapeIds').length?list(fields,'grapeIds'):existing?.grapeIds??[],producerIds:existing?.producerIds??[],wineIds:existing?.wineIds??[],sourceUrl:sources.length?sources[0]:existing?.sourceUrl??'',history:field(fields,'history',existing?.history,description||resolvedSummary),growingSeason:field(fields,'growingSeason',existing?.growingSeason,text(fields,'climate')||resolvedSummary),viticulture:field(fields,'viticulture',existing?.viticulture,description||resolvedSummary),wineStyles:list(fields,'wineStyles').length?list(fields,'wineStyles'):existing?.wineStyles??[],subregions:list(fields,'subregions').length?list(fields,'subregions'):existing?.subregions??[],pairings:list(fields,'pairings').length?list(fields,'pairings'):existing?.pairings??[],keyFacts:list(fields,'keyFacts').length?list(fields,'keyFacts'):existing?.keyFacts??[],sources:sources.length?sources.map(url=>({label:new URL(url).hostname,url})):existing?.sources??[],featured:existing?.featured,hasRegionalTerroirEvidence:Boolean(existing?.hasRegionalTerroirEvidence||(text(fields,'climate')&&text(fields,'soil')))}
      if(existing)Object.assign(existing,next);else regions.push(next)
    }else if(draft.recordType==='grape'){
      const existing=grapes.find(item=>item.id===id)
      const requestedColour=text(fields,'colour')
      if(requestedColour&&requestedColour!=='white'&&requestedColour!=='red'){issues.push(`Published grape ${id} has invalid colour`);continue}
      if(!existing&&!requestedColour){issues.push(`Published grape ${id} is missing colour`);continue}
      const color=(requestedColour||existing?.color||'red') as Grape['color']
      const requestedGrapeAromas=list(fields,'aromaIds'),requestedGrapeRegions=list(fields,'regionIds')
      if(invalidList(fields,'aromaIds')||requestedGrapeAromas.some(aromaId=>!aromas.some(item=>item.id===aromaId))){issues.push(`Published grape ${id} has invalid aromaIds`);continue}
      if(invalidList(fields,'regionIds')||requestedGrapeRegions.some(regionId=>!regions.some(item=>item.id===regionId))){issues.push(`Published grape ${id} has invalid regionIds`);continue}
      const next:Grape={id,name:resolvedName,aliases:existing?.aliases??[],color,summary:resolvedSummary,acidity:existing?.acidity??3,tannin:color==='red'?existing?.tannin??3:0,body:existing?.body??3,aromaIds:requestedGrapeAromas.length?requestedGrapeAromas:existing?.aromaIds??[],regionIds:requestedGrapeRegions.length?requestedGrapeRegions:existing?.regionIds??[],origin:field(fields,'origin',existing?.origin),ripening:field(fields,'ripening',existing?.ripening,description),climateFit:field(fields,'climateFit',existing?.climateFit,description),viticulture:field(fields,'viticulture',existing?.viticulture,description),winemaking:field(fields,'winemaking',existing?.winemaking,description),styles:list(fields,'styles').length?list(fields,'styles'):existing?.styles??[],pairings:list(fields,'pairings').length?list(fields,'pairings'):existing?.pairings??[]}
      if(existing)Object.assign(existing,next);else grapes.push(next)
    }else if(draft.recordType==='producer'){
      const existing=producers.find(item=>item.id===id)
      const regionId=text(fields,'regionId')||existing?.regionId||''
      const region=regions.find(item=>item.id===regionId)
      if(!region){issues.push(`Published producer ${id} has no valid region`);continue}
      const requestedRegions=list(fields,'regionIds')
      if(invalidList(fields,'regionIds')||requestedRegions.some(regionIdValue=>!regions.some(item=>item.id===regionIdValue))){issues.push(`Published producer ${id} has invalid regionIds`);continue}
      const next:Producer={id,name:resolvedName,regionId,regionIds:[...new Set([regionId,...(existing?.regionIds??[]),...requestedRegions])],summary:resolvedSummary,lat:existing?.lat??region.lat,lng:existing?.lng??region.lng,wineIds:existing?.wineIds??[],communityRating:existing?.communityRating??0,philosophy:field(fields,'philosophy',existing?.philosophy,description||resolvedSummary),vineyard:aliasField(fields,'vineyard','viticulture',existing?.vineyard,description||resolvedSummary),cellar:field(fields,'cellar',existing?.cellar,description||resolvedSummary),speciality:field(fields,'speciality',existing?.speciality,description||resolvedSummary),sourceUrl:sources.length?sources[0]:existing?.sourceUrl??''}
      if(existing)Object.assign(existing,next);else producers.push(next)
    }else if(draft.recordType==='wine'){
      const existing=wines.find(item=>item.id===id)
      const producerId=text(fields,'producerId')||existing?.producerId||''
      const producer=producers.find(item=>item.id===producerId)
      const regionId=text(fields,'regionId')||existing?.regionId||producer?.regionId||''
      if(!producer||!regions.some(item=>item.id===regionId)){issues.push(`Published wine ${id} has no valid producer or region`);continue}
      if(!producer.regionIds.includes(regionId)){issues.push(`Published wine ${id} region ${regionId} is not linked to producer ${producer.id}`);continue}
      const requestedStyle=text(fields,'style')
      const validStyles=['red','white','rose','sparkling','sweet','fortified']
      if(requestedStyle&&!validStyles.includes(requestedStyle)){issues.push(`Published wine ${id} has invalid style`);continue}
      if(!existing&&!requestedStyle){issues.push(`Published wine ${id} is missing style`);continue}
      const style=(requestedStyle||existing?.style||'red') as WineStyle
      const nextPairings=list(fields,'pairings')
      const submittedGrapes=list(fields,'grapeIds')
      if(invalidList(fields,'grapeIds')||(has(fields,'grapeIds')&&!submittedGrapes.length)||submittedGrapes.some(grapeId=>!grapes.some(item=>item.id===grapeId))){issues.push(`Published wine ${id} has invalid grapeIds`);continue}
      const submittedAromas=list(fields,'aromaIds')
      if(invalidList(fields,'aromaIds')||submittedAromas.some(aromaId=>!aromas.some(item=>item.id===aromaId))){issues.push(`Published wine ${id} has invalid aromaIds`);continue}
      if(invalidList(fields,'pairings')){issues.push(`Published wine ${id} has invalid pairings`);continue}
      const rawVintage=fields.vintage
      if(has(fields,'vintage')&&rawVintage!==null&&rawVintage!==''&&!(typeof rawVintage==='number'&&Number.isInteger(rawVintage)&&rawVintage>=1800&&rawVintage<=new Date().getFullYear())&&!(typeof rawVintage==='string'&&/^\d{4}$/.test(rawVintage.trim())&&Number(rawVintage)>=1800&&Number(rawVintage)<=new Date().getFullYear())){issues.push(`Published wine ${id} has invalid vintage`);continue}
      const next:Wine={id,name:resolvedName,producerId,regionId,grapeIds:submittedGrapes.length?submittedGrapes:existing?.grapeIds??[],style,vintage:optionalInteger(fields,'vintage',existing?.vintage??null),summary:resolvedSummary,aromaIds:submittedAromas.length?submittedAromas:existing?.aromaIds??[],serving:field(fields,'service',existing?.serving),communityRating:existing?.communityRating??0,composition:field(fields,'composition',existing?.composition),vinification:field(fields,'vinification',existing?.vinification),maturation:field(fields,'maturation',existing?.maturation),drinkWindow:aliasField(fields,'drinkWindow','window',existing?.drinkWindow),pairings:nextPairings.length?nextPairings:(existing?.pairings??[]),sourceUrl:sources[0]||existing?.sourceUrl||'',evidenceLevel:existing?.evidenceLevel??'producer',merchantOffers:existing?.merchantOffers??[]}
      if(existing)Object.assign(existing,next);else wines.push(next)
    }
  }
  for(const region of regions){region.producerIds=[];region.wineIds=[]}
  for(const producer of producers){
    producer.wineIds=[]
    producer.regionIds=[...new Set(producer.regionIds.flatMap(regionId=>[regionId,...regionAncestors(regionId)]))]
    for(const regionId of producer.regionIds){const region=regions.find(item=>item.id===regionId);if(region&&!region.producerIds.includes(producer.id))region.producerIds.push(producer.id)}
  }
  for(const wine of wines){
    const producer=producers.find(item=>item.id===wine.producerId)
    if(producer&&!producer.wineIds.includes(wine.id))producer.wineIds.push(wine.id)
    for(const regionId of [wine.regionId,...regionAncestors(wine.regionId)]){const region=regions.find(item=>item.id===regionId);if(region&&!region.wineIds.includes(wine.id))region.wineIds.push(wine.id)}
  }
  for(const grape of grapes)for(const regionId of grape.regionIds){const region=regions.find(item=>item.id===regionId);if(region&&!region.grapeIds.includes(grape.id))region.grapeIds.push(grape.id)}
  counts.regions=regions.length;counts.grapes=grapes.length;counts.producers=producers.length;counts.wines=wines.length
  return issues
}
