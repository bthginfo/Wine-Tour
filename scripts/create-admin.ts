import { randomBytes, scrypt as scryptCallback } from 'node:crypto'
import { promisify } from 'node:util'
import { drizzle } from 'drizzle-orm/node-postgres'
import { sql } from 'drizzle-orm'
import { Pool } from 'pg'
import { auditLog, userRoles, users, workspaceMembers, workspaces } from '../db/schema'

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL
const username = process.env.ADMIN_USERNAME?.trim() ?? ''
const password = process.env.ADMIN_PASSWORD ?? ''

if (!connectionString) throw new Error('DATABASE_URL_UNPOOLED or DATABASE_URL is required.')
if (!/^[A-Za-z0-9][A-Za-z0-9._-]{2,31}$/.test(username)) throw new Error('ADMIN_USERNAME must be 3-32 safe username characters.')
if (password.length < 12 || password.length > 128) throw new Error('ADMIN_PASSWORD must contain 12-128 characters.')

const pool = new Pool({ connectionString, max:1 })
const db = drizzle(pool)
const scrypt = promisify(scryptCallback)

try {
  const salt = randomBytes(16).toString('hex')
  const passwordHash = ((await scrypt(password, salt, 64)) as Buffer).toString('hex')
  const normalized = username.toLocaleLowerCase('en-US')

  const adminId = await db.transaction(async tx => {
    const [account] = await tx.insert(users).values({
      username,
      usernameNormalized:normalized,
      passwordHash,
      passwordSalt:salt,
      displayName:username,
      role:'admin',
      disabled:false,
      failedLoginAttempts:0,
      lockedUntil:null,
      updatedAt:new Date(),
    }).onConflictDoUpdate({
      target:users.usernameNormalized,
      set:{ username, passwordHash, passwordSalt:salt, role:'admin', disabled:false, failedLoginAttempts:0, lockedUntil:null, updatedAt:new Date() },
    }).returning({ id:users.id })

    await tx.insert(userRoles).values([
      { userId:account.id, role:'member' },
      { userId:account.id, role:'admin' },
    ]).onConflictDoNothing()

    const workspaceId = `user-${account.id}-admin`
    const content = {
      id:workspaceId,
      name:'Vine Atlas Editorial',
      role:'admin',
      verification:'verified',
      publishState:'published',
      plan:'custom',
      planStatus:'active',
      checklist:[
        {id:'catalogue',complete:true},
        {id:'roles',complete:true},
        {id:'approvals',complete:false},
      ],
    }
    await tx.insert(workspaces).values({
      id:workspaceId,
      name:content.name,
      role:'admin',
      verification:'verified',
      state:'published',
      content,
    }).onConflictDoUpdate({
      target:workspaces.id,
      set:{ name:content.name, role:'admin', verification:'verified', state:'published', content, updatedAt:new Date() },
    })
    await tx.insert(workspaceMembers).values({
      workspaceId,
      userId:account.id,
      role:'admin',
      permissions:['view','edit','publish','commerce','moderate'],
    }).onConflictDoUpdate({
      target:[workspaceMembers.workspaceId,workspaceMembers.userId],
      set:{ role:'admin', permissions:['view','edit','publish','commerce','moderate'] },
    })
    await tx.insert(auditLog).values({
      actorUserId:account.id,
      action:'admin.provisioned',
      entityType:'user',
      entityId:account.id,
      details:{ source:'deployment-bootstrap' },
    })
    await tx.execute(sql`delete from sessions where user_id = ${account.id}`)
    return account.id
  })

  console.log(JSON.stringify({ok:true,adminId}))
} finally {
  await pool.end()
}
