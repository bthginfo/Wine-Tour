import { and, eq } from 'drizzle-orm'
import { auditLog, ratings } from '../db/schema.js'
import { getSessionUser } from '../server/auth.js'
import { database } from '../server/db.js'
import { consumeRateLimit, rateLimitResponse, rejectCrossSiteMutation } from '../server/security.js'

const entityTypes=new Set(['region','producer','wine'])
function entityFrom(request:Request){
  const url=new URL(request.url,'https://wine-tour.vercel.app')
  const entityType=url.searchParams.get('entityType')??''
  const entityId=url.searchParams.get('entityId')??''
  if(!entityTypes.has(entityType)||!/^[a-z0-9][a-z0-9-]{0,199}$/.test(entityId))return null
  return {entityType,entityId}
}
async function snapshot(entityType:string,entityId:string,userId?:string){
  const rows=await database.select({userId:ratings.userId,score:ratings.score}).from(ratings).where(and(eq(ratings.entityType,entityType),eq(ratings.entityId,entityId)))
  const count=rows.length
  const average=count?Math.round((rows.reduce((sum,row)=>sum+row.score,0)/count)*10)/10:null
  return {average,count,yourScore:userId?rows.find(row=>row.userId===userId)?.score??null:null}
}

export async function GET(request:Request){
  const entity=entityFrom(request)
  if(!entity)return Response.json({error:'INVALID_ENTITY'},{status:400})
  try{
    const user=await getSessionUser(request)
    return Response.json(await snapshot(entity.entityType,entity.entityId,user?.id),{headers:{'Cache-Control':'private, no-store'}})
  }catch(error){
    console.error('Rating read failed',error)
    return Response.json({error:'RATINGS_UNAVAILABLE'},{status:503})
  }
}

export async function PUT(request:Request){
  const rejected=rejectCrossSiteMutation(request);if(rejected)return rejected
  const entity=entityFrom(request);if(!entity)return Response.json({error:'INVALID_ENTITY'},{status:400})
  try{
    const user=await getSessionUser(request)
    if(!user)return Response.json({error:'AUTH_REQUIRED'},{status:401})
    const rate=await consumeRateLimit(request,'rating-write',30,60_000,user.id)
    if(!rate.allowed)return rateLimitResponse(rate.resetAt)
    const payload=await request.json().catch(()=>null) as {score?:unknown}|null
    const score=Number(payload?.score)
    if(!Number.isInteger(score)||score<1||score>5)return Response.json({error:'INVALID_SCORE'},{status:400})
    const now=new Date()
    await database.insert(ratings).values({userId:user.id,entityType:entity.entityType,entityId:entity.entityId,score,updatedAt:now}).onConflictDoUpdate({target:[ratings.userId,ratings.entityType,ratings.entityId],set:{score,updatedAt:now}})
    await database.insert(auditLog).values({actorUserId:user.id,action:'rating.updated',entityType:entity.entityType,entityId:entity.entityId,details:{score}})
    return Response.json(await snapshot(entity.entityType,entity.entityId,user.id),{headers:{'Cache-Control':'no-store'}})
  }catch(error){
    console.error('Rating write failed',error)
    return Response.json({error:'RATING_SAVE_FAILED'},{status:503})
  }
}
