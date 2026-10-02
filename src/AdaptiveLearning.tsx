import { ArrowRight, Brain, Check, Clock3, Route, Sparkles, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { repository } from './data/repository'
import { useLocale, type Locale } from './i18n'
import { learningModules, schoolCopy, type LearningModule, type LearningSchool } from './learningCurriculum'
import { useMemo, useState } from 'react'

type Goal='taste'|'place'|'make'|'cellar'|'host'
type Level='start'|'deepen'|'expert'
type LearningPreferences={goal:Goal;level:Level;weeklyMinutes:number}
type StoredLearning={saved:string[];completed:string[];blockProgress:Record<string,string[]>;preferences?:LearningPreferences}

const copy={
  en:{eyebrow:'Your learning route',title:'Build a path around the question you care about',body:'Choose what you want to understand. Your suggestions reflect your interest, starting point and available time.',goal:'I want to',taste:'taste with precision',place:'understand place',make:'understand winemaking',cellar:'build and age a cellar',host:'host memorable tastings',level:'Starting point',start:'build foundations',deepen:'connect the dots',expert:'explore advanced topics',time:'Weekly rhythm',minutes:'minutes',route:'Recommended next',skill:'Lessons you have completed',begin:'Start this route',done:'complete',noFit:'Nothing fits that weekly budget yet.',noFitBody:'Increase the available time or choose a shorter route. No lesson is shown as fitting when its full duration would exceed your budget.'},
  de:{eyebrow:'Dein Lernweg',title:'Baue einen Pfad um die Frage, die dich wirklich interessiert',body:'Was möchtest du besser verstehen? Die Vorschläge richten sich nach deinem Interesse, Vorwissen und Zeitbudget.',goal:'Ich möchte',taste:'präziser verkosten',place:'Herkunft verstehen',make:'Weinbereitung verstehen',cellar:'einen Keller aufbauen',host:'starke Tastings hosten',level:'Ausgangspunkt',start:'Grundlagen aufbauen',deepen:'Zusammenhänge knüpfen',expert:'anspruchsvolle Themen vertiefen',time:'Wochenrhythmus',minutes:'Minuten',route:'Als Nächstes empfohlen',skill:'Deine abgeschlossenen Lektionen',begin:'Diesen Weg starten',done:'abgeschlossen'},
  fr:{eyebrow:'Votre parcours',title:'Construisez un parcours autour de votre vraie question',body:'Que souhaitez-vous mieux comprendre ? Les suggestions tiennent compte de votre intérêt, de votre niveau et du temps disponible.',goal:'Je veux',taste:'déguster avec précision',place:'comprendre le lieu',make:'comprendre la vinification',cellar:'constituer une cave',host:'animer des dégustations',level:'Point de départ',start:'poser les bases',deepen:'relier les idées',expert:'approfondir les sujets avancés',time:'Rythme hebdomadaire',minutes:'minutes',route:'Prochaines recommandations',skill:'Leçons terminées',begin:'Commencer ce parcours',done:'terminé'},
  es:{eyebrow:'Tu ruta de aprendizaje',title:'Crea un camino alrededor de la pregunta que te importa',body:'¿Qué te gustaría entender mejor? Las sugerencias tienen en cuenta tu interés, tu punto de partida y el tiempo disponible.',goal:'Quiero',taste:'catar con precisión',place:'entender el lugar',make:'entender la elaboración',cellar:'crear y criar una bodega',host:'dirigir grandes catas',level:'Punto de partida',start:'construir fundamentos',deepen:'conectar ideas',expert:'explorar temas avanzados',time:'Ritmo semanal',minutes:'minutos',route:'Siguiente recomendación',skill:'Lecciones completadas',begin:'Empezar esta ruta',done:'completado'},
} satisfies Record<Locale,Record<string,string>>

const noFitCopy:Record<Locale,[string,string]>={
  en:['Nothing fits that weekly budget yet.','Increase your weekly time or open a subject guide below. A lesson appears here only when its full listed duration fits.'],
  de:['Noch passt keine Lektion in dieses Zeitbudget.','Erhöhe deine Wochenzeit oder öffne unten einen Themen-Guide. Eine Lektion erscheint hier nur, wenn ihre gesamte angegebene Dauer hineinpasst.'],
  fr:['Aucune leçon ne tient encore dans ce budget hebdomadaire.','Augmentez votre temps hebdomadaire ou ouvrez un guide thématique ci-dessous. Une leçon n’apparaît ici que si sa durée complète tient dans le budget.'],
  es:['Todavía no hay ninguna lección que encaje en ese presupuesto semanal.','Aumenta tu tiempo semanal o abre una guía temática más abajo. Aquí solo aparece una lección si cabe su duración completa.'],
}

const recommendationCountCopy:Record<Locale,string>={en:'lessons suggested',de:'Lektionen empfohlen',fr:'leçons conseillées',es:'lecciones sugeridas'}
const saveFailureCopy:Record<Locale,string>={en:'Your learning preferences could not be saved in this browser.',de:'Deine Lernpräferenzen konnten in diesem Browser nicht gespeichert werden.',fr:'Vos préférences d’apprentissage n’ont pas pu être enregistrées dans ce navigateur.',es:'No se pudieron guardar tus preferencias de aprendizaje en este navegador.'}
const schools:Record<Goal,LearningSchool[]>={taste:['sensory-tasting','foundations','food-service'],place:['origins-maps','vine-terroir','foundations'],make:['cellar-process','styles-methods','foundations'],cellar:['cellar-evolution','styles-methods','sensory-tasting'],host:['hosting-storytelling','food-service','sensory-tasting']}
const levels:Record<Level,LearningModule['level'][]>= {start:['foundation','intermediate','advanced'],deepen:['intermediate','foundation','advanced'],expert:['advanced','intermediate','foundation']}
function read():StoredLearning{
  const stored=repository.learning.get<StoredLearning>({saved:[],completed:[],blockProgress:{}})
  const modules=new Map(learningModules.map(module=>[module.id,module]))
  const completed=[...new Set(stored.completed??[])].filter(id=>modules.has(id))
  const blockProgress=Object.fromEntries([...modules].map(([id,module])=>[id,[...new Set(stored.blockProgress?.[id]??[])].filter(blockId=>module.blocks.some(block=>block.id===blockId))]))
  return {...stored,saved:[...new Set(stored.saved??[])],completed,blockProgress}
}

export function AdaptiveLearningPlanner(){
  const {locale}=useLocale(),c=copy[locale]
  const [stored,setStored]=useState(read),[saveFailed,setSaveFailed]=useState(false),prefs=stored.preferences??{goal:'taste',level:'start',weeklyMinutes:45}
  const recommendations=useMemo(()=>{
    const ranked=learningModules.filter(module=>!stored.completed.includes(module.id)).sort((a,b)=>{
      const schoolScore=(schools[prefs.goal].indexOf(a.school)+1||99)-(schools[prefs.goal].indexOf(b.school)+1||99)
      const levelScore=levels[prefs.level].indexOf(a.level)-levels[prefs.level].indexOf(b.level)
      const aStarted=(stored.blockProgress[a.id]?.length??0)>0,bStarted=(stored.blockProgress[b.id]?.length??0)>0
      return schoolScore||levelScore||Number(bStarted)-Number(aStarted)
    })
    const selected:LearningModule[]=[];let remaining=prefs.weeklyMinutes
    for(const module of ranked){if(module.minutes<=remaining&&selected.length<3){selected.push(module);remaining-=module.minutes}}
    return selected
  },[prefs.goal,prefs.level,prefs.weeklyMinutes,stored.completed,stored.blockProgress])
  const update=(patch:Partial<LearningPreferences>)=>{const next={...read(),preferences:{...prefs,...patch}};setStored(next);try{repository.learning.save(next);setSaveFailed(false)}catch{setSaveFailed(true)}}
  const completed=learningModules.filter(module=>stored.completed.includes(module.id)).length
  const completedBySchool=[...new Set(learningModules.map(module=>module.school))].map(school=>{const all=learningModules.filter(module=>module.school===school),complete=all.filter(module=>stored.completed.includes(module.id)).length;return {school,complete,total:all.length}})
  const totalMinutes=recommendations.reduce((sum,module)=>sum+module.minutes,0)
  const planNote={en:'A suggested set within your available weekly time.',de:'Ein Vorschlag innerhalb deiner verfügbaren Wochenzeit.',fr:'Une proposition qui tient dans votre temps hebdomadaire disponible.',es:'Una propuesta que cabe en tu tiempo semanal disponible.'}[locale]
  const empty={en:'You have completed every lesson. Revisit a favourite or explore a subject guide below.',de:'Du hast alle Lektionen abgeschlossen. Wiederhole einen Favoriten oder entdecke unten ein neues Thema.',fr:'Vous avez terminé toutes les leçons. Retrouvez un sujet favori ou explorez un guide ci-dessous.',es:'Has completado todas las lecciones. Repasa un tema favorito o explora una guía más abajo.'}[locale]
  const outputMessage=saveFailed?saveFailureCopy[locale]:recommendations.length?`${recommendations.length} ${recommendationCountCopy[locale]} · ${totalMinutes} ${c.minutes} · ${planNote}`:completed===learningModules.length?empty:`${noFitCopy[locale][0]} ${noFitCopy[locale][1]}`
  return <section className="adaptive-learning"><header><div><span className="eyebrow"><Brain/>{c.eyebrow}</span><h2>{c.title}</h2><p>{c.body}</p></div><Sparkles aria-hidden="true"/></header><div className="adaptive-controls"><fieldset><legend>{c.goal}</legend>{(['taste','place','make','cellar','host'] as Goal[]).map(goal=><button type="button" aria-pressed={prefs.goal===goal} className={prefs.goal===goal?'active':''} onClick={()=>update({goal})} key={goal}>{c[goal]}</button>)}</fieldset><fieldset><legend>{c.level}</legend>{(['start','deepen','expert'] as Level[]).map(level=><button type="button" aria-pressed={prefs.level===level} className={prefs.level===level?'active':''} onClick={()=>update({level})} key={level}>{c[level]}</button>)}</fieldset><label><span><Clock3/>{c.time}</span><input type="range" aria-label={c.time} aria-valuetext={`${prefs.weeklyMinutes} ${c.minutes}`} min="20" max="120" step="5" value={prefs.weeklyMinutes} onChange={event=>update({weeklyMinutes:Number(event.target.value)})}/><strong>{prefs.weeklyMinutes} {c.minutes}</strong></label></div><div className="adaptive-output"><div><span className="eyebrow"><Route/>{c.route}</span><p className="adaptive-plan-note" aria-live="polite">{outputMessage}</p>{recommendations.map((module,index)=><Link to={`/learn/${module.id}`} key={module.id}><span>{String(index+1).padStart(2,'0')}</span><div><small>{schoolCopy[module.school].name[locale]} · {module.minutes} {c.minutes}</small><strong>{module.title[locale]}</strong></div><ArrowRight/></Link>)}{recommendations[0]&&<Link className="primary-button" to={`/learn/${recommendations[0].id}`}>{c.begin}<ArrowRight/></Link>}</div><aside><span className="eyebrow"><Target/>{c.skill}</span>{completedBySchool.map(item=><div className="adaptive-school-count" key={item.school}><span>{schoolCopy[item.school].name[locale]}<b>{item.complete} / {item.total}</b></span></div>)}<small><Check/>{completed} / {learningModules.length} {c.done}</small></aside></div></section>
}
