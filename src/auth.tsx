import { createContext, Fragment, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { clearPersonalRepositoryState, hydrateRepositoryState } from './data/repository'
import type { User } from './types'

type AuthResult = string | null
type AuthValue = {
  user: User | null
  ready: boolean
  login: (username: string, password: string) => Promise<AuthResult>
  register: (username: string, password: string) => Promise<AuthResult>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

async function readAccount() {
  const response = await fetch('/api/auth/me', { headers: { Accept: 'application/json' }, credentials: 'same-origin' })
  if (!response.ok) return null
  const payload = await response.json() as { user?: User | null }
  return payload.user ?? null
}

async function authenticate(path: 'login' | 'register', username: string, password: string) {
  const response = await fetch(`/api/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ username, password }),
  })
  const payload = await response.json().catch(() => ({})) as { user?: User; error?: string }
  return { ok: response.ok, user: payload.user ?? null, error: payload.error ?? 'BACKEND_UNAVAILABLE' }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [sessionVersion, setSessionVersion] = useState(0)

  useEffect(() => {
    let active = true
    void (async () => {
      try {
        const account = await readAccount()
        await hydrateRepositoryState(Boolean(account))
        if (active) setUser(account)
      } finally {
        if (active) setReady(true)
      }
    })()
    return () => { active = false }
  }, [])

  const refresh = async () => {
    const account = await readAccount()
    await hydrateRepositoryState(Boolean(account))
    setUser(account)
    setSessionVersion(value => value + 1)
  }

  const value = useMemo<AuthValue>(() => ({
    user,
    ready,
    login: async (username, password) => {
      try {
        const result = await authenticate('login', username, password)
        if (!result.ok || !result.user) return result.error
        await hydrateRepositoryState(true)
        setUser(result.user)
        setSessionVersion(version => version + 1)
        return null
      } catch {
        return 'BACKEND_UNAVAILABLE'
      }
    },
    register: async (username, password) => {
      try {
        const result = await authenticate('register', username, password)
        if (!result.ok || !result.user) return result.error
        await hydrateRepositoryState(true, true)
        setUser(result.user)
        setSessionVersion(version => version + 1)
        return null
      } catch {
        return 'BACKEND_UNAVAILABLE'
      }
    },
    logout: async () => {
      try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }) } finally {
        clearPersonalRepositoryState()
        await hydrateRepositoryState(false)
        setUser(null)
        setSessionVersion(version => version + 1)
      }
    },
    refresh,
  }), [user, ready])

  if (!ready) return <div className="app-bootstrap" aria-busy="true"><span /></div>
  return <AuthContext.Provider value={value}><Fragment key={sessionVersion}>{children}</Fragment></AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('AuthProvider missing')
  return value
}
