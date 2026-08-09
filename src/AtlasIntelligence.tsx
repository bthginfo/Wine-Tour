import { Check, GitCompareArrows, Layers3, Plus, X } from 'lucide-react'
import { grapes, producers } from './data/catalog'
import { countryLabel, regionContent, regionName } from './localizedContent'
import { useLocale, type Locale } from './i18n'
import type { Region } from './types'

export type AtlasLens='classic'|'climate'|'soil'

const copy={
  en:{title:'Map layers',classic:'Wine families',climate:'Climate',soil:'Soils',compare:'Compare region',remove:'Remove',comparison:'Place comparison',empty:'Choose up to two regions to compare climate, ground and linked knowledge.',lat:'Latitude',grapes:'Key varieties',producers:'Linked producers'},
  de:{title:'Kartenebenen',classic:'Weinfamilien',climate:'Klima',soil:'Böden',compare:'Region vergleichen',remove:'Entfernen',comparison:'Orte vergleichen',empty:'Wähle bis zu zwei Regionen, um Klima, Boden und Wissensverbindungen zu vergleichen.',lat:'Breitengrad',grapes:'Leitrebsorten',producers:'Verknüpfte Erzeuger'},
  fr:{title:'Couches cartographiques',classic:'Familles de vin',climate:'Climat',soil:'Sols',compare:'Comparer la région',remove:'Retirer',comparison:'Comparaison de lieux',empty:'Choisissez jusqu’à deux régions pour comparer climat, sols et connaissances liées.',lat:'Latitude',grapes:'Cépages clés',producers:'Producteurs liés'},
  es:{title:'Capas del mapa',classic:'Familias de vino',climate:'Clima',soil:'Suelos',compare:'Comparar región',remove:'Quitar',comparison:'Comparación de lugares',empty:'Elige hasta dos regiones para comparar clima, suelo y conocimiento conectado.',lat:'Latitud',grapes:'Variedades clave',producers:'Productores vinculados'},
} satisfies Record<Locale,Record<string,string>>

const classify=(text:string,groups:Array<[string,string[]]>,fallback:string)=>groups.find(([,terms])=>terms.some(term=>text.toLowerCase().includes(term)))?.[0]??fallback
export function lensValue(region:Region,lens:AtlasLens){
  if(lens==='climate')return classify(region.climate,[['Maritime',['maritime','ocean','atlantic','coastal']],['Continental',['continental','diurnal','inland']],['Mediterranean',['mediterranean','warm dry','hot dry']],['Altitude',['altitude','alpine','mountain']],['Cool',['cool','cold']]],'Mixed')
  if(lens==='soil')return classify(region.soil,[['Limestone',['limestone','chalk','calcareous']],['Slate / schist',['slate','schist']],['Volcanic',['volcan','basalt']],['Granite',['granite']],['Gravel / sand',['gravel','sand']],['Clay / loam',['clay','loam']]],'Mixed')
  return region.grapeIds.some(id=>grapes.find(grape=>grape.id===id)?.color==='red')?'Red-led':'White-led'
}
const palette:Record<string,string>={'Maritime':'#477a82','Continental':'#9b663d','Mediterranean':'#b44e3f','Altitude':'#687b52','Cool':'#5071a3','Mixed':'#7b6c62','Limestone':'#c7b58b','Slate / schist':'#4f5861','Volcanic':'#6a3d35','Granite':'#9b7772','Gravel / sand':'#b28655','Clay / loam':'#86604b','Red-led':'#7f263f','White-led':'#9a8340'}
export function atlasMarkerStyle(region:Region,lens:AtlasLens,selected:boolean){const value=lensValue(region,lens);return {color:selected?'#f7ead6':'#fff9ef',fillColor:selected?'#8f2d44':palette[value]??'#755934',fillOpacity:.94,weight:selected?3:2}}

export function AtlasLensControls({lens,onChange,regions}:{lens:AtlasLens;onChange:(lens:AtlasLens)=>void;regions:Region[]}){
  const {locale}=useLocale(),c=copy[locale],values=[...new Set(regions.map(region=>lensValue(region,lens)))]
  return <div className="atlas-intelligence"><div><span><Layers3/>{c.title}</span>{(['classic','climate','soil'] as AtlasLens[]).map(item=><button className={lens===item?'active':''} aria-pressed={lens===item} onClick={()=>onChange(item)} key={item}>{c[item]}</button>)}</div><div className="atlas-legend">{values.slice(0,8).map(value=><span key={value}><i style={{background:palette[value]}}/>{value}</span>)}</div></div>
}

export function RegionCompare({items,onRemove}:{items:Region[];onRemove:(id:string)=>void}){
  const {locale}=useLocale(),c=copy[locale]
  return <section className="region-compare"><header><div><span className="eyebrow"><GitCompareArrows/>{c.comparison}</span><h2>{items.length?items.map(item=>regionName(item,locale)).join(' × '):c.comparison}</h2></div></header>{items.length===0?<p className="compare-empty">{c.empty}</p>:<div>{items.map(region=>{const content=regionContent(region,locale),name=regionName(region,locale);return <article key={region.id}><button onClick={()=>onRemove(region.id)} aria-label={`${c.remove} ${name}`}><X/></button><small>{countryLabel(region.country,locale)}</small><h3>{name}</h3><dl><div><dt>{c.lat}</dt><dd>{Math.abs(region.lat).toFixed(1)}°{region.lat>=0?'N':'S'}</dd></div><div><dt>{c.grapes}</dt><dd>{grapes.filter(grape=>region.grapeIds.includes(grape.id)).slice(0,4).map(grape=>grape.name).join(' · ')}</dd></div><div><dt>{c.producers}</dt><dd>{producers.filter(producer=>producer.regionIds.includes(region.id)).length}</dd></div></dl><p><strong>{lensValue(region,'climate')}</strong>{content.climate}</p><p><strong>{lensValue(region,'soil')}</strong>{content.soil}</p></article>})}</div>}</section>
}

export function CompareButton({active,disabled,onClick}:{active:boolean;disabled:boolean;onClick:()=>void}){const {locale}=useLocale(),c=copy[locale];return <button className={`compare-place ${active?'active':''}`} disabled={disabled&&!active} aria-pressed={active} onClick={onClick}>{active?<Check/>:<Plus/>}{active?c.remove:c.compare}</button>}
