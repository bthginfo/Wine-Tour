import { createHash } from 'node:crypto'
import { sql } from 'drizzle-orm'
import { requestRateLimits } from '../db/schema.js'
import { database } from './db.js'

const forbiddenObjectKeys = new Set(['__proto__', 'constructor', 'prototype'])

export function isSameOrigin(request: Request) {
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite === 'cross-site') return false
  const origin = request.headers.get('origin')
  if (!origin) return true
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  if (!host) return false
  try { return new URL(origin).host === host } catch { return false }
}

export function rejectCrossSiteMutation(request: Request) {
  if (isSameOrigin(request)) return null
  return Response.json({ error: 'CROSS_SITE_REQUEST_REJECTED' }, { status: 403, headers: { 'Cache-Control': 'no-store' } })
}

function clientFingerprint(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const address = forwarded || request.headers.get('x-real-ip') || 'unknown'
  const agent = request.headers.get('user-agent')?.slice(0, 120) ?? 'unknown-agent'
  const salt = process.env.RATE_LIMIT_SALT ?? 'vine-atlas-rate-limit-v1'
  return createHash('sha256').update(`${salt}:${address}:${agent}`).digest('hex')
}

export async function consumeRateLimit(request: Request, scope: string, limit: number, windowMs: number, subject = '') {
  const subjectHash = createHash('sha256').update(subject.trim().toLowerCase()).digest('hex').slice(0, 24)
  const key = `${scope}:${clientFingerprint(request)}:${subjectHash}`
  const now = new Date()
  const expiresAt = new Date(now.getTime() + windowMs)
  const [updated] = await database.insert(requestRateLimits).values({ key, count: 1, windowStart: now, expiresAt, updatedAt: now }).onConflictDoUpdate({
    target: requestRateLimits.key,
    set: {
      count: sql`case when ${requestRateLimits.expiresAt} <= ${now} then 1 else ${requestRateLimits.count} + 1 end`,
      windowStart: sql`case when ${requestRateLimits.expiresAt} <= ${now} then ${now} else ${requestRateLimits.windowStart} end`,
      expiresAt: sql`case when ${requestRateLimits.expiresAt} <= ${now} then ${expiresAt} else ${requestRateLimits.expiresAt} end`,
      updatedAt: now,
    },
  }).returning({ count: requestRateLimits.count, expiresAt: requestRateLimits.expiresAt })
  const count = updated?.count ?? 1
  const resetAt = updated?.expiresAt ?? expiresAt
  return { allowed: count <= limit, remaining: Math.max(0, limit - count), resetAt }
}

export function rateLimitResponse(resetAt: Date) {
  const retryAfter = Math.max(1, Math.ceil((resetAt.getTime() - Date.now()) / 1000))
  return Response.json({ error: 'RATE_LIMITED' }, { status: 429, headers: { 'Cache-Control': 'no-store', 'Retry-After': String(retryAfter) } })
}

function isSafeHttpsUrl(value: string) {
  try { return new URL(value).protocol === 'https:' } catch { return false }
}

function isSafeStoredUrl(key: string, value: string) {
  if (key === 'imageDataUrl' && /^\/api\/media\/upload\?id=[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) return true
  return isSafeHttpsUrl(value)
}

export function validateStoredPayload(value: unknown, depth = 0): string | null {
  if (depth > 12) return 'PAYLOAD_TOO_DEEP'
  if (value === null || typeof value === 'boolean' || typeof value === 'number') return null
  if (typeof value === 'string') return value.length <= 20_000 ? null : 'VALUE_TOO_LONG'
  if (Array.isArray(value)) {
    if (value.length > 10_000) return 'TOO_MANY_ITEMS'
    for (const item of value) { const error = validateStoredPayload(item, depth + 1); if (error) return error }
    return null
  }
  if (typeof value !== 'object') return 'INVALID_VALUE'
  const entries = Object.entries(value as Record<string, unknown>)
  if (entries.length > 250) return 'TOO_MANY_FIELDS'
  for (const [key, nested] of entries) {
    if (forbiddenObjectKeys.has(key)) return 'FORBIDDEN_FIELD'
    if (/(url|link|website)$/i.test(key) && typeof nested === 'string' && nested && !isSafeStoredUrl(key, nested)) return 'UNSAFE_URL'
    const error = validateStoredPayload(nested, depth + 1)
    if (error) return error
  }
  return null
}
