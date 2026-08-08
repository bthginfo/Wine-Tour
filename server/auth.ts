import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { and, eq, gt } from 'drizzle-orm'
import { sessions, userRoles, users, workspaceMembers } from '../db/schema.js'
import { database } from './db.js'

export const platformRoles = ['member', 'host', 'winery', 'merchant', 'admin'] as const
export type PlatformRole = typeof platformRoles[number]

const SESSION_COOKIE = 'vine_atlas_session'
const SESSION_SECONDS = 60 * 60 * 24 * 30
const scrypt = promisify(scryptCallback)

export type SessionUser = {
  id: string
  username: string
  displayName?: string
  role: PlatformRole
  roles: PlatformRole[]
  workspaceIds: string[]
}

export function normalizeUsername(value: string) {
  return value.trim().toLocaleLowerCase('en-US')
}

export function validateCredentials(username: string, password: string) {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{2,31}$/.test(username.trim())) return 'USERNAME_FORMAT'
  if (password.length < 8 || password.length > 128) return 'PASSWORD_LENGTH'
  return null
}

export async function createPasswordHash(password: string, salt = randomBytes(16).toString('hex')) {
  const derived = await scrypt(password, salt, 64) as Buffer
  return { salt, hash: derived.toString('hex') }
}

export async function verifyPassword(password: string, salt: string, expectedHash: string) {
  const derived = await scrypt(password, salt, 64) as Buffer
  const expected = Buffer.from(expectedHash, 'hex')
  return expected.length === derived.length && timingSafeEqual(expected, derived)
}

export function readSessionToken(request: Request) {
  const cookies = request.headers.get('cookie') ?? ''
  for (const part of cookies.split(';')) {
    const [name, ...value] = part.trim().split('=')
    if (name === SESSION_COOKIE) return decodeURIComponent(value.join('='))
  }
  return null
}

export function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + SESSION_SECONDS * 1000)
  await database.insert(sessions).values({ userId, tokenHash: hashSessionToken(token), expiresAt })
  return { token, expiresAt }
}

export function setSessionCookie(response: Response, token: string, request: Request) {
  const secure = new URL(request.url).protocol === 'https:' || Boolean(process.env.VERCEL)
  response.headers.append('Set-Cookie', `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_SECONDS}${secure ? '; Secure' : ''}`)
  return response
}

export function clearSessionCookie(response: Response, request: Request) {
  const secure = new URL(request.url).protocol === 'https:' || Boolean(process.env.VERCEL)
  response.headers.append('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}`)
  return response
}

export async function getSessionUser(request: Request): Promise<SessionUser | null> {
  const token = readSessionToken(request)
  if (!token) return null
  const rows = await database.select({
    id: users.id,
    username: users.username,
    displayName: users.displayName,
    role: users.role,
  }).from(sessions).innerJoin(users, eq(sessions.userId, users.id)).where(and(
    eq(sessions.tokenHash, hashSessionToken(token)),
    gt(sessions.expiresAt, new Date()),
    eq(users.disabled, false),
  )).limit(1)
  const account = rows[0]
  if (!account) return null
  const [roleRows, workspaceRows] = await Promise.all([
    database.select({ role: userRoles.role }).from(userRoles).where(eq(userRoles.userId, account.id)),
    database.select({ workspaceId: workspaceMembers.workspaceId }).from(workspaceMembers).where(eq(workspaceMembers.userId, account.id)),
  ])
  const roles = roleRows.length ? roleRows.map(row => row.role) : [account.role]
  if (!roles.includes('member')) roles.unshift('member')
  return {
    id: account.id,
    username: account.username,
    displayName: account.displayName ?? undefined,
    role: account.role,
    roles,
    workspaceIds: workspaceRows.map(row => row.workspaceId),
  }
}

export async function requireRole(request: Request, roles: PlatformRole[]) {
  const user = await getSessionUser(request)
  if (!user || !roles.some(role => user.roles.includes(role))) return null
  return user
}
