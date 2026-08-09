import {useMemo,useState} from 'react'
import {Check,ChevronRight,FlaskConical,Layers3,NotebookPen,RotateCcw,SlidersHorizontal} from 'lucide-react'
import {repository} from './data/repository'
import type {Locale} from './i18n'
import type {Article,TastingJourney} from './types'

type L={en:string;de:string;fr:string;es:string}
type LabMode='sequence'|'dial'|'compare'|'diagnose'|'evidence'
type LabDefinition={mode:LabMode;axis:L;low:L;high:L}
const l=(en:string,de:string,fr:string,es:string):L=>({en,de,fr,es})

const labs:Record<string,LabDefinition>={
  'vine-to-glass':{mode:'sequence',axis:l('Decision chain','Entscheidungskette','Chaîne de décisions','Cadena de decisiones'),low:l('Fruit','Traube','Raisin','Uva'),high:l('Bottle','Flasche','Bouteille','Botella')},
  'taste-with-intention':{mode:'evidence',axis:l('Observation order','Beobachtungsfolge','Ordre d’observation','Orden de observación'),low:l('First look','Erster Blick','Premier regard','Primera mirada'),high:l('Conclusion','Schlussfolgerung','Conclusion','Conclusión')},
  'sparkling-methods':{mode:'compare',axis:l('Where pressure forms','Wo Druck entsteht','Lieu de prise de mousse','Dónde nace la presión'),low:l('Bottle','Flasche','Bouteille','Botella'),high:l('Tank / unfinished ferment','Tank / laufende Gärung','Cuve / fermentation en cours','Depósito / fermentación activa')},
  'red-white-rose':{mode:'dial',axis:l('Skin contact','Schalenkontakt','Contact pelliculaire','Contacto con pieles'),low:l('Immediate press','Direktpressung','Pressurage direct','Prensado directo'),high:l('Extended maceration','Lange Maischezeit','Macération longue','Maceración larga')},
  'sweet-wine':{mode:'compare',axis:l('Concentration route','Konzentrationsweg','Voie de concentration','Vía de concentración'),low:l('Botrytis / freezing','Botrytis / Gefrieren','Botrytis / gel','Botrytis / congelación'),high:l('Drying / late harvest','Trocknung / Spätlese','Passerillage / vendange tardive','Secado / vendimia tardía')},
  'fortified-wine':{mode:'sequence',axis:l('Fortification timing','Zeitpunkt der Aufspritung','Moment du mutage','Momento de fortificación'),low:l('During fermentation','Während der Gärung','Pendant la fermentation','Durante la fermentación'),high:l('After fermentation','Nach der Gärung','Après fermentation','Después de fermentar')},
  service:{mode:'dial',axis:l('Serving temperature','Serviertemperatur','Température de service','Temperatura de servicio'),low:l('Cooler','Kühler','Plus frais','Más frío'),high:l('Warmer','Wärmer','Plus chaud','Más cálido')},
  'aroma-language':{mode:'evidence',axis:l('Descriptor precision','Präzision der Deskriptoren','Précision des descripteurs','Precisión descriptiva'),low:l('Broad family','Große Familie','Famille large','Familia amplia'),high:l('Specific reference','Konkrete Referenz','Référence précise','Referencia concreta')},
  'vine-year':{mode:'sequence',axis:l('Growing season','Vegetationsjahr','Cycle végétatif','Ciclo vegetativo'),low:l('Dormancy','Winterruhe','Dormance','Dormancia'),high:l('Harvest','Lese','Vendange','Vendimia')},
  'terroir-layers':{mode:'evidence',axis:l('Scale of evidence','Maßstab der Evidenz','Échelle de preuve','Escala de evidencia'),low:l('Regional climate','Regionalklima','Climat régional','Clima regional'),high:l('Parcel and practice','Parzelle und Arbeit','Parcelle et pratique','Parcela y práctica')},
  fermentation:{mode:'dial',axis:l('Fermentation temperature','Gärtemperatur','Température de fermentation','Temperatura de fermentación'),low:l('Cool / protected','Kühl / geschützt','Frais / protégé','Frío / protegido'),high:l('Warm / extractive','Warm / extraktiv','Chaud / extractif','Cálido / extractivo')},
  'maturation-vessels':{mode:'compare',axis:l('Vessel behaviour','Verhalten des Gefäßes','Comportement du contenant','Comportamiento del recipiente'),low:l('Inert / protected','Inert / geschützt','Inerte / protégé','Inerte / protegido'),high:l('Porous / reactive','Porös / reaktiv','Poreux / réactif','Poroso / reactivo')},
  'lees-and-malolactic':{mode:'dial',axis:l('Post-ferment texture work','Texturarbeit nach der Gärung','Travail de texture après fermentation','Trabajo de textura posfermentación'),low:l('No intervention','Kein Eingriff','Sans intervention','Sin intervención'),high:l('Lees contact / conversion','Hefelager / Säureabbau','Lies / malo','Lías / maloláctica')},
  'labels-and-origin':{mode:'diagnose',axis:l('Label evidence','Etiketten-Evidenz','Indices de l’étiquette','Evidencia de etiqueta'),low:l('Producer and place','Erzeuger und Ort','Producteur et lieu','Productor y lugar'),high:l('Vintage and rules','Jahrgang und Regeln','Millésime et règles','Añada y reglas')},
  'food-pairing':{mode:'dial',axis:l('Structural intensity','Strukturelle Intensität','Intensité structurelle','Intensidad estructural'),low:l('Delicate','Fein','Délicate','Delicada'),high:l('Powerful','Kraftvoll','Puissante','Potente')},
  'wine-faults':{mode:'diagnose',axis:l('Signal concentration','Konzentration des Signals','Concentration du signal','Concentración de la señal'),low:l('Trace / contextual','Spur / kontextuell','Trace / contextuelle','Traza / contextual'),high:l('Dominant / obscuring','Dominant / verdeckend','Dominante / masquante','Dominante / encubridora')},
  'climate-and-altitude':{mode:'compare',axis:l('Site energy balance','Energiebilanz des Standorts','Bilan énergétique du site','Balance energético del lugar'),low:l('Lower / warmer night','Tiefer / wärmere Nacht','Bas / nuit plus chaude','Bajo / noche más cálida'),high:l('Higher / cooler night','Höher / kühlere Nacht','Haut / nuit plus fraîche','Alto / noche más fresca')},
  cellaring:{mode:'sequence',axis:l('Bottle evolution','Flaschenentwicklung','Évolution en bouteille','Evolución en botella'),low:l('Young / primary','Jung / primär','Jeune / primaire','Joven / primario'),high:l('Mature / tertiary','Reif / tertiär','Évolué / tertiaire','Maduro / terciario')},
  'sparkling-service':{mode:'diagnose',axis:l('Pressure control','Druckkontrolle','Maîtrise de la pression','Control de presión'),low:l('Cold and controlled','Kühl und kontrolliert','Froid et maîtrisé','Frío y controlado'),high:l('Warm and agitated','Warm und bewegt','Chaud et agité','Cálido y agitado')},
  'soil-water-roots':{mode:'evidence',axis:l('Water pathway','Wasserweg','Trajet de l’eau','Ruta del agua'),low:l('Fast drainage','Schnelle Drainage','Drainage rapide','Drenaje rápido'),high:l('Slow storage and release','Speichern und Nachliefern','Réserve et restitution lente','Reserva y liberación lenta')},
  'vintage-weather':{mode:'sequence',axis:l('Timing of risk','Zeitpunkt des Risikos','Moment du risque','Momento del riesgo'),low:l('Budbreak / flowering','Austrieb / Blüte','Débourrement / floraison','Brotación / floración'),high:l('Ripening / harvest','Reife / Lese','Maturation / vendange','Maduración / vendimia')},
  'sensory-calibration':{mode:'dial',axis:l('Calibration quality','Qualität der Kalibrierung','Qualité de calibration','Calidad de calibración'),low:l('Vague impression','Vager Eindruck','Impression vague','Impresión vaga'),high:l('Repeatable scale','Wiederholbare Skala','Échelle répétable','Escala repetible')},
  'appellation-maps':{mode:'evidence',axis:l('Geographic resolution','Geografische Auflösung','Résolution géographique','Resolución geográfica'),low:l('Country / region','Land / Region','Pays / région','País / región'),high:l('Appellation / site','Appellation / Lage','Appellation / lieu','Denominación / sitio')},
  'bottle-closures':{mode:'compare',axis:l('Closure oxygen regime','Sauerstoffregime des Verschlusses','Régime d’oxygène du bouchage','Régimen de oxígeno del cierre'),low:l('Lower transmission','Geringere Transmission','Transmission faible','Transmisión baja'),high:l('Higher / variable transmission','Höhere / variable Transmission','Transmission plus forte / variable','Transmisión mayor / variable')},
  'oxygen-and-age':{mode:'dial',axis:l('Oxygen exposure','Sauerstoffexposition','Exposition à l’oxygène','Exposición al oxígeno'),low:l('Protected','Geschützt','Protégée','Protegida'),high:l('Extended exposure','Lange Exposition','Exposition prolongée','Exposición prolongada')},
}
export const referenceGuideLabIds=Object.keys(labs)

const copy={
  en:{eyebrow:'Process in focus',stage:'Stage',evidence:'Evidence',prediction:'Your prediction before tasting',placeholder:'What do you expect to change—and what would disprove it?',reset:'Reset',add:'Add this guide to a tasting',added:'Added to your tasting',complete:'Mark guide complete',completed:'Guide completed'},
  de:{eyebrow:'Prozess im Fokus',stage:'Stufe',evidence:'Evidenz',prediction:'Deine Prognose vor der Verkostung',placeholder:'Was erwartest du – und welche Beobachtung würde es widerlegen?',reset:'Zurücksetzen',add:'Guide in ein Tasting übernehmen',added:'Zum Tasting hinzugefügt',complete:'Guide abschließen',completed:'Guide abgeschlossen'},
  fr:{eyebrow:'Processus en détail',stage:'Étape',evidence:'Indice',prediction:'Votre prévision avant dégustation',placeholder:'Quel changement attendez-vous, et quel fait le réfuterait ?',reset:'Réinitialiser',add:'Ajouter ce guide à une dégustation',added:'Ajouté à la dégustation',complete:'Terminer le guide',completed:'Guide terminé'},
  es:{eyebrow:'Proceso en detalle',stage:'Etapa',evidence:'Evidencia',prediction:'Tu predicción antes de catar',placeholder:'¿Qué esperas que cambie y qué observación lo refutaría?',reset:'Restablecer',add:'Añadir esta guía a una cata',added:'Añadida a la cata',complete:'Completar guía',completed:'Guía completada'},
} as const

function readCompleted(){try{return JSON.parse(localStorage.getItem('vine-atlas.guide-progress')??'[]') as string[]}catch{return []}}

export function ReferenceGuideExperience({article,locale}:{article:Article;locale:Locale}){
  const definition=labs[article.id]??labs['taste-with-intention'],c=copy[locale]
  const [value,setValue]=useState(0),[prediction,setPrediction]=useState(''),[added,setAdded]=useState(false),[completed,setCompleted]=useState(()=>readCompleted().includes(article.id))
  const index=Math.min(article.body.length-1,Math.round(value/100*Math.min(4,article.body.length-1)))
  const stages=useMemo(()=>Array.from({length:4},(_,position)=>Math.round(position*100/3)),[])
  const addToTasting=()=>{
    const journeys=repository.journeys.all()
    const journey:TastingJourney=journeys[0]??{id:crypto.randomUUID(),title:{en:'My learning tasting',de:'Mein Lern-Tasting',fr:'Ma dégustation pédagogique',es:'Mi cata de aprendizaje'}[locale],description:article.summary,pace:'host',access:'private',chapters:[],updatedAt:new Date().toISOString()}
    if(!journey.chapters.some(chapter=>chapter.type==='article'&&chapter.referenceId===article.id))journey.chapters.push({id:crypto.randomUUID(),type:'article',referenceId:article.id,title:article.title,duration:article.minutes})
    journey.updatedAt=new Date().toISOString();repository.journeys.save([journey,...journeys.filter(item=>item.id!==journey.id)]);setAdded(true)
  }
  const finish=()=>{const next=[...new Set([...readCompleted(),article.id])];localStorage.setItem('vine-atlas.guide-progress',JSON.stringify(next));setCompleted(true)}
  return <section className={`reference-lab reference-mode-${definition.mode}`}>
    <header><div><span className="eyebrow">{c.eyebrow}</span><h2>{article.title}</h2><p>{article.summary}</p></div><div className="lab-axis"><small>{definition.axis[locale]}</small><span>{definition.low[locale]}</span><i/><span>{definition.high[locale]}</span></div></header>
    <div className="lab-workbench">
      {definition.mode==='dial'&&<div className="lab-dial"><SlidersHorizontal/><input type="range" min="0" max="100" value={value} onChange={event=>setValue(Number(event.target.value))}/><div><span>{definition.low[locale]}</span><strong>{value}%</strong><span>{definition.high[locale]}</span></div></div>}
      {definition.mode==='compare'&&<div className="lab-compare">{[0,100].map((position,side)=><button key={position} className={value===position?'active':''} onClick={()=>setValue(position)}><span>0{side+1}</span><strong>{side?definition.high[locale]:definition.low[locale]}</strong><p>{article.body[Math.min(side,article.body.length-1)]}</p></button>)}</div>}
      {definition.mode==='sequence'&&<div className="lab-sequence">{stages.map((position,stage)=><button key={position} className={value===position?'active':''} onClick={()=>setValue(position)}><span>{String(stage+1).padStart(2,'0')}</span><b>{stage===0?definition.low[locale]:stage===3?definition.high[locale]:`${c.stage} ${stage+1}`}</b><ChevronRight/></button>)}</div>}
      {definition.mode==='diagnose'&&<div className="lab-diagnose">{stages.map((position,stage)=><button key={position} className={value===position?'active':''} onClick={()=>setValue(position)}><FlaskConical/><span>{c.evidence} {stage+1}</span><b>{article.objectives[stage%article.objectives.length]}</b></button>)}</div>}
      {definition.mode==='evidence'&&<div className="lab-evidence">{stages.map((position,stage)=><button key={position} className={value===position?'active':''} onClick={()=>setValue(position)}><span>{String(stage+1).padStart(2,'0')}</span><p>{article.body[stage%article.body.length]}</p></button>)}</div>}
      <article className="lab-result" aria-live="polite"><span>{definition.axis[locale]} · {index+1}</span><p>{article.body[index]}</p><button className="text-action" onClick={()=>setValue(0)}><RotateCcw/>{c.reset}</button></article>
    </div>
    <div className="lab-journal"><NotebookPen/><label><span>{c.prediction}</span><textarea value={prediction} onChange={event=>setPrediction(event.target.value)} placeholder={c.placeholder}/></label><div><button className="secondary-button" onClick={addToTasting}><Layers3/>{added?c.added:c.add}</button><button className={`primary-button ${completed?'done':''}`} onClick={finish}><Check/>{completed?c.completed:c.complete}</button></div></div>
  </section>
}
