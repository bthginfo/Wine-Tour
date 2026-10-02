import {useEffect,useMemo,useState,type CSSProperties} from 'react'
import {ArrowLeft,ArrowRight,Bookmark,BookOpen,Check,ChevronRight,Clock,Compass,FlaskConical,Grape,Layers3,Play,RotateCcw,Search,SlidersHorizontal,Sparkles,Target,Wine} from 'lucide-react'
import {Link,useParams} from 'react-router-dom'
import {aromas,articles,grapes,producers,regions,wines} from './data/catalog'
import {repository} from './data/repository'
import {useLocale,type Locale} from './i18n'
import {articleContent} from './localizedContent'
import {guideImage} from './learningGuideMedia'
import {LearningPoster} from './LearningPoster'
import {ReadingText} from './ReadingText'
import {learningBlockById,learningModuleById,learningModules,schoolCopy,type LearningArchetype,type LearningBlock,type LearningBlockKind,type LearningLevel,type LearningModule,type LearningSchool} from './learningCurriculum'
import type {TastingChapter,TastingJourney} from './types'
import {AdaptiveLearningPlanner} from './AdaptiveLearning'
import './interaction-audit.css'

const ui={
  en:{academy:'Wine school',title:'Learn by looking, changing and tasting',intro:'Explore the questions behind a bottle, test one change at a time, and carry your observations into a real tasting.',search:'Search questions, topics or places',allSchools:'All schools',allLevels:'All levels',allFormats:'All formats',foundation:'Foundation',intermediate:'Intermediate',advanced:'Advanced',continue:'Continue learning',saved:'Saved modules',suggested:'Suggested tasting labs',modules:'modules',results:'results',empty:'No module matches these filters.',clear:'Clear filters',previous:'Previous',next:'Next',page:'Page',progress:'Current',min:'min',open:'Open lesson',save:'Save module',savedAction:'Saved',outcomes:'What you will be able to do',useTasting:'Use in a tasting',addedTasting:'Added to a tasting',addBlock:'Add to a tasting',lessonMap:'In this lesson',tableExperiment:'Take this to the table',complete:'Mark complete',completed:'Completed',sources:'Sources and limits',back:'Back to academy',observe:'Observe',manipulate:'Compare',explain:'Explain',test:'Test in the glass',keep:'Save / use',stage:'Stage',cool:'Cooler / lower',warm:'Warmer / higher',reveal:'Reveal reasoning',reset:'Reset',country:'Country',region:'Region',subregion:'Subregion',site:'Site',scale:'Scale',confidence:'Confidence',low:'Low',high:'High',choose:'Choose one answer',retry:'Try again',correct:'Good comparison.',notQuite:'Not quite.',sourceNote:'Primary and technical sources are provided for verification. They support mechanisms and definitions; they do not make every sensory outcome deterministic.',hostReveal:'Evidence check',selfPaced:'Self-paced',blocks:'blocks',duration:'Duration',format:'Format',continueBody:'Resume at the next unfinished block.',savedBody:'Keep a personal shelf of questions worth revisiting.',tastingBody:'Short practical modules that work well between two wines.',all:'All',journey:'Process journey',anatomy:'Annotated anatomy',sensory:'Sensory lab',map:'Map expedition',comparison:'A/B comparison',simulator:'Simulator',diagnostic:'Diagnostic case',pairing:'Pairing lab',guided:'Guided tasting','producer-case':'Decision chain',notFound:'This field lesson could not be found.',openAcademy:'Open the academy',addWhole:'Add complete lesson',blockAdded:'Learning step added',newJourney:'Learning table'},
  de:{academy:'Weinschule',title:'Lernen durch Beobachten, Verändern und Verkosten',intro:'Elf vertiefte Masterclasses und fünfundzwanzig Nachschlage-Guides verbinden Mechanismus, Ort und sensorische Evidenz. Wähle eine Frage, verändere eine Variable und nimm das Ergebnis mit in eine echte Verkostung.',search:'Fragen, Themen oder Orte suchen',allSchools:'Alle Schulen',allLevels:'Alle Niveaus',allFormats:'Alle Formate',foundation:'Grundlage',intermediate:'Fortgeschritten',advanced:'Vertiefung',continue:'Weiterlernen',saved:'Gespeicherte Module',suggested:'Empfohlene Verkostungslabore',modules:'Module',results:'Ergebnisse',empty:'Kein Modul passt zu diesen Filtern.',clear:'Filter löschen',previous:'Zurück',next:'Weiter',page:'Seite',progress:'Aktuell',min:'Min.',open:'Lektion öffnen',save:'Modul speichern',savedAction:'Gespeichert',outcomes:'Das kannst du danach',useTasting:'In einer Verkostung nutzen',addedTasting:'Zur Verkostung hinzugefügt',addBlock:'Zur Verkostung hinzufügen',lessonMap:'In dieser Lektion',tableExperiment:'Mit an den Tisch nehmen',complete:'Als abgeschlossen markieren',completed:'Abgeschlossen',sources:'Quellen und Grenzen',back:'Zur Akademie',observe:'Beobachten',manipulate:'Verändern',explain:'Erklären',test:'Im Glas prüfen',keep:'Speichern / einsetzen',stage:'Phase',cool:'Kühler / niedriger',warm:'Wärmer / höher',reveal:'Begründung zeigen',reset:'Zurücksetzen',country:'Land',region:'Region',subregion:'Teilregion',site:'Lage',scale:'Maßstab',confidence:'Sicherheit',low:'Niedrig',high:'Hoch',choose:'Wähle eine Antwort',retry:'Noch einmal',correct:'Richtig. Vergleiche deine Antwort mit der Erklärung in dieser Lektion.',notQuite:'Noch nicht ganz. Lies die Erklärung noch einmal und versuche es erneut.',sourceNote:'Primär- und Fachquellen dienen der Überprüfung. Sie stützen Mechanismen und Definitionen; sie machen sensorische Ergebnisse nicht deterministisch.',hostReveal:'Evidenz prüfen',selfPaced:'Selbstgesteuert',blocks:'Blöcke',duration:'Dauer',format:'Format',continueBody:'Steige beim nächsten offenen Block wieder ein.',savedBody:'Lege dir ein persönliches Regal mit Fragen zum Wiederholen an.',tastingBody:'Kurze praktische Module, die zwischen zwei Weinen funktionieren.',all:'Alle',journey:'Prozessreise',anatomy:'Anatomietafel',sensory:'Sensoriklabor',map:'Kartenexpedition',comparison:'A/B-Vergleich',simulator:'Simulator',diagnostic:'Diagnosefall',pairing:'Pairing-Labor',guided:'Geführte Verkostung','producer-case':'Entscheidungskette',notFound:'Diese Feldlektion wurde nicht gefunden.',openAcademy:'Akademie öffnen',addWhole:'Komplette Lektion hinzufügen',blockAdded:'Lernschritt hinzugefügt',newJourney:'Lerntisch'},
  fr:{academy:'École du vin',title:'Apprendre en observant, modifiant et dégustant',intro:'Onze masterclasses approfondies et vingt-cinq guides de référence relient mécanisme, lieu et indices sensoriels. Choisissez une question, modifiez une variable, puis emportez le résultat dans une vraie dégustation.',search:'Rechercher questions, thèmes ou lieux',allSchools:'Toutes les écoles',allLevels:'Tous les niveaux',allFormats:'Tous les formats',foundation:'Fondation',intermediate:'Intermédiaire',advanced:'Avancé',continue:'Continuer',saved:'Modules enregistrés',suggested:'Laboratoires conseillés',modules:'modules',results:'résultats',empty:'Aucun module ne correspond à ces filtres.',clear:'Effacer les filtres',previous:'Précédent',next:'Suivant',page:'Page',progress:'En cours',min:'min',open:'Ouvrir la leçon',save:'Enregistrer',savedAction:'Enregistré',outcomes:'Ce que vous saurez faire',useTasting:'Utiliser en dégustation',addedTasting:'Ajouté à votre dégustation',addBlock:'Ajouter à une dégustation',lessonMap:'Dans cette leçon',tableExperiment:'Passer à table',complete:'Marquer comme terminé',completed:'Terminé',sources:'Sources et limites',back:'Retour à l’académie',observe:'Observer',manipulate:'Comparer',explain:'Expliquer',test:'Tester dans le verre',keep:'Enregistrer / utiliser',stage:'Étape',cool:'Plus frais / plus bas',warm:'Plus chaud / plus haut',reveal:'Révéler le raisonnement',reset:'Réinitialiser',country:'Pays',region:'Région',subregion:'Sous-région',site:'Site',scale:'Échelle',confidence:'Confiance',low:'Faible',high:'Élevée',choose:'Choisissez une réponse',retry:'Réessayer',correct:'Bonne réponse. Retrouvez l’explication dans cette leçon.',notQuite:'Pas tout à fait. Relisez l’explication et réessayez.',sourceNote:'Les sources primaires et techniques permettent la vérification. Elles étayent mécanismes et définitions sans rendre chaque résultat sensoriel déterministe.',hostReveal:'Vérifier les indices',selfPaced:'Autonome',blocks:'blocs',duration:'Durée',format:'Format',continueBody:'Reprenez au prochain bloc inachevé.',savedBody:'Conservez les questions auxquelles vous souhaitez revenir.',tastingBody:'Des modules pratiques courts entre deux vins.',all:'Tous',journey:'Parcours du procédé',anatomy:'Planche anatomique',sensory:'Laboratoire sensoriel',map:'Expédition cartographique',comparison:'Comparaison A/B',simulator:'Simulateur',diagnostic:'Cas diagnostic',pairing:'Laboratoire d’accord',guided:'Dégustation guidée','producer-case':'Chaîne de décisions',notFound:'Cette leçon est introuvable.',openAcademy:'Ouvrir l’académie',addWhole:'Ajouter la leçon complète',blockAdded:'Étape pédagogique ajoutée',newJourney:'Table pédagogique'},
  es:{academy:'Escuela del vino',title:'Aprender observando, cambiando y catando',intro:'Once clases magistrales en profundidad y veinticinco guías de referencia conectan mecanismo, lugar y evidencia sensorial. Elige una pregunta, modifica una variable y lleva el resultado a una cata real.',search:'Buscar preguntas, temas o lugares',allSchools:'Todas las escuelas',allLevels:'Todos los niveles',allFormats:'Todos los formatos',foundation:'Fundamentos',intermediate:'Intermedio',advanced:'Avanzado',continue:'Continuar aprendiendo',saved:'Módulos guardados',suggested:'Laboratorios sugeridos',modules:'módulos',results:'resultados',empty:'Ningún módulo coincide con estos filtros.',clear:'Borrar filtros',previous:'Anterior',next:'Siguiente',page:'Página',progress:'Actual',min:'min',open:'Abrir lección',save:'Guardar módulo',savedAction:'Guardado',outcomes:'Lo que podrás hacer',useTasting:'Usar en una cata',addedTasting:'Añadido a tu cata',addBlock:'Añadir a una cata',lessonMap:'En esta lección',tableExperiment:'Llevarlo a la mesa',complete:'Marcar como completado',completed:'Completado',sources:'Fuentes y límites',back:'Volver a la academia',observe:'Observar',manipulate:'Comparar',explain:'Explicar',test:'Probar en la copa',keep:'Guardar / usar',stage:'Etapa',cool:'Más fresco / más bajo',warm:'Más cálido / más alto',reveal:'Mostrar razonamiento',reset:'Reiniciar',country:'País',region:'Región',subregion:'Subregión',site:'Sitio',scale:'Escala',confidence:'Confianza',low:'Baja',high:'Alta',choose:'Elige una respuesta',retry:'Intentar de nuevo',correct:'Respuesta correcta. Compárala con la explicación de esta lección.',notQuite:'No del todo. Repasa la explicación y vuelve a intentarlo.',sourceNote:'Las fuentes primarias y técnicas permiten verificar. Respaldan mecanismos y definiciones, pero no hacen determinista cada resultado sensorial.',hostReveal:'Comprobar indicios',selfPaced:'Autoguiado',blocks:'bloques',duration:'Duración',format:'Formato',continueBody:'Retoma en el siguiente bloque sin terminar.',savedBody:'Guarda preguntas personales para volver a ellas.',tastingBody:'Módulos prácticos breves entre dos vinos.',all:'Todos',journey:'Viaje del proceso',anatomy:'Lámina anatómica',sensory:'Laboratorio sensorial',map:'Expedición cartográfica',comparison:'Comparación A/B',simulator:'Simulador',diagnostic:'Caso diagnóstico',pairing:'Laboratorio de maridaje',guided:'Cata guiada','producer-case':'Cadena de decisiones',notFound:'No se encontró esta lección.',openAcademy:'Abrir la academia',addWhole:'Añadir lección completa',blockAdded:'Paso de aprendizaje añadido',newJourney:'Mesa de aprendizaje'},
} as const

type LearningState={saved:string[];completed:string[];blockProgress:Record<string,string[]>}
type LearningLibraryItem={key:string;id:string;title:string;summary:string;category:string;minutes:number;kind:'lesson'|'guide';module?:LearningModule}
function readState():LearningState{
  const stored=repository.learning.get<LearningState>({saved:[],completed:[],blockProgress:{}})
  const moduleIds=new Set(learningModules.map(module=>module.id)),guideIds=new Set(articles.map(article=>article.id))
  const saved=[...new Set(stored.saved??[])].flatMap(id=>{
    if(moduleIds.has(id))return [id]
    if(id.startsWith('guide:')&&guideIds.has(id.slice('guide:'.length)))return [id]
    // Migrate unambiguous legacy guide bookmarks. A colliding bare id belongs to its module.
    if(guideIds.has(id)&&!moduleIds.has(id))return [`guide:${id}`]
    return []
  })
  const completed=[...new Set(stored.completed??[])].filter(id=>moduleIds.has(id))
  const blockProgress=Object.fromEntries(learningModules.map(module=>[module.id,[...new Set(stored.blockProgress?.[module.id]??[])].filter(id=>module.blocks.some(block=>block.id===id))]))
  return {...stored,saved,completed,blockProgress}
}
function writeState(value:LearningState){repository.learning.save(value)}
function normalizeSearch(value:string,locale:Locale){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase(locale)}
function naturalMediaAlt(value:string){return value.trim()}

const archetypeIcon:Record<LearningArchetype,typeof Compass>={journey:Play,anatomy:Target,sensory:Sparkles,map:Compass,comparison:SlidersHorizontal,simulator:FlaskConical,diagnostic:Search,pairing:Wine,guided:Grape,'producer-case':Layers3}
const kindSteps:LearningBlockKind[]=['annotated-plate','process-timeline','comparison-lab','map-lab','sensory-lab','simulator','decision-case']

function addLearningToJourney(module:LearningModule,locale:Locale,block?:LearningBlock){
  const journeys=repository.journeys.all()
  const target=journeys[0]??{id:crypto.randomUUID(),title:ui[locale].newJourney,description:module.question[locale],pace:'host',access:'invite',chapters:[],updatedAt:new Date().toISOString()} satisfies TastingJourney
  const chapter:TastingChapter={id:crypto.randomUUID(),type:(block?'learning-block':'article') as TastingChapter['type'],referenceId:block?.id??module.id,title:block?.title[locale]??module.title[locale],hostNote:block?.eyebrow[locale]??module.question[locale],duration:block?.duration??module.minutes}
  const updated={...target,chapters:[...target.chapters,chapter],updatedAt:new Date().toISOString()}
  repository.journeys.save([updated,...journeys.filter(item=>item.id!==updated.id)])
}

function ModuleCard({module,locale,state,onSave}:{module:LearningModule;locale:Locale;state:LearningState;onSave:(id:string)=>void}){
  const c=ui[locale],Icon=archetypeIcon[module.archetype],media=module.blocks.find(block=>block.media)?.media
  const finished=state.completed.includes(module.id),progress=state.blockProgress[module.id]?.length??0
  return <article className={`learning-module-card archetype-${module.archetype}`}>
    <Link to={`/learn/${module.id}`} className="module-visual">
      {media&&<img src={media.src} alt={naturalMediaAlt(media.alt[locale])} loading="lazy"/>}
      <span className="module-format"><Icon size={15}/>{c[module.archetype]}</span>
      {(finished||progress>0)&&<span className="module-progress" style={{'--progress':`${Math.round(progress/module.blocks.length*100)}%`} as CSSProperties}>{finished?<Check size={15}/>:String(Math.round(progress/module.blocks.length*100))+'%'}</span>}
    </Link>
    <div className="module-card-copy"><div><span>{schoolCopy[module.school].name[locale]}</span><span>{module.minutes} {c.min}</span></div><Link to={`/learn/${module.id}`}><h3>{module.title[locale]}</h3><p>{module.question[locale]}</p></Link><footer><span>{c[module.level]}</span><button aria-label={`${state.saved.includes(module.id)?c.savedAction:c.save}: ${module.title[locale]}`} aria-pressed={state.saved.includes(module.id)} className={state.saved.includes(module.id)?'active':''} onClick={()=>onSave(module.id)}><Bookmark size={17} fill={state.saved.includes(module.id)?'currentColor':'none'}/></button></footer></div>
  </article>
}

const discoveryCopy={
  en:{academy:'Wine school',title:'Understand what is in your glass.',intro:'Follow the journey from vineyard to cellar, learn to recognise aromas, and discover why place and people shape every wine.',start:'Start with the essentials',browse:'Explore all lessons',library:'Explore a question',libraryBody:'Find a complete lesson or focus on a single subject. You can bring any lesson to your next tasting.',all:'All learning',lessons:'Step-by-step lessons',guides:'Subject guides',time:'Any duration',short:'Up to 25 minutes',long:'More than 25 minutes',saved:'Saved lessons',savedEmpty:'Save a lesson with the bookmark to find it here.',personal:'Choose your learning path',personalBody:'Set an interest and the time you have this week.',empty:'No lessons found',emptyBody:'Try a broader search or clear a filter.',search:'Search wine, aromas, regions or techniques',begin:'Begin lesson',continue:'Continue lesson',completed:'lessons completed',steps:'steps finished',page:'Page',previous:'Previous',next:'Next',clear:'Clear filters',count:'results',allDone:'Choose something new to explore',guide:'Subject guide',saveLesson:'Save lesson',savedLesson:'Saved lesson',saveGuide:'Save guide',savedGuide:'Saved guide'},
  de:{academy:'Weinschule',title:'Verstehe, was in deinem Glas steckt.',intro:'Begleite den Wein vom Weinberg bis in den Keller, lerne Aromen zu erkennen und entdecke, wie Herkunft und Menschen seinen Charakter prägen.',start:'Mit den Grundlagen beginnen',browse:'Alle Lektionen entdecken',library:'Deiner Frage nachgehen',libraryBody:'Wähle eine ganze Lektion oder vertiefe ein einzelnes Thema. Jede Lektion kannst du in eine Verkostung mitnehmen.',all:'Alle Lerninhalte',lessons:'Schritt-für-Schritt-Lektionen',guides:'Themen zum Vertiefen',time:'Beliebige Dauer',short:'Bis 25 Minuten',long:'Mehr als 25 Minuten',saved:'Gespeicherte Lektionen',savedEmpty:'Speichere eine Lektion mit dem Lesezeichen, um sie hier wiederzufinden.',personal:'Deinen Lernweg zusammenstellen',personalBody:'Wähle dein Interesse und wie viel Zeit du diese Woche hast.',empty:'Keine Lektionen gefunden',emptyBody:'Suche etwas allgemeiner oder entferne einen Filter.',search:'Wein, Aromen, Regionen oder Verfahren suchen',begin:'Lektion beginnen',continue:'Lektion fortsetzen',completed:'Lektionen abgeschlossen',steps:'Schritte abgeschlossen',page:'Seite',previous:'Zurück',next:'Weiter',clear:'Filter zurücksetzen',count:'Ergebnisse',allDone:'Entdecke ein neues Thema',guide:'Vertiefung',saveLesson:'Lektion speichern',savedLesson:'Lektion gespeichert',saveGuide:'Guide speichern',savedGuide:'Guide gespeichert'},
  fr:{academy:'École du vin',title:'Comprenez ce qui se trouve dans votre verre.',intro:'Suivez le vin de la vigne à la cave, apprenez à reconnaître les arômes et découvrez comment le lieu et les personnes façonnent chaque vin.',start:'Commencer par les bases',browse:'Explorer toutes les leçons',library:'Explorer une question',libraryBody:'Suivez une leçon complète ou approfondissez un sujet précis. Chaque leçon peut accompagner votre prochaine dégustation.',all:'Tous les contenus',lessons:'Leçons pas à pas',guides:'Guides thématiques',time:'Toutes les durées',short:'Jusqu’à 25 minutes',long:'Plus de 25 minutes',saved:'Leçons enregistrées',savedEmpty:'Enregistrez une leçon avec le signet pour la retrouver ici.',personal:'Composer votre parcours',personalBody:'Choisissez un intérêt et votre temps disponible cette semaine.',empty:'Aucune leçon trouvée',emptyBody:'Essayez une recherche plus large ou retirez un filtre.',search:'Rechercher vins, arômes, régions ou techniques',begin:'Commencer la leçon',continue:'Reprendre la leçon',completed:'leçons terminées',steps:'étapes terminées',page:'Page',previous:'Précédent',next:'Suivant',clear:'Effacer les filtres',count:'résultats',allDone:'Découvrez un nouveau sujet',guide:'Guide thématique',saveLesson:'Enregistrer la leçon',savedLesson:'Leçon enregistrée',saveGuide:'Enregistrer le guide',savedGuide:'Guide enregistré'},
  es:{academy:'Escuela del vino',title:'Entiende lo que hay en tu copa.',intro:'Sigue el vino desde el viñedo hasta la bodega, aprende a reconocer aromas y descubre cómo el lugar y las personas dan carácter a cada vino.',start:'Empezar por los fundamentos',browse:'Explorar todas las lecciones',library:'Explorar una pregunta',libraryBody:'Sigue una lección completa o profundiza en un tema concreto. Puedes llevar cualquier lección a tu próxima cata.',all:'Todo el aprendizaje',lessons:'Lecciones paso a paso',guides:'Guías temáticas',time:'Cualquier duración',short:'Hasta 25 minutos',long:'Más de 25 minutos',saved:'Lecciones guardadas',savedEmpty:'Guarda una lección con el marcador para encontrarla aquí.',personal:'Crear tu ruta de aprendizaje',personalBody:'Elige un interés y el tiempo que tienes esta semana.',empty:'No se encontraron lecciones',emptyBody:'Prueba una búsqueda más amplia o elimina un filtro.',search:'Buscar vinos, aromas, regiones o técnicas',begin:'Empezar lección',continue:'Continuar lección',completed:'lecciones completadas',steps:'pasos completados',page:'Página',previous:'Anterior',next:'Siguiente',clear:'Borrar filtros',count:'resultados',allDone:'Descubre un nuevo tema',guide:'Guía temática',saveLesson:'Guardar lección',savedLesson:'Lección guardada',saveGuide:'Guardar guía',savedGuide:'Guía guardada'},
} satisfies Record<Locale,Record<string,string>>

export function LearningHub(){
  const {locale}=useLocale(),c=ui[locale],d=discoveryCopy[locale]
  const [query,setQuery]=useState(''),[kind,setKind]=useState<'all'|'lesson'|'guide'|'saved'>('all'),[duration,setDuration]=useState<'all'|'short'|'long'>('all'),[page,setPage]=useState(1),[state,setState]=useState(readState)
  const all=useMemo<LearningLibraryItem[]>(()=>[
    ...learningModules.map(module=>({key:module.id,id:module.id,title:module.title[locale],summary:module.question[locale],category:schoolCopy[module.school].name[locale],minutes:module.minutes,kind:'lesson' as const,module})),
    ...articles.map(article=>{const guide=articleContent(article,locale);return {key:`guide:${guide.id}`,id:guide.id,title:guide.title,summary:guide.summary,category:guide.eyebrow,minutes:guide.minutes,kind:'guide' as const}})
  ],[locale])
  const filtered=all.filter(item=>{
    const matches=normalizeSearch(`${item.title} ${item.summary} ${item.category}`,locale).includes(normalizeSearch(query.trim(),locale))
    return matches&&(kind==='all'||(kind==='saved'?state.saved.includes(item.key):item.kind===kind))&&(duration==='all'||(duration==='short'?item.minutes<=25:item.minutes>25))
  })
  const size=9,pages=Math.max(1,Math.ceil(filtered.length/size)),safePage=Math.min(page,pages),visible=filtered.slice((safePage-1)*size,safePage*size)
  useEffect(()=>{if(page!==safePage)setPage(safePage)},[page,safePage])
  const reset=()=>{setQuery('');setKind('all');setDuration('all');setPage(1)}
  const toggleSaved=(id:string)=>{const current=readState();const next={...current,saved:current.saved.includes(id)?current.saved.filter(item=>item!==id):[...current.saved,id]};setState(next);writeState(next)}
  const completed=learningModules.filter(module=>state.completed.includes(module.id)).length
  const continued=learningModules.find(module=>module.blocks.some(block=>state.blockProgress[module.id]?.includes(block.id))&&!state.completed.includes(module.id))
  const featureGuide=articleContent(articles.find(item=>item.id==='vine-to-glass')??articles[0],locale)
  const feature=continued?{title:continued.title[locale],summary:continued.question[locale],minutes:continued.minutes,image:continued.blocks.find(block=>block.media)?.media?.src,alt:naturalMediaAlt(continued.blocks.find(block=>block.media)?.media?.alt[locale]??continued.title[locale]),href:`/learn/${continued.id}`}:{...featureGuide,image:guideImage(featureGuide.id),alt:featureGuide.title,href:`/learn/guides/${featureGuide.id}`}
  const nextBlock=continued?.blocks.find(block=>!state.blockProgress[continued.id]?.includes(block.id))
  return <div className="page learning-hub academy-refined">
      <header className="academy-opening"><div><span className="eyebrow">{d.academy}</span><h1>{d.title}</h1><p>{d.intro}</p><a className="text-action" href="#learning-library">{d.browse}<ArrowRight size={18}/></a></div><Link className="academy-feature" to={`${feature.href}${nextBlock?'#'+nextBlock.id:''}`}><img src={feature.image} alt={feature.alt} fetchPriority="high"/><div><span className="eyebrow">{continued?d.continue:d.start} · {feature.minutes} {c.min}</span><h2>{feature.title}</h2><span className="academy-feature-action">{continued?d.continue:d.begin}<ArrowRight/></span></div></Link></header>
    <details className="academy-path"><summary><div><span className="eyebrow">{d.personal}</span><p>{d.personalBody}</p></div><ChevronRight/></summary><AdaptiveLearningPlanner/></details>
    <section className="learning-discovery" id="learning-library">
      <header className="academy-library-heading"><div><span className="eyebrow">{d.academy}</span><h2>{d.library}</h2><p>{d.libraryBody}</p></div>{completed>0&&<span className="academy-completion"><Check size={18}/>{completed} / {learningModules.length} {d.completed}</span>}</header>
      <div className="learning-toolbar"><label className="learning-search"><Search size={20}/><input type="search" aria-label={d.search} value={query} onChange={event=>{setQuery(event.target.value);setPage(1)}} placeholder={d.search}/></label><span aria-live="polite">{filtered.length} {d.count}</span></div>
      <div className="academy-filter-row"><div className="academy-type-filters" role="group" aria-label={d.all}>{[['all',d.all],['lesson',d.lessons],['guide',d.guides],['saved',d.saved]].map(([value,label])=><button type="button" key={value} aria-pressed={kind===value} className={kind===value?'active':''} onClick={()=>{setKind(value as typeof kind);setPage(1)}}>{label}</button>)}</div><select aria-label={d.time} value={duration} onChange={event=>{setDuration(event.target.value as typeof duration);setPage(1)}}><option value="all">{d.time}</option><option value="short">{d.short}</option><option value="long">{d.long}</option></select></div>
      {visible.length?<div className="learning-module-grid academy-results">{visible.map(item=>item.module?<ModuleCard key={item.key} module={item.module} locale={locale} state={state} onSave={toggleSaved}/>:<article className="learning-module-card academy-guide" key={item.key}><Link className="module-visual" to={`/learn/guides/${item.id}`}><img src={guideImage(item.id)} alt={naturalMediaAlt(item.title)} loading="lazy"/><span className="module-format"><BookOpen size={15}/>{d.guide}</span></Link><div className="module-card-copy"><div><span>{item.category}</span><span>{item.minutes} {c.min}</span></div><Link to={`/learn/guides/${item.id}`}><h3>{item.title}</h3><p>{item.summary}</p></Link><footer><Link to={`/learn/guides/${item.id}`}>{d.begin}<ArrowRight size={16}/></Link><button type="button" aria-label={`${state.saved.includes(item.key)?d.savedGuide:d.saveGuide}: ${item.title}`} aria-pressed={state.saved.includes(item.key)} onClick={()=>toggleSaved(item.key)}><Bookmark size={17} fill={state.saved.includes(item.key)?'currentColor':'none'}/></button></footer></div></article>)}</div>:<div className="learning-empty"><BookOpen/><h2>{d.empty}</h2><p>{kind==='saved'&&!query?d.savedEmpty:d.emptyBody}</p><button type="button" className="secondary-button" onClick={reset}>{d.clear}</button></div>}
      {pages>1&&<nav className="learning-pagination" aria-label={d.page}><button disabled={safePage===1} onClick={()=>{setPage(safePage-1);document.getElementById('learning-library')?.scrollIntoView({block:'start'})}}><ArrowLeft/>{d.previous}</button><span>{d.page} {safePage} / {pages}</span><button disabled={safePage===pages} onClick={()=>{setPage(safePage+1);document.getElementById('learning-library')?.scrollIntoView({block:'start'})}}>{d.next}<ArrowRight/></button></nav>}
    </section>
  </div>
}
function entityLink(id:string){if(regions.some(item=>item.id===id))return `/regions/${id}`;if(grapes.some(item=>item.id===id))return `/grapes/${id}`;if(producers.some(item=>item.id===id))return `/wineries/${id}`;if(wines.some(item=>item.id===id))return `/wines/${id}`;if(aromas.some(item=>item.id===id))return `/aromas?selected=${id}`;return '/atlas'}
function entityName(id:string){return [...regions,...grapes,...producers,...wines,...aromas].find(item=>item.id===id)?.name??id.replaceAll('-',' ')}

function InteractiveVisual({block,locale}:{block:LearningBlock;locale:Locale}){
  const c=ui[locale],[value,setValue]=useState(1),[step,setStep]=useState(0),[answer,setAnswer]=useState<number|null>(null),[revealed,setRevealed]=useState(false),[comparisonChoice,setComparisonChoice]=useState<0|1|null>(null)
  const guidance={
    en:{check:'Choose the method that tests one cause without changing the glass, sample, time or order.',timeline:'Select a phase to see what changes next and which observation could show it.',plate:'Choose a structure. Separate what you can observe from what it may suggest.',map:'Select an origin term or evidence lens to see what it establishes and what it does not.',mapLimit:'This diagram is schematic; it does not show legal vineyard boundaries.',case:'Record an observation separately from your hypothesis. Open one clue at a time; a clue can support a diagnosis without proving a single cause.',dial:'Move one variable only. The response describes a possible direction, never a guaranteed flavour.'},
    de:{check:'Wähle die Methode, die eine Ursache prüft, ohne Glas, Probe, Zeit oder Reihenfolge zu verändern.',timeline:'Wähle eine Phase, um zu sehen, was sich danach verändert und welcher Befund das zeigen könnte.',plate:'Wähle eine Struktur. Trenne sichtbare Beobachtung von ihrer möglichen Deutung.',map:'Wähle einen Herkunftsbegriff oder eine Evidenzebene: Was belegt sie – und was nicht?',mapLimit:'Die Abbildung ist schematisch und zeigt keine rechtlichen Weinbergsgrenzen.',case:'Notiere Beobachtung und Hypothese getrennt. Öffne einen Hinweis nach dem anderen; er kann eine Diagnose stützen, aber nicht eine einzige Ursache beweisen.',dial:'Verändere nur eine Variable. Das Ergebnis beschreibt eine mögliche Richtung, niemals ein garantiertes Aroma.'},
    fr:{check:'Choisissez la méthode qui teste une cause sans changer verre, échantillon, durée ni ordre.',timeline:'Choisissez une phase pour voir ce qui change ensuite et quelle observation pourrait le montrer.',plate:'Choisissez une structure. Distinguez ce qui est observable de ce que cela peut suggérer.',map:'Choisissez un terme d’origine ou un angle d’observation : ce qu’il établit, et ses limites.',mapLimit:'Le schéma est indicatif ; il ne représente pas les limites juridiques des vignobles.',case:'Notez séparément l’observation et l’hypothèse. Ouvrez un indice à la fois ; il peut étayer un diagnostic sans prouver une cause unique.',dial:'Ne modifiez qu’une variable. Le résultat décrit une direction possible, jamais un arôme garanti.'},
    es:{check:'Elige el método que prueba una causa sin cambiar copa, muestra, tiempo ni orden.',timeline:'Elige una fase para ver qué cambia después y qué observación podría mostrarlo.',plate:'Elige una estructura. Separa lo que observas de lo que podría indicar.',map:'Elige un término de origen o una perspectiva: qué establece y qué no.',mapLimit:'El diagrama es esquemático; no muestra límites legales de viñedos.',case:'Anota por separado la observación y la hipótesis. Abre una pista cada vez; puede apoyar un diagnóstico sin probar una causa única.',dial:'Cambia una sola variable. El resultado describe una dirección posible, nunca un aroma garantizado.'},
  }[locale]
  const feedback={
    en:{correct:'Best-supported answer.',wrong:'Try again.',correctFallback:'This option best matches the evidence the question asks you to compare.',wrongFallback:'Check which evidence the question asks you to compare, then try again.'},
    de:{correct:'Am besten gestützte Antwort.',wrong:'Versuche es noch einmal.',correctFallback:'Diese Antwort passt am besten zur Evidenz, die die Frage vergleichen lässt.',wrongFallback:'Prüfe, welche Evidenz die Frage vergleichen lässt, und versuche es erneut.'},
    fr:{correct:'Réponse la mieux étayée.',wrong:'Réessayez.',correctFallback:'Cette réponse correspond le mieux aux indices que la question demande de comparer.',wrongFallback:'Vérifiez quels indices la question demande de comparer, puis réessayez.'},
    es:{correct:'Respuesta mejor respaldada.',wrong:'Inténtalo de nuevo.',correctFallback:'Esta opción corresponde mejor a la evidencia que pide comparar la pregunta.',wrongFallback:'Revisa qué evidencia pide comparar la pregunta y vuelve a intentarlo.'},
  }[locale]
  const stages=block.stages?.[locale]??[c.stage],scales=block.stages?.[locale].slice(0,4)??[c.country,c.region,c.subregion,c.site],isOriginMap=block.id.startsWith('germany-origin')
  const mapGroupLabel=isOriginMap?c.scale:{en:'Choose a focus',de:'Schwerpunkt wählen',fr:'Choisissez un angle',es:'Elige un enfoque'}[locale]
  const answerKey=block.answer??1
  const interactionPrompt=block.interaction?.prompt[locale]
  const mapPrompt=isOriginMap?`${interactionPrompt??guidance.map} ${guidance.mapLimit}`:interactionPrompt??guidance.map
  if(block.kind==='knowledge-check')return <div className="knowledge-check"><p className="interaction-instruction">{interactionPrompt??guidance.check}</p><p>{c.choose}</p><div role="group" aria-label={interactionPrompt??c.choose}>{block.options?.[locale].map((option,index)=><button type="button" key={option} aria-pressed={answer===index} className={answer===index?(index===answerKey?'correct':'wrong'):''} onClick={()=>setAnswer(index)}><span>{String.fromCharCode(65+index)}</span>{option}</button>)}</div>{answer!==null&&<p role="status" aria-live="polite" className={answer===answerKey?'feedback-correct':'feedback-wrong'}><strong>{answer===answerKey?feedback.correct:feedback.wrong}</strong> {block.interaction?.feedback?.[locale]?.[answer]??(answer===answerKey?feedback.correctFallback:feedback.wrongFallback)}</p>}{answer!==null&&answer!==answerKey&&<button type="button" className="text-action" onClick={()=>setAnswer(null)}><RotateCcw size={15}/>{c.retry}</button>}</div>
  if(block.kind==='process-timeline')return <div className="process-controller"><p className="interaction-instruction">{interactionPrompt??guidance.timeline}</p><div role="group" aria-label={c.stage}>{stages.map((label,index)=><button type="button" key={label} aria-current={step===index?'step':undefined} aria-pressed={step===index} className={step===index?'active':''} onClick={()=>setStep(index)}><span>{String(index+1).padStart(2,'0')}</span>{label}</button>)}</div><article><span>{c.stage} {step+1}</span><strong>{stages[step]}</strong><p role="status" aria-live="polite">{block.body[locale][step]??block.body[locale][0]}</p><button type="button" className="text-action" onClick={()=>setStep(value=>(value+1)%stages.length)}>{step===stages.length-1?<RotateCcw/>:<Play/>}{step===stages.length-1?c.reset:c.next}</button></article></div>
  if(block.kind==='annotated-plate')return <div className="plate-hotspots"><p className="interaction-instruction">{interactionPrompt??guidance.plate}</p><div className="hotspot-list" role="group" aria-label={interactionPrompt??guidance.plate}>{(block.interaction?.labels?.[locale]??stages.slice(0,3)).map((label,index)=><button type="button" key={label} aria-current={step===index?'step':undefined} aria-pressed={step===index} className={step===index?'active':''} onClick={()=>setStep(index)}><span>{String(index+1).padStart(2,'0')}</span>{label}</button>)}</div><p role="status" aria-live="polite">{block.body[locale][step]??block.body[locale][0]}</p></div>
  if(block.kind==='map-lab')return <div className="map-scale-lab"><p className="interaction-instruction">{mapPrompt}</p><span>{mapGroupLabel}</span>{isOriginMap?<div className="germany-learning-map" data-step={step} role="img" aria-label={`${naturalMediaAlt(block.media?.alt[locale]??block.title[locale])} · ${mapGroupLabel}: ${scales[step]??scales[0]}`}><svg viewBox="0 0 440 270" aria-hidden="true"><path className="country-shape" d="M185 18l45 12 17 32 38 18-7 43 28 27-32 31-7 55-58 22-41-30-48-7-7-45 23-31-10-40 36-31z"/><path className="river-line" d="M252 39c-18 32-10 55-34 79-19 19-13 42-47 78"/><path className="mosel-line" d="M218 119c-31 3-29 24-57 17-24-6-24 19-45 15"/><circle cx="148" cy="143" r="7"/><circle cx="230" cy="92" r="7"/></svg><span className="map-label mosel">Mosel</span><span className="map-label rheingau">Rheingau</span><span className="map-scope-highlight" aria-hidden="true">{scales[step]??scales[0]}</span></div>:<div className="learning-locator" data-step={step} role="img" aria-label={`${naturalMediaAlt(block.media?.alt[locale]??block.title[locale])} · ${mapGroupLabel}: ${scales[step]??scales[0]}`}>{scales.map((label,index)=><span key={label} className={step===index?'active':''} style={{'--locator-index':index} as CSSProperties} aria-hidden="true"><i>{index+1}</i><b>{label}</b></span>)}</div>}<div className="map-scope-options" role="group" aria-label={mapGroupLabel}>{scales.map((label,index)=><button type="button" key={label} aria-pressed={step===index} className={step===index?'active':''} onClick={()=>setStep(index)}><i/>{label}</button>)}</div><p role="status" aria-live="polite">{block.body[locale][step]??block.body[locale][0]}</p></div>
  if(block.kind==='decision-case')return <div className="decision-reveal"><p className="interaction-instruction">{interactionPrompt??guidance.case}</p><div className="evidence-vials" role="group" aria-label={c.hostReveal}>{(block.interaction?.labels?.[locale]??stages).map((label,index)=><button type="button" key={label} aria-pressed={revealed&&step===index} className={revealed&&step===index?'active':''} onClick={()=>{setStep(index);setRevealed(true)}}><span>{String(index+1).padStart(2,'0')}</span><b>{label}</b></button>)}</div>{revealed&&<p role="status" aria-live="polite">{block.body[locale][step]??block.body[locale][0]}</p>}<button type="button" className="secondary-button" onClick={()=>{if(revealed){setRevealed(false);setStep(0)}else{setStep(0);setRevealed(true)}}}>{revealed?<RotateCcw/>:<Play/>}{revealed?c.reset:c.reveal}</button></div>
  if(block.kind==='comparison-lab'&&block.comparison){
    const comparison=block.comparison
    return <div className="learning-dial learning-comparison">
      <p className="interaction-instruction">{comparison.prompt[locale]}</p>
      <strong className="dial-variable">{block.title[locale]}</strong>
      <div className="lesson-variable-choices comparison-options" role="group" aria-label={comparison.prompt[locale]}>
        {[comparison.a[locale],comparison.b[locale]].map((label,index)=><button type="button" key={label} aria-pressed={comparisonChoice===index} className={comparisonChoice===index?'active':''} onClick={()=>setComparisonChoice(index as 0|1)}>{index===0?'A':'B'} · {label}</button>)}
      </div>
      {comparisonChoice!==null&&<div className="dial-result" role="status" aria-live="polite"><p>{comparison.outcomes[locale][comparisonChoice]}</p></div>}
    </div>
  }
  if(block.kind==='sensory-lab'&&block.sensory){
    const sensory=block.sensory
    return <div className="learning-dial learning-sensory">
      <p className="interaction-instruction">{sensory.prompt[locale]}</p>
      <strong className="dial-variable">{sensory.label[locale]}</strong>
      <div className="lesson-variable-choices" role="group" aria-label={`${sensory.label[locale]}: ${sensory.prompt[locale]}`}>
        {sensory.choices[locale].map((label,index)=><button type="button" key={label} aria-pressed={value===index} className={value===index?'active':''} onClick={()=>setValue(index)}>{label}</button>)}
      </div>
      <div className="dial-result" role="status" aria-live="polite"><p>{sensory.observations[locale][value]}</p></div>
    </div>
  }
  if(['comparison-lab','sensory-lab','simulator'].includes(block.kind)){
    const control=block.control,band=value
     const middle={en:'Middle range',de:'Mittlerer Bereich',fr:'Zone intermédiaire',es:'Zona intermedia'}[locale]
    const labels=[control?.low[locale]??c.cool,middle,control?.high[locale]??c.warm]
     return <div className={`learning-dial ${block.kind}`}><p className="interaction-instruction">{interactionPrompt??guidance.dial}</p><strong className="dial-variable">{control?.label[locale]??block.title[locale]}</strong><div className="lesson-variable-choices" role="group" aria-label={control?.label[locale]??block.title[locale]}>{labels.map((label,index)=><button type="button" key={label} aria-pressed={value===index} className={value===index?'active':''} onClick={()=>setValue(index)}>{label}</button>)}</div><div className="dial-result" aria-live="polite"><p>{control?.states[locale][band]??block.body[locale][band]}</p></div></div>
  }
  return null
}

export function PortableLearningBlock({module,block,compact=false,expanded=false,bodyOverride}:{module:LearningModule;block:LearningBlock;compact?:boolean;expanded?:boolean;bodyOverride?:string[]}){
  const {locale}=useLocale(),c=ui[locale],[added,setAdded]=useState(false)
  const body=bodyOverride??block.body[locale]
  return <section id={block.id} className={`portable-learning-block block-${block.kind} ${compact?'compact':''}`}>
    <header><div><span className="eyebrow">{block.eyebrow[locale]} · {block.duration} {c.min}</span><h2>{block.title[locale]}</h2></div></header>
    {block.media&&<figure className={`learning-plate focus-${block.media.focus??'center'}`}><img src={block.media.src} alt={naturalMediaAlt(block.media.alt[locale])} loading="lazy"/><span className="plate-index">{block.kind==='annotated-plate'?'01 · 02 · 03':block.kind==='map-lab'?`${c.country} → ${c.site}`:`${c.observe} → ${c.test}`}</span></figure>}
    {block.reading&&<ReadingText paragraphs={block.reading[locale]} locale={locale} className="learning-prose authored-reading"/>}
    {kindSteps.includes(block.kind)&&<InteractiveVisual block={block} locale={locale}/>} 
    {expanded&&kindSteps.includes(block.kind)&&<ReadingText paragraphs={body} locale={locale} className="learning-prose expanded-learning-prose"/>}
    {!kindSteps.includes(block.kind)&&block.kind!=='knowledge-check'&&block.kind!=='sources'&&<ReadingText paragraphs={body} locale={locale} className="learning-prose"/>}
    {block.kind==='knowledge-check'&&<InteractiveVisual block={block} locale={locale}/>} 
    {block.kind==='entity-connections'&&<div className="block-entity-links">{(module.entityIds.length?module.entityIds:['riesling','mosel','chardonnay']).map(id=><Link to={entityLink(id)} key={id}>{entityName(id)}<ChevronRight/></Link>)}</div>}
    {block.kind==='sources'&&<ReadingText paragraphs={body} locale={locale} className="learning-prose"/>}
    {!compact&&block.kind!=='sources'&&<button type="button" aria-live="polite" className={`add-learning-block ${added?'added':''}`} onClick={()=>{addLearningToJourney(module,locale,block);setAdded(true)}}>{added?<Check/>:<Layers3/>}{added?c.blockAdded:c.addBlock}</button>}
  </section>
}

type LessonDisplayBlock={block:LearningBlock;body:string[]}
function lessonDisplayBlocks(module:LearningModule,locale:Locale):LessonDisplayBlock[]{
  if(module.id!=='wine-as-system')return module.blocks.map(block=>({block,body:block.body[locale]}))

  // The opening, outcomes and table exercise already present these notes. Keep
  // each explanatory paragraph once, while leaving every interactive state intact.
  const seen=new Set([module.summary[locale],...module.outcomes[locale],module.experiment[locale]])
  module.blocks.flatMap(block=>block.reading?.[locale]??[]).forEach(paragraph=>seen.add(paragraph))
  return module.blocks.flatMap(block=>{
    if(block.kind==='glossary'){
      const body=block.body[locale].filter(paragraph=>{
        if(seen.has(paragraph))return false
        seen.add(paragraph)
        return true
      })
      return body.length?[{block,body}]:[]
    }
    if(block.kind==='sources')return []
    if(kindSteps.includes(block.kind)||block.kind==='knowledge-check')return [{block,body:block.body[locale]}]
    const body=block.body[locale].filter(paragraph=>{
      if(seen.has(paragraph))return false
      seen.add(paragraph)
      return true
    })
    return [{block,body}]
  })
}

export function LearningLesson(){
  const {slug}=useParams(),{locale}=useLocale(),c=ui[locale],module=learningModuleById(slug??'')
  const lessonBlocks=useMemo(()=>module?lessonDisplayBlocks(module,locale):[],[module,locale])
  const [state,setState]=useState(readState),[added,setAdded]=useState(false),[currentBlock,setCurrentBlock]=useState('')
  useEffect(()=>{
    if(!module)return
    const done=state.blockProgress[module.id]??[]
    setCurrentBlock(current=>current&&lessonBlocks.some(({block})=>block.id===current)?current:lessonBlocks.find(({block})=>!done.includes(block.id))?.block.id??lessonBlocks[0]?.block.id??'')
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>Math.abs(a.boundingClientRect.top)-Math.abs(b.boundingClientRect.top))[0]
      if(visible)setCurrentBlock((visible.target as HTMLElement).id)
    },{rootMargin:'-18% 0px -66% 0px',threshold:[0,.2,.6]})
    lessonBlocks.forEach(({block})=>{const element=document.getElementById(block.id);if(element)observer.observe(element)})
    return ()=>observer.disconnect()
  },[module?.id,lessonBlocks,state.blockProgress])
  if(!module)return <div className="page learning-not-found"><BookOpen/><h1>{c.notFound}</h1><Link className="primary-button ink" to="/learn">{c.openAcademy}</Link></div>
  const storedDone=state.blockProgress[module.id]??[],done=storedDone.filter(id=>lessonBlocks.some(({block})=>block.id===id)),saved=state.saved.includes(module.id),completed=state.completed.includes(module.id)
  const update=(next:LearningState)=>{setState(next);writeState(next)}
  const toggleSaved=()=>update({...state,saved:saved?state.saved.filter(id=>id!==module.id):[...state.saved,module.id]})
  const markBlock=(id:string)=>{if(storedDone.includes(id))return;update({...state,blockProgress:{...state.blockProgress,[module.id]:[...storedDone,id]}})}
  // Completion is a learner's bookmark, not a claim of mastery. Preserve the
  // blocks they actually visited instead of manufacturing progress here.
  const finish=()=>update({...state,completed:completed?state.completed.filter(id=>id!==module.id):[...state.completed,module.id]})
  const Icon=archetypeIcon[module.archetype],next=learningModules[(learningModules.indexOf(module)+1)%learningModules.length]
  return <article className={`page learning-lesson lesson-${module.archetype}`}>
    <Link className="back-link" to="/learn"><ArrowLeft/>{c.back}</Link>
    <header className="lesson-opening"><div><span className="eyebrow">{schoolCopy[module.school].name[locale]} · {c[module.level]}</span><h1>{module.title[locale]}</h1><p>{module.question[locale]}</p><div className="lesson-meta"><span><Clock/>{module.minutes} {c.min}</span><span><Icon/>{c[module.archetype]}</span><span><Layers3/>{lessonBlocks.length} {c.blocks}</span></div><div className="lesson-actions"><button className="primary-button ink" onClick={()=>{addLearningToJourney(module,locale);setAdded(true)}}>{added?<Check/>:<Layers3/>}{added?c.addedTasting:c.addWhole}</button><button className={`secondary-button ${saved?'active':''}`} onClick={toggleSaved}><Bookmark fill={saved?'currentColor':'none'}/>{saved?c.savedAction:c.save}</button></div></div><div className="opening-question"><span>{c.observe} → {c.manipulate} → {c.test}</span><strong>{String(learningModules.indexOf(module)+1).padStart(2,'0')}</strong><p>{module.summary[locale]}</p></div></header>
    <section className="lesson-outcomes"><span className="eyebrow">{c.outcomes}</span><ol>{module.outcomes[locale].map((outcome,index)=><li key={outcome}><span>0{index+1}</span>{outcome}</li>)}</ol></section>
    <LearningPoster module={module} locale={locale}/>
    <div className="lesson-field-layout"><aside className="lesson-rail" aria-label={c.lessonMap}><span className="eyebrow">{c.lessonMap}</span><i className="lesson-total-progress" style={{'--progress':`${done.length/lessonBlocks.length*100}%`} as CSSProperties}/>{lessonBlocks.map(({block},index)=>{const isDone=done.includes(block.id),isCurrent=currentBlock===block.id;return <a href={`#${block.id}`} aria-current={isCurrent?'step':undefined} aria-label={`${index+1}. ${block.title[locale]} · ${isCurrent?c.progress:isDone?c.completed:c.next}`} className={`${isDone?'done':''} ${isCurrent?'current':''}`.trim()} key={block.id} onClick={()=>setCurrentBlock(block.id)}><span>{isCurrent?String(index+1).padStart(2,'0'):isDone?<Check/>:String(index+1).padStart(2,'0')}</span><div><strong>{block.title[locale]}</strong></div></a>})}</aside><main className="lesson-blocks">{lessonBlocks.map(({block,body})=>{const isDone=done.includes(block.id);return <div className="lesson-block-wrap" key={block.id}><PortableLearningBlock module={module} block={block} bodyOverride={body}/><button type="button" aria-live="polite" className={`block-completion-action ${isDone?'completed':''}`} disabled={isDone} onClick={()=>markBlock(block.id)}>{<Check/>}{isDone?c.completed:c.complete}</button></div>})}</main></div>
    <section className="table-experiment"><div><span className="eyebrow">{c.tableExperiment}</span><h2>{module.title[locale]}</h2><p>{module.experiment[locale]}</p></div><Wine/></section>
    <section className="lesson-finish"><button type="button" aria-live="polite" className={`primary-button ${completed?'completed':''}`} onClick={finish}>{completed?<Check/>:<Target/>}{completed?c.completed:c.complete}</button><Link to={`/learn/${next.id}`}><span>{c.next}</span><strong>{next.title[locale]}</strong><ArrowRight/></Link></section>
  </article>
}

export function InlineLearningChapter({referenceId}:{referenceId:string}){
  const pair=learningBlockById(referenceId),module=learningModuleById(referenceId)
  if(pair)return <PortableLearningBlock module={pair.module} block={pair.block} compact/>
  if(module)return <PortableLearningBlock module={module} block={module.blocks.find(block=>kindSteps.includes(block.kind))??module.blocks[0]} compact/>
  return null
}

export {ui as learningUi}
