'use server'

import { revalidatePath } from 'next/cache'
import { clearAdminSession, passwordMatches, setAdminSession } from '@/lib/admin-auth'
import { getStore } from '@/lib/store'

export async function loginAdminAction(formData: FormData): Promise<void> {
  const password = formData.get('password')
  if (typeof password === 'string' && passwordMatches(password)) {
    await setAdminSession()
    revalidatePath('/')
    revalidatePath('/admin')
  }
}

export async function logoutAdminAction(): Promise<void> {
  await clearAdminSession()
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function resetBridesmaidAction(slug: string): Promise<void> {
  const store = getStore()
  await store.reset(slug)
  revalidatePath('/admin')
  revalidatePath(`/bridesmaids/${slug}`)
}
