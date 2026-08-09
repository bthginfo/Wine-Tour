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
  en:{eyebrow:'Your learning route',title:'Build a path around the question you care about',body:'The route adapts to your goal and progress. It mixes explanation, sensory practice and a table exercise instead of forcing a fixed course.',goal:'I want to',taste:'taste with precision',place:'understand place',make:'understand winemaking',cellar:'build and age a cellar',host:'host memorable tastings',level:'Starting point',start:'build foundations',deepen:'connect the dots',expert:'challenge my model',time:'Weekly rhythm',minutes:'minutes',route:'Recommended next',skill:'Competency map',begin:'Start this route',done:'complete'},
  de:{eyebrow:'Dein Lernweg',title:'Baue einen Pfad um die Frage, die dich wirklich interessiert',body:'Der Weg passt sich Ziel und Fortschritt an. Er verbindet Erklärung, Sensorik und Tisch-Experiment statt eines starren Kurses.',goal:'Ich möchte',taste:'präziser verkosten',place:'Herkunft verstehen',make:'Weinbereitung verstehen',cellar:'einen Keller aufbauen',host:'starke Tastings hosten',level:'Ausgangspunkt',start:'Grundlagen aufbauen',deepen:'Zusammenhänge knüpfen',expert:'mein Modell prüfen',time:'Wochenrhythmus',minutes:'Minuten',route:'Als Nächstes empfohlen',skill:'Kompetenzkarte',begin:'Diesen Weg starten',done:'abgeschlossen'},
  fr:{eyebrow:'Votre parcours',title:'Construisez un parcours autour de votre vraie question',body:'Le parcours s’adapte à votre objectif et à vos progrès. Il mêle explication, pratique sensorielle et expérience à table.',goal:'Je veux',taste:'déguster avec précision',place:'comprendre le lieu',make:'comprendre la vinification',cellar:'constituer une cave',host:'animer des dégustations',level:'Point de départ',start:'poser les bases',deepen:'relier les idées',expert:'tester mon modèle',time:'Rythme hebdomadaire',minutes:'minutes',route:'Prochaines recommandations',skill:'Carte des compétences',begin:'Commencer ce parcours',done:'terminé'},
  es:{eyebrow:'Tu ruta de aprendizaje',title:'Crea un camino alrededor de la pregunta que te importa',body:'La ruta se adapta a tu objetivo y progreso. Mezcla explicación, práctica sensorial y experimento en la mesa.',goal:'Quiero',taste:'catar con precisión',place:'entender el lugar',make:'entender la elaboración',cellar:'crear y criar una bodega',host:'dirigir grandes catas',level:'Punto de partida',start:'construir fundamentos',deepen:'conectar ideas',expert:'poner a prueba mi modelo',time:'Ritmo semanal',minutes:'minutos',route:'Siguiente recomendación',skill:'Mapa de competencias',begin:'Empezar esta ruta',done:'completado'},
} satisfies Record<Locale,Record<string,string>>

const schools:Record<Goal,LearningSchool[]>={taste:['sensory-tasting','foundations','food-service'],place:['origins-maps','vine-terroir','foundations'],make:['cellar-process','styles-methods','foundations'],cellar:['cellar-evolution','styles-methods','sensory-tasting'],host:['hosting-storytelling','food-service','sensory-tasting']}
const levels:Record<Level,LearningModule['level'][]>= {start:['foundation','intermediate','advanced'],deepen:['intermediate','foundation','advanced'],expert:['advanced','intermediate','foundation']}
const read=()=>repository.learning.get<StoredLearning>({saved:[],completed:[],blockProgress:{}})

export function AdaptiveLearningPlanner(){
  const {locale}=useLocale(),c=copy[locale]
  const [stored,setStored]=useState(read),prefs=stored.preferences??{goal:'taste',level:'start',weeklyMinutes:45}
  const recommendations=useMemo(()=>learningModules.filter(module=>!stored.completed.includes(module.id)).sort((a,b)=>{
    const schoolScore=(schools[prefs.goal].indexOf(a.school)+1||99)-(schools[prefs.goal].indexOf(b.school)+1||99)
    if(schoolScore)return schoolScore
    return levels[prefs.level].indexOf(a.level)-levels[prefs.level].indexOf(b.level)
  }).slice(0,3),[prefs.goal,prefs.level,stored.completed])
  const update=(patch:Partial<LearningPreferences>)=>{const next={...stored,preferences:{...prefs,...patch}};setStored(next);repository.learning.save(next)}
  const competence=[...new Set(learningModules.map(module=>module.school))].map(school=>{const all=learningModules.filter(module=>module.school===school),complete=all.filter(module=>stored.completed.includes(module.id)).length;return {school,value:all.length?Math.round(complete/all.length*100):0}}).slice(0,5)
  return <section className="adaptive-learning"><header><div><span className="eyebrow"><Brain/>{c.eyebrow}</span><h2>{c.title}</h2><p>{c.body}</p></div><Sparkles/></header><div className="adaptive-controls"><fieldset><legend>{c.goal}</legend>{(['taste','place','make','cellar','host'] as Goal[]).map(goal=><button aria-pressed={prefs.goal===goal} className={prefs.goal===goal?'active':''} onClick={()=>update({goal})} key={goal}>{c[goal]}</button>)}</fieldset><fieldset><legend>{c.level}</legend>{(['start','deepen','expert'] as Level[]).map(level=><button aria-pressed={prefs.level===level} className={prefs.level===level?'active':''} onClick={()=>update({level})} key={level}>{c[level]}</button>)}</fieldset><label><span><Clock3/>{c.time}</span><input type="range" min="20" max="120" step="10" value={prefs.weeklyMinutes} onChange={event=>update({weeklyMinutes:Number(event.target.value)})}/><strong>{prefs.weeklyMinutes} {c.minutes}</strong></label></div><div className="adaptive-output"><div><span className="eyebrow"><Route/>{c.route}</span>{recommendations.map((module,index)=><Link to={`/learn/${module.id}`} key={module.id}><span>{String(index+1).padStart(2,'0')}</span><div><small>{schoolCopy[module.school].name[locale]} · {module.minutes} min</small><strong>{module.title[locale]}</strong></div><ArrowRight/></Link>)}{recommendations[0]&&<Link className="primary-button" to={`/learn/${recommendations[0].id}`}>{c.begin}<ArrowRight/></Link>}</div><aside><span className="eyebrow"><Target/>{c.skill}</span>{competence.map(item=><div key={item.school}><span>{schoolCopy[item.school].name[locale]}<b>{item.value}%</b></span><i><em style={{width:`${item.value}%`}}/></i></div>)}<small><Check/>{stored.completed.length} / {learningModules.length} {c.done}</small></aside></div></section>
}
