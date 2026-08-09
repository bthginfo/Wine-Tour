import { eq } from 'drizzle-orm'
import { platformStates } from '../../db/schema.js'
import { database } from '../../server/db.js'
import { consumeRateLimit, rateLimitResponse } from '../../server/security.js'

const headers={'Cache-Control':'no-store'}

export async function GET(request:Request){
  const limit=await consumeRateLimit(request,'event-invite',120,60_000)
  if(!limit.allowed)return rateLimitResponse(limit.resetAt)
  const url=new URL(request.url)
  const id=url.searchParams.get('id')?.trim()??''
  const code=url.searchParams.get('code')?.trim().toUpperCase()??''
  if(!id||!/^[-a-zA-Z0-9_]{3,160}$/.test(id)||!/^[-A-Z0-9]{6,32}$/.test(code))return Response.json({error:'INVITATION_NOT_FOUND'},{status:404,headers})
  const [row]=await database.select({value:platformStates.value}).from(platformStates).where(eq(platformStates.key,'events')).limit(1)
  const events=Array.isArray(row?.value)?row.value:[]
  const event=events.find(candidate=>candidate&&typeof candidate==='object'&&String((candidate as Record<string,unknown>).id)===id&&String((candidate as Record<string,unknown>).inviteCode??'').toUpperCase()===code)
  if(!event)return Response.json({error:'INVITATION_NOT_FOUND'},{status:404,headers})
  return Response.json({event},{headers})
}
