import { eq } from 'drizzle-orm'
import { platformStates } from '../../db/schema.js'
import { getSessionUser } from '../../server/auth.js'
import { database } from '../../server/db.js'
import { consumeRateLimit, rateLimitResponse } from '../../server/security.js'

type EventRecord={
  id?:string
  workspaceId?:string
  inviteCode?:string
  visibility?:string
  publishState?:string
  [key:string]:unknown
}
const headers={'Cache-Control':'no-store'}

export async function GET(request:Request){
  const limit=await consumeRateLimit(request,'tasting-join',120,60_000)
  if(!limit.allowed)return rateLimitResponse(limit.resetAt)
  const code=new URL(request.url).searchParams.get('code')?.trim().toUpperCase()??''
  if(!/^[A-Z0-9-]{4,80}$/.test(code))return Response.json({error:'INVALID_CODE'},{status:400,headers})
  const [row]=await database.select({value:platformStates.value}).from(platformStates).where(eq(platformStates.key,'events')).limit(1)
  const events=Array.isArray(row?.value)?row.value as EventRecord[]:[]
  const event=events.find(item=>item.id?.toUpperCase()===code||item.inviteCode?.toUpperCase()===code)
  if(!event)return Response.json({error:'TASTING_NOT_FOUND'},{status:404,headers})
  const user=await getSessionUser(request)
  const owner=Boolean(event.workspaceId&&user?.workspaceIds.includes(event.workspaceId))
  const publicEvent=event.visibility==='public'&&event.publishState==='published'
  const invited=Boolean(event.inviteCode&&event.inviteCode.toUpperCase()===code)
  if(!owner&&!publicEvent&&!invited)return Response.json({error:'TASTING_NOT_FOUND'},{status:404,headers})
  if(owner||invited)return Response.json({event},{headers})
  const {secureJoinLink:_secureJoinLink,inviteCode:_inviteCode,...safeEvent}=event
  return Response.json({event:safeEvent},{headers})
}
