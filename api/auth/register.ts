import { auditLog, userRoles, users, workspaceMembers, workspaces } from '../../db/schema.js'
import { createPasswordHash, createSession, normalizeUsername, setSessionCookie, validateCredentials } from '../../server/auth.js'
import { database } from '../../server/db.js'
import { eq } from 'drizzle-orm'
import { consumeRateLimit, rateLimitResponse, rejectCrossSiteMutation } from '../../server/security.js'

export async function POST(request: Request) {
  const crossSite = rejectCrossSiteMutation(request)
  if (crossSite) return crossSite
  const limit = await consumeRateLimit(request, 'register', 8, 60 * 60_000)
  if (!limit.allowed) return rateLimitResponse(limit.resetAt)
  const body = await request.json().catch(() => null) as { username?: string; password?: string } | null
  const username = body?.username?.trim() ?? ''
  const password = body?.password ?? ''
  const validation = validateCredentials(username, password)
  if (validation) return Response.json({ error: validation }, { status: 400 })

  const normalized = normalizeUsername(username)
  const existing = await database.select({ id: users.id }).from(users).where(eq(users.usernameNormalized, normalized)).limit(1)
  if (existing.length) return Response.json({ error: 'USERNAME_TAKEN' }, { status: 409 })

  const passwordRecord = await createPasswordHash(password)
  let account: { id: string; username: string }
  try {
    account = await database.transaction(async tx => {
      const [created] = await tx.insert(users).values({
        username,
        usernameNormalized: normalized,
        passwordHash: passwordRecord.hash,
        passwordSalt: passwordRecord.salt,
        displayName: username,
        role: 'member',
      }).returning({ id: users.id, username: users.username })
      await tx.insert(userRoles).values({ userId: created.id, role: 'member' })
      const workspaceId = `user-${created.id}-member`
      const workspace = {
        id: workspaceId,
        name: `${created.username} · Private cellar`,
        role: 'member' as const,
        verification: 'unverified' as const,
        publishState: 'draft' as const,
        plan: 'member' as const,
        planStatus: 'active' as const,
        checklist: [{ id: 'profile', complete: true }, { id: 'first-tasting', complete: false }],
      }
      await tx.insert(workspaces).values({ id: workspaceId, name: workspace.name, role: 'member', verification: 'unverified', state: 'draft', content: workspace })
      await tx.insert(workspaceMembers).values({ workspaceId, userId: created.id, role: 'member', permissions: ['view', 'edit'] })
      await tx.insert(auditLog).values({ actorUserId: created.id, action: 'account.registered', entityType: 'user', entityId: created.id, details: { username: created.username } })
      return created
    })
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return Response.json({ error: 'USERNAME_TAKEN' }, { status: 409 })
    }
    throw error
  }

  const session = await createSession(account.id)
  const response = Response.json({ user: { id: account.id, username: account.username, displayName: account.username, role: 'member', roles: ['member'], workspaceIds: [`user-${account.id}-member`] } }, { status: 201 })
  return setSessionCookie(response, session.token, request)
}
