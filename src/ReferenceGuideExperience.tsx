import {useState} from 'react'
import {Check,Layers3,NotebookPen,RotateCcw} from 'lucide-react'
import {repository} from './data/repository'
import {learningCases,type LearningCase} from './data/learningCases'
import type {Locale} from './i18n'
import type {Article,TastingJourney} from './types'
import './study-practice.css'

export const referenceGuideLabIds=[
  'vine-to-glass','taste-with-intention','sparkling-methods','red-white-rose','sweet-wine','fortified-wine','service','aroma-language','vine-year','terroir-layers','fermentation','maturation-vessels','lees-and-malolactic','labels-and-origin','food-pairing','wine-faults','climate-and-altitude','cellaring','sparkling-service','soil-water-roots','vintage-weather','sensory-calibration','appellation-maps','bottle-closures','oxygen-and-age',
]

const studyCopy={
  en:{eyebrow:'Practice after reading',title:'Make one call, then check the reasoning',intro:'Choose the answer you would use in a tasting conversation. The explanation separates what the observation supports from what it cannot prove.',question:'Practice question',choose:'Choose one answer',options:'options',check:'Check answer',correct:'That is the best answer.',wrong:'Not quite. Read the rationale, then try again.',rationale:'Why',retry:'Try again',notes:'Your notes',placeholder:'What will you look for in your next glass?',noteSaved:'Note saved on this device.',noteFailed:'This note could not be saved. Your browser may be blocking local storage.',add:'Add to a tasting',added:'Added to tasting',already:'This guide is already in that tasting.',chooseTasting:'Choose where to add it',chooseTastingBody:'Pick an existing tasting, or create a new one. Nothing is added until you choose.',noTastings:'You have no tastings yet.',newTasting:'Create a new tasting',newTitle:'Tasting name',newTitlePlaceholder:'For example: Sunday study',create:'Create tasting',cancel:'Cancel',chapters:'chapters',complete:'Mark guide complete',completed:'Guide completed',completeHint:'Check the answer before marking this guide complete.',progress:'Answer checked',completeSaved:'Guide marked complete.',saveFailed:'Could not save this progress on your device.'},
  de:{eyebrow:'Nach dem Lesen üben',title:'Entscheide dich und prüfe die Begründung',intro:'Wähle die Antwort, die du in einem Verkostungsgespräch verwenden würdest. Die Erklärung trennt Beobachtung und Schlussfolgerung.',question:'Übungsfrage',choose:'Eine Antwort wählen',options:'Optionen',check:'Antwort prüfen',correct:'Das ist die beste Antwort.',wrong:'Noch nicht. Lies die Begründung und versuche es erneut.',rationale:'Warum',retry:'Erneut versuchen',notes:'Deine Notizen',placeholder:'Worauf achtest du im nächsten Glas?',noteSaved:'Notiz auf diesem Gerät gespeichert.',noteFailed:'Die Notiz konnte nicht gespeichert werden. Der Browser blockiert möglicherweise den lokalen Speicher.',add:'Zu einem Tasting hinzufügen',added:'Zum Tasting hinzugefügt',already:'Dieser Guide ist bereits in diesem Tasting.',chooseTasting:'Ziel für den Guide wählen',chooseTastingBody:'Wähle ein bestehendes Tasting oder erstelle ein neues. Erst danach wird etwas hinzugefügt.',noTastings:'Du hast noch keine Tastings.',newTasting:'Neues Tasting erstellen',newTitle:'Name des Tastings',newTitlePlaceholder:'Zum Beispiel: Sonntag zum Lernen',create:'Tasting erstellen',cancel:'Abbrechen',chapters:'Kapitel',complete:'Guide abschließen',completed:'Guide abgeschlossen',completeHint:'Prüfe zuerst die Antwort, bevor du den Guide abschließt.',progress:'Antwort geprüft',completeSaved:'Guide als abgeschlossen markiert.',saveFailed:'Der Fortschritt konnte auf diesem Gerät nicht gespeichert werden.'},
  fr:{eyebrow:'Pratiquer après la lecture',title:'Choisissez, puis vérifiez le raisonnement',intro:'Choisissez la réponse que vous utiliseriez à table. L’explication distingue ce que l’observation permet de dire de ce qu’elle ne prouve pas.',question:'Question pratique',choose:'Choisir une réponse',options:'options',check:'Vérifier la réponse',correct:'C’est la meilleure réponse.',wrong:'Pas tout à fait. Lisez l’explication, puis recommencez.',rationale:'Pourquoi',retry:'Réessayer',notes:'Vos notes',placeholder:'Que chercherez-vous dans votre prochain verre ?',noteSaved:'Note enregistrée sur cet appareil.',noteFailed:'Cette note n’a pas pu être enregistrée. Le stockage local est peut-être bloqué.',add:'Ajouter à une dégustation',added:'Ajouté à la dégustation',already:'Ce guide est déjà dans cette dégustation.',chooseTasting:'Choisir où l’ajouter',chooseTastingBody:'Choisissez une dégustation existante ou créez-en une. Rien n’est ajouté avant votre choix.',noTastings:'Vous n’avez pas encore de dégustation.',newTasting:'Créer une dégustation',newTitle:'Nom de la dégustation',newTitlePlaceholder:'Par exemple : étude du dimanche',create:'Créer la dégustation',cancel:'Annuler',chapters:'chapitres',complete:'Terminer le guide',completed:'Guide terminé',completeHint:'Vérifiez la réponse avant de terminer ce guide.',progress:'Réponse vérifiée',completeSaved:'Guide marqué comme terminé.',saveFailed:'La progression n’a pas pu être enregistrée sur cet appareil.'},
  es:{eyebrow:'Practica después de leer',title:'Elige y comprueba el razonamiento',intro:'Elige la respuesta que usarías en una conversación de cata. La explicación separa lo que la observación permite decir de lo que no demuestra.',question:'Pregunta práctica',choose:'Elige una respuesta',options:'opciones',check:'Comprobar respuesta',correct:'Es la mejor respuesta.',wrong:'Todavía no. Lee la explicación e inténtalo de nuevo.',rationale:'Por qué',retry:'Intentarlo de nuevo',notes:'Tus notas',placeholder:'¿Qué buscarás en tu próxima copa?',noteSaved:'Nota guardada en este dispositivo.',noteFailed:'No se pudo guardar la nota. Es posible que el navegador bloquee el almacenamiento local.',add:'Añadir a una cata',added:'Añadida a la cata',already:'Esta guía ya está en esa cata.',chooseTasting:'Elige dónde añadirla',chooseTastingBody:'Elige una cata existente o crea una nueva. No se añadirá nada hasta que elijas.',noTastings:'Todavía no tienes catas.',newTasting:'Crear una cata nueva',newTitle:'Nombre de la cata',newTitlePlaceholder:'Por ejemplo: estudio del domingo',create:'Crear cata',cancel:'Cancelar',chapters:'capítulos',complete:'Completar guía',completed:'Guía completada',completeHint:'Comprueba la respuesta antes de completar esta guía.',progress:'Respuesta comprobada',completeSaved:'Guía marcada como completada.',saveFailed:'No se pudo guardar el progreso en este dispositivo.'},
} as const

const completedKey='vine-atlas.guide-progress'
const noteKey=(articleId:string)=>`vine-atlas.guide-note:${articleId}`
function safeRead<T>(key:string,fallback:T):T{
  if(typeof window==='undefined')return fallback
  try{const value=window.localStorage.getItem(key);return value?JSON.parse(value) as T:fallback}catch{return fallback}
}
function safeWrite(key:string,value:unknown){
  if(typeof window==='undefined')return false
  try{window.localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}
}
function readStoredIds(key:string){
  const value=safeRead<unknown>(key,[])
  return Array.isArray(value)&&value.every(item=>typeof item==='string')?value:[]
}
function readStoredString(key:string){
  const value=safeRead<unknown>(key,'')
  return typeof value==='string'?value:''
}
function makeId(prefix:string){
  if(typeof crypto!=='undefined'&&typeof crypto.randomUUID==='function')return crypto.randomUUID()
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}
function readJourneys(){
  try{
    const value=repository.journeys.all() as unknown
    if(!Array.isArray(value))return []
    return value.filter((item):item is TastingJourney=>{
      if(!item||typeof item!=='object')return false
      const journey=item as Partial<TastingJourney>
      return typeof journey.id==='string'&&typeof journey.title==='string'&&typeof journey.description==='string'&&Array.isArray(journey.chapters)&&journey.chapters.every(chapter=>Boolean(chapter&&typeof chapter==='object'&&typeof (chapter as {type?:unknown}).type==='string'))
    })
  }catch{return []}
}

type TastingNotice='added'|'already'|'failed'|null

export function ReferenceGuideExperience({article,locale}:{article:Article;locale:Locale}){
  const c=studyCopy[locale],practice:LearningCase|undefined=learningCases[article.id]
  const [selected,setSelected]=useState<number|null>(null),[submitted,setSubmitted]=useState(false)
  const [note,setNote]=useState(()=>readStoredString(noteKey(article.id))),[noteStatus,setNoteStatus]=useState<'idle'|'saved'|'failed'>('idle')
  const [completed,setCompleted]=useState(()=>readStoredIds(completedKey).includes(article.id))
  const [pickerOpen,setPickerOpen]=useState(false),[journeys,setJourneys]=useState<TastingJourney[]>([]),[newTitle,setNewTitle]=useState(''),[tastingNotice,setTastingNotice]=useState<TastingNotice>(null)
  if(!practice)return null
  const saveNote=()=>setNoteStatus(safeWrite(noteKey(article.id),note)?'saved':'failed')
  const checkAnswer=()=>{if(selected!==null)setSubmitted(true)}
  const retry=()=>{setSelected(null);setSubmitted(false)}
  const finish=()=>{
    if(!submitted||selected!==practice.answer){setTastingNotice(null);return}
    const next=[...new Set([...readStoredIds(completedKey),article.id])]
    if(safeWrite(completedKey,next)){setCompleted(true);setTastingNotice(null)}else setTastingNotice('failed')
  }
  const openPicker=()=>{setJourneys(readJourneys());setTastingNotice(null);setPickerOpen(true)}
  const addToJourney=(target:TastingJourney)=>{
    if(target.chapters.some(chapter=>chapter.type==='article'&&new Set([article.id,`guide:${article.id}`]).has(chapter.referenceId??''))){setTastingNotice('already');setPickerOpen(false);return}
    const updated:TastingJourney={...target,chapters:[...target.chapters,{id:makeId('guide'),type:'article',referenceId:`guide:${article.id}`,title:article.title,duration:article.minutes}],updatedAt:new Date().toISOString()}
    try{
      const all=readJourneys(),next=[updated,...all.filter(item=>item.id!==updated.id)]
      repository.journeys.save(next);setJourneys(next);setPickerOpen(false);setTastingNotice('added')
    }catch{setTastingNotice('failed')}
  }
  const createTasting=()=>{
    const title=newTitle.trim()||({en:'My study tasting',de:'Mein Lern-Tasting',fr:'Ma dégustation d’étude',es:'Mi cata de estudio'}[locale])
    const journey:TastingJourney={id:makeId('tasting'),title,description:article.summary,pace:'host',access:'private',chapters:[],updatedAt:new Date().toISOString()}
    addToJourney(journey);setNewTitle('')
  }
  return <section className="study-practice" aria-labelledby={`study-practice-title-${article.id}`}>
    <header className="study-practice-header"><div><span className="eyebrow">{c.eyebrow}</span><h2 id={`study-practice-title-${article.id}`}>{c.title}</h2><p>{c.intro}</p></div><span className="study-practice-mark">{practice.options.length} {c.options}</span></header>
    <div className="study-practice-grid">
      <form className="study-practice-question" onSubmit={event=>{event.preventDefault();checkAnswer()}}>
        <fieldset>
          <legend><span>{c.question}</span>{practice.question[locale]}</legend>
          <div className="study-practice-choices" role="group" aria-label={c.choose}>
            {practice.options.map((option,index)=>{const isCorrect=submitted&&index===practice.answer,isWrong=submitted&&selected===index&&index!==practice.answer;return <button type="button" key={index} aria-pressed={selected===index} className={`study-practice-choice ${selected===index?'selected':''} ${isCorrect?'correct':''} ${isWrong?'wrong':''}`} onClick={()=>{setSelected(index);setSubmitted(false)}}><span aria-hidden="true">{String.fromCharCode(65+index)}</span><strong>{option[locale]}</strong></button>})}
          </div>
          <div className="study-practice-actions"><button type="submit" className="primary-button" disabled={selected===null}>{c.check}</button>{submitted&&selected!==practice.answer&&<button type="button" className="text-action" onClick={retry}><RotateCcw size={15}/>{c.retry}</button>}</div>
          {submitted&&selected!==null&&<div className={`study-practice-rationale ${selected===practice.answer?'is-correct':'is-wrong'}`} role="status" aria-live="polite"><strong>{selected===practice.answer?c.correct:c.wrong}</strong><span>{c.rationale}</span><p>{practice.explanation[locale]}</p></div>}
        </fieldset>
      </form>
      <aside className="study-practice-notes" aria-label={c.notes}><div><NotebookPen size={19}/><div><span className="eyebrow">{c.notes}</span><p>{c.placeholder}</p></div></div><textarea value={note} onChange={event=>{setNote(event.target.value);setNoteStatus('idle')}} onBlur={saveNote} placeholder={c.placeholder} aria-label={c.notes}/>{noteStatus==='saved'&&<small className="study-practice-storage" role="status">{c.noteSaved}</small>}{noteStatus==='failed'&&<small className="study-practice-storage is-error" role="alert">{c.noteFailed}</small>}<div className="study-practice-note-actions"><button type="button" className="secondary-button" onClick={openPicker}><Layers3 size={16}/>{tastingNotice==='added'?c.added:c.add}</button><button type="button" className={`primary-button ${completed?'done':''}`} onClick={finish} disabled={completed||!submitted||selected!==practice.answer} aria-describedby={!completed?`study-practice-hint-${article.id}`:undefined}><Check size={16}/>{completed?c.completed:c.complete}</button></div>{!completed&&<small className="study-practice-hint" id={`study-practice-hint-${article.id}`}>{c.completeHint}</small>}{tastingNotice==='failed'&&<small className="study-practice-storage is-error" role="alert">{c.saveFailed}</small>}{tastingNotice==='already'&&<small className="study-practice-storage" role="status">{c.already}</small>}</aside>
    </div>
    {pickerOpen&&<aside className="study-practice-picker" aria-label={c.chooseTasting}><div className="study-practice-picker-head"><div><span className="eyebrow">{c.chooseTasting}</span><p>{c.chooseTastingBody}</p></div><button type="button" className="text-action" onClick={()=>setPickerOpen(false)}>{c.cancel}</button></div>{journeys.length>0&&<div className="study-practice-journeys">{journeys.map(journey=><button type="button" key={journey.id} onClick={()=>addToJourney(journey)}><strong>{journey.title}</strong><small>{journey.chapters.length} {c.chapters}</small><span>→</span></button>)}</div>}{journeys.length===0&&<p className="study-practice-empty">{c.noTastings}</p>}<div className="study-practice-new"><label>{c.newTitle}<input value={newTitle} onChange={event=>setNewTitle(event.target.value)} placeholder={c.newTitlePlaceholder}/></label><button type="button" className="primary-button" onClick={createTasting}>{c.newTasting}</button></div></aside>}
  </section>
}
