import { eq } from 'drizzle-orm'
import { sessions } from '../../db/schema.js'
import { clearSessionCookie, hashSessionToken, readSessionToken } from '../../server/auth.js'
import { database } from '../../server/db.js'

export async function POST(request: Request) {
  const token = readSessionToken(request)
  if (token) await database.delete(sessions).where(eq(sessions.tokenHash, hashSessionToken(token)))
  return clearSessionCookie(Response.json({ ok: true }), request)
}
