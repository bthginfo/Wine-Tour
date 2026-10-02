/**
 * Keep interaction-only browser data separate for each signed-in account.
 * Old unscoped values may belong to a guest or a previous signed-in account.
 * They are deliberately left untouched and are never read automatically.
 */
export function scopedInteractionKey(key: string, accountId?: string | null) {
  return accountId ? `${key}:account:${encodeURIComponent(accountId)}` : `${key}:guest`
}

export function readInteractionValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const value = window.localStorage.getItem(key)
    return value === null ? fallback : JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function writeInteractionValue(key: string, value: unknown) {
  if (typeof window === 'undefined') return false
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
