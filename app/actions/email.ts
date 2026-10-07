'use server'

import { getBridesmaid, type BridesmaidColor } from '@/lib/bridesmaids'
import { sendKeepsakeEmail } from '@/lib/email'

export async function sendKeepsakeAction({
  slug,
  email,
  customColor,
}: {
  slug: string
  email: string
  customColor?: BridesmaidColor | null
}): Promise<{ success: boolean; error?: string }> {
  const trimmed = email.trim()
  if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  const bridesmaid = getBridesmaid(slug)
  if (!bridesmaid) {
    return { success: false, error: 'Bridesmaid record not found.' }
  }

  let colors: BridesmaidColor[] = []
  if (bridesmaid.type === 'chief') {
    colors = bridesmaid.colors ?? []
  } else if (customColor) {
    colors = [customColor]
  }

  if (colors.length === 0) {
    return { success: false, error: 'No color assigned yet.' }
  }

  return await sendKeepsakeEmail({
    toEmail: trimmed,
    bridesmaid,
    colors,
  })
}
