import type { BridesmaidColor } from '@/lib/bridesmaids'

/** One row per bridesmaid. Everything is nullable until it happens. */
export type ResponseRecord = {
  slug: string
  openedAt: string | null
  openCount: number
  acceptedAt: string | null
  /** How many times she tapped "Let me think..." before saying yes 😂 */
  hesitations: number
  colorName: string | null
  colorHex: string | null
  colorAssignedAt: string | null
}

export interface ResponseStore {
  readonly kind: 'neon' | 'file'
  get(slug: string): Promise<ResponseRecord | null>
  all(): Promise<ResponseRecord[]>
  recordOpen(slug: string): Promise<ResponseRecord>
  recordAccept(slug: string, hesitations: number): Promise<ResponseRecord>
  /**
   * Assigns a colour to a bridesmaid. If she already has a colour assigned,
   * her existing record is returned. If not yet assigned, picks randomly
   * from the unassigned colours in `palette` (or uses `candidate` if none
   * are available), ensuring no two bridesmaids get the same colour.
   */
  assignColor(
    slug: string,
    candidate: BridesmaidColor,
    palette?: BridesmaidColor[],
  ): Promise<ResponseRecord>
  reset(slug: string): Promise<void>
}

export function emptyRecord(slug: string): ResponseRecord {
  return {
    slug,
    openedAt: null,
    openCount: 0,
    acceptedAt: null,
    hesitations: 0,
    colorName: null,
    colorHex: null,
    colorAssignedAt: null,
  }
}
