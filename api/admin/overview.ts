import { count, sql } from 'drizzle-orm'
import { academyLessons, auditLog, cellarItems, grapes, platformStates, producers, regions, tastingNotes, userRoles, users, wines, workspaces } from '../../db/schema.js'
import { requireRole } from '../../server/auth.js'
import { database } from '../../server/db.js'
import { consumeRateLimit, rateLimitResponse } from '../../server/security.js'

function collection(value:unknown){return Array.isArray(value)?value.filter(item=>item&&typeof item==='object') as Array<Record<string,unknown>>:[]}

export async function GET(request:Request){
  const actor=await requireRole(request,['admin'])
  if(!actor)return Response.json({error:'FORBIDDEN'},{status:403,headers:{'Cache-Control':'no-store'}})
  const limit=await consumeRateLimit(request,'admin-overview',120,60_000,actor.id)
  if(!limit.allowed)return rateLimitResponse(limit.resetAt)
  const [
    [userCount],[workspaceCount],[regionCount],[grapeCount],[producerCount],[wineCount],[lessonCount],[noteCount],[cellarCount],[bottleCount],[auditCount],roles,stateRows,
  ]=await Promise.all([
    database.select({value:count()}).from(users),database.select({value:count()}).from(workspaces),database.select({value:count()}).from(regions),
    database.select({value:count()}).from(grapes),database.select({value:count()}).from(producers),database.select({value:count()}).from(wines),
    database.select({value:count()}).from(academyLessons),database.select({value:count()}).from(tastingNotes),database.select({value:count()}).from(cellarItems),
    database.select({value:sql<number>`coalesce(sum(${cellarItems.quantity}),0)`}).from(cellarItems),database.select({value:count()}).from(auditLog),
    database.select({role:userRoles.role,value:count()}).from(userRoles).groupBy(userRoles.role),database.select({key:platformStates.key,value:platformStates.value}).from(platformStates),
  ])
  const states=Object.fromEntries(stateRows.map(row=>[row.key,row.value]))
  const additions=collection(states.additions),approvals=collection(states.approvals),events=collection(states.events),profiles=collection(states.partnerProfiles),offers=collection(states.offers)
  const workflow={
    editorialDrafts:additions.filter(item=>item.status==='draft').length,
    editorialReview:additions.filter(item=>item.status==='review').length,
    pendingApprovals:approvals.filter(item=>item.state==='pending').length,
    publishedEvents:events.filter(item=>item.publishState==='published').length,
    draftEvents:events.filter(item=>item.publishState==='draft').length,
    verifiedPartners:profiles.filter(item=>item.verification==='verified').length,
    pendingPartners:profiles.filter(item=>item.verification==='pending').length,
    activeOffers:offers.filter(item=>item.publishState==='published'&&item.stock!=='out-of-stock').length,
  }
  return Response.json({
    people:{users:Number(userCount.value),workspaces:Number(workspaceCount.value),roles:Object.fromEntries(roles.map(row=>[row.role,Number(row.value)]))},
    catalogue:{regions:Number(regionCount.value),grapes:Number(grapeCount.value),producers:Number(producerCount.value),wines:Number(wineCount.value),lessons:Number(lessonCount.value)},
    community:{cellarRecords:Number(cellarCount.value),bottles:Number(bottleCount.value),tastingNotes:Number(noteCount.value)},workflow,auditEntries:Number(auditCount.value),
  },{headers:{'Cache-Control':'no-store'}})
}
