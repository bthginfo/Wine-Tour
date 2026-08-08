import { getSessionUser } from '../../server/auth.js'

export async function GET(request: Request) {
  return Response.json({ user: await getSessionUser(request) }, { headers: { 'Cache-Control': 'no-store' } })
}
