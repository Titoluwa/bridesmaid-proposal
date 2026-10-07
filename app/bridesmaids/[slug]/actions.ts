'use server'

import { randomInt } from 'node:crypto'
import { bridesmaidColors, getBridesmaid, type BridesmaidColor } from '@/lib/bridesmaids'
import { getStore } from '@/lib/store'

export type ActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string }

function requireBridesmaid(slug: string) {
  const bridesmaid = getBridesmaid(slug)
  if (!bridesmaid) throw new Error('Unknown bridesmaid')
  return bridesmaid
}

async function attempt<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() }
  } catch (error) {
    console.error('[bridesmaid action]', error)
    return { ok: false, error: 'Something went a little wrong. Please try again.' }
  }
}

/** Called when she taps "Open your letter". */
export async function openLetterAction(slug: string) {
  return attempt(async () => {
    requireBridesmaid(slug)
    await getStore().recordOpen(slug)
  })
}

/** Called when she says yes. */
export async function acceptProposalAction(slug: string, hesitations: number) {
  return attempt(async () => {
    requireBridesmaid(slug)
    const safeHesitations = Math.max(0, Math.min(99, Math.floor(Number(hesitations) || 0)))
    await getStore().recordAccept(slug, safeHesitations)
  })
}

/**
 * Picks a random pastel colour on the server and persists it.
 * If she already has one, her existing colour is returned instead —
 * so refreshing or reopening the link can never change it.
 */
export async function revealColorAction(slug: string): Promise<ActionResult<BridesmaidColor>> {
  return attempt(async () => {
    const bridesmaid = requireBridesmaid(slug)
    if (!bridesmaid.randomColor) throw new Error('This bridesmaid has fixed colours')

    const candidate = bridesmaidColors[randomInt(bridesmaidColors.length)]
    const record = await getStore().assignColor(slug, candidate)
    const assigned = bridesmaidColors.find((color) => color.name === record.colorName)
    if (!assigned) throw new Error('Stored colour is not in the palette')
    return assigned
  })
}
