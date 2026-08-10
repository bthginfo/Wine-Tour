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
const number=(value:string,fallback=0)=>Number.isFinite(Number(value))?Number(value):fallback
const sourceList=(draft:Draft)=>Array.isArray(draft.sourceUrls)?draft.sourceUrls.filter((item):item is string=>typeof item==='string'&&item.startsWith('https://')):[]

export function applyCatalogAdditions(entries:unknown[]){
  regions.splice(0,regions.length,...structuredClone(base.regions))
  grapes.splice(0,grapes.length,...structuredClone(base.grapes))
  producers.splice(0,producers.length,...structuredClone(base.producers))
  wines.splice(0,wines.length,...structuredClone(base.wines))
  for(const locale of Object.keys(translations))delete translations[locale]
  const issues:string[]=[]
  const published=entries.filter((entry):entry is Draft=>Boolean(entry&&typeof entry==='object'&&(entry as Draft).status==='published'))
  for(const draft of published){
    const fields=record(draft.fields)
    const id=(draft.baseId||draft.slug||'').trim()
    const name=(draft.name||'').trim()
    const summary=(draft.summary||'').trim()
    const description=(draft.description||'').trim()
    const sources=sourceList(draft)
    if(!id||!name||!summary||!sources.length){issues.push(`Published ${draft.recordType??'record'} ${id||name||'unknown'} is incomplete`);continue}
    const locale=['en','de','fr','es'].includes(draft.locale??'')?draft.locale!:'en'
    if(locale!=='en'){
      if(!['region','grape','producer','wine'].includes(draft.recordType??'')){issues.push(`Published translation ${id} has an invalid record type`);continue}
      const sourceCollection=draft.recordType==='region'?regions:draft.recordType==='grape'?grapes:draft.recordType==='producer'?producers:wines
      if(!sourceCollection.some(item=>item.id===id)){issues.push(`Published ${locale} translation ${id} has no base record`);continue}
      translations[locale]??={};translations[locale][draft.recordType!]??={}
      translations[locale][draft.recordType!][id]={summary,description,fields}
      continue
    }
    if(draft.recordType==='region'){
      const existing=regions.find(item=>item.id===id)
      const next:Region={id,name,country:text(fields,'country')||existing?.country||'',lat:number(text(fields,'lat'),existing?.lat??0),lng:number(text(fields,'lng'),existing?.lng??0),summary,climate:text(fields,'climate')||existing?.climate||description,soil:text(fields,'soil')||existing?.soil||'',grapeIds:existing?.grapeIds??[],producerIds:existing?.producerIds??[],wineIds:existing?.wineIds??[],sourceUrl:sources[0],history:description||existing?.history||summary,growingSeason:existing?.growingSeason||text(fields,'climate')||summary,viticulture:existing?.viticulture||description||summary,wineStyles:existing?.wineStyles??[],subregions:existing?.subregions??[],pairings:existing?.pairings??[],keyFacts:existing?.keyFacts??[],sources:sources.map(url=>({label:new URL(url).hostname,url})),featured:existing?.featured,hasRegionalTerroirEvidence:Boolean(existing?.hasRegionalTerroirEvidence||(text(fields,'climate')&&text(fields,'soil')))}
      if(existing)Object.assign(existing,next);else regions.push(next)
    }else if(draft.recordType==='grape'){
      const existing=grapes.find(item=>item.id===id)
      const color=(text(fields,'colour')==='white'?'white':'red') as Grape['color']
      const next:Grape={id,name,aliases:existing?.aliases??[],color,summary,acidity:existing?.acidity??3,tannin:color==='red'?existing?.tannin??3:0,body:existing?.body??3,aromaIds:list(fields,'aromaIds').filter(aromaId=>aromas.some(item=>item.id===aromaId)),regionIds:list(fields,'regionIds'),origin:text(fields,'origin')||existing?.origin||'',ripening:existing?.ripening||description,climateFit:existing?.climateFit||description,viticulture:text(fields,'viticulture')||existing?.viticulture||description,winemaking:existing?.winemaking||description,styles:existing?.styles??[],pairings:existing?.pairings??[]}
      if(existing)Object.assign(existing,next);else grapes.push(next)
    }else if(draft.recordType==='producer'){
      const existing=producers.find(item=>item.id===id)
      const regionId=text(fields,'regionId')||existing?.regionId||''
      const region=regions.find(item=>item.id===regionId)
      if(!region){issues.push(`Published producer ${id} has no valid region`);continue}
      const next:Producer={id,name,regionId,regionIds:[regionId],summary,lat:existing?.lat??region.lat,lng:existing?.lng??region.lng,wineIds:existing?.wineIds??[],communityRating:existing?.communityRating??0,philosophy:text(fields,'philosophy')||existing?.philosophy||description,vineyard:text(fields,'viticulture')||existing?.vineyard||description,cellar:text(fields,'cellar')||existing?.cellar||description,speciality:existing?.speciality||description,sourceUrl:sources[0]}
      if(existing)Object.assign(existing,next);else producers.push(next)
    }else if(draft.recordType==='wine'){
      const existing=wines.find(item=>item.id===id)
      const producerId=text(fields,'producerId')||existing?.producerId||''
      const producer=producers.find(item=>item.id===producerId)
      const regionId=text(fields,'regionId')||producer?.regionId||existing?.regionId||''
      if(!producer||!regions.some(item=>item.id===regionId)){issues.push(`Published wine ${id} has no valid producer or region`);continue}
      const style=(['red','white','rose','sparkling','sweet','fortified'].includes(text(fields,'style'))?text(fields,'style'):'red') as WineStyle
      const vintageText=text(fields,'vintage')
      const next:Wine={id,name,producerId,regionId,grapeIds:list(fields,'grapeIds'),style,vintage:vintageText?Math.round(number(vintageText)):null,summary,aromaIds:list(fields,'aromaIds').filter(aromaId=>aromas.some(item=>item.id===aromaId)),serving:text(fields,'service')||existing?.serving||'',communityRating:existing?.communityRating??0,composition:description,vinification:text(fields,'vinification')||existing?.vinification||description,maturation:text(fields,'maturation')||existing?.maturation||'',drinkWindow:text(fields,'window')||existing?.drinkWindow||'',pairings:text(fields,'service').split('·').map(item=>item.trim()).filter(Boolean),sourceUrl:sources[0],evidenceLevel:'producer',merchantOffers:existing?.merchantOffers??[]}
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
