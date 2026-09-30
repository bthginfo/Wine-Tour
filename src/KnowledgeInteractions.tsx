import { useState } from 'react'
import { Droplets, Mountain, SunMedium, Wine } from 'lucide-react'
import type { Grape, Region } from './types'
import type { Locale } from './i18n'
import { grapeContent, regionContent, regionName, styleLabel, wineContent } from './localizedContent'
import { producers, regions, wines } from './data/catalog'
import ampelographyMedia from './data/ampelographyMedia.generated.json'
import grapeEvidence from './data/grapeEvidence.generated.json'
import regionPlate from './assets/knowledge-region-seasons.jpg'

const regionCopy={
  en:{eyebrow:'Terroir studio',title:'Move the growing conditions',body:'Set a hypothetical comparison and follow possible mechanisms from vine to glass. These controls use no measured vineyard data and are not a quality score.',alt:'Illustrated vineyard through four seasons with roots and soil layers',altitude:'Elevation',water:'Water reserve',exposure:'Sun exposure',low:'Low',middle:'Middle',high:'High',scarce:'Scarce',balanced:'Balanced',ample:'Ample',shaded:'Sheltered',open:'Open',sunny:'Sun-facing',result:'Mechanisms to check',fresh:'Altitude can cool a site, but cold-air inversion may leave lower ground colder on clear nights; compare the actual block.',ripe:'Earlier heat accumulation may advance ripening; check site temperatures and fruit development together.',stress:'Severe water stress can slow photosynthesis; berry size and canopy signals then need checking.',steady:'Compare shoot growth and berry size through the same season; water supply, crop load and rootstock matter.',dilute:'More vigorous growth is possible; watch yield and shading.',cool:'A shaded fruit zone may be cooler; check canopy cover and phenolic development.',even:'Record fruit-zone light and temperature at matched times; canopy leaves alter exposure.',warm:'More exposed fruit can warm and face sunburn risk; canopy cover and picking date matter.'},
  de:{eyebrow:'Terroir-Studio',title:'Standort im Vergleich',body:'Stelle einen hypothetischen Vergleich ein und verfolge mögliche Mechanismen von der Rebe bis ins Glas. Die Regler nutzen keine Messwerte des Weinbergs und bewerten keine Qualität.',alt:'Illustrierter Weinberg durch vier Jahreszeiten mit Wurzeln und Bodenschichten',altitude:'Höhenlage',water:'Wasserreserve',exposure:'Sonnenexposition',low:'Niedrig',middle:'Mittel',high:'Hoch',scarce:'Knapp',balanced:'Ausgewogen',ample:'Reichlich',shaded:'Geschützt',open:'Offen',sunny:'Sonnenzugewandt',result:'Zu prüfende Mechanismen',fresh:'Höhere Lagen können kühler sein, doch Kaltluftseen können Talböden in klaren Nächten kälter machen; den konkreten Block vergleichen.',ripe:'Früherer Wärmeaufbau kann die Reife beschleunigen; Standorttemperatur und Fruchtentwicklung gemeinsam prüfen.',stress:'Starker Wasserstress kann die Photosynthese bremsen; Beerengröße und Laubwand brauchen dann besondere Beobachtung.',steady:'Triebwachstum und Beerengröße über dieselbe Saison vergleichen; Wasserversorgung, Ertrag und Unterlage zählen mit.',dilute:'Mehr Wuchskraft ist möglich; Ertrag und Schatten im Blick behalten.',cool:'Eine beschattete Traubenzone kann kühler sein; Laubschutz und phenolische Reife prüfen.',even:'Licht und Temperatur in der Traubenzone zu vergleichbaren Zeiten erfassen; Blätter verändern die Exposition.',warm:'Stärker exponierte Trauben können sich erwärmen und Sonnenbrand riskieren; Laubschutz und Lesetermin zählen.'},
  fr:{eyebrow:'Studio du terroir',title:'Faites varier les conditions de culture',body:'Réglez une comparaison hypothétique et suivez des mécanismes possibles de la vigne au verre. Ces commandes n’utilisent aucune mesure de parcelle et ne donnent pas de note de qualité.',alt:'Vignoble illustré au fil des quatre saisons avec racines et horizons du sol',altitude:'Altitude',water:'Réserve hydrique',exposure:'Exposition solaire',low:'Basse',middle:'Moyenne',high:'Haute',scarce:'Faible',balanced:'Équilibrée',ample:'Abondante',shaded:'Abritée',open:'Ouverte',sunny:'Ensoleillée',result:'Mécanismes à vérifier',fresh:'L’altitude peut rafraîchir un site, mais une inversion thermique peut laisser les bas-fonds plus froids par nuit claire ; comparez la parcelle réelle.',ripe:'Une accumulation de chaleur plus précoce peut avancer la maturité ; comparez températures du site et développement du fruit.',stress:'Un stress hydrique sévère peut ralentir la photosynthèse ; surveillez alors taille des baies et feuillage.',steady:'Comparez pousses et baies au même moment de saison ; eau, charge et porte-greffe comptent aussi.',dilute:'Une vigueur accrue est possible ; surveillez rendement et ombre.',cool:'Une zone fructifère ombragée peut être plus fraîche ; vérifiez couverture foliaire et maturité phénolique.',even:'Relevez lumière et température au même endroit et à la même heure ; le feuillage modifie l’exposition.',warm:'Des grappes très exposées peuvent chauffer et risquer le coup de soleil ; couverture foliaire et vendange comptent.'},
  es:{eyebrow:'Estudio de terroir',title:'Mueve las condiciones de cultivo',body:'Configura una comparación hipotética y sigue mecanismos posibles desde la vid hasta la copa. Estos controles no usan mediciones del viñedo ni asignan una puntuación de calidad.',alt:'Viñedo ilustrado durante las cuatro estaciones con raíces y capas del suelo',altitude:'Altitud',water:'Reserva de agua',exposure:'Exposición solar',low:'Baja',middle:'Media',high:'Alta',scarce:'Escasa',balanced:'Equilibrada',ample:'Amplia',shaded:'Protegida',open:'Abierta',sunny:'Soleada',result:'Mecanismos que comprobar',fresh:'La altitud puede enfriar un lugar, pero una inversión térmica puede dejar más fríos los fondos de valle en noches despejadas; compara la parcela real.',ripe:'Una acumulación de calor más temprana puede adelantar la maduración; compara temperatura local y desarrollo del fruto.',stress:'Un estrés hídrico severo puede ralentizar la fotosíntesis; observa entonces el tamaño de las bayas y la vegetación.',steady:'Compara brotes y bayas en el mismo momento de la temporada; también influyen agua, carga y portainjerto.',dilute:'Puede aumentar el vigor; vigila el rendimiento y la sombra.',cool:'Una zona de fruta sombreada puede estar más fresca; comprueba la cobertura foliar y la madurez fenólica.',even:'Registra luz y temperatura de la zona del fruto a la misma hora; las hojas cambian la exposición.',warm:'Los racimos más expuestos pueden calentarse y sufrir riesgo de quemadura solar; importan la cobertura foliar y la vendimia.'},
} as const
const regionDiagramCaption={
  en:'Vineyard through four seasons · roots and soil layers',
  de:'Weinberg im Jahreslauf · Wurzeln und Bodenschichten',
  fr:'Vignoble au fil des saisons · racines et horizons du sol',
  es:'Viñedo a lo largo de las estaciones · raíces y capas del suelo',
} as const

function Choice({labels,value,onChange,label}:{labels:readonly string[];value:number;onChange:(value:number)=>void;label:string}){
  return <fieldset className="knowledge-choice"><legend>{label}</legend><div>{labels.map((item,index)=><button type="button" key={item} onClick={()=>onChange(index)} aria-pressed={value===index}>{item}</button>)}</div></fieldset>
}

export function RegionTerroirStudio({region,locale}:{region:Region;locale:Locale}){
  const c=regionCopy[locale]
  const [altitude,setAltitude]=useState(1),[water,setWater]=useState(1),[exposure,setExposure]=useState(1)
  const baseline={
    en:{altitude:'Compare the actual block’s temperatures and cold-air flow; elevation alone is incomplete.',water:'Track shoot growth and berry size through the same season; water, crop load and rootstock also matter.',exposure:'Record fruit-zone light and temperature at matched times; canopy leaves alter exposure.'},
    de:{altitude:'Temperatur und Kaltluftfluss am konkreten Block vergleichen; Höhenlage allein reicht nicht.',water:'Triebwachstum und Beerengröße über dieselbe Saison verfolgen; Wasser, Ertrag und Unterlage wirken ebenfalls mit.',exposure:'Licht und Temperatur in der Traubenzone zu vergleichbaren Zeiten erfassen; Blätter verändern die Exposition.'},
    fr:{altitude:'Comparez températures et écoulement d’air froid sur la parcelle réelle ; l’altitude seule ne suffit pas.',water:'Suivez pousses et baies au même moment de saison ; eau, charge et porte-greffe comptent aussi.',exposure:'Relevez lumière et température de la zone fructifère à la même heure ; le feuillage modifie l’exposition.'},
    es:{altitude:'Compara temperatura y flujo de aire frío en la parcela real; la altitud por sí sola no basta.',water:'Sigue brotes y bayas en el mismo momento de la temporada; también influyen agua, carga y portainjerto.',exposure:'Registra luz y temperatura de la zona del fruto a la misma hora; las hojas cambian la exposición.'},
  }[locale]
  const effects=[altitude===2?c.fresh:altitude===0?c.ripe:baseline.altitude,water===0?c.stress:water===2?c.dilute:baseline.water,exposure===0?c.cool:exposure===2?c.warm:baseline.exposure]
  const effectText=effects.map(effect=>effect.replace(/[.!?]+$/,'')).join(' · ')
  return <section className="knowledge-lab region-terroir-studio">
    <figure><img src={regionPlate} alt={c.alt}/><figcaption><strong>{regionDiagramCaption[locale]}</strong></figcaption></figure>
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
  const media=ampelographyMedia.find(item=>item.grapeId===grape.id)
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
  const selectedMode=Math.min(mode,examples.length-1),wine=examples[selectedMode],region=regions.find(item=>item.id===wine.regionId)!,producer=producers.find(item=>item.id===wine.producerId)!,content=wineContent(wine,producer,region,locale)
  const c={
    en:{eyebrow:'Bottle comparison',title:`Keep ${grape.name}. Change origin and producer.`,body:'These are documented examples, not a controlled tasting: origin, producer and cellar choices can all change. Use them to form a question, not to assign one cause.',select:'Choose a documented wine example',origin:'Origin',producer:'Producer',style:'Style',composition:'Composition',fieldEvidence:'Field evidence',evidenceSource:'PlantGrape record',leaf:'Leaf',cluster:'Cluster'},
    de:{eyebrow:'Flaschenvergleich',title:`${grape.name} bleibt. Herkunft und Erzeuger wechseln.`,body:'Das sind dokumentierte Beispiele, keine kontrollierte Verkostung: Herkunft, Erzeuger und Kellerarbeit können sich zugleich ändern. Nutze sie für eine Frage, nicht als Beleg für eine einzelne Ursache.',select:'Dokumentiertes Weinbeispiel wählen',origin:'Herkunft',producer:'Erzeuger',style:'Stil',composition:'Cuvée',fieldEvidence:'Feldbefund',evidenceSource:'PlantGrape-Aufzeichnung',leaf:'Blatt',cluster:'Traube'},
    fr:{eyebrow:'Comparaison de bouteilles',title:`Gardez ${grape.name}. Changez d’origine et de domaine.`,body:'Ce sont des exemples documentés, pas une dégustation contrôlée : origine, domaine et choix de cave peuvent tous varier. Ils ouvrent une question, sans isoler une cause.',select:'Choisissez un exemple de vin documenté',origin:'Origine',producer:'Domaine',style:'Style',composition:'Assemblage',fieldEvidence:'Relevé de terrain',evidenceSource:'Fiche PlantGrape',leaf:'Feuille',cluster:'Grappe'},
    es:{eyebrow:'Comparación de botellas',title:`Mantén ${grape.name}. Cambia origen y productor.`,body:'Son ejemplos documentados, no una cata controlada: pueden cambiar a la vez origen, productor y decisiones de bodega. Úsalos para plantear una pregunta, no para atribuir una causa única.',select:'Elige un ejemplo de vino documentado',origin:'Origen',producer:'Productor',style:'Estilo',composition:'Composición',fieldEvidence:'Registro de campo',evidenceSource:'Ficha PlantGrape',leaf:'Hoja',cluster:'Racimo'},
  }[locale]
  const field=grapeEvidence.find(item=>item.grapeId===grape.id)?.[locale]
  const fieldNote=field?({
    en:`${field.cluster.trim().replace(/[.]+$/,'')}. Berry description: ${field.berry.trim().replace(/^the /i,'').replace(/[.]+$/,'')}.`,
    de:`${field.cluster.trim().replace(/[.]+$/,'')}. Beerenbeschreibung: ${field.berry.trim().replace(/^die /i,'').replace(/[.]+$/,'')}.`,
    fr:`${field.cluster.trim().replace(/[.]+$/,'')}. Description des baies : ${field.berry.trim().replace(/^les /i,'').replace(/[.]+$/,'')}.`,
    es:`${field.cluster.trim().replace(/[.]+$/,'')}. Descripción de la baya: ${field.berry.trim().replace(/^las /i,'').replace(/[.]+$/,'')}.`,
  }[locale]):''
  return <section className={`knowledge-lab grape-expression-lab${media?'':' is-text-only'}`}><div className="knowledge-lab-panel"><span className="eyebrow">{c.eyebrow}</span><h2>{c.title}</h2><p>{c.body}</p>
    <div className="expression-tabs" role="group" aria-label={c.select}>{examples.map((item,index)=><button type="button" key={item.id} onClick={()=>setMode(index)} aria-pressed={selectedMode===index} className={selectedMode===index?'active':''}><Wine/>{item.name}</button>)}</div>
    <div className="expression-notes" aria-live="polite"><article><small>{c.origin}</small><strong>{regionName(region,locale)}</strong><p>{region.hasRegionalTerroirEvidence?regionContent(region,locale).climate:regionContent(region,locale).summary}</p></article><article><small>{c.producer}</small><strong>{producer.name}</strong><p>{content.summary}</p></article><article><small>{c.style}</small><strong>{styleLabel(wine.style,locale)}</strong><p><b>{c.composition}</b> · {wine.composition}</p></article>{fieldNote&&<article><small>{c.fieldEvidence}</small><strong>{c.evidenceSource}</strong><p>{fieldNote}</p></article>}</div>
  </div>{media&&<figure className="grape-expression-plate"><div className="grape-expression-photos"><img src={media.leafUrl} alt={`${grape.name} · ${c.leaf}`} loading="lazy" referrerPolicy="no-referrer"/><img src={media.clusterUrl} alt={`${grape.name} · ${c.cluster}`} loading="lazy" referrerPolicy="no-referrer"/></div><figcaption>{grape.name} · {c.evidenceSource}</figcaption></figure>}</section>
}
