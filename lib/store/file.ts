import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { BridesmaidColor } from '@/lib/bridesmaids'
import { emptyRecord, type ResponseRecord, type ResponseStore } from './types'

type FileShape = Record<string, ResponseRecord>

/**
 * Local JSON-file store used in development when DATABASE_URL isn't set.
 * Writes are serialised through a promise chain so concurrent requests in
 * the same process can't clobber each other.
 *
 * NOTE: serverless hosts (e.g. Vercel) have a read-only filesystem, so set
 * DATABASE_URL in production.
 */
export function createFileStore(filePath = path.join(process.cwd(), '.data', 'responses.json')): ResponseStore {
  let queue: Promise<unknown> = Promise.resolve()

  async function read(): Promise<FileShape> {
    try {
      return JSON.parse(await fs.readFile(filePath, 'utf8')) as FileShape
    } catch {
      return {}
    }
  }

  async function write(data: FileShape) {
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    const tmp = `${filePath}.${process.pid}.tmp`
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8')
    await fs.rename(tmp, filePath)
  }

  function mutate(slug: string, fn: (record: ResponseRecord, now: string) => ResponseRecord) {
    const run = queue.then(async () => {
      const data = await read()
      const now = new Date().toISOString()
      const next = fn(data[slug] ?? emptyRecord(slug), now)
      data[slug] = next
      await write(data)
      return next
    })
    queue = run.catch(() => undefined)
    return run
  }

  return {
    kind: 'file',

    async get(slug) {
      return (await read())[slug] ?? null
    },

    async all() {
      return Object.values(await read())
    },

    recordOpen(slug) {
      return mutate(slug, (r, now) => ({ ...r, openedAt: r.openedAt ?? now, openCount: r.openCount + 1 }))
    },

    recordAccept(slug, hesitations) {
      return mutate(slug, (r, now) => ({
        ...r,
        openedAt: r.openedAt ?? now,
        acceptedAt: r.acceptedAt ?? now,
        hesitations: Math.max(r.hesitations, hesitations),
      }))
    },

    assignColor(slug, candidate: BridesmaidColor) {
      return mutate(slug, (r, now) =>
        r.colorName
          ? r
          : {
              ...r,
              openedAt: r.openedAt ?? now,
              acceptedAt: r.acceptedAt ?? now,
              colorName: candidate.name,
              colorHex: candidate.hex,
              colorAssignedAt: now,
            },
      )
    },

    async reset(slug) {
      const run = queue.then(async () => {
        const data = await read()
        delete data[slug]
        await write(data)
      })
      queue = run.catch(() => undefined)
      await run
    },
  }
}
