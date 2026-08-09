import { desc, eq } from 'drizzle-orm'
import { auditLog, users } from '../../db/schema.js'
import { requireRole } from '../../server/auth.js'
import { database } from '../../server/db.js'
import { consumeRateLimit, rateLimitResponse } from '../../server/security.js'

export async function GET(request:Request){
  const actor=await requireRole(request,['admin'])
  if(!actor)return Response.json({error:'FORBIDDEN'},{status:403,headers:{'Cache-Control':'no-store'}})
  const limit=await consumeRateLimit(request,'admin-audit',120,60_000,actor.id)
  if(!limit.allowed)return rateLimitResponse(limit.resetAt)
  const requested=Number(new URL(request.url).searchParams.get('limit')??50)
  const limitValue=Math.max(1,Math.min(100,Number.isFinite(requested)?Math.round(requested):50))
  const entries=await database.select({id:auditLog.id,action:auditLog.action,entityType:auditLog.entityType,entityId:auditLog.entityId,details:auditLog.details,createdAt:auditLog.createdAt,actorUsername:users.username}).from(auditLog).leftJoin(users,eq(auditLog.actorUserId,users.id)).orderBy(desc(auditLog.createdAt)).limit(limitValue)
  return Response.json({entries},{headers:{'Cache-Control':'no-store'}})
}
