import { and, desc, eq } from 'drizzle-orm'
import { mediaAssets } from '../../db/schema.js'
import { database } from '../../server/db.js'
import { consumeRateLimit, rateLimitResponse } from '../../server/security.js'

const headers={'Cache-Control':'public, max-age=60, stale-while-revalidate=600','X-Content-Type-Options':'nosniff'}

export async function GET(request:Request){
  const wineId=new URL(request.url).searchParams.get('wineId')?.trim()??''
  if(!/^[a-z0-9][a-z0-9-]{1,119}$/.test(wineId))return Response.json({error:'INVALID_WINE'},{status:400,headers})
  const limit=await consumeRateLimit(request,'wine-media-read',600,60*60_000,wineId)
  if(!limit.allowed)return rateLimitResponse(limit.resetAt)
  const [asset]=await database.select({id:mediaAssets.id,url:mediaAssets.url,altText:mediaAssets.altText}).from(mediaAssets).where(and(eq(mediaAssets.entityType,'wine'),eq(mediaAssets.entityId,wineId),eq(mediaAssets.access,'public'))).orderBy(desc(mediaAssets.createdAt)).limit(1)
  if(!asset)return Response.json({url:null},{headers})
  return Response.json({url:asset.url??`/api/media/upload?id=${asset.id}`,altText:asset.altText},{headers})
}
