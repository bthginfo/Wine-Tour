import { del, get, put } from '@vercel/blob'
import { and, eq, or } from 'drizzle-orm'
import { mediaAssets, platformStates, workspaceMembers } from '../../db/schema.js'
import { getSessionUser } from '../../server/auth.js'
import { database } from '../../server/db.js'
import { consumeRateLimit, isSameOrigin, rateLimitResponse } from '../../server/security.js'

const MAX_BYTES = 2 * 1024 * 1024
const responseHeaders = { 'Cache-Control': 'no-store' }

async function canEditWorkspace(userId:string,workspaceId:string){
  const [membership]=await database.select({workspaceId:workspaceMembers.workspaceId}).from(workspaceMembers).where(and(eq(workspaceMembers.userId,userId),eq(workspaceMembers.workspaceId,workspaceId))).limit(1)
  return Boolean(membership)
}

async function isPublishedWorkspaceAsset(assetId:string,workspaceId:string){
  const rows=await database.select({key:platformStates.key,value:platformStates.value}).from(platformStates).where(or(eq(platformStates.key,'winerySections'),eq(platformStates.key,'partnerProfiles')))
  const sections=rows.find(row=>row.key==='winerySections')?.value
  const profiles=rows.find(row=>row.key==='partnerProfiles')?.value
  const visible=Array.isArray(sections)&&sections.some(candidate=>candidate&&typeof candidate==='object'&&String((candidate as Record<string,unknown>).workspaceId)===workspaceId&&String((candidate as Record<string,unknown>).mediaAssetId)===assetId&&(candidate as Record<string,unknown>).visible===true)
  const published=Array.isArray(profiles)&&profiles.some(candidate=>candidate&&typeof candidate==='object'&&String((candidate as Record<string,unknown>).workspaceId)===workspaceId&&(candidate as Record<string,unknown>).publishState==='published')
  return visible&&published
}

export async function POST(request: Request) {
  const user = await getSessionUser(request)
  if (!user) {
    return Response.json({ error: 'AUTH_REQUIRED' }, { status: 401, headers: responseHeaders })
  }
  const uploadMode=request.headers.get('x-vine-upload')
  const workspaceId=request.headers.get('x-vine-workspace')?.trim()??''
  const wineId=request.headers.get('x-vine-entity-id')?.trim()??''
  const workspaceUpload=uploadMode==='workspace-media-v1'&&/^user-[0-9a-f-]{36}-(winery|merchant|host|admin)$/.test(workspaceId)
  const catalogueUpload=uploadMode==='catalog-wine-v1'&&user.roles.includes('admin')&&/^[a-z0-9][a-z0-9-]{1,119}$/.test(wineId)
  if (!['bottle-photo-v1','workspace-media-v1','catalog-wine-v1'].includes(uploadMode??'') || !isSameOrigin(request) || (uploadMode==='workspace-media-v1'&&!workspaceUpload) || (uploadMode==='catalog-wine-v1'&&!catalogueUpload)) {
    return Response.json({ error: 'Upload request rejected.' }, { status: 403, headers: responseHeaders })
  }
  if(workspaceUpload&&!await canEditWorkspace(user.id,workspaceId))return Response.json({error:'FORBIDDEN'},{status:403,headers:responseHeaders})
  if (request.headers.get('content-type') !== 'image/webp') {
    return Response.json({ error: 'Only prepared WebP bottle images are accepted.' }, { status: 415, headers: responseHeaders })
  }
  const limit = await consumeRateLimit(request, 'media-upload', 60, 60 * 60_000, user.id)
  if (!limit.allowed) return rateLimitResponse(limit.resetAt)

  const declaredSize = Number(request.headers.get('content-length') ?? 0)
  if (declaredSize > MAX_BYTES) {
    return Response.json({ error: 'Bottle image exceeds the 2 MB limit.' }, { status: 413, headers: responseHeaders })
  }

  try {
    const bytes = await request.arrayBuffer()
    if (!bytes.byteLength || bytes.byteLength > MAX_BYTES) {
      return Response.json({ error: 'Bottle image is empty or exceeds the 2 MB limit.' }, { status: 413, headers: responseHeaders })
    }
    const signature = new Uint8Array(bytes.slice(0, 12))
    const ascii = String.fromCharCode(...signature)
    if (signature.length < 12 || ascii.slice(0, 4) !== 'RIFF' || ascii.slice(8, 12) !== 'WEBP') {
      return Response.json({ error: 'Image signature does not match WebP.' }, { status: 415, headers: responseHeaders })
    }

    const blobOptions={addRandomSuffix:true,contentType:'image/webp' as const,cacheControlMaxAge:31_536_000}
    const blob=catalogueUpload
      ?await put(`catalogue/wines/${wineId}/${crypto.randomUUID()}.webp`,bytes,{...blobOptions,access:'public'})
      :await put(workspaceUpload?`workspaces/${workspaceId}/${crypto.randomUUID()}.webp`:`cellar/bottles/${crypto.randomUUID()}.webp`,bytes,{...blobOptions,access: 'private'})
    const [asset] = await database.insert(mediaAssets).values({
      provider: 'vercel-blob',
      access: catalogueUpload?'public':'private',
      storageKey: blob.pathname,
      url: blob.url,
      mimeType: 'image/webp',
      altText: catalogueUpload?`Bottle photograph for ${wineId}`:'Bottle photograph',
      ownerUserId: user.id,
      ownerWorkspaceId: workspaceUpload?workspaceId:null,
      entityType: catalogueUpload?'wine':workspaceUpload?'workspace-section':'cellar-item',
      entityId: catalogueUpload?wineId:null,
      metadata: { uploadedBy: user.username, source: catalogueUpload?'catalogue-wine-upload':workspaceUpload?'workspace-editor-upload':'cellar-bottle-upload' },
    }).returning({ id: mediaAssets.id })
    return Response.json({ assetId: asset.id, url: `/api/media/upload?id=${asset.id}`, pathname: blob.pathname }, { headers: responseHeaders })
  } catch (error) {
    console.error('Bottle photo upload failed', error)
    return Response.json({ error: 'Bottle photo storage is temporarily unavailable.' }, { status: 503, headers: responseHeaders })
  }
}

export async function GET(request:Request){
  const user=await getSessionUser(request)
  const assetId=new URL(request.url).searchParams.get('id')??''
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(assetId))return Response.json({error:'INVALID_ASSET'},{status:400,headers:responseHeaders})
  const limit=await consumeRateLimit(request,'media-read',600,60*60_000,user?.id??assetId)
  if(!limit.allowed)return rateLimitResponse(limit.resetAt)
  const [asset]=await database.select({id:mediaAssets.id,access:mediaAssets.access,url:mediaAssets.url,storageKey:mediaAssets.storageKey,mimeType:mediaAssets.mimeType,ownerUserId:mediaAssets.ownerUserId,ownerWorkspaceId:mediaAssets.ownerWorkspaceId}).from(mediaAssets).where(eq(mediaAssets.id,assetId)).limit(1)
  if(!asset)return Response.json({error:'ASSET_NOT_FOUND'},{status:404,headers:responseHeaders})
  if(asset.access==='public'&&asset.url)return Response.redirect(asset.url,302)
  let allowed=Boolean(user&&asset.ownerUserId===user.id),published=false
  if(!allowed&&user&&asset.ownerWorkspaceId)allowed=await canEditWorkspace(user.id,asset.ownerWorkspaceId)
  if(!allowed&&asset.ownerWorkspaceId){published=await isPublishedWorkspaceAsset(asset.id,asset.ownerWorkspaceId);allowed=published}
  if(!allowed)return Response.json({error:'ASSET_NOT_FOUND'},{status:404,headers:responseHeaders})
  try{
    const result=await get(asset.storageKey,{access:'private'})
    if(!result||result.statusCode!==200)return Response.json({error:'ASSET_NOT_FOUND'},{status:404,headers:responseHeaders})
    return new Response(result.stream,{headers:{'Content-Type':asset.mimeType,'Cache-Control':published?'public, max-age=300, stale-while-revalidate=3600':'private, no-cache','X-Content-Type-Options':'nosniff','Content-Disposition':'inline'}})
  }catch(error){
    console.error('Bottle photo read failed',error)
    return Response.json({error:'MEDIA_READ_FAILED'},{status:503,headers:responseHeaders})
  }
}

export async function DELETE(request:Request){
  const user=await getSessionUser(request)
  if(!user)return Response.json({error:'AUTH_REQUIRED'},{status:401,headers:responseHeaders})
  const uploadMode=request.headers.get('x-vine-upload')
  const workspaceId=request.headers.get('x-vine-workspace')?.trim()??''
  if(!['bottle-photo-v1','workspace-media-v1','catalog-wine-v1'].includes(uploadMode??'')||!isSameOrigin(request))return Response.json({error:'Upload request rejected.'},{status:403,headers:responseHeaders})
  const limit=await consumeRateLimit(request,'media-delete',120,60*60_000,user.id)
  if(!limit.allowed)return rateLimitResponse(limit.resetAt)
  const body=await request.json().catch(()=>null) as {assetId?:string}|null
  const assetId=body?.assetId??''
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(assetId))return Response.json({error:'INVALID_ASSET'},{status:400,headers:responseHeaders})
  const [asset]=await database.select({id:mediaAssets.id,url:mediaAssets.url,storageKey:mediaAssets.storageKey,ownerUserId:mediaAssets.ownerUserId,ownerWorkspaceId:mediaAssets.ownerWorkspaceId}).from(mediaAssets).where(eq(mediaAssets.id,assetId)).limit(1)
  if(!asset)return Response.json({error:'ASSET_NOT_FOUND'},{status:404,headers:responseHeaders})
  const allowed=uploadMode==='bottle-photo-v1'?asset.ownerUserId===user.id:uploadMode==='catalog-wine-v1'?user.roles.includes('admin')&&asset.ownerUserId===user.id:Boolean(workspaceId&&asset.ownerWorkspaceId===workspaceId&&await canEditWorkspace(user.id,workspaceId))
  if(!allowed)return Response.json({error:'ASSET_NOT_FOUND'},{status:404,headers:responseHeaders})
  try{
    await del(asset.url??asset.storageKey)
    await database.delete(mediaAssets).where(eq(mediaAssets.id,asset.id))
    return Response.json({ok:true},{headers:responseHeaders})
  }catch(error){
    console.error('Bottle photo deletion failed',error)
    return Response.json({error:'MEDIA_DELETE_FAILED'},{status:503,headers:responseHeaders})
  }
}
