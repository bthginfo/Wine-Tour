import type {
  ApprovalRecord,
  BusinessWorkspace,
  MerchantOffer,
  PartnerProfile,
  PlatformFeeConfiguration,
  PromotionalPlacement,
  TastingEvent,
  WineryPageSection,
  WorkspaceMembership,
} from '../types'
import { producers, regions, wines } from './catalog'

export const demoWorkspaces: BusinessWorkspace[] = []

export const demoMemberships: WorkspaceMembership[] = demoWorkspaces.map(workspace=>({
  id:`membership-${workspace.id}`,
  workspaceId:workspace.id,
  userId:'local-demo-user',
  role:workspace.role,
  permissions:workspace.role==='admin'?['view','edit','publish','commerce','moderate']:workspace.role==='member'?['view','edit']:['view','edit','publish','commerce'],
}))

export const demoPartnerProfiles: PartnerProfile[] = []

export const demoEvents: TastingEvent[] = []

export const demoWinerySections: WineryPageSection[] = []

export const demoOffers: MerchantOffer[] = []

export const demoPlacements: PromotionalPlacement[] = []

export const demoApprovals: ApprovalRecord[] = []

export const demoFeeConfiguration: PlatformFeeConfiguration = {
  recurringPartnerPlans:true,
  ticketFeeBps:800,
  merchantAffiliateLinks:true,
  paymentsMode:'disabled-demo',
}

export function validateBusinessData(){
  const errors:string[]=[]
  const workspaceIds=new Set(demoWorkspaces.map(item=>item.id))
  const profileIds=new Set(demoPartnerProfiles.map(item=>item.id))
  const producerIds=new Set(producers.map(item=>item.id))
  const wineIds=new Set(wines.map(item=>item.id))
  const regionIds=new Set(regions.map(item=>item.id))
  demoMemberships.forEach(item=>{if(!workspaceIds.has(item.workspaceId))errors.push(`Membership ${item.id} has missing workspace ${item.workspaceId}`)})
  demoPartnerProfiles.forEach(item=>{if(!workspaceIds.has(item.workspaceId))errors.push(`Profile ${item.id} has missing workspace ${item.workspaceId}`);if(item.producerId&&!producerIds.has(item.producerId))errors.push(`Profile ${item.id} has missing producer ${item.producerId}`)})
  demoEvents.forEach(item=>{if(!workspaceIds.has(item.workspaceId))errors.push(`Event ${item.id} has missing workspace ${item.workspaceId}`);if(!profileIds.has(item.hostProfileId))errors.push(`Event ${item.id} has missing host ${item.hostProfileId}`);if(item.regionId&&!regionIds.has(item.regionId))errors.push(`Event ${item.id} has missing region ${item.regionId}`);item.featuredWineIds.forEach(id=>{if(!wineIds.has(id))errors.push(`Event ${item.id} has missing wine ${id}`)});const role=demoWorkspaces.find(workspace=>workspace.id===item.workspaceId)?.role;if(role==='member'&&(item.visibility!=='private'||item.publishState==='published'))errors.push(`Member event ${item.id} must remain private and unpublished`)})
  demoWinerySections.forEach(item=>{if(!workspaceIds.has(item.workspaceId))errors.push(`Section ${item.id} has missing workspace ${item.workspaceId}`)})
  demoOffers.forEach(item=>{if(!workspaceIds.has(item.workspaceId))errors.push(`Offer ${item.id} has missing workspace ${item.workspaceId}`);if(!wineIds.has(item.wineId))errors.push(`Offer ${item.id} has missing wine ${item.wineId}`);if(!/^https:\/\//.test(item.destinationUrl))errors.push(`Offer ${item.id} requires an https destination`)})
  demoPlacements.forEach(item=>{if(!workspaceIds.has(item.workspaceId))errors.push(`Placement ${item.id} has missing workspace ${item.workspaceId}`);if(!profileIds.has(item.partnerProfileId))errors.push(`Placement ${item.id} has missing profile ${item.partnerProfileId}`);if(item.startsAt>item.endsAt)errors.push(`Placement ${item.id} ends before it starts`)})
  demoApprovals.forEach(item=>{if(!workspaceIds.has(item.workspaceId))errors.push(`Approval ${item.id} has missing workspace ${item.workspaceId}`)})
  if(demoFeeConfiguration.paymentsMode!=='disabled-demo')errors.push('Demo payments must remain disabled')
  return errors
}
