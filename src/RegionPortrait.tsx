import type { Locale } from './i18n'
import type { Region } from './types'
import { countryLabel, regionContent, regionName } from './localizedContent'
import { regionMediaFor } from './regionMedia'

const portraitCopy={
  en:{eyebrow:'Terroir portrait',climate:'Growing season',ground:'Ground structure',varieties:'Linked varieties',producers:'Documented producers',coordinates:'Catalogue centre',visual:'Illustration subject'},
  de:{eyebrow:'Terroir-Porträt',climate:'Vegetationsperiode',ground:'Untergrund',varieties:'Verknüpfte Rebsorten',producers:'Dokumentierte Weingüter',coordinates:'Katalogmittelpunkt',visual:'Motiv der Illustration'},
  fr:{eyebrow:'Portrait du terroir',climate:'Cycle végétatif',ground:'Structure du sol',varieties:'Cépages reliés',producers:'Domaines documentés',coordinates:'Centre du catalogue',visual:'Sujet de l’illustration'},
  es:{eyebrow:'Retrato del terruño',climate:'Ciclo vegetativo',ground:'Estructura del suelo',varieties:'Variedades vinculadas',producers:'Bodegas documentadas',coordinates:'Centro del catálogo',visual:'Tema de la ilustración'},
} as const

export function RegionPortrait({region,locale}:{region:Region;locale:Locale}){
  const media=regionMediaFor(region.id).portrait
  if(!media)return null
  const c=portraitCopy[locale],content=regionContent(region,locale),name=regionName(region,locale)
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
      <div><strong>{c.visual}</strong><p>{media.caption[locale]}</p></div>
      {region.hasRegionalTerroirEvidence?<><div><strong>{c.climate}</strong><p>{content.climate}</p></div><div><strong>{c.ground}</strong><p>{content.soil}</p></div></>:<><div><strong>{c.varieties}</strong><p>{region.grapeIds.length}</p></div><div><strong>{c.producers}</strong><p>{region.producerIds.length}</p></div></>}
    </figcaption>
  </figure>
}
