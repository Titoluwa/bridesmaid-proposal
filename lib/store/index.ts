import { createFileStore } from './file'
import { createNeonStore } from './neon'
import type { ResponseStore } from './types'

export type { ResponseRecord, ResponseStore } from './types'

const globalForStore = globalThis as unknown as { __bridesmaidStore?: ResponseStore }

function isValidPostgresUrl(url?: string | null): boolean {
  if (!url) return false
  const lower = url.toLowerCase()
  if (
    lower.includes('your_password') ||
    lower.includes('ep-example-pooler') ||
    lower.includes('example.com')
  ) {
    return false
  }
  return lower.startsWith('postgres://') || lower.startsWith('postgresql://')
}

/**
 * Creates a resilient store that uses Neon Postgres when a valid URL is
 * provided, but safely falls back to local file storage if the database is
 * unreachable or credentials fail (such as during prerendering or dev).
 */
function createResilientStore(databaseUrl: string): ResponseStore {
  const neonStore = createNeonStore(databaseUrl)
  const fileStore = createFileStore()
  let hasFailed = false

  async function withFallback<T>(fn: (store: ResponseStore) => Promise<T>): Promise<T> {
    if (hasFailed) {
      return fn(fileStore)
    }
    try {
      return await fn(neonStore)
    } catch (err) {
      console.warn('[store] Neon connection error, falling back to local file store:', err)
      hasFailed = true
      return fn(fileStore)
    }
  }

  return {
    kind: 'neon',
    get: (slug) => withFallback((s) => s.get(slug)),
    all: () => withFallback((s) => s.all()),
    recordOpen: (slug) => withFallback((s) => s.recordOpen(slug)),
    recordAccept: (slug, hesitations) => withFallback((s) => s.recordAccept(slug, hesitations)),
    assignColor: (slug, candidate, palette) => withFallback((s) => s.assignColor(slug, candidate, palette)),
    reset: (slug) => withFallback((s) => s.reset(slug)),
  }
}

/**
 * Returns the active response store.
 * - Valid DATABASE_URL set → Postgres (Neon / Vercel Postgres with auto-fallback)
 * - Otherwise              → local JSON file at .data/responses.json
 */
export function getStore(): ResponseStore {
  if (!globalForStore.__bridesmaidStore) {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
    if (isValidPostgresUrl(url)) {
      globalForStore.__bridesmaidStore = createResilientStore(url!)
    } else {
      globalForStore.__bridesmaidStore = createFileStore()
    }
  }
  return globalForStore.__bridesmaidStore
}
