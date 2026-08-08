import { eq } from 'drizzle-orm'
import { auditLog, platformStates, userRoles, users, workspaceMembers, workspaces } from '../../db/schema.js'
import { platformRoles, requireRole, type PlatformRole } from '../../server/auth.js'
import { database } from '../../server/db.js'

const rolePriority: PlatformRole[] = ['admin', 'winery', 'merchant', 'host', 'member']

function workspaceDefinition(user: { id: string; username: string }, role: PlatformRole) {
  const labels: Record<PlatformRole, string> = {
    member: 'Private cellar',
    host: 'Host studio',
    winery: 'Winery studio',
    merchant: 'Merchant studio',
    admin: 'Platform administration',
  }
  const plans: Record<PlatformRole, 'member' | 'studio' | 'partner' | 'custom'> = {
    member: 'member', host: 'studio', winery: 'partner', merchant: 'partner', admin: 'custom',
  }
  const permissions: Record<PlatformRole, string[]> = {
    member: ['view', 'edit'],
    host: ['view', 'edit', 'publish'],
    winery: ['view', 'edit', 'publish', 'commerce'],
    merchant: ['view', 'edit', 'publish', 'commerce'],
    admin: ['view', 'edit', 'publish', 'commerce', 'moderate'],
  }
  const id = `user-${user.id}-${role}`
  const content = {
    id,
    name: `${user.username} · ${labels[role]}`,
    role,
    verification: role === 'admin' ? 'verified' : 'unverified',
    publishState: 'draft',
    plan: plans[role],
    planStatus: 'active',
    checklist: [
      { id: 'profile', complete: true },
      { id: 'identity', complete: role === 'member' || role === 'admin' },
      { id: 'first-publication', complete: false },
    ],
  }
  return { id, content, permissions: permissions[role] }
}

async function listAccounts() {
  const [accounts, roles, memberships] = await Promise.all([
    database.select({ id: users.id, username: users.username, displayName: users.displayName, role: users.role, disabled: users.disabled, createdAt: users.createdAt, lastLoginAt: users.lastLoginAt }).from(users),
    database.select({ userId: userRoles.userId, role: userRoles.role }).from(userRoles),
    database.select({ userId: workspaceMembers.userId, workspaceId: workspaceMembers.workspaceId }).from(workspaceMembers),
  ])
  return accounts.map(account => ({
    ...account,
    roles: roles.filter(item => item.userId === account.id).map(item => item.role),
    workspaceIds: memberships.filter(item => item.userId === account.id).map(item => item.workspaceId),
  }))
}

export async function GET(request: Request) {
  if (!await requireRole(request, ['admin'])) return Response.json({ error: 'FORBIDDEN' }, { status: 403 })
  return Response.json({ users: await listAccounts() }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function PATCH(request: Request) {
  const actor = await requireRole(request, ['admin'])
  if (!actor) return Response.json({ error: 'FORBIDDEN' }, { status: 403 })
  const body = await request.json().catch(() => null) as { userId?: string; roles?: string[]; disabled?: boolean } | null
  const requested = [...new Set(body?.roles ?? [])].filter((role): role is PlatformRole => platformRoles.includes(role as PlatformRole))
  if (!body?.userId) return Response.json({ error: 'USER_REQUIRED' }, { status: 400 })
  if (!requested.includes('member')) requested.unshift('member')
  if (body.userId === actor.id && !requested.includes('admin')) return Response.json({ error: 'CANNOT_REMOVE_OWN_ADMIN' }, { status: 400 })
  const [target] = await database.select({ id: users.id, username: users.username }).from(users).where(eq(users.id, body.userId)).limit(1)
  if (!target) return Response.json({ error: 'USER_NOT_FOUND' }, { status: 404 })

  await database.transaction(async tx => {
    await tx.delete(userRoles).where(eq(userRoles.userId, target.id))
    await tx.insert(userRoles).values(requested.map(role => ({ userId: target.id, role, grantedBy: actor.id })))
    const primary = rolePriority.find(role => requested.includes(role)) ?? 'member'
    await tx.update(users).set({ role: primary, disabled: Boolean(body.disabled), updatedAt: new Date() }).where(eq(users.id, target.id))

    for (const role of requested) {
      const workspace = workspaceDefinition(target, role)
      await tx.insert(workspaces).values({
        id: workspace.id,
        name: workspace.content.name,
        role,
        verification: role === 'admin' ? 'verified' : 'unverified',
        state: 'draft',
        content: workspace.content,
      }).onConflictDoUpdate({ target: workspaces.id, set: { name: workspace.content.name, role, content: workspace.content, updatedAt: new Date() } })
      await tx.insert(workspaceMembers).values({ workspaceId: workspace.id, userId: target.id, role, permissions: workspace.permissions }).onConflictDoUpdate({
        target: [workspaceMembers.workspaceId, workspaceMembers.userId],
        set: { role, permissions: workspace.permissions },
      })
    }
    const allRoleWorkspaces = platformRoles.map(role => `user-${target.id}-${role}`)
    const retained = new Set(requested.map(role => `user-${target.id}-${role}`))
    for (const workspaceId of allRoleWorkspaces) {
      if (!retained.has(workspaceId)) await tx.delete(workspaceMembers).where(eq(workspaceMembers.workspaceId, workspaceId))
    }
    const professionalRoles = requested.filter((role): role is 'host' | 'winery' | 'merchant' => ['host','winery','merchant'].includes(role))
    if (professionalRoles.length) {
      const [profileState] = await tx.select({ value: platformStates.value }).from(platformStates).where(eq(platformStates.key, 'partnerProfiles')).limit(1)
      const profiles = Array.isArray(profileState?.value) ? [...profileState.value] as Array<Record<string, unknown>> : []
      for (const role of professionalRoles) {
        const id = `profile-${target.id}-${role}`
        if (!profiles.some(profile => profile.id === id)) profiles.push({
          id,
          workspaceId:`user-${target.id}-${role}`,
          kind:role,
          displayName:target.username,
          tagline:'',
          story:'',
          languages:[],
          markets:[],
          serviceArea:'',
          verification:'unverified',
          publishState:'draft',
          expertise:[],
        })
      }
      await tx.insert(platformStates).values({ key:'partnerProfiles', value:profiles, updatedBy:actor.id, updatedAt:new Date() }).onConflictDoUpdate({
        target:platformStates.key,
        set:{ value:profiles, updatedBy:actor.id, updatedAt:new Date() },
      })
    }
    await tx.insert(auditLog).values({ actorUserId: actor.id, action: 'user.roles.updated', entityType: 'user', entityId: target.id, details: { roles: requested, disabled: Boolean(body.disabled) } })
  })
  return Response.json({ users: await listAccounts() })
}
