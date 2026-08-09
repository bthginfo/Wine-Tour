import {useEffect,useState} from 'react'
import {Activity,RefreshCw,ShieldCheck} from 'lucide-react'
import {useLocale} from './i18n'

type AuditEntry={id:string;action:string;entityType:string;entityId:string;details:unknown;createdAt:string;actorUsername:string|null}

export function AuditTrail(){
  const {locale}=useLocale()
  const c={en:{eyebrow:'Accountability',title:'Recent platform activity',body:'Security, account, publication and state changes are recorded with actor and time.',refresh:'Refresh',empty:'No administrative activity has been recorded yet.',system:'System'},de:{eyebrow:'Nachvollziehbarkeit',title:'Letzte Plattformaktivität',body:'Sicherheits-, Konto-, Publikations- und Statusänderungen werden mit Akteur und Zeitpunkt protokolliert.',refresh:'Aktualisieren',empty:'Noch keine administrative Aktivität protokolliert.',system:'System'},fr:{eyebrow:'Traçabilité',title:'Activité récente de la plateforme',body:'Les changements de sécurité, compte, publication et état sont consignés avec auteur et date.',refresh:'Actualiser',empty:'Aucune activité administrative enregistrée.',system:'Système'},es:{eyebrow:'Trazabilidad',title:'Actividad reciente de la plataforma',body:'Los cambios de seguridad, cuenta, publicación y estado se registran con autor y fecha.',refresh:'Actualizar',empty:'Todavía no hay actividad administrativa registrada.',system:'Sistema'}}[locale]
  const [entries,setEntries]=useState<AuditEntry[]>([]),[loading,setLoading]=useState(true)
  const load=async()=>{setLoading(true);try{const response=await fetch('/api/admin/audit?limit=60',{credentials:'same-origin'});if(response.ok){const payload=await response.json() as {entries?:AuditEntry[]};setEntries(payload.entries??[])}}finally{setLoading(false)}}
  useEffect(()=>{void load()},[])
  return <section className="audit-trail"><header><div><span className="eyebrow">{c.eyebrow}</span><h2>{c.title}</h2><p>{c.body}</p></div><button className="secondary-button" onClick={()=>void load()} disabled={loading}><RefreshCw/>{c.refresh}</button></header>{entries.length?<div className="audit-list">{entries.map(entry=><article key={entry.id}><span><Activity/></span><div><strong>{entry.action.replaceAll('.',' · ')}</strong><small>{entry.actorUsername??c.system} · {new Intl.DateTimeFormat(locale,{dateStyle:'medium',timeStyle:'short'}).format(new Date(entry.createdAt))}</small></div><code>{entry.entityType} / {entry.entityId}</code></article>)}</div>:<div className="audit-empty"><ShieldCheck/><p>{c.empty}</p></div>}</section>
}
