import { readFile, readdir } from 'node:fs/promises'

const requiredChecks = {
  'api/auth/register.ts': ['rejectCrossSiteMutation', 'consumeRateLimit', 'createPasswordHash'],
  'api/auth/login.ts': ['rejectCrossSiteMutation', 'consumeRateLimit', 'verifyPassword'],
  'api/auth/logout.ts': ['rejectCrossSiteMutation', 'hashSessionToken'],
  'api/state.ts': ['rejectCrossSiteMutation', 'consumeRateLimit', 'validateStoredPayload', 'pg_advisory_xact_lock'],
  'api/media/upload.ts': ['isSameOrigin', 'consumeRateLimit', "ascii.slice(8, 12) !== 'WEBP'", "access: 'private'", "'private, no-cache'", 'canEditWorkspace', 'isPublishedWorkspaceAsset'],
  'api/admin/users.ts': ['rejectCrossSiteMutation', 'consumeRateLimit', 'CANNOT_DISABLE_OWN_ACCOUNT', 'pausedWorkspaceIds', 'pg_advisory_xact_lock'],
  'api/admin/audit.ts': ['requireRole', 'consumeRateLimit', "'Cache-Control':'no-store'"],
  'api/events/invite.ts': ['consumeRateLimit', "'Cache-Control':'no-store'"],
  'api/tastings/join.ts': ['consumeRateLimit', 'secureJoinLink', "'Cache-Control':'no-store'"],
  'server/auth.ts': ['HttpOnly', 'SameSite=Lax', 'timingSafeEqual', 'randomBytes(32)'],
  'vercel.json': ['Content-Security-Policy', 'Strict-Transport-Security', 'X-Content-Type-Options'],
}

const errors = []
for (const [path, needles] of Object.entries(requiredChecks)) {
  const source = await readFile(path, 'utf8')
  for (const needle of needles) if (!source.includes(needle)) errors.push(`${path} is missing ${needle}`)
}

const schema = await readFile('db/schema.ts', 'utf8')
if (!schema.includes("pgTable('request_rate_limits'")) errors.push('Database rate-limit table is missing')

const trackedRoots = ['api', 'server', 'src', 'scripts', 'db']
const files = []
async function walk(path) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const child = `${path}/${entry.name}`
    if (entry.isDirectory()) await walk(child)
    else if (/\.(?:ts|tsx|js|mjs|sql|md|json)$/.test(entry.name)) files.push(child)
  }
}
for (const root of trackedRoots) await walk(root)
const tokenPattern = /(?:vcp_[A-Za-z0-9_-]{20,}|github_pat_[A-Za-z0-9_]{20,})/
for (const path of files) {
  const source = await readFile(path, 'utf8')
  if (tokenPattern.test(source)) errors.push(`Credential-like token found in ${path}`)
}

if (errors.length) throw new Error(`Security validation failed:\n${errors.join('\n')}`)
process.stdout.write(`Security validation passed: ${Object.keys(requiredChecks).length} boundaries and ${files.length} tracked files checked.\n`)
