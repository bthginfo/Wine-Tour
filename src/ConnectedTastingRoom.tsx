import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArrowRight, Check, LockKeyhole, NotebookPen, Plus, Share2, X } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { aromas, grapes, producers, regions, wines } from './data/catalog'
import { repository } from './data/repository'
import { aromaContent } from './localizedContent'
import { useLocale } from './i18n'
import { useUiCopy } from './uiCopy'
import type { TastingEvent, TastingJourney, TastingNote } from './types'

export function ConnectedTastingRoom({renderJourney}:{renderJourney:(journey:TastingJourney)=>ReactNode}){
  const {id=''}=useParams()
  const {locale}=useLocale()
  const ui=useUiCopy()
  const localJourney=useMemo(()=>repository.journeys.all().find(item=>item.id===id),[id])
  const [event,setEvent]=useState<TastingEvent|null>(null)
  const [loading,setLoading]=useState(!localJourney)
  const [current,setCurrent]=useState(0)
  const [step,setStep]=useState(0)
  const [selectedAromas,setSelectedAromas]=useState<string[]>([])
  const [fields,setFields]=useState({appearance:ui.defaultAppearance,palate:'',reflection:''})
  const [saved,setSaved]=useState(false)
  const [,setCellarVersion]=useState(0)
  const roomCopy={
    en:{loading:'Opening tasting…',missing:'This tasting could not be found.',missingBody:'Check the six-character invitation code or ask the host for a new link.',empty:'This tasting has no wines or learning journey yet.',back:'Back to tastings',add:'Add to my cellar',added:'In my cellar'},
    de:{loading:'Tasting wird geöffnet…',missing:'Dieses Tasting wurde nicht gefunden.',missingBody:'Prüfe den sechsstelligen Einladungscode oder bitte den Host um einen neuen Link.',empty:'Dieses Tasting enthält noch keine Weine oder Lernreise.',back:'Zurück zu Tastings',add:'In meinen Keller legen',added:'In meinem Keller'},
    fr:{loading:'Ouverture de la dégustation…',missing:'Cette dégustation est introuvable.',missingBody:'Vérifiez le code d’invitation à six caractères ou demandez un nouveau lien à l’hôte.',empty:'Cette dégustation ne contient pas encore de vins ni de parcours.',back:'Retour aux dégustations',add:'Ajouter à ma cave',added:'Dans ma cave'},
    es:{loading:'Abriendo la cata…',missing:'No se encontró esta cata.',missingBody:'Comprueba el código de invitación de seis caracteres o pide un nuevo enlace al anfitrión.',empty:'Esta cata todavía no contiene vinos ni recorrido de aprendizaje.',back:'Volver a catas',add:'Añadir a mi bodega',added:'En mi bodega'},
  }[locale]

  useEffect(()=>{
    if(localJourney){setLoading(false);return}
    let active=true
    setLoading(true)
    void fetch(`/api/tastings/join?code=${encodeURIComponent(id)}`,{headers:{Accept:'application/json'},credentials:'same-origin'})
      .then(async response=>response.ok?response.json() as Promise<{event:TastingEvent}>:Promise.reject())
      .then(payload=>{if(active)setEvent(payload.event)})
      .catch(()=>{if(active)setEvent(null)})
      .finally(()=>{if(active)setLoading(false)})
    return()=>{active=false}
  },[id,localJourney])

  const journey=localJourney??event?.journey
  const flight=useMemo(()=>event?.featuredWineIds.map(wineId=>wines.find(wine=>wine.id===wineId)).filter((wine):wine is typeof wines[number]=>Boolean(wine))??[],[event])
  const wine=flight[current]
  const shareUrl=`${window.location.origin}/tastings/${id}`

  if(journey)return <>{renderJourney(journey)}</>
  if(loading)return <div className="page guarded" aria-busy="true"><span className="loading-orbit"/><h1>{roomCopy.loading}</h1></div>
  if(!event)return <div className="page guarded"><LockKeyhole/><h1>{roomCopy.missing}</h1><p>{roomCopy.missingBody}</p><Link to="/tastings" className="primary-button ink">{roomCopy.back}</Link></div>
  if(!wine)return <div className="page guarded"><NotebookPen/><h1>{event.title}</h1><p>{roomCopy.empty}</p><Link to="/tastings" className="primary-button ink">{roomCopy.back}</Link></div>

  const inCellar=repository.cellar.all().some(item=>item.wineId===wine.id)
  function saveNote(){
    if(saved)return
    const notes=repository.notes.all(),existing=notes.find(note=>note.tastingId===event!.id&&note.wineId===wine!.id)
    const next:TastingNote={id:existing?.id??crypto.randomUUID(),tastingId:event!.id,wineId:wine!.id,appearance:fields.appearance,aromaIds:selectedAromas,palate:fields.palate,reflection:fields.reflection,rating:4,visibility:'private',createdAt:existing?.createdAt??new Date().toISOString()}
    repository.notes.save(existing?notes.map(note=>note.id===existing.id?next:note):[...notes,next])
    const cellar=repository.cellar.all(),cellarItem=cellar.find(item=>item.wineId===wine!.id)
    if(cellarItem){
      const cellarNote={id:next.id,appearance:next.appearance,aromaIds:next.aromaIds,palate:next.palate,finish:'',reflection:next.reflection,acidity:3,tannin:wine!.style==='red'?3:1,body:3,rating:next.rating,createdAt:next.createdAt}
      const cellarNotes=cellarItem.notes??[]
      cellarItem.notes=cellarNotes.some(note=>note.id===next.id)?cellarNotes.map(note=>note.id===next.id?cellarNote:note):[...cellarNotes,cellarNote]
      cellarItem.rating=next.rating
      repository.cellar.save(cellar)
      setCellarVersion(value=>value+1)
    }
    setSaved(true)
  }
  function addCurrentWine(){
    const cellar=repository.cellar.all(),existing=cellar.find(item=>item.wineId===wine!.id)
    if(existing)return
    cellar.push({id:crypto.randomUUID(),wineId:wine!.id,state:'tasted',quantity:1,location:ui.homeCellar,vintage:wine!.vintage??undefined,bottleSizeMl:750,notes:[]})
    repository.cellar.save(cellar);setCellarVersion(value=>value+1)
  }
  function chooseWine(index:number){setCurrent(index);setStep(0);setSaved(false);setSelectedAromas([]);setFields({appearance:ui.defaultAppearance,palate:'',reflection:''})}

  return <div className="tasting-room">
    <header className="room-header"><Link to="/tastings"><X/></Link><div><small>{ui.liveTasting} · {ui.wine} {current+1} {ui.of} {flight.length}</small><strong>{event.title}</strong></div><button onClick={()=>void navigator.clipboard?.writeText(shareUrl)}><Share2/></button></header>
    <div className="flight-progress">{flight.map((item,index)=><button key={item.id} onClick={()=>chooseWine(index)} className={index===current?'active':index<current?'done':''}><span>{index+1}</span></button>)}</div>
    <main>
      <section className="current-wine"><div className={`room-bottle style-${wine.style}`}/><div><span>{regions.find(region=>region.id===wine.regionId)?.name}</span><h1>{wine.name}</h1><p>{producers.find(producer=>producer.id===wine.producerId)?.name} · {wine.vintage??'—'}</p><div className="thread-cloud">{grapes.filter(grape=>wine.grapeIds.includes(grape.id)).map(grape=><Link className="thread-link moss" to={`/grapes/${grape.id}`} key={grape.id}>{grape.name}</Link>)}</div><button className={inCellar?'secondary-button cellar-added':'secondary-button'} onClick={addCurrentWine}>{inCellar?<Check/>:<Plus/>}{inCellar?roomCopy.added:roomCopy.add}</button></div></section>
      <div className="note-steps">{[ui.look,ui.smell,ui.taste,ui.reflect].map((name,index)=><button onClick={()=>setStep(index)} className={step===index?'active':''} key={name}><span>{index+1}</span>{name}</button>)}</div>
      <section className="note-composer">
        {step===0&&<><span className="eyebrow">{ui.stepOne} · {ui.look}</span><h2>{ui.glassShow}</h2><textarea value={fields.appearance} onChange={e=>{setFields({...fields,appearance:e.target.value});setSaved(false)}}/></>}
        {step===1&&<><span className="eyebrow">{ui.stepTwo} · {ui.smell}</span><h2>{ui.closestReferences}</h2><p>{ui.noCorrectNumber}</p><div className="note-aromas">{aromas.filter(aroma=>wine.aromaIds.includes(aroma.id)).map(aroma=><button className={selectedAromas.includes(aroma.id)?'active':''} onClick={()=>{setSelectedAromas(values=>values.includes(aroma.id)?values.filter(id=>id!==aroma.id):[...values,aroma.id]);setSaved(false)}} key={aroma.id}>{selectedAromas.includes(aroma.id)&&<Check/>}{aromaContent(aroma,locale).name}</button>)}</div></>}
        {step===2&&<><span className="eyebrow">{ui.stepThree} · {ui.taste}</span><h2>{ui.wineBuilt}</h2><textarea placeholder={ui.palatePlaceholder} value={fields.palate} onChange={e=>{setFields({...fields,palate:e.target.value});setSaved(false)}}/></>}
        {step===3&&<><span className="eyebrow">{ui.stepFour} · {ui.reflect}</span><h2>{ui.remember}</h2><textarea placeholder={ui.reflectionPlaceholder} value={fields.reflection} onChange={e=>{setFields({...fields,reflection:e.target.value});setSaved(false)}}/></>}
        <div className="composer-actions"><small><LockKeyhole/>{ui.privateYou}</small>{step<3?<button className="primary-button" onClick={()=>setStep(step+1)}>{ui.nextStep}<ArrowRight/></button>:<button className="primary-button" onClick={saveNote}>{saved?<><Check/>{ui.noteSaved}</>:<>{ui.saveNote}<NotebookPen/></>}</button>}</div>
      </section>
    </main>
    <aside className="room-share"><QRCodeSVG value={shareUrl} size={110} bgColor="#f4efe6" fgColor="#241920"/><h3>{ui.bringTable}</h3><p>{ui.shareQr}</p></aside>
  </div>
}
