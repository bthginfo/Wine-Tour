import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './auth'
import { useLocale } from './i18n'

type Snapshot={average:number|null;count:number;yourScore:number|null}
const copy={
  en:{label:'Community rating',empty:'No ratings yet — be the first',one:'1 verified vote',many:'verified votes',mine:'Your vote',login:'Sign in to vote',error:'Could not save your vote'},
  de:{label:'Community-Bewertung',empty:'Noch keine Bewertungen – stimme als Erste:r ab',one:'1 verifizierte Stimme',many:'verifizierte Stimmen',mine:'Deine Stimme',login:'Zum Abstimmen anmelden',error:'Deine Stimme konnte nicht gespeichert werden'},
  fr:{label:'Note de la communauté',empty:'Aucun vote — soyez la première personne',one:'1 vote vérifié',many:'votes vérifiés',mine:'Votre vote',login:'Connectez-vous pour voter',error:'Impossible d’enregistrer votre vote'},
  es:{label:'Valoración de la comunidad',empty:'Aún no hay votos — sé la primera persona',one:'1 voto verificado',many:'votos verificados',mine:'Tu voto',login:'Inicia sesión para votar',error:'No se pudo guardar tu voto'},
} as const

export function CommunityRating({entityType,entityId}:{entityType:'region'|'producer'|'wine';entityId:string}){
  const {locale}=useLocale(),{user}=useAuth(),navigate=useNavigate(),location=useLocation(),c=copy[locale]
  const [snapshot,setSnapshot]=useState<Snapshot>({average:null,count:0,yourScore:null}),[busy,setBusy]=useState(false),[error,setError]=useState('')
  useEffect(()=>{let active=true;void fetch(`/api/ratings?entityType=${entityType}&entityId=${encodeURIComponent(entityId)}`,{credentials:'same-origin'}).then(response=>response.ok?response.json():Promise.reject()).then(value=>{if(active)setSnapshot(value as Snapshot)}).catch(()=>{});return()=>{active=false}},[entityType,entityId])
  async function vote(score:number){
    if(!user){navigate(`/profile?returnTo=${encodeURIComponent(`${location.pathname}${location.search}`)}`);return}
    setBusy(true);setError('')
    try{const response=await fetch(`/api/ratings?entityType=${entityType}&entityId=${encodeURIComponent(entityId)}`,{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({score})});if(!response.ok)throw new Error();setSnapshot(await response.json() as Snapshot)}catch{setError(c.error)}finally{setBusy(false)}
  }
  return <div className="community-rating">
    <div className="community-rating-head"><strong>{c.label}</strong>{snapshot.average!==null&&<span>{snapshot.average.toFixed(1)}</span>}</div>
    <div className="rating-stars" role="group" aria-label={c.mine}>{[1,2,3,4,5].map(score=><button type="button" key={score} disabled={busy} onClick={()=>void vote(score)} className={(snapshot.yourScore??0)>=score?'selected':''} aria-label={`${score} / 5`}><Star fill={(snapshot.yourScore??0)>=score?'currentColor':'none'}/></button>)}</div>
    <small>{snapshot.count===0?c.empty:snapshot.count===1?c.one:`${snapshot.count} ${c.many}`}{!user&&<> · {c.login}</>}</small>
    {error&&<em role="status">{error}</em>}
  </div>
}
