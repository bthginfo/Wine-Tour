import { Check, CircleAlert, Link2, ShieldCheck } from 'lucide-react'
import { grapes, producers, regions, wines } from './data/catalog'
import { useLocale, type Locale } from './i18n'
import type { Grape as GrapeType, Producer, Region, Wine as WineType } from './types'
import ampelographyMedia from './data/ampelographyMedia.generated.json'

type KnowledgeKind='region'|'grape'|'producer'|'wine'
type KnowledgeEntity=Region|GrapeType|Producer|WineType

const copy={
  en:{eyebrow:'Editorial standard',title:'How complete is this record?',body:'Depth, primary-source traceability and meaningful links are checked separately. A high score means well documented, not objectively superior.',depth:'Authored depth',sources:'Source traceability',links:'Knowledge graph',specificity:'Specific evidence',complete:'Release ready',review:'Editorial review',dashboard:'Knowledge integrity',dashboardBody:'A living quality gate across the atlas. Records below the standard stay visible to editors and are prioritised for research.',passed:'meet the standard',needs:'need editorial work',records:'records',region:'Regions',grape:'Varieties',producer:'Producers',wine:'Wines'},
  de:{eyebrow:'Redaktioneller Standard',title:'Wie vollständig ist dieser Eintrag?',body:'Inhaltstiefe, Primärquellen und sinnvolle Verknüpfungen werden getrennt geprüft. Eine hohe Wertung bedeutet gut dokumentiert, nicht objektiv besser.',depth:'Inhaltstiefe',sources:'Quellennachweis',links:'Wissensgraph',specificity:'Konkrete Evidenz',complete:'Veröffentlichungsreif',review:'Redaktionell prüfen',dashboard:'Wissensintegrität',dashboardBody:'Ein lebendiges Qualitäts-Gate für den gesamten Atlas. Einträge unter dem Standard werden für die Recherche priorisiert.',passed:'erfüllen den Standard',needs:'brauchen redaktionelle Arbeit',records:'Einträge',region:'Regionen',grape:'Rebsorten',producer:'Erzeuger',wine:'Weine'},
  fr:{eyebrow:'Standard éditorial',title:'Cette fiche est-elle complète ?',body:'Profondeur, traçabilité des sources primaires et liens utiles sont contrôlés séparément. Un score élevé signifie bien documenté, pas objectivement supérieur.',depth:'Profondeur rédigée',sources:'Traçabilité des sources',links:'Graphe de connaissances',specificity:'Indices précis',complete:'Prêt à publier',review:'Révision éditoriale',dashboard:'Intégrité des connaissances',dashboardBody:'Un contrôle qualité vivant pour tout l’atlas. Les fiches sous le standard sont prioritaires pour la recherche.',passed:'respectent le standard',needs:'demandent une révision',records:'fiches',region:'Régions',grape:'Cépages',producer:'Producteurs',wine:'Vins'},
  es:{eyebrow:'Estándar editorial',title:'¿Qué tan completa está esta ficha?',body:'Profundidad, trazabilidad de fuentes primarias y conexiones útiles se comprueban por separado. Una puntuación alta significa bien documentado, no objetivamente superior.',depth:'Profundidad editorial',sources:'Trazabilidad de fuentes',links:'Grafo de conocimiento',specificity:'Evidencia concreta',complete:'Lista para publicar',review:'Revisión editorial',dashboard:'Integridad del conocimiento',dashboardBody:'Un control de calidad vivo para todo el atlas. Las fichas bajo el estándar se priorizan para investigar.',passed:'cumplen el estándar',needs:'requieren revisión',records:'fichas',region:'Regiones',grape:'Variedades',producer:'Productores',wine:'Vinos'},
} satisfies Record<Locale,Record<string,string>>

const words=(value:string)=>value.trim().split(/\s+/).filter(Boolean).length

export function knowledgeAudit(kind:KnowledgeKind,entity:KnowledgeEntity){
  let authored='',sourceCount=0,linkCount=0,specific=false
  if(kind==='region'){
    const item=entity as Region
    authored=[item.summary,item.climate,item.soil,item.history,item.growingSeason,item.viticulture,...item.wineStyles,...item.keyFacts].join(' ')
    sourceCount=1+item.sources.length
    linkCount=item.grapeIds.length+item.producerIds.length+item.wineIds.length
    specific=item.subregions.length>0&&item.lat!==0&&item.lng!==0
  }else if(kind==='grape'){
    const item=entity as GrapeType
    authored=[item.summary,item.origin,item.ripening,item.climateFit,item.viticulture,item.winemaking,...item.styles,...item.pairings].join(' ')
    sourceCount=ampelographyMedia.some(media=>media.grapeId===item.id)?1:0
    linkCount=item.regionIds.length+item.aromaIds.length+wines.filter(wine=>wine.grapeIds.includes(item.id)).length
    specific=Boolean(item.origin&&item.ripening&&item.climateFit)
  }else if(kind==='producer'){
    const item=entity as Producer
    authored=[item.summary,item.philosophy,item.vineyard,item.cellar,item.speciality].join(' ')
    sourceCount=item.sourceUrl?1:0
    linkCount=item.regionIds.length+item.wineIds.length
    specific=Boolean(item.vineyard&&item.cellar&&item.speciality)
  }else{
    const item=entity as WineType
    authored=[item.summary,item.composition,item.vinification,item.maturation,item.serving,item.drinkWindow,...item.pairings].join(' ')
    sourceCount=item.sourceUrl?1:0
    linkCount=item.grapeIds.length+item.aromaIds.length+2
    specific=item.evidenceLevel==='producer'||Boolean(item.composition&&item.vinification&&item.maturation)
  }
  const floors={region:150,grape:95,producer:100,wine:65}
  const checks=[words(authored)>=floors[kind],sourceCount>0,linkCount>=4,specific]
  return {checks,score:Math.round(checks.filter(Boolean).length/checks.length*100),words:words(authored),sourceCount,linkCount,ready:checks.every(Boolean)}
}

export function KnowledgeStandard({kind,entity}:{kind:KnowledgeKind;entity:KnowledgeEntity}){
  const {locale}=useLocale(),c=copy[locale],audit=knowledgeAudit(kind,entity)
  const labels=[c.depth,c.sources,c.links,c.specificity]
  return <section className="knowledge-standard" aria-label={c.title}>
    <div className="knowledge-standard-score"><ShieldCheck/><strong>{audit.score}</strong><span>/ 100</span></div>
    <div><span className="eyebrow">{c.eyebrow}</span><h2>{c.title}</h2><p>{c.body}</p><div className="knowledge-checks">{labels.map((label,index)=><span className={audit.checks[index]?'pass':'review'} key={label}>{audit.checks[index]?<Check/>:<CircleAlert/>}{label}</span>)}</div></div>
    <strong className={audit.ready?'quality-ready':'quality-review'}>{audit.ready?c.complete:c.review}</strong>
  </section>
}

export function KnowledgeQualityDashboard(){
  const {locale}=useLocale(),c=copy[locale]
  const groups=[['region',regions],['grape',grapes],['producer',producers],['wine',wines]] as const
  return <section className="quality-dashboard"><header><div><span className="eyebrow">{c.eyebrow}</span><h2>{c.dashboard}</h2><p>{c.dashboardBody}</p></div><ShieldCheck/></header><div>{groups.map(([kind,items])=>{const passed=items.filter(item=>knowledgeAudit(kind,item).ready).length;return <article key={kind}><span>{c[kind]}</span><strong>{Math.round(passed/items.length*100)}%</strong><div><i style={{width:`${passed/items.length*100}%`}}/></div><small>{passed} / {items.length} {c.passed}</small></article>})}</div><footer><Link2/><span>{groups.reduce((sum,[,items])=>sum+items.length,0)} {c.records} · {groups.reduce((sum,[kind,items])=>sum+items.filter(item=>!knowledgeAudit(kind,item).ready).length,0)} {c.needs}</span></footer></section>
}
