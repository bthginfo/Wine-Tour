import { useState } from 'react'
import { Droplets, Mountain, SunMedium, Wine } from 'lucide-react'
import type { Grape, Region } from './types'
import type { Locale } from './i18n'
import { grapeContent, regionContent, regionName, styleLabel, wineContent } from './localizedContent'
import { producers, regions, wines } from './data/catalog'
import grapeEvidence from './data/grapeEvidence.generated.json'
import regionPlate from './assets/knowledge-region-seasons.jpg'
import grapePlate from './assets/knowledge-grape-botany.jpg'
import whiteGrapePlate from './assets/knowledge-grape-botany-white.jpg'

const regionCopy={
  en:{eyebrow:'Terroir studio',title:'Move the growing conditions',body:'Change one condition and follow the likely consequence from vine to glass. This is a comparison model, not a quality score.',alt:'Illustrated vineyard through four seasons with roots and soil layers',altitude:'Elevation',water:'Water reserve',exposure:'Sun exposure',low:'Low',middle:'Middle',high:'High',scarce:'Scarce',balanced:'Balanced',ample:'Ample',shaded:'Sheltered',open:'Open',sunny:'Sun-facing',result:'Likely consequence',fresh:'Altitude can cool a site, but cold-air inversion may leave lower ground colder on clear nights; compare the actual block.',ripe:'faster ripening and broader fruit',stress:'Severe water stress can slow photosynthesis; berry size and canopy signals then need checking.',steady:'a steadier canopy and longer ripening window',dilute:'more vigour, with yield and shade needing attention',cool:'a cooler fruit zone and slower phenolic development',even:'more even light across the canopy',warm:'More exposed fruit can warm and face sunburn risk; canopy cover and picking date matter.'},
  de:{eyebrow:'Terroir-Studio',title:'Standort im Vergleich',body:'Ändere eine Bedingung und verfolge die wahrscheinliche Folge von der Rebe bis ins Glas. Das ist ein Vergleichsmodell, keine Qualitätswertung.',alt:'Illustrierter Weinberg durch vier Jahreszeiten mit Wurzeln und Bodenschichten',altitude:'Höhenlage',water:'Wasserreserve',exposure:'Sonnenexposition',low:'Niedrig',middle:'Mittel',high:'Hoch',scarce:'Knapp',balanced:'Ausgewogen',ample:'Reichlich',shaded:'Geschützt',open:'Offen',sunny:'Sonnenzugewandt',result:'Wahrscheinliche Folge',fresh:'Höhere Lagen können kühler sein, doch Kaltluftseen können Talböden in klaren Nächten kälter machen; den konkreten Block vergleichen.',ripe:'raschere Reife und breitere Frucht',stress:'Starker Wasserstress kann die Photosynthese bremsen; Beerengröße und Laubwand brauchen dann besondere Beobachtung.',steady:'eine stabilere Laubwand und ein längeres Reifefenster',dilute:'mehr Wuchskraft; Ertrag und Schatten verlangen Aufmerksamkeit',cool:'eine kühlere Traubenzone und langsamere phenolische Reife',even:'gleichmäßigeres Licht in der Laubwand',warm:'Stärker exponierte Trauben können sich erwärmen und Sonnenbrand riskieren; Laubschutz und Lesetermin zählen.'},
  fr:{eyebrow:'Studio du terroir',title:'Faites varier les conditions de culture',body:'Modifiez une condition et suivez sa conséquence probable de la vigne au verre. C’est un modèle comparatif, pas une note de qualité.',alt:'Vignoble illustré au fil des quatre saisons avec racines et horizons du sol',altitude:'Altitude',water:'Réserve hydrique',exposure:'Exposition solaire',low:'Basse',middle:'Moyenne',high:'Haute',scarce:'Faible',balanced:'Équilibrée',ample:'Abondante',shaded:'Abritée',open:'Ouverte',sunny:'Ensoleillée',result:'Conséquence probable',fresh:'L’altitude peut rafraîchir un site, mais une inversion thermique peut laisser les bas-fonds plus froids par nuit claire ; comparez la parcelle réelle.',ripe:'une maturité plus rapide et un fruit plus ample',stress:'Un stress hydrique sévère peut ralentir la photosynthèse ; surveillez alors taille des baies et feuillage.',steady:'un feuillage plus stable et une fenêtre de maturité plus longue',dilute:'plus de vigueur, avec rendement et ombre à surveiller',cool:'une zone fructifère plus fraîche et une maturité phénolique plus lente',even:'une lumière plus régulière dans le feuillage',warm:'Des grappes très exposées peuvent chauffer et risquer le coup de soleil ; couverture foliaire et vendange comptent.'},
  es:{eyebrow:'Estudio de terroir',title:'Mueve las condiciones de cultivo',body:'Cambia una condición y sigue la consecuencia probable desde la vid hasta la copa. Es un modelo comparativo, no una puntuación de calidad.',alt:'Viñedo ilustrado durante las cuatro estaciones con raíces y capas del suelo',altitude:'Altitud',water:'Reserva de agua',exposure:'Exposición solar',low:'Baja',middle:'Media',high:'Alta',scarce:'Escasa',balanced:'Equilibrada',ample:'Amplia',shaded:'Protegida',open:'Abierta',sunny:'Soleada',result:'Consecuencia probable',fresh:'La altitud puede enfriar un lugar, pero una inversión térmica puede dejar más fríos los fondos de valle en noches despejadas; compara la parcela real.',ripe:'maduración más rápida y fruta más amplia',stress:'Un estrés hídrico severo puede ralentizar la fotosíntesis; observa entonces el tamaño de las bayas y la vegetación.',steady:'vegetación más estable y una ventana de madurez más larga',dilute:'más vigor, con rendimiento y sombra que vigilar',cool:'zona de fruta más fresca y madurez fenólica más lenta',even:'luz más uniforme en la vegetación',warm:'Los racimos más expuestos pueden calentarse y sufrir riesgo de quemadura solar; importan la cobertura foliar y la vendimia.'},
} as const

function Choice({labels,value,onChange,label}:{labels:readonly string[];value:number;onChange:(value:number)=>void;label:string}){
  return <fieldset className="knowledge-choice"><legend>{label}</legend><div>{labels.map((item,index)=><button type="button" key={item} onClick={()=>onChange(index)} aria-pressed={value===index}>{item}</button>)}</div></fieldset>
}

export function RegionTerroirStudio({region,locale}:{region:Region;locale:Locale}){
  const c=regionCopy[locale],content=regionContent(region,locale)
  const [altitude,setAltitude]=useState(1),[water,setWater]=useState(1),[exposure,setExposure]=useState(1)
  const effects=[altitude===2?c.fresh:altitude===0?c.ripe:content.growingSeason.split(/[.!?]/)[0].toLocaleLowerCase(locale),water===0?c.stress:water===2?c.dilute:c.steady,exposure===0?c.cool:exposure===2?c.warm:c.even]
  const effectText=effects.map(effect=>effect.replace(/[.!?]+$/,'')).join(' · ')
  return <section className="knowledge-lab region-terroir-studio">
    <figure><img src={regionPlate} alt={c.alt}/><figcaption><strong>{regionName(region,locale)}</strong><span>{content.climate}</span></figcaption></figure>
    <div className="knowledge-lab-panel"><span className="eyebrow">{c.eyebrow}</span><h2>{c.title}</h2><p>{c.body}</p>
      <div className="knowledge-controls">
        <div><Mountain/><Choice label={c.altitude} labels={[c.low,c.middle,c.high]} value={altitude} onChange={setAltitude}/></div>
        <div><Droplets/><Choice label={c.water} labels={[c.scarce,c.balanced,c.ample]} value={water} onChange={setWater}/></div>
        <div><SunMedium/><Choice label={c.exposure} labels={[c.shaded,c.open,c.sunny]} value={exposure} onChange={setExposure}/></div>
      </div>
      <div className="knowledge-result" aria-live="polite"><small>{c.result}</small><p>{effectText}.</p></div>
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
  const candidates=wines.filter(wine=>wine.grapeIds.includes(grape.id))
  const examples=(()=>{
    const selected:typeof candidates=[]
    const regionsSeen=new Set<string>()
    for(const wine of candidates){if(!regionsSeen.has(wine.regionId)){selected.push(wine);regionsSeen.add(wine.regionId)}}
    const producersSeen=new Set(selected.map(wine=>wine.producerId))
    for(const wine of candidates){if(selected.length>=4)break;if(!selected.includes(wine)&&!producersSeen.has(wine.producerId)){selected.push(wine);producersSeen.add(wine.producerId)}}
    for(const wine of candidates){if(selected.length>=4)break;if(!selected.includes(wine))selected.push(wine)}
    return selected.slice(0,4)
  })()
  const [mode,setMode]=useState(0)
  if(examples.length<2)return null
  const wine=examples[Math.min(mode,examples.length-1)],region=regions.find(item=>item.id===wine.regionId)!,producer=producers.find(item=>item.id===wine.producerId)!,content=wineContent(wine,producer,region,locale)
  const c={
    en:{eyebrow:'Bottle comparison',title:`Keep ${grape.name}. Change origin and producer.`,body:'Compare a few documented wines made from this grape. Differences in origin, producer and cellar choices show how the same variety can take more than one shape.',origin:'Origin',producer:'Producer',style:'Style',composition:'Composition',fieldEvidence:'Field evidence',evidenceSource:'PlantGrape record'},
    de:{eyebrow:'Flaschenvergleich',title:`${grape.name} bleibt. Herkunft und Erzeuger wechseln.`,body:'Vergleiche mehrere dokumentierte Weine dieser Rebsorte. Unterschiede in Herkunft, Erzeuger und Kellerarbeit zeigen, wie dieselbe Sorte verschiedene Ausdrucksformen annehmen kann.',origin:'Herkunft',producer:'Erzeuger',style:'Stil',composition:'Cuvée',fieldEvidence:'Feldbefund',evidenceSource:'PlantGrape-Aufzeichnung'},
    fr:{eyebrow:'Comparaison de bouteilles',title:`Gardez ${grape.name}. Changez d’origine et de domaine.`,body:'Comparez plusieurs vins documentés issus de ce cépage. Les différences d’origine, de domaine et de travail en cave montrent comment une même variété peut prendre plusieurs expressions.',origin:'Origine',producer:'Domaine',style:'Style',composition:'Assemblage',fieldEvidence:'Relevé de terrain',evidenceSource:'Fiche PlantGrape'},
    es:{eyebrow:'Comparación de botellas',title:`Mantén ${grape.name}. Cambia origen y productor.`,body:'Compara varios vinos documentados de esta variedad. Las diferencias de origen, productor y trabajo de bodega muestran cómo una misma variedad puede expresarse de varias maneras.',origin:'Origen',producer:'Productor',style:'Estilo',composition:'Composición',fieldEvidence:'Registro de campo',evidenceSource:'Ficha PlantGrape'},
  }[locale]
  const field=grapeEvidence.find(item=>item.grapeId===grape.id)?.[locale]
  const fieldNote=field?({
    en:`${field.cluster.trim().replace(/[.]+$/,'')}. Berry description: ${field.berry.trim().replace(/^the /i,'').replace(/[.]+$/,'')}.`,
    de:`${field.cluster.trim().replace(/[.]+$/,'')}. Beerenbeschreibung: ${field.berry.trim().replace(/^die /i,'').replace(/[.]+$/,'')}.`,
    fr:`${field.cluster.trim().replace(/[.]+$/,'')}. Description des baies : ${field.berry.trim().replace(/^les /i,'').replace(/[.]+$/,'')}.`,
    es:`${field.cluster.trim().replace(/[.]+$/,'')}. Descripción de la baya: ${field.berry.trim().replace(/^las /i,'').replace(/[.]+$/,'')}.`,
  }[locale]):''
  return <section className="knowledge-lab grape-expression-lab"><div className="knowledge-lab-panel"><span className="eyebrow">{c.eyebrow}</span><h2>{c.title}</h2><p>{c.body}</p>
    <div className="expression-tabs" role="tablist" aria-label={c.title}>{examples.map((item,index)=><button type="button" role="tab" key={item.id} onClick={()=>setMode(index)} aria-selected={mode===index}><Wine/>{item.name}</button>)}</div>
    <div className="expression-notes" aria-live="polite"><article><small>{c.origin}</small><strong>{regionName(region,locale)}</strong><p>{region.hasRegionalTerroirEvidence?regionContent(region,locale).climate:regionContent(region,locale).summary}</p></article><article><small>{c.producer}</small><strong>{producer.name}</strong><p>{content.summary}</p></article><article><small>{c.style}</small><strong>{styleLabel(wine.style,locale)}</strong><p><b>{c.composition}</b> · {wine.composition}</p></article>{fieldNote&&<article><small>{c.fieldEvidence}</small><strong>{c.evidenceSource}</strong><p>{fieldNote}</p></article>}</div>
  </div><figure><img src={grape.color==='white'?whiteGrapePlate:grapePlate} alt={c.title}/><figcaption>{grape.name}</figcaption></figure></section>
}
