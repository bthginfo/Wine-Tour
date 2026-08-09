import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { grapes } from '../src/data/catalog'

type Listing = { id:string; name:string }
type MediaRecord = {
  grapeId:string
  sourceName:string
  leafUrl:string
  clusterUrl:string
  sourceUrl:string
  sourceLabel:string
}

const manualNames:Record<string,string[]> = {
  'syrah-shiraz':['Syrah'],
  'grenache-garnacha':['Grenache'],
  'mourvedre-monastrell':['Mourvèdre'],
  'zinfandel-primitivo':['Primitivo','Zinfandel'],
  'blaufrankisch-lemberger':['Blaufränkisch'],
  'albarino-alvarinho':['Alvarinho'],
  'viura-macabeo':['Macabeu'],
  'nero-d-avola':['Calabrese'],
  'melon-de-bourgogne':['Melon'],
  'pedro-ximenez':['Pedro Ximénez'],
  'torrontes':['Torrontés riojano'],
  'mencia':['Mencía'],
  'pais':['País'],
  'gruner-veltliner':['Grüner Veltliner'],
  'gewurztraminer':['Gewurztraminer'],
}

function normalize(value:string){
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('en').replace(/[^a-z0-9]+/g,' ').trim()
}

async function text(url:string){
  const response=await fetch(url,{headers:{'user-agent':'VineAtlasEditorialImporter/1.0'}})
  if(!response.ok)throw new Error(`${response.status} ${url}`)
  return response.text()
}

function extractListings(html:string):Listing[]{
  const pattern=/m-grapeCard__wrapper[^>]*href="https:\/\/www\.plantgrape\.fr\/en\/varieties\/fruit-varieties\/(\d+)"[\s\S]*?m-grapeCard__textTitle[^>]*>([^<]+)<\/h4>/gi
  return [...html.matchAll(pattern)].map(match=>({id:match[1],name:match[2].trim()}))
}

function imageWithAlt(html:string,alt:'Feuille'|'Grappe'){
  const tags=[...html.matchAll(/<img[^>]+>/gi)].map(match=>match[0])
  const tag=tags.find(candidate=>new RegExp(`alt="${alt}"`,'i').test(candidate)&&/(?:data-src|src)="https:\/\/www\.plantgrape\.fr\/storage\/img\//i.test(candidate))
  return tag?.match(/(?:data-src|src)="(https:\/\/www\.plantgrape\.fr\/storage\/img\/[^"]+)"/i)?.[1]
}

async function main(){
  const pages=await Promise.all(Array.from({length:23},(_,index)=>text(`https://www.plantgrape.fr/en/varieties/fruit-varieties?page=${index+1}`)))
  const listings=pages.flatMap(extractListings)
  const byName=new Map(listings.map(item=>[normalize(item.name),item]))
  const matches=grapes.flatMap(grape=>{
    const candidates=[grape.name,...grape.aliases,...(manualNames[grape.id]??[])].flatMap(name=>name.split(' / '))
    const match=candidates.map(name=>byName.get(normalize(name))).find(Boolean)
    return match?[{grape,match}]:[]
  })
  const records:MediaRecord[]=[]
  for(let offset=0;offset<matches.length;offset+=12){
    const batch=matches.slice(offset,offset+12)
    const results=await Promise.all(batch.map(async({grape,match})=>{
      const sourceUrl=`https://www.plantgrape.fr/en/varieties/fruit-varieties/${match.id}`
      const html=await text(sourceUrl)
      const leafUrl=imageWithAlt(html,'Feuille'),clusterUrl=imageWithAlt(html,'Grappe')
      if(!leafUrl||!clusterUrl)return null
      return {grapeId:grape.id,sourceName:match.name,leafUrl,clusterUrl,sourceUrl,sourceLabel:'PlantGrape · IFV / INRAE / Institut Agro'} satisfies MediaRecord
    }))
    records.push(...results.filter((item):item is MediaRecord=>Boolean(item)))
  }
  const target=resolve('src/data/ampelographyMedia.generated.json')
  writeFileSync(target,`${JSON.stringify(records,null,2)}\n`,'utf8')
  console.log(JSON.stringify({catalogGrapes:grapes.length,matchedPages:matches.length,completePhotoPairs:records.length,target}))
}

main().catch(error=>{console.error(error);process.exitCode=1})
