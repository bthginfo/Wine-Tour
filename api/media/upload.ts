import { put } from '@vercel/blob'
import { mediaAssets } from '../../db/schema.js'
import { getSessionUser } from '../../server/auth.js'
import { database } from '../../server/db.js'

const MAX_BYTES = 2 * 1024 * 1024
const responseHeaders = { 'Cache-Control': 'no-store' }

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  if (!origin || !host) return true
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  const user = await getSessionUser(request)
  if (!user) {
    return Response.json({ error: 'AUTH_REQUIRED' }, { status: 401, headers: responseHeaders })
  }
  if (request.headers.get('x-vine-upload') !== 'bottle-photo-v1' || !sameOrigin(request)) {
    return Response.json({ error: 'Upload request rejected.' }, { status: 403, headers: responseHeaders })
  }
  if (request.headers.get('content-type') !== 'image/webp') {
    return Response.json({ error: 'Only prepared WebP bottle images are accepted.' }, { status: 415, headers: responseHeaders })
  }

  const declaredSize = Number(request.headers.get('content-length') ?? 0)
  if (declaredSize > MAX_BYTES) {
    return Response.json({ error: 'Bottle image exceeds the 2 MB limit.' }, { status: 413, headers: responseHeaders })
  }

  try {
    const bytes = await request.arrayBuffer()
    if (!bytes.byteLength || bytes.byteLength > MAX_BYTES) {
      return Response.json({ error: 'Bottle image is empty or exceeds the 2 MB limit.' }, { status: 413, headers: responseHeaders })
    }

    const blob = await put(`cellar/bottles/${crypto.randomUUID()}.webp`, bytes, {
      access: 'public',
      addRandomSuffix: true,
      contentType: 'image/webp',
      cacheControlMaxAge: 31_536_000,
    })
    const [asset] = await database.insert(mediaAssets).values({
      provider: 'vercel-blob',
      access: 'public',
      storageKey: blob.pathname,
      url: blob.url,
      mimeType: 'image/webp',
      altText: 'Bottle photograph',
      ownerUserId: user.id,
      entityType: 'cellar-item',
      metadata: { uploadedBy: user.username, source: 'cellar-bottle-upload' },
    }).returning({ id: mediaAssets.id })
    return Response.json({ assetId: asset.id, url: blob.url, pathname: blob.pathname }, { headers: responseHeaders })
  } catch (error) {
    console.error('Bottle photo upload failed', error)
    return Response.json({ error: 'Bottle photo storage is temporarily unavailable.' }, { status: 503, headers: responseHeaders })
  }
}
