import { eq, lt } from 'drizzle-orm'
import { sessions, users } from '../../db/schema.js'
import { createPasswordHash, createSession, getSessionUser, normalizeUsername, setSessionCookie, verifyPassword } from '../../server/auth.js'
import { database } from '../../server/db.js'

const DUMMY_SALT = 'd4f2ce19b89448079fe58a76f6e69bb2'
const LOCK_MINUTES = 15

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { username?: string; password?: string } | null
  const username = body?.username?.trim() ?? ''
  const password = body?.password ?? ''
  const [account] = await database.select().from(users).where(eq(users.usernameNormalized, normalizeUsername(username))).limit(1)

  if (!account) {
    await createPasswordHash(password || 'invalid-password', DUMMY_SALT)
    return Response.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 })
  }
  if (account.disabled) return Response.json({ error: 'ACCOUNT_DISABLED' }, { status: 403 })
  if (account.lockedUntil && account.lockedUntil > new Date()) return Response.json({ error: 'ACCOUNT_LOCKED' }, { status: 429 })

  const matches = await verifyPassword(password, account.passwordSalt, account.passwordHash)
  if (!matches) {
    const attempts = account.failedLoginAttempts + 1
    await database.update(users).set({
      failedLoginAttempts: attempts >= 10 ? 0 : attempts,
      lockedUntil: attempts >= 10 ? new Date(Date.now() + LOCK_MINUTES * 60_000) : null,
      updatedAt: new Date(),
    }).where(eq(users.id, account.id))
    return Response.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 })
  }

  await database.transaction(async tx => {
    await tx.update(users).set({ failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date(), updatedAt: new Date() }).where(eq(users.id, account.id))
    await tx.delete(sessions).where(lt(sessions.expiresAt, new Date()))
  })
  const session = await createSession(account.id)
  const probe = new Request(request.url, { headers: { cookie: `vine_atlas_session=${session.token}` } })
  const user = await getSessionUser(probe)
  const response = Response.json({ user })
  return setSessionCookie(response, session.token, request)
}
