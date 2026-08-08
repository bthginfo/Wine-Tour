import { eq } from 'drizzle-orm'
import { platformStates } from '../../db/schema.js'
import { getSessionUser } from '../../server/auth.js'
import { database } from '../../server/db.js'

type EventRecord={
  id?:string
  workspaceId?:string
  inviteCode?:string
  visibility?:string
  publishState?:string
  [key:string]:unknown
}

export async function GET(request:Request){
  const code=new URL(request.url).searchParams.get('code')?.trim().toUpperCase()??''
  if(!/^[A-Z0-9-]{4,80}$/.test(code))return Response.json({error:'INVALID_CODE'},{status:400})
  const [row]=await database.select({value:platformStates.value}).from(platformStates).where(eq(platformStates.key,'events')).limit(1)
  const events=Array.isArray(row?.value)?row.value as EventRecord[]:[]
  const event=events.find(item=>item.id?.toUpperCase()===code||item.inviteCode?.toUpperCase()===code)
  if(!event)return Response.json({error:'TASTING_NOT_FOUND'},{status:404,headers:{'Cache-Control':'no-store'}})
  const user=await getSessionUser(request)
  const owner=Boolean(event.workspaceId&&user?.workspaceIds.includes(event.workspaceId))
  const publicEvent=event.visibility==='public'&&event.publishState==='published'
  const invited=Boolean(event.inviteCode&&event.inviteCode.toUpperCase()===code)
  if(!owner&&!publicEvent&&!invited)return Response.json({error:'TASTING_NOT_FOUND'},{status:404,headers:{'Cache-Control':'no-store'}})
  return Response.json({event},{headers:{'Cache-Control':'no-store'}})
}
