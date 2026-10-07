import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import type { BridesmaidColor } from '@/lib/bridesmaids'
import type { ResponseRecord, ResponseStore } from './types'

type Row = {
  slug: string
  opened_at: Date | string | null
  open_count: number
  accepted_at: Date | string | null
  hesitations: number
  color_name: string | null
  color_hex: string | null
  color_assigned_at: Date | string | null
}

const iso = (value: Date | string | null) => (value ? new Date(value).toISOString() : null)

function toRecord(row: Row): ResponseRecord {
  return {
    slug: row.slug,
    openedAt: iso(row.opened_at),
    openCount: Number(row.open_count ?? 0),
    acceptedAt: iso(row.accepted_at),
    hesitations: Number(row.hesitations ?? 0),
    colorName: row.color_name,
    colorHex: row.color_hex,
    colorAssignedAt: iso(row.color_assigned_at),
  }
}

/**
 * Postgres-backed store (Neon / Vercel Postgres) using DATABASE_URL.
 * The table is created automatically on first use — see db/schema.sql.
 */
export function createNeonStore(databaseUrl: string): ResponseStore {
  const sql: NeonQueryFunction<false, false> = neon(databaseUrl)
  let ready: Promise<unknown> | null = null

  const ensureTable = () => {
    ready ??= sql`
      CREATE TABLE IF NOT EXISTS bridesmaid_responses (
        slug              TEXT PRIMARY KEY,
        opened_at         TIMESTAMPTZ,
        open_count        INTEGER NOT NULL DEFAULT 0,
        accepted_at       TIMESTAMPTZ,
        hesitations       INTEGER NOT NULL DEFAULT 0,
        color_name        TEXT,
        color_hex         TEXT,
        color_assigned_at TIMESTAMPTZ,
        updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `.catch((error) => {
      ready = null
      throw error
    })
    return ready
  }

  const one = (rows: unknown) => toRecord((rows as Row[])[0])

  return {
    kind: 'neon',

    async get(slug) {
      await ensureTable()
      const rows = (await sql`SELECT * FROM bridesmaid_responses WHERE slug = ${slug}`) as Row[]
      return rows[0] ? toRecord(rows[0]) : null
    },

    async all() {
      await ensureTable()
      const rows = (await sql`SELECT * FROM bridesmaid_responses`) as Row[]
      return rows.map(toRecord)
    },

    async recordOpen(slug) {
      await ensureTable()
      return one(await sql`
        INSERT INTO bridesmaid_responses (slug, opened_at, open_count)
        VALUES (${slug}, now(), 1)
        ON CONFLICT (slug) DO UPDATE SET
          opened_at  = COALESCE(bridesmaid_responses.opened_at, now()),
          open_count = bridesmaid_responses.open_count + 1,
          updated_at = now()
        RETURNING *
      `)
    },

    async recordAccept(slug, hesitations) {
      await ensureTable()
      return one(await sql`
        INSERT INTO bridesmaid_responses (slug, opened_at, open_count, accepted_at, hesitations)
        VALUES (${slug}, now(), 1, now(), ${hesitations})
        ON CONFLICT (slug) DO UPDATE SET
          opened_at   = COALESCE(bridesmaid_responses.opened_at, now()),
          accepted_at = COALESCE(bridesmaid_responses.accepted_at, now()),
          hesitations = GREATEST(bridesmaid_responses.hesitations, EXCLUDED.hesitations),
          updated_at  = now()
        RETURNING *
      `)
    },

    async assignColor(slug, candidate: BridesmaidColor) {
      await ensureTable()
      // Atomic first-write-wins: an existing colour is never overwritten,
      // even if two requests race each other.
      return one(await sql`
        INSERT INTO bridesmaid_responses (slug, opened_at, open_count, accepted_at, color_name, color_hex, color_assigned_at)
        VALUES (${slug}, now(), 1, now(), ${candidate.name}, ${candidate.hex}, now())
        ON CONFLICT (slug) DO UPDATE SET
          opened_at         = COALESCE(bridesmaid_responses.opened_at, now()),
          accepted_at       = COALESCE(bridesmaid_responses.accepted_at, now()),
          color_name        = COALESCE(bridesmaid_responses.color_name, EXCLUDED.color_name),
          color_hex         = COALESCE(bridesmaid_responses.color_hex, EXCLUDED.color_hex),
          color_assigned_at = COALESCE(bridesmaid_responses.color_assigned_at, EXCLUDED.color_assigned_at),
          updated_at        = now()
        RETURNING *
      `)
    },

    async reset(slug) {
      await ensureTable()
      await sql`DELETE FROM bridesmaid_responses WHERE slug = ${slug}`
    },
  }
}
