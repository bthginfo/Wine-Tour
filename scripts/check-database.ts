import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL_UNPOOLED or DATABASE_URL is required to check the database.')

const expected = {
  regions:222,
  grapes:107,
  producers:203,
  wines:409,
  aromas:77,
  academy_lessons:11,
} as const

const pool = new Pool({ connectionString, max:1 })

try {
  const counts:Record<string,number> = {}
  for (const [table, minimum] of Object.entries(expected)) {
    const result = await pool.query(`select count(*)::int as count from ${table}`)
    counts[table] = result.rows[0].count
    if (counts[table] < minimum) throw new Error(`${table} has ${counts[table]} rows; expected at least ${minimum}`)
  }
  const snapshot = await pool.query("select version, counts, published_at from catalog_snapshots where id='current'")
  if (!snapshot.rowCount) throw new Error('Current catalogue snapshot is missing.')
  if (snapshot.rows[0].counts.articles !== expected.academy_lessons) throw new Error(`Snapshot reports ${snapshot.rows[0].counts.articles} lessons; expected ${expected.academy_lessons}`)
  const mediaUploads = await pool.query("select enabled, configuration from feature_flags where key='media_uploads'")
  if (!mediaUploads.rowCount || !mediaUploads.rows[0].enabled || mediaUploads.rows[0].configuration?.provider !== 'vercel-blob') {
    throw new Error('Vercel Blob media uploads are not enabled in the production feature flags.')
  }
  const backend = await pool.query(`
    select
      (select count(*)::int from users where disabled = false) as users,
      (select count(*)::int from user_roles where role = 'admin') as admins,
      (select count(*)::int from platform_states) as platform_states,
      (select count(*)::int from workspaces) as workspaces
  `)
  const backendCounts = backend.rows[0] as {users:number;admins:number;platform_states:number;workspaces:number}
  if (backendCounts.admins < 1) throw new Error('No active administrator role is provisioned.')
  if (backendCounts.platform_states < 8) throw new Error(`Only ${backendCounts.platform_states} platform state records are present; expected at least 8.`)
  console.log(JSON.stringify({ ok:true, counts, backend:backendCounts, snapshot:snapshot.rows[0], mediaUploads:mediaUploads.rows[0] }))
} finally {
  await pool.end()
}
