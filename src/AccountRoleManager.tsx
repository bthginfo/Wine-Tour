import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Building2, Check, ChevronLeft, ChevronRight, Clock3, Search, ShieldCheck, UserRoundCog, Users } from 'lucide-react'
import { useAuth } from './auth'
import { useLocale, type Locale } from './i18n'
import type { MembershipRole } from './types'

type ManagedAccount = {
  id:string
  username:string
  displayName?:string
  role:MembershipRole
  roles:MembershipRole[]
  workspaceIds:string[]
  disabled:boolean
  createdAt:string
  lastLoginAt?:string
}

const roles:MembershipRole[]=['member','host','winery','merchant','admin']
const roleMetaCopy:Record<Locale,{all:string;professional:string;accounts:string;workspaces:string;lastSeen:string;created:string;never:string;unsaved:string}>={
  en:{all:'All roles',professional:'Professional access',accounts:'accounts',workspaces:'workspaces',lastSeen:'Last sign-in',created:'Joined',never:'Never',unsaved:'Unsaved changes'},
  de:{all:'Alle Rollen',professional:'Professionelle Zugänge',accounts:'Konten',workspaces:'Workspaces',lastSeen:'Letzte Anmeldung',created:'Registriert',never:'Noch nie',unsaved:'Ungespeicherte Änderungen'},
  fr:{all:'Tous les rôles',professional:'Accès professionnels',accounts:'comptes',workspaces:'espaces',lastSeen:'Dernière connexion',created:'Inscription',never:'Jamais',unsaved:'Modifications non enregistrées'},
  es:{all:'Todos los roles',professional:'Accesos profesionales',accounts:'cuentas',workspaces:'espacios',lastSeen:'Último acceso',created:'Registro',never:'Nunca',unsaved:'Cambios sin guardar'}
}
const loadingCopy:Record<Locale,string>={en:'Loading accounts…',de:'Konten werden geladen…',fr:'Chargement des comptes…',es:'Cargando cuentas…'}
const text:Record<Locale,{
  eyebrow:string;title:string;body:string;search:string;account:string;roles:string;status:string;active:string;disabled:string;
  save:string;saving:string;saved:string;empty:string;previous:string;next:string;page:string;loadError:string;saveError:string;
  roleNames:Record<MembershipRole,string>;roleHelp:Record<MembershipRole,string>
}>={
  en:{eyebrow:'Access control',title:'People, roles & workspaces',body:'Grant only the capabilities each account needs. Every professional role receives a separate workspace; personal cellar data remains private.',search:'Search accounts',account:'Account',roles:'Roles',status:'Account status',active:'Active',disabled:'Disabled',save:'Save access',saving:'Saving…',saved:'Access updated',empty:'No matching accounts.',previous:'Previous',next:'Next',page:'Page',loadError:'Accounts could not be loaded.',saveError:'Access could not be updated.',roleNames:{member:'Private member',host:'Professional host',winery:'Winery',merchant:'Wine merchant',admin:'Administrator'},roleHelp:{member:'Personal cellar, notes and private tastings',host:'Create and publish hosted tastings',winery:'Build an estate profile, pages and wine content',merchant:'Manage a merchant profile and wine offers',admin:'Moderate users, editorial content and commercial placements'}},
  de:{eyebrow:'Zugriffssteuerung',title:'Personen, Rollen & Workspaces',body:'Vergib nur die Funktionen, die ein Konto benötigt. Jede professionelle Rolle erhält einen eigenen Workspace; persönliche Kellerdaten bleiben privat.',search:'Konten durchsuchen',account:'Konto',roles:'Rollen',status:'Kontostatus',active:'Aktiv',disabled:'Deaktiviert',save:'Zugriff speichern',saving:'Wird gespeichert…',saved:'Zugriff aktualisiert',empty:'Keine passenden Konten.',previous:'Zurück',next:'Weiter',page:'Seite',loadError:'Konten konnten nicht geladen werden.',saveError:'Zugriff konnte nicht aktualisiert werden.',roleNames:{member:'Privatperson',host:'Professioneller Host',winery:'Weingut',merchant:'Weinhändler',admin:'Administrator'},roleHelp:{member:'Persönlicher Keller, Notizen und private Tastings',host:'Geführte Tastings erstellen und veröffentlichen',winery:'Weingutsprofil, Seiten und Weininhalte verwalten',merchant:'Händlerprofil und Weinangebote verwalten',admin:'Nutzer, Redaktion und Platzierungen moderieren'}},
  fr:{eyebrow:'Contrôle des accès',title:'Personnes, rôles et espaces',body:'Accordez uniquement les fonctions nécessaires. Chaque rôle professionnel reçoit son propre espace ; la cave personnelle reste privée.',search:'Rechercher un compte',account:'Compte',roles:'Rôles',status:'État du compte',active:'Actif',disabled:'Désactivé',save:'Enregistrer les accès',saving:'Enregistrement…',saved:'Accès mis à jour',empty:'Aucun compte correspondant.',previous:'Précédent',next:'Suivant',page:'Page',loadError:'Impossible de charger les comptes.',saveError:'Impossible de modifier les accès.',roleNames:{member:'Membre privé',host:'Hôte professionnel',winery:'Domaine',merchant:'Marchand de vin',admin:'Administrateur'},roleHelp:{member:'Cave, notes et dégustations privées',host:'Créer et publier des dégustations guidées',winery:'Gérer le profil, les pages et les vins du domaine',merchant:'Gérer un profil marchand et des offres',admin:'Modérer les comptes, la rédaction et les placements'}},
  es:{eyebrow:'Control de acceso',title:'Personas, roles y espacios',body:'Concede solo las funciones necesarias. Cada rol profesional recibe su propio espacio; la bodega personal sigue siendo privada.',search:'Buscar cuentas',account:'Cuenta',roles:'Roles',status:'Estado de la cuenta',active:'Activa',disabled:'Desactivada',save:'Guardar acceso',saving:'Guardando…',saved:'Acceso actualizado',empty:'No hay cuentas coincidentes.',previous:'Anterior',next:'Siguiente',page:'Página',loadError:'No se pudieron cargar las cuentas.',saveError:'No se pudo actualizar el acceso.',roleNames:{member:'Persona privada',host:'Anfitrión profesional',winery:'Bodega',merchant:'Comerciante de vino',admin:'Administrador'},roleHelp:{member:'Bodega, notas y catas privadas',host:'Crear y publicar catas guiadas',winery:'Gestionar el perfil, las páginas y los vinos de la bodega',merchant:'Gestionar un perfil comercial y ofertas',admin:'Moderar cuentas, contenidos y promociones'}}
}

export function AccountRoleManager(){
  const {locale}=useLocale()
  const {user,refresh}=useAuth()
  const c=text[locale]
  const meta=roleMetaCopy[locale]
  const [accounts,setAccounts]=useState<ManagedAccount[]>([])
  const [drafts,setDrafts]=useState<Record<string,{roles:MembershipRole[];disabled:boolean}>>({})
  const [query,setQuery]=useState('')
  const [roleFilter,setRoleFilter]=useState<'all'|MembershipRole>('all')
  const [page,setPage]=useState(1)
  const [busy,setBusy]=useState('')
  const [loading,setLoading]=useState(true)
  const [notice,setNotice]=useState('')
  const [error,setError]=useState('')
  const pageSize=8

  useEffect(()=>{
    let active=true
    void fetch('/api/admin/users',{headers:{Accept:'application/json'},credentials:'same-origin'})
      .then(async response=>{if(!response.ok)throw new Error();return response.json() as Promise<{users:ManagedAccount[]}>})
      .then(payload=>{if(active){setAccounts(payload.users);setDrafts(Object.fromEntries(payload.users.map(account=>[account.id,{roles:account.roles,disabled:account.disabled}])))} })
      .catch(()=>{if(active)setError(c.loadError)})
      .finally(()=>{if(active)setLoading(false)})
    return()=>{active=false}
  },[c.loadError])

  const filtered=useMemo(()=>accounts.filter(account=>(roleFilter==='all'||account.roles.includes(roleFilter))&&`${account.username} ${account.displayName??''} ${account.roles.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())),[accounts,query,roleFilter])
  const pages=Math.max(1,Math.ceil(filtered.length/pageSize))
  const visible=filtered.slice((page-1)*pageSize,page*pageSize)
  useEffect(()=>setPage(1),[query,roleFilter])

  function toggleRole(accountId:string,role:MembershipRole){
    setNotice('');setError('')
    setDrafts(current=>{
      const entry=current[accountId]
      if(!entry)return current
      const selected=entry.roles.includes(role)
      const next=selected?entry.roles.filter(item=>item!==role):[...entry.roles,role]
      return {...current,[accountId]:{...entry,roles:role==='member'&&!selected?next:next.includes('member')?next:['member',...next]}}
    })
  }

  async function save(account:ManagedAccount){
    const draft=drafts[account.id]
    if(!draft)return
    setBusy(account.id);setNotice('');setError('')
    try{
      const response=await fetch('/api/admin/users',{method:'PATCH',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({userId:account.id,...draft})})
      const payload=await response.json() as {users?:ManagedAccount[];error?:string}
      if(!response.ok||!payload.users)throw new Error(payload.error)
      setAccounts(payload.users)
      setDrafts(Object.fromEntries(payload.users.map(item=>[item.id,{roles:item.roles,disabled:item.disabled}])))
      if(account.id===user?.id)await refresh()
      setNotice(c.saved)
    }catch{setError(c.saveError)}finally{setBusy('')}
  }

  return <section className="role-manager">
    <header>
      <div><span className="eyebrow">{c.eyebrow}</span><h2>{c.title}</h2><p>{c.body}</p></div>
      <label className="role-search"><Search/><span className="sr-only">{c.search}</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={c.search}/></label>
    </header>
    <div className="role-manager-summary">
      <div><Users/><strong>{accounts.length}</strong><span>{meta.accounts}</span></div>
      <div><ShieldCheck/><strong>{accounts.filter(account=>account.roles.some(role=>role!=='member')).length}</strong><span>{meta.professional}</span></div>
      <div><Building2/><strong>{new Set(accounts.flatMap(account=>account.workspaceIds)).size}</strong><span>{meta.workspaces}</span></div>
      <nav aria-label={c.roles}><button type="button" aria-pressed={roleFilter==='all'} className={roleFilter==='all'?'active':''} onClick={()=>setRoleFilter('all')}>{meta.all}</button>{roles.map(role=><button type="button" key={role} aria-pressed={roleFilter===role} className={roleFilter===role?'active':''} onClick={()=>setRoleFilter(role)}>{c.roleNames[role]} <small>{accounts.filter(account=>account.roles.includes(role)).length}</small></button>)}</nav>
    </div>
    {loading&&<div className="role-notice" role="status" aria-live="polite"><Clock3/>{loadingCopy[locale]}</div>}
    {(notice||error)&&<div className={error?'role-notice error':'role-notice'} role={error?'alert':'status'} aria-live={error?'assertive':'polite'}>{error?<AlertCircle/>:<Check/>}{error||notice}</div>}
    <div className="role-account-list" aria-busy={loading}>
      {visible.map(account=>{const draft=drafts[account.id]??{roles:account.roles,disabled:account.disabled};const changed=draft.disabled!==account.disabled||draft.roles.slice().sort().join('|')!==account.roles.slice().sort().join('|');return <article key={account.id}>
        <div className="role-account-identity"><UserRoundCog/><div><small>{c.account}</small><h3>{account.displayName||account.username}</h3><span>@{account.username}</span><div className="account-context"><span><Clock3/>{meta.lastSeen}: {account.lastLoginAt?new Intl.DateTimeFormat(locale,{dateStyle:'medium'}).format(new Date(account.lastLoginAt)):meta.never}</span><span><Building2/>{account.workspaceIds.length} {meta.workspaces}</span><span>{meta.created}: {new Intl.DateTimeFormat(locale,{dateStyle:'medium'}).format(new Date(account.createdAt))}</span></div></div>{changed&&<em>{meta.unsaved}</em>}</div>
        <fieldset><legend>{c.roles}</legend>{roles.map(role=><label key={role} className={draft.roles.includes(role)?'selected':''}>
          <input type="checkbox" checked={draft.roles.includes(role)} disabled={role==='member'||(account.id===user?.id&&role==='admin')} onChange={()=>toggleRole(account.id,role)}/>
          <span><strong>{c.roleNames[role]}</strong><small>{c.roleHelp[role]}</small></span>
          <i>{draft.roles.includes(role)&&<Check/>}</i>
        </label>)}</fieldset>
        <footer>
          <label className="account-state"><input type="checkbox" checked={!draft.disabled} disabled={account.id===user?.id} onChange={()=>setDrafts(current=>({...current,[account.id]:{...draft,disabled:!draft.disabled}}))}/><span><strong>{c.status}</strong><small>{draft.disabled?c.disabled:c.active}</small></span></label>
          <button type="button" className="primary-button" onClick={()=>void save(account)} disabled={!changed||Boolean(busy)}><ShieldCheck/>{busy===account.id?c.saving:c.save}</button>
        </footer>
      </article>})}
      {!loading&&!error&&!visible.length&&<div className="role-empty"><UserRoundCog/><p>{c.empty}</p></div>}
    </div>
    {pages>1&&<nav className="role-pagination"><button disabled={page===1} onClick={()=>setPage(value=>Math.max(1,value-1))}><ChevronLeft/>{c.previous}</button><span>{c.page} {page} / {pages}</span><button disabled={page===pages} onClick={()=>setPage(value=>Math.min(pages,value+1))}>{c.next}<ChevronRight/></button></nav>}
  </section>
}
