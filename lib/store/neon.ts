import { randomInt } from 'node:crypto'
import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import { bridesmaidColors, isBridesmaidSlug, type BridesmaidColor } from '@/lib/bridesmaids'
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
    ready ??= (async () => {
      await sql`
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
      `
      await sql`
        CREATE UNIQUE INDEX IF NOT EXISTS bridesmaid_responses_color_name_unique
        ON bridesmaid_responses (color_name)
        WHERE color_name IS NOT NULL
      `.catch((err) => {
        console.warn('[neon] Notice: unique color index creation skipped:', err)
      })
    })().catch((error) => {
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

    async assignColor(slug: string, candidate: BridesmaidColor, palette?: BridesmaidColor[]) {
      await ensureTable()

      const pool = palette ?? bridesmaidColors
      const maxAttempts = 3

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // 1. If she already has a color, return her existing record immediately
        const existingRows = (await sql`SELECT * FROM bridesmaid_responses WHERE slug = ${slug}`) as Row[]
        if (existingRows[0]?.color_name) {
          return toRecord(existingRows[0])
        }

        // 2. Fetch all colors already claimed by other bridesmaids
        const takenRows = (await sql`
          SELECT slug, color_name, color_hex
          FROM bridesmaid_responses
          WHERE color_name IS NOT NULL AND slug != ${slug}
        `) as Row[]

        const takenNames = new Set<string>()
        const takenHexes = new Set<string>()
        for (const row of takenRows) {
          if (isBridesmaidSlug(row.slug) && row.color_name) {
            takenNames.add(row.color_name.toLowerCase().trim())
            if (row.color_hex) takenHexes.add(row.color_hex.toLowerCase().trim())
          }
        }

        // 3. Filter to available unassigned colors
        const available = pool.filter(
          (c) =>
            !takenNames.has(c.name.toLowerCase().trim()) &&
            !takenHexes.has(c.hex.toLowerCase().trim()),
        )

        const chosen =
          available.length > 0 ? available[randomInt(available.length)] : candidate

        try {
          return one(await sql`
            INSERT INTO bridesmaid_responses (slug, opened_at, open_count, accepted_at, color_name, color_hex, color_assigned_at)
            VALUES (${slug}, now(), 1, now(), ${chosen.name}, ${chosen.hex}, now())
            ON CONFLICT (slug) DO UPDATE SET
              opened_at         = COALESCE(bridesmaid_responses.opened_at, now()),
              accepted_at       = COALESCE(bridesmaid_responses.accepted_at, now()),
              color_name        = COALESCE(bridesmaid_responses.color_name, EXCLUDED.color_name),
              color_hex         = COALESCE(bridesmaid_responses.color_hex, EXCLUDED.color_hex),
              color_assigned_at = COALESCE(bridesmaid_responses.color_assigned_at, EXCLUDED.color_assigned_at),
              updated_at        = now()
            RETURNING *
          `)
        } catch (err) {
          if (attempt < maxAttempts - 1) {
            continue
          }
          throw err
        }
      }

      const finalRows = (await sql`SELECT * FROM bridesmaid_responses WHERE slug = ${slug}`) as Row[]
      return toRecord(finalRows[0])
    },

    async reset(slug) {
      await ensureTable()
      await sql`DELETE FROM bridesmaid_responses WHERE slug = ${slug}`
    },
  }
}
