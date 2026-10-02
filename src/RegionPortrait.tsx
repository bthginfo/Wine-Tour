import type { Locale } from './i18n'
import type { Region } from './types'
import { countryLabel, regionContent, regionName } from './localizedContent'
import { regionMediaFor } from './regionMedia'

const portraitCopy={
  en:{eyebrow:'Regional profile',climate:'Climate',ground:'Soils',varieties:'Linked grape varieties',producers:'Listed producers',coordinates:'Location'},
  de:{eyebrow:'Region im Überblick',climate:'Klima',ground:'Böden',varieties:'Verknüpfte Rebsorten',producers:'Aufgeführte Erzeuger',coordinates:'Lage'},
  fr:{eyebrow:'Profil régional',climate:'Climat',ground:'Sols',varieties:'Cépages associés',producers:'Producteurs répertoriés',coordinates:'Localisation'},
  es:{eyebrow:'Perfil regional',climate:'Clima',ground:'Suelos',varieties:'Variedades vinculadas',producers:'Bodegas incluidas',coordinates:'Ubicación'},
} as const

export function RegionPortrait({region,locale}:{region:Region;locale:Locale}){
  const media=regionMediaFor(region.id).portrait
  if(!media)return null
  const c=portraitCopy[locale],content=regionContent(region,locale),name=regionName(region,locale)
  const regionalFacts=[{label:c.climate,text:content.climate},{label:c.ground,text:content.soil}].filter(item=>item.text.trim())
  const facts=regionalFacts.length?regionalFacts:[{label:c.varieties,text:String(region.grapeIds.length)},{label:c.producers,text:String(region.producerIds.length)}]
  return <figure className="region-cartographic-portrait">
    <div className="region-portrait-visual">
      <div className="region-portrait-landscape">
        <img src={media.src} alt={media.alt[locale]} />
        <div className="region-portrait-title"><span>{countryLabel(region.country,locale)}</span><strong>{name}</strong></div>
        <div className="region-coordinate"><span>{c.coordinates}</span><strong>{Math.abs(region.lat).toFixed(2)}° {region.lat>=0?'N':'S'} · {Math.abs(region.lng).toFixed(2)}° {region.lng>=0?'E':'W'}</strong></div>
      </div>
    </div>
    <figcaption>
      <span className="eyebrow">{c.eyebrow}</span>
      <div><p>{media.caption[locale]}</p></div>
      {facts.map(item=><div key={item.label}><strong>{item.label}</strong><p>{item.text}</p></div>)}
    </figcaption>
  </figure>
}
