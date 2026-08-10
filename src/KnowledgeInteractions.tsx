import { useState } from 'react'
import { Droplets, Mountain, SunMedium, Wine } from 'lucide-react'
import type { Grape, Region } from './types'
import type { Locale } from './i18n'
import { grapeContent, regionContent, regionName, styleLabel, wineContent } from './localizedContent'
import { producers, regions, wines } from './data/catalog'
import regionPlate from './assets/knowledge-region-seasons.jpg'
import grapePlate from './assets/knowledge-grape-botany.jpg'
import whiteGrapePlate from './assets/knowledge-grape-botany-white.jpg'

const regionCopy={
  en:{eyebrow:'Terroir studio',title:'Move the growing conditions',body:'Change one condition and follow the likely consequence from vine to glass. This is a comparison model, not a quality score.',alt:'Illustrated vineyard through four seasons with roots and soil layers',altitude:'Elevation',water:'Water reserve',exposure:'Sun exposure',low:'Low',middle:'Middle',high:'High',scarce:'Scarce',balanced:'Balanced',ample:'Ample',shaded:'Sheltered',open:'Open',sunny:'Sun-facing',result:'Likely consequence',fresh:'slower sugar accumulation and firmer acidity',ripe:'faster ripening and broader fruit',stress:'smaller berries and earlier stress signals',steady:'a steadier canopy and longer ripening window',dilute:'more vigour, with yield and shade needing attention',cool:'a cooler fruit zone and slower phenolic development',even:'more even light across the canopy',warm:'warmer berries and a shorter harvest decision window'},
  de:{eyebrow:'Terroir-Studio',title:'Verändere die Wachstumsbedingungen',body:'Ändere eine Bedingung und verfolge die wahrscheinliche Folge von der Rebe bis ins Glas. Das ist ein Vergleichsmodell, keine Qualitätswertung.',alt:'Illustrierter Weinberg durch vier Jahreszeiten mit Wurzeln und Bodenschichten',altitude:'Höhenlage',water:'Wasserreserve',exposure:'Sonnenexposition',low:'Niedrig',middle:'Mittel',high:'Hoch',scarce:'Knapp',balanced:'Ausgewogen',ample:'Reichlich',shaded:'Geschützt',open:'Offen',sunny:'Sonnenzugewandt',result:'Wahrscheinliche Folge',fresh:'langsamere Zuckerbildung und straffere Säure',ripe:'raschere Reife und breitere Frucht',stress:'kleinere Beeren und frühere Stresssignale',steady:'eine stabilere Laubwand und ein längeres Reifefenster',dilute:'mehr Wuchskraft; Ertrag und Schatten verlangen Aufmerksamkeit',cool:'eine kühlere Traubenzone und langsamere phenolische Reife',even:'gleichmäßigeres Licht in der Laubwand',warm:'wärmere Beeren und ein kürzeres Entscheidungsfenster für die Lese'},
  fr:{eyebrow:'Studio du terroir',title:'Faites varier les conditions de culture',body:'Modifiez une condition et suivez sa conséquence probable de la vigne au verre. C’est un modèle comparatif, pas une note de qualité.',alt:'Vignoble illustré au fil des quatre saisons avec racines et horizons du sol',altitude:'Altitude',water:'Réserve hydrique',exposure:'Exposition solaire',low:'Basse',middle:'Moyenne',high:'Haute',scarce:'Faible',balanced:'Équilibrée',ample:'Abondante',shaded:'Abritée',open:'Ouverte',sunny:'Ensoleillée',result:'Conséquence probable',fresh:'une accumulation des sucres plus lente et une acidité plus ferme',ripe:'une maturité plus rapide et un fruit plus ample',stress:'des baies plus petites et des signes de stress plus précoces',steady:'un feuillage plus stable et une fenêtre de maturité plus longue',dilute:'plus de vigueur, avec rendement et ombre à surveiller',cool:'une zone fructifère plus fraîche et une maturité phénolique plus lente',even:'une lumière plus régulière dans le feuillage',warm:'des baies plus chaudes et une fenêtre de vendange plus courte'},
  es:{eyebrow:'Estudio de terroir',title:'Mueve las condiciones de cultivo',body:'Cambia una condición y sigue la consecuencia probable desde la vid hasta la copa. Es un modelo comparativo, no una puntuación de calidad.',alt:'Viñedo ilustrado durante las cuatro estaciones con raíces y capas del suelo',altitude:'Altitud',water:'Reserva de agua',exposure:'Exposición solar',low:'Baja',middle:'Media',high:'Alta',scarce:'Escasa',balanced:'Equilibrada',ample:'Amplia',shaded:'Protegida',open:'Abierta',sunny:'Soleada',result:'Consecuencia probable',fresh:'acumulación de azúcar más lenta y acidez más firme',ripe:'maduración más rápida y fruta más amplia',stress:'bayas más pequeñas y señales de estrés más tempranas',steady:'vegetación más estable y una ventana de madurez más larga',dilute:'más vigor, con rendimiento y sombra que vigilar',cool:'zona de fruta más fresca y madurez fenólica más lenta',even:'luz más uniforme en la vegetación',warm:'bayas más cálidas y una ventana de vendimia más corta'},
} as const

function Choice({labels,value,onChange,label}:{labels:readonly string[];value:number;onChange:(value:number)=>void;label:string}){
  return <fieldset className="knowledge-choice"><legend>{label}</legend><div>{labels.map((item,index)=><button type="button" key={item} onClick={()=>onChange(index)} aria-pressed={value===index}>{item}</button>)}</div></fieldset>
}

export function RegionTerroirStudio({region,locale}:{region:Region;locale:Locale}){
  const c=regionCopy[locale],content=regionContent(region,locale)
  const [altitude,setAltitude]=useState(1),[water,setWater]=useState(1),[exposure,setExposure]=useState(1)
  const effects=[altitude===2?c.fresh:altitude===0?c.ripe:content.growingSeason.split(/[.!?]/)[0].toLocaleLowerCase(locale),water===0?c.stress:water===2?c.dilute:c.steady,exposure===0?c.cool:exposure===2?c.warm:c.even]
  return <section className="knowledge-lab region-terroir-studio">
    <figure><img src={regionPlate} alt={c.alt}/><figcaption><strong>{regionName(region,locale)}</strong><span>{content.climate}</span></figcaption></figure>
    <div className="knowledge-lab-panel"><span className="eyebrow">{c.eyebrow}</span><h2>{c.title}</h2><p>{c.body}</p>
      <div className="knowledge-controls">
        <div><Mountain/><Choice label={c.altitude} labels={[c.low,c.middle,c.high]} value={altitude} onChange={setAltitude}/></div>
        <div><Droplets/><Choice label={c.water} labels={[c.scarce,c.balanced,c.ample]} value={water} onChange={setWater}/></div>
        <div><SunMedium/><Choice label={c.exposure} labels={[c.shaded,c.open,c.sunny]} value={exposure} onChange={setExposure}/></div>
      </div>
      <div className="knowledge-result" aria-live="polite"><small>{c.result}</small><p>{effects.join(' · ')}.</p></div>
    </div>
  </section>
}

const grapeCopy={
  en:{eyebrow:'Expression lab',title:'Keep the grape. Change the context.',body:'Compare three plausible expressions without pretending that climate alone determines flavour.',alt:'Botanical study of vine leaves, shoots, bunches and berry anatomy',cool:'Cool site',classic:'Classic window',warm:'Warm site',acid:'Acidity',bodyLabel:'Body',tannin:'Tannin',aroma:'Aromatic direction',vine:'In the vineyard',cellar:'In the cellar'},
  de:{eyebrow:'Ausdruckslabor',title:'Die Rebsorte bleibt. Der Kontext wechselt.',body:'Vergleiche drei plausible Ausprägungen, ohne so zu tun, als bestimme Klima allein den Geschmack.',alt:'Botanische Studie von Rebblättern, Trieben, Trauben und Beerenanatomie',cool:'Kühler Standort',classic:'Klassisches Fenster',warm:'Warmer Standort',acid:'Säure',bodyLabel:'Körper',tannin:'Tannin',aroma:'Aromatische Richtung',vine:'Im Weinberg',cellar:'Im Keller'},
  fr:{eyebrow:'Laboratoire d’expression',title:'Gardez le cépage. Changez le contexte.',body:'Comparez trois expressions plausibles sans prétendre que le climat détermine seul la saveur.',alt:'Étude botanique de feuilles, rameaux, grappes et anatomie de la baie',cool:'Site frais',classic:'Fenêtre classique',warm:'Site chaud',acid:'Acidité',bodyLabel:'Corps',tannin:'Tanins',aroma:'Direction aromatique',vine:'À la vigne',cellar:'En cave'},
  es:{eyebrow:'Laboratorio de expresión',title:'Mantén la variedad. Cambia el contexto.',body:'Compara tres expresiones plausibles sin fingir que el clima determina por sí solo el sabor.',alt:'Estudio botánico de hojas, brotes, racimos y anatomía de la baya',cool:'Lugar fresco',classic:'Ventana clásica',warm:'Lugar cálido',acid:'Acidez',bodyLabel:'Cuerpo',tannin:'Tanino',aroma:'Dirección aromática',vine:'En el viñedo',cellar:'En bodega'},
} as const

export function GrapeExpressionLab({grape,locale}:{grape:Grape;locale:Locale}){
  const examples=wines.filter(wine=>wine.grapeIds.includes(grape.id)).slice(0,4)
  const [mode,setMode]=useState(0)
  if(examples.length<2)return null
  const wine=examples[Math.min(mode,examples.length-1)],region=regions.find(item=>item.id===wine.regionId)!,producer=producers.find(item=>item.id===wine.producerId)!,content=wineContent(wine,producer,region,locale)
  const c={
    en:{eyebrow:'Bottle comparison',title:`Keep ${grape.name}. Change origin and producer.`,body:'Each tab opens a real catalogue wine. Compare what is documented before drawing a conclusion about the variety.',origin:'Origin',producer:'Producer',style:'Style',composition:'Composition'},
    de:{eyebrow:'Flaschenvergleich',title:`${grape.name} bleibt. Herkunft und Erzeuger wechseln.`,body:'Jeder Reiter öffnet einen realen Katalogwein. Vergleiche zuerst die dokumentierten Unterschiede, bevor du auf die Rebsorte schließt.',origin:'Herkunft',producer:'Erzeuger',style:'Stil',composition:'Cuvée'},
    fr:{eyebrow:'Comparaison de bouteilles',title:`Gardez ${grape.name}. Changez d’origine et de domaine.`,body:'Chaque onglet ouvre un vin réel du catalogue. Comparez les différences documentées avant de conclure sur le cépage.',origin:'Origine',producer:'Domaine',style:'Style',composition:'Assemblage'},
    es:{eyebrow:'Comparación de botellas',title:`Mantén ${grape.name}. Cambia origen y productor.`,body:'Cada pestaña abre un vino real del catálogo. Compara primero las diferencias documentadas antes de concluir sobre la variedad.',origin:'Origen',producer:'Productor',style:'Estilo',composition:'Composición'},
  }[locale]
  return <section className="knowledge-lab grape-expression-lab"><div className="knowledge-lab-panel"><span className="eyebrow">{c.eyebrow}</span><h2>{c.title}</h2><p>{c.body}</p>
    <div className="expression-tabs" role="tablist" aria-label={c.title}>{examples.map((item,index)=><button type="button" role="tab" key={item.id} onClick={()=>setMode(index)} aria-selected={mode===index}><Wine/>{item.name}</button>)}</div>
    <div className="expression-notes" aria-live="polite"><article><small>{c.origin}</small><strong>{regionName(region,locale)}</strong><p>{region.hasRegionalTerroirEvidence?regionContent(region,locale).climate:regionContent(region,locale).summary}</p></article><article><small>{c.producer}</small><strong>{producer.name}</strong><p>{content.summary}</p></article><article><small>{c.style}</small><strong>{styleLabel(wine.style,locale)}</strong><p><b>{c.composition}</b> · {wine.composition}</p></article></div>
  </div><figure><img src={grape.color==='white'?whiteGrapePlate:grapePlate} alt={c.title}/><figcaption>{grape.name}</figcaption></figure></section>
}
