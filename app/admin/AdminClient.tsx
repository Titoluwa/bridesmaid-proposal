'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import type { Bridesmaid } from '@/lib/bridesmaids'
import { site } from '@/lib/site'
import type { ResponseRecord } from '@/lib/store/types'
import { logoutAdminAction, resetBridesmaidAction } from './actions'

type AdminRow = {
  bridesmaid: Bridesmaid
  record: ResponseRecord | null
}

type Props = {
  rows: AdminRow[]
  isPostgres: boolean
}

export function AdminDashboard({ rows, isPostgres }: Readonly<Props>) {
  const [isPending, startTransition] = useTransition()
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null)

  const openedCount = rows.filter((r) => r.record?.openedAt).length
  const acceptedCount = rows.filter((r) => r.record?.acceptedAt).length
  const colorCount = rows.filter(
    (r) => r.bridesmaid.type === 'chief' || Boolean(r.record?.colorName),
  ).length

  const handleReset = (slug: string) => {
    startTransition(async () => {
      await resetBridesmaidAction(slug)
      setConfirmSlug(null)
    })
  }

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAdminAction()
    })
  }

  return (
    <div className="min-h-screen bg-ivory px-3.5 py-6 text-ink sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        {/* Top Header */}
        <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src={site.logo}
                alt={site.couple}
                width={36}
                height={36}
                className="h-8 w-8 object-contain drop-shadow-xs"
              />
              <span className="text-muted">·</span>
              <span className="eyebrow">Bridal Party Dashboard</span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-light text-ink sm:text-4xl">
              Proposal Responses &amp; Colors
            </h1>
            <p className="mt-1 text-xs text-muted sm:text-sm">
              {isPostgres
                ? 'Connected to Postgres (Neon / Vercel Postgres).'
                : 'Local JSON storage active (.data/responses.json). Set DATABASE_URL to connect Postgres.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/"
              className="btn-ghost text-xs"
            >
              Letters Directory
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="btn-ghost text-xs"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Metric Cards */}
        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-xl border border-line bg-paper/60 p-3.5 shadow-xs sm:p-5">
            <p className="eyebrow text-[0.62rem]">Total Party</p>
            <p className="mt-1.5 font-display text-2xl text-ink sm:mt-2 sm:text-3xl">{rows.length}</p>
            <p className="mt-1 text-[0.7rem] text-muted sm:text-xs">1 Chief · 7 Bridesmaids</p>
          </div>

          <div className="rounded-xl border border-line bg-paper/60 p-3.5 shadow-xs sm:p-5">
            <p className="eyebrow text-[0.62rem]">Opened</p>
            <p className="mt-1.5 font-display text-2xl text-ink sm:mt-2 sm:text-3xl">
              {openedCount} <span className="text-base text-muted sm:text-lg">/ {rows.length}</span>
            </p>
            <p className="mt-1 text-[0.7rem] text-muted sm:text-xs">{openedCount === rows.length ? 'All opened! 💌' : 'Waiting'}</p>
          </div>

          <div className="rounded-xl border border-line bg-paper/60 p-3.5 shadow-xs sm:p-5">
            <p className="eyebrow text-[0.62rem]">Accepted</p>
            <p className="mt-1.5 font-display text-2xl text-sage sm:mt-2 sm:text-3xl">
              {acceptedCount} <span className="text-base text-muted sm:text-lg">/ {rows.length}</span>
            </p>
            <p className="mt-1 text-[0.7rem] text-muted sm:text-xs">{acceptedCount > 0 ? 'Said yes! 🤍' : 'Awaiting'}</p>
          </div>

          <div className="rounded-xl border border-line bg-paper/60 p-3.5 shadow-xs sm:p-5">
            <p className="eyebrow text-[0.62rem]">Colors</p>
            <p className="mt-1.5 font-display text-2xl text-ink sm:mt-2 sm:text-3xl">
              {colorCount} <span className="text-base text-muted sm:text-lg">/ {rows.length}</span>
            </p>
            <p className="mt-1 text-[0.7rem] text-muted sm:text-xs">Persistent palette</p>
          </div>
        </div>

        {/* Responses Table */}
        <div className="mt-10 overflow-hidden rounded-xl border border-line bg-paper shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-sand/30 font-sans text-[0.68rem] tracking-[0.2em] text-muted uppercase">
                <tr>
                  <th className="px-6 py-4">Bridesmaid</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Response</th>
                  <th className="px-6 py-4">Assigned Color</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {rows.map(({ bridesmaid, record }) => {
                  const isChief = bridesmaid.type === 'chief'
                  const opened = Boolean(record?.openedAt)
                  const accepted = Boolean(record?.acceptedAt)

                  let responseBadge = <span className="text-muted">—</span>
                  if (accepted) {
                    responseBadge = (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-sage/15 px-3 py-1 font-sans text-xs font-medium text-sage">
                        <span>Yes, of course</span>
                        <span>🤍</span>
                      </span>
                    )
                  } else if (opened) {
                    responseBadge = (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-champagne/30 px-3 py-1 font-sans text-xs font-medium text-ink-soft">
                        <span>Opened</span>
                        <span className="text-[0.65rem] text-muted">({record?.openCount}×)</span>
                      </span>
                    )
                  }

                  let colorBadge = <span className="text-muted">—</span>
                  if (isChief) {
                    colorBadge = (
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          <span className="h-5 w-5 rounded-full border border-paper bg-[#D9BF8C] shadow-xs" title="Champagne Gold" />
                          <span className="h-5 w-5 rounded-full border border-paper bg-wine shadow-xs" title="Wine" />
                        </div>
                        <div>
                          <span className="font-sans text-xs font-medium text-ink">Champagne Gold / Wine</span>
                          <span className="block text-[0.65rem] text-muted">Designated Bridal Colors</span>
                        </div>
                      </div>
                    )
                  } else if (record?.colorName && record.colorHex) {
                    colorBadge = (
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-5 w-5 rounded-full border border-paper shadow-xs"
                          style={{ backgroundColor: record.colorHex }}
                        />
                        <div>
                          <span className="font-sans text-xs font-medium text-ink">
                            {record.colorName}
                          </span>
                          <span className="block font-mono text-[0.65rem] text-muted">
                            {record.colorHex}
                          </span>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <tr key={bridesmaid.slug} className="transition-colors hover:bg-sand/15">
                      {/* Bridesmaid Name */}
                      <td className="px-6 py-4">
                        <div className="font-display text-base font-medium text-ink">
                          {bridesmaid.name}
                        </div>
                        <div className="text-xs text-muted">
                          /bridesmaids/{bridesmaid.slug}
                        </div>
                        {record?.hesitations && record.hesitations > 0 ? (
                          <div className="mt-1 text-[0.7rem] text-muted italic">
                            Hesitated {record.hesitations}× before YES 😂
                          </div>
                        ) : null}
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <div className="font-sans text-xs font-semibold text-ink">
                          {bridesmaid.role}
                        </div>
                        <div className="eyebrow mt-0.5 text-[0.62rem]">
                          {bridesmaid.weddingRole}
                        </div>
                      </td>

                      {/* Response */}
                      <td className="px-6 py-4">
                        {responseBadge}
                      </td>

                      {/* Assigned Color */}
                      <td className="px-6 py-4">
                        {colorBadge}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/bridesmaids/${bridesmaid.slug}`}
                            target="_blank"
                            className="rounded-md border border-line px-2.5 py-1 text-xs text-ink-soft transition-colors hover:border-ink hover:text-ink"
                          >
                            Open Link ↗
                          </Link>

                          {confirmSlug === bridesmaid.slug ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleReset(bridesmaid.slug)}
                                disabled={isPending}
                                className="rounded-md bg-wine px-2 py-1 text-xs text-white hover:bg-wine/90"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmSlug(null)}
                                className="rounded-md border border-line px-2 py-1 text-xs text-muted"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmSlug(bridesmaid.slug)}
                              title="Reset response and assigned color for this bridesmaid"
                              className="rounded-md px-2 py-1 text-xs text-muted hover:text-wine"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <footer className="mt-8 text-center text-xs text-muted">
          <p>
            Private bridesmaid management view · Responses and color choices are saved automatically.
          </p>
        </footer>
      </div>
    </div>
  )
}
