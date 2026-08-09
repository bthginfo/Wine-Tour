import type { ApprovalRecord, BusinessWorkspace, CellarItem, MerchantOffer, PartnerProfile, PlatformFeeConfiguration, PromotionalPlacement, TastingEvent, TastingJourney, TastingNote, WineryPageSection, WorkspaceMembership } from '../types'
import { applyCatalogAdditions } from './catalogExtensions'

const keys = {
  cellar:'vine-atlas.cellar', notes:'vine-atlas.notes', ratings:'vine-atlas.ratings', additions:'vine-atlas.additions', journeys:'vine-atlas.journeys', learning:'vine-atlas-learning-v2',
  workspaces:'vine-atlas.business.workspaces', memberships:'vine-atlas.business.memberships', partnerProfiles:'vine-atlas.business.partner-profiles', events:'vine-atlas.business.events', winerySections:'vine-atlas.business.winery-sections', offers:'vine-atlas.business.offers', placements:'vine-atlas.business.placements', approvals:'vine-atlas.business.approvals', feeConfiguration:'vine-atlas.business.fee-configuration'
} as const

type RepositoryKey = keyof typeof keys
const personalKeys:RepositoryKey[]=['cellar','notes','ratings','journeys','learning']
const businessKeys:RepositoryKey[]=['workspaces','memberships','partnerProfiles','events','winerySections','offers','placements','approvals','feeConfiguration']
const cacheSchemaKey='vine-atlas.cache-schema'
const currentCacheSchema='3'
let backendSyncEnabled=false
const pending=new Map<RepositoryKey,unknown>()
let flushTimer:number|undefined
let retryDelay=2_000

async function flush(){
  flushTimer=undefined
  if(!backendSyncEnabled||!pending.size)return
  const batch=[...pending.entries()]
  pending.clear()
  await Promise.all(batch.map(async([key,value])=>{
    try{
      const response=await fetch('/api/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({key,value}),credentials:'same-origin',keepalive:true})
      if(response.ok)return
    }catch{/* keep the newest local value queued for the next online retry */}
    if(!pending.has(key))pending.set(key,value)
  }))
  if(pending.size&&backendSyncEnabled&&flushTimer===undefined){
    flushTimer=window.setTimeout(()=>void flush(),retryDelay)
    retryDelay=Math.min(30_000,retryDelay*2)
  }else if(!pending.size)retryDelay=2_000
}

function schedule(key:RepositoryKey,value:unknown){
  if(!backendSyncEnabled)return
  pending.set(key,value)
  retryDelay=2_000
  if(flushTimer===undefined)flushTimer=window.setTimeout(()=>void flush(),250)
}

function read<T>(key:string, fallback:T):T {
  try { const value=localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback } catch { return fallback }
}
function write<T>(key:RepositoryKey,value:T){ localStorage.setItem(keys[key],JSON.stringify(value));schedule(key,value) }

function migrateLegacyBusinessCache(){
  if(localStorage.getItem(cacheSchemaKey)===currentCacheSchema)return
  for(const key of businessKeys)localStorage.removeItem(keys[key])
  localStorage.setItem(cacheSchemaKey,currentCacheSchema)
}

export async function hydrateRepositoryState(authenticated:boolean,migrateLocal=false){
  backendSyncEnabled=false
  migrateLegacyBusinessCache()
  const localPersonal=new Map<RepositoryKey,unknown>()
  if(authenticated&&migrateLocal){
    for(const key of personalKeys){const raw=localStorage.getItem(keys[key]);if(raw)try{localPersonal.set(key,JSON.parse(raw))}catch{/* ignore invalid legacy state */}}
  }
  if(authenticated&&!migrateLocal)for(const key of personalKeys)localStorage.removeItem(keys[key])
  let response:Response
  try{response=await fetch('/api/state',{headers:{Accept:'application/json'},credentials:'same-origin'})}
  catch{backendSyncEnabled=authenticated;return}
  if(response.ok){
    const payload=await response.json().catch(()=>({})) as {state?:Record<string,unknown>}
    // Platform records are server-authoritative. Clearing first ensures an empty
    // published collection also removes seeded records cached by earlier builds.
    for(const key of businessKeys)localStorage.removeItem(keys[key])
    for(const [key,value] of Object.entries(payload.state??{})){
      if(key in keys)localStorage.setItem(keys[key as RepositoryKey],JSON.stringify(value))
    }
    applyCatalogAdditions(Array.isArray(payload.state?.additions)?payload.state.additions:[])
    if(authenticated&&migrateLocal){
      for(const [key,value] of localPersonal){
        if(!(key in (payload.state??{}))){localStorage.setItem(keys[key],JSON.stringify(value));pending.set(key,value)}
      }
    }
  }
  backendSyncEnabled=authenticated
  if(pending.size)await flush()
}

export function clearPersonalRepositoryState(){
  backendSyncEnabled=false
  pending.clear()
  for(const key of personalKeys)localStorage.removeItem(keys[key])
}

export const repository = {
  cellar: { all:()=>read<CellarItem[]>(keys.cellar,[]), save:(items:CellarItem[])=>write('cellar',items) },
  notes: { all:()=>read<TastingNote[]>(keys.notes,[]), save:(notes:TastingNote[])=>write('notes',notes) },
  ratings: { all:()=>read<Record<string,number>>(keys.ratings,{}), save:(ratings:Record<string,number>)=>write('ratings',ratings) },
  additions: { all:()=>read<Record<string,unknown>[]>(keys.additions,[]), save:(items:Record<string,unknown>[])=>write('additions',items) },
  journeys: { all:()=>read<TastingJourney[]>(keys.journeys,[]), save:(items:TastingJourney[])=>write('journeys',items) },
  learning: { get:<T>(fallback:T)=>read<T>(keys.learning,fallback), save:<T>(value:T)=>write('learning',value) },
  workspaces: { all:(fallback:BusinessWorkspace[]=[])=>read<BusinessWorkspace[]>(keys.workspaces,fallback), save:(items:BusinessWorkspace[])=>write('workspaces',items) },
  memberships: { all:(fallback:WorkspaceMembership[]=[])=>read<WorkspaceMembership[]>(keys.memberships,fallback), save:(items:WorkspaceMembership[])=>write('memberships',items) },
  partnerProfiles: { all:(fallback:PartnerProfile[]=[])=>read<PartnerProfile[]>(keys.partnerProfiles,fallback), save:(items:PartnerProfile[])=>write('partnerProfiles',items) },
  events: { all:(fallback:TastingEvent[]=[])=>read<TastingEvent[]>(keys.events,fallback), save:(items:TastingEvent[])=>write('events',items) },
  winerySections: { all:(fallback:WineryPageSection[]=[])=>read<WineryPageSection[]>(keys.winerySections,fallback), save:(items:WineryPageSection[])=>write('winerySections',items) },
  offers: { all:(fallback:MerchantOffer[]=[])=>read<MerchantOffer[]>(keys.offers,fallback), save:(items:MerchantOffer[])=>write('offers',items) },
  placements: { all:(fallback:PromotionalPlacement[]=[])=>read<PromotionalPlacement[]>(keys.placements,fallback), save:(items:PromotionalPlacement[])=>write('placements',items) },
  approvals: { all:(fallback:ApprovalRecord[]=[])=>read<ApprovalRecord[]>(keys.approvals,fallback), save:(items:ApprovalRecord[])=>write('approvals',items) },
  feeConfiguration: { get:(fallback:PlatformFeeConfiguration)=>read<PlatformFeeConfiguration>(keys.feeConfiguration,fallback), save:(item:PlatformFeeConfiguration)=>write('feeConfiguration',item) },
}
