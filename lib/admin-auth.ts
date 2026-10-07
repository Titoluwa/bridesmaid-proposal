import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'tm_admin'

/** True when an admin password is configured, or we're in local dev. */
export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD) || process.env.NODE_ENV !== 'production'
}

function expectedToken() {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return null
  return createHmac('sha256', password).update('bridesmaid-admin-session').digest('hex')
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

export function passwordMatches(input: string) {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  return safeEqual(input, password)
}

/**
 * Whether the current request belongs to the admin.
 * Without ADMIN_PASSWORD the admin is open in development only.
 */
export async function isAdmin() {
  const token = expectedToken()
  if (!token) return process.env.NODE_ENV !== 'production'
  const value = (await cookies()).get(ADMIN_COOKIE)?.value
  return Boolean(value && safeEqual(value, token))
}

export async function setAdminSession() {
  const token = expectedToken()
  if (!token) {
    return
  }
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 60,
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
}
