import { and, eq, inArray } from 'drizzle-orm'
import {
  auditLog,
  cellarItems,
  platformStates,
  ratings,
  tastingNotes,
  userStates,
  workspaceMembers,
  workspaces,
} from '../db/schema.js'
import { getSessionUser, type PlatformRole } from '../server/auth.js'
import { database } from '../server/db.js'

const personalKeys = new Set(['cellar', 'notes', 'ratings', 'journeys'])
const adminKeys = new Set(['additions', 'approvals', 'feeConfiguration'])
const roleKeys: Record<string, PlatformRole[]> = {
  partnerProfiles: ['host', 'winery', 'merchant', 'admin'],
  events: ['member', 'host', 'winery', 'merchant', 'admin'],
  winerySections: ['winery', 'merchant', 'admin'],
  offers: ['merchant', 'admin'],
  placements: ['admin'],
}
const publicPlatformKeys = new Set([...Object.keys(roleKeys), 'additions'])

function isUuid(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function publicRecord(key: string, item: Record<string, unknown>) {
  if (key === 'additions') return item.status === 'published'
  if (key === 'events') return item.publishState === 'published' && item.visibility === 'public'
  if (key === 'partnerProfiles' || key === 'offers') return item.publishState === 'published'
  if (key === 'winerySections') return item.visible === true
  if (key === 'placements') return item.enabled === true
  return false
}

function visiblePlatformValue(key: string, value: unknown, user: Awaited<ReturnType<typeof getSessionUser>>) {
  if (!Array.isArray(value)) return user?.roles.includes('admin') ? value : undefined
  if (user?.roles.includes('admin')) return value
  const workspaceIds = new Set(user?.workspaceIds ?? [])
  return value.filter(candidate => {
    if (!candidate || typeof candidate !== 'object') return false
    const item = candidate as Record<string, unknown>
    return (typeof item.workspaceId === 'string' && workspaceIds.has(item.workspaceId)) || publicRecord(key, item)
  })
}

async function personalState(userId: string) {
  const [cellarRows, noteRows, ratingRows, stateRows] = await Promise.all([
    database.select({ details: cellarItems.details }).from(cellarItems).where(eq(cellarItems.userId, userId)),
    database.select({ content: tastingNotes.content }).from(tastingNotes).where(eq(tastingNotes.userId, userId)),
    database.select({ entityType: ratings.entityType, entityId: ratings.entityId, score: ratings.score }).from(ratings).where(eq(ratings.userId, userId)),
    database.select({ key: userStates.key, value: userStates.value }).from(userStates).where(eq(userStates.userId, userId)),
  ])
  const state: Record<string, unknown> = Object.fromEntries(stateRows.map(row => [row.key, row.value]))
  if (cellarRows.length) state.cellar = cellarRows.map(row => row.details)
  if (noteRows.length) state.notes = noteRows.map(row => row.content)
  if (ratingRows.length) state.ratings = Object.fromEntries(ratingRows.map(row => [`${row.entityType}:${row.entityId}`, row.score]))
  return state
}

export async function GET(request: Request) {
  const user = await getSessionUser(request)
  const rows = await database.select({ key: platformStates.key, value: platformStates.value }).from(platformStates)
  const state: Record<string, unknown> = {}
  for (const row of rows) {
    if (publicPlatformKeys.has(row.key) || user?.roles.includes('admin') || (row.key === 'approvals' && user)) {
      const visible = visiblePlatformValue(row.key, row.value, user)
      if (visible !== undefined) state[row.key] = visible
    }
  }

  const workspaceRows = user?.roles.includes('admin')
    ? await database.select({ content: workspaces.content }).from(workspaces)
    : user
      ? await database.select({ content: workspaces.content }).from(workspaces).innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId)).where(eq(workspaceMembers.userId, user.id))
      : []
  if (workspaceRows.length) state.workspaces = workspaceRows.map(row => row.content)
  if (user) Object.assign(state, await personalState(user.id))
  return Response.json({ state }, { headers: { 'Cache-Control': 'no-store' } })
}

async function saveCellar(userId: string, value: unknown) {
  if (!Array.isArray(value) || value.length > 2_000) throw new Error('INVALID_CELLAR')
  await database.transaction(async tx => {
    await tx.delete(cellarItems).where(eq(cellarItems.userId, userId))
    if (!value.length) return
    await tx.insert(cellarItems).values(value.map(candidate => {
      const item = candidate as Record<string, unknown>
      return {
        id: isUuid(item.id) ? item.id : crypto.randomUUID(),
        userId,
        wineId: typeof item.wineId === 'string' ? item.wineId : null,
        customName: typeof item.customName === 'string' ? item.customName : null,
        producerName: typeof item.producer === 'string' ? item.producer : null,
        regionName: typeof item.region === 'string' ? item.region : null,
        vintage: typeof item.vintage === 'number' ? Math.round(item.vintage) : null,
        state: ['owned', 'wishlist', 'tasted', 'finished'].includes(String(item.state)) ? item.state as 'owned' | 'wishlist' | 'tasted' | 'finished' : 'owned',
        quantity: Math.max(1, Math.min(999, Number(item.quantity) || 1)),
        location: typeof item.location === 'string' ? item.location.slice(0, 200) : '',
        details: item,
        updatedAt: new Date(),
      }
    }))
  })
}

async function saveNotes(userId: string, value: unknown) {
  if (!Array.isArray(value) || value.length > 10_000) throw new Error('INVALID_NOTES')
  await database.transaction(async tx => {
    await tx.delete(tastingNotes).where(eq(tastingNotes.userId, userId))
    if (!value.length) return
    await tx.insert(tastingNotes).values(value.map(candidate => {
      const note = candidate as Record<string, unknown>
      return {
        id: isUuid(note.id) ? note.id : crypto.randomUUID(),
        userId,
        wineId: typeof note.wineId === 'string' ? note.wineId : null,
        rating: typeof note.rating === 'number' ? Math.max(1, Math.min(5, Math.round(note.rating))) : null,
        content: note,
        updatedAt: new Date(),
      }
    }))
  })
}

async function saveRatings(userId: string, value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('INVALID_RATINGS')
  const entries = Object.entries(value as Record<string, unknown>).slice(0, 10_000)
  await database.transaction(async tx => {
    await tx.delete(ratings).where(eq(ratings.userId, userId))
    if (!entries.length) return
    await tx.insert(ratings).values(entries.map(([key, score]) => {
      const separator = key.indexOf(':')
      return {
        userId,
        entityType: separator > 0 ? key.slice(0, separator) : 'entity',
        entityId: separator > 0 ? key.slice(separator + 1) : key,
        score: Math.max(1, Math.min(5, Math.round(Number(score) || 1))),
      }
    }))
  })
}

async function savePersonalJson(userId: string, key: string, value: unknown) {
  await database.insert(userStates).values({ userId, key, value, updatedAt: new Date() }).onConflictDoUpdate({
    target: [userStates.userId, userStates.key],
    set: { value, updatedAt: new Date() },
  })
}

async function savePlatform(user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>>, key: string, value: unknown) {
  const admin = user.roles.includes('admin')
  if (adminKeys.has(key) && !admin) throw new Error('FORBIDDEN')
  const allowedRoles = roleKeys[key]
  if (!admin && (!allowedRoles || !allowedRoles.some(role => user.roles.includes(role)))) throw new Error('FORBIDDEN')
  let next = value
  if (!admin && Array.isArray(value)) {
    const [current] = await database.select({ value: platformStates.value }).from(platformStates).where(eq(platformStates.key, key)).limit(1)
    const existing = Array.isArray(current?.value) ? current.value as Array<Record<string, unknown>> : []
    const allowed = new Set(user.workspaceIds)
    let owned = value.filter(item => item && typeof item === 'object' && allowed.has(String((item as Record<string, unknown>).workspaceId))) as Array<Record<string, unknown>>
    if (key === 'partnerProfiles') owned = owned.map(item => ({ ...item, publishState:'draft', verification:'pending' }))
    if (key === 'events' || key === 'offers') owned = owned.map(item => ({ ...item, publishState:'draft' }))
    next = [...existing.filter(item => !allowed.has(String(item.workspaceId))), ...owned]
  }
  await database.insert(platformStates).values({ key, value: next, updatedBy: user.id, updatedAt: new Date() }).onConflictDoUpdate({
    target: platformStates.key,
    set: { value: next, updatedBy: user.id, updatedAt: new Date() },
  })
}

export async function PUT(request: Request) {
  const user = await getSessionUser(request)
  if (!user) return Response.json({ error: 'AUTH_REQUIRED' }, { status: 401 })
  const body = await request.json().catch(() => null) as { key?: string; value?: unknown } | null
  const key = body?.key ?? ''
  const size = JSON.stringify(body?.value ?? null).length
  if (!key || size > 2_000_000) return Response.json({ error: 'INVALID_STATE' }, { status: 400 })
  try {
    if (personalKeys.has(key)) {
      if (key === 'cellar') await saveCellar(user.id, body?.value)
      else if (key === 'notes') await saveNotes(user.id, body?.value)
      else if (key === 'ratings') await saveRatings(user.id, body?.value)
      else await savePersonalJson(user.id, key, body?.value)
    } else {
      await savePlatform(user, key, body?.value)
    }
    await database.insert(auditLog).values({ actorUserId: user.id, action: 'state.updated', entityType: 'state', entityId: key, details: { bytes: size } })
    return Response.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'STATE_WRITE_FAILED'
    return Response.json({ error: message }, { status: message === 'FORBIDDEN' ? 403 : 400 })
  }
}
