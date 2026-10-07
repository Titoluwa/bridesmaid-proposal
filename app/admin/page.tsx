import type { Metadata } from 'next'
import { allBridesmaids } from '@/lib/bridesmaids'
import { adminConfigured, isAdmin } from '@/lib/admin-auth'
import { getStore } from '@/lib/store'
import { AdminLoginForm } from '@/components/auth/AdminLoginForm'
import { AdminDashboard } from './AdminClient'

export const metadata: Metadata = {
  title: 'Bridal Party Overview · Admin',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const isAuthorized = await isAdmin()

  if (!isAuthorized) {
    return <AdminLoginForm configured={adminConfigured()} />
  }

  const store = getStore()
  const records = await store.all()
  const recordsBySlug = new Map(records.map((r) => [r.slug, r]))

  const rows = allBridesmaids().map((bridesmaid) => ({
    bridesmaid,
    record: recordsBySlug.get(bridesmaid.slug) ?? null,
  }))

  return (
    <AdminDashboard
      rows={rows}
      isPostgres={store.kind === 'neon'}
    />
  )
}
