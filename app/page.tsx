import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { allBridesmaids } from '@/lib/bridesmaids'
import { adminConfigured, isAdmin } from '@/lib/admin-auth'
import { site } from '@/lib/site'
import { Backdrop } from '@/components/proposal/Backdrop'
import { AdminLoginForm } from '@/components/auth/AdminLoginForm'
import { logoutAdminAction } from '@/app/admin/actions'

export const metadata: Metadata = {
  title: `${site.title} · Bridal Party Directory`,
  robots: { index: false, follow: false },
}

export default async function HomePage() {
  const isAuthorized = await isAdmin()

  if (!isAuthorized) {
    return (
      <AdminLoginForm
        configured={adminConfigured()}
        title="Private Bridal Portal"
        description="Enter the password to view the bridal party letters directory."
        buttonText="Enter Directory"
      />
    )
  }

  const girls = allBridesmaids()

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-ivory text-ink">
      <Backdrop />

      {/* Top Bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-4xl items-center justify-between px-4 pt-6 sm:px-10 sm:pt-8">
        <Image
          src={site.logo}
          alt={site.couple}
          width={44}
          height={44}
          priority
          className="h-9 w-9 object-contain drop-shadow-xs sm:h-10 sm:w-10"
        />
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/admin"
            className="btn-ghost text-xs"
          >
            Admin Dashboard
          </Link>
          <form action={logoutAdminAction}>
            <button type="submit" className="btn-ghost text-xs">
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-4 pt-8 pb-16 text-center sm:px-6 sm:pt-12 sm:pb-24">
        <p className="eyebrow">Personal Letters From</p>
        <h1 className="mt-3 px-2 text-balance font-display text-[clamp(2.4rem,9vw,5.5rem)] leading-[0.95] font-light tracking-tight text-ink sm:mt-4">
          Toluwani
        </h1>
        <p className="mt-3 max-w-md px-2 font-display text-lg text-muted italic sm:mt-4 sm:text-2xl">
          To the women who anchor me, bring the laughter, and walk with me into this new chapter.
        </p>

        <div className="my-8 h-px w-14 bg-line sm:my-10 sm:w-16" />

        {/* Bridesmaid Cards Grid */}
        <section className="w-full">
          <p className="eyebrow mb-5 sm:mb-6">Select a personalized letter</p>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
            {girls.map((bridesmaid) => {
              const isChief = bridesmaid.type === 'chief'

              return (
                <Link
                  key={bridesmaid.slug}
                  href={`/bridesmaids/${bridesmaid.slug}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-line bg-paper/75 p-5 text-left shadow-xs backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:border-ink/30 hover:shadow-md sm:p-6"
                >
                  {isChief && (
                    <div className="absolute top-0 right-0 rounded-bl-lg bg-wine px-3 py-1 font-sans text-[0.6rem] font-semibold tracking-wider text-ivory uppercase">
                      Chief Bridesmaid
                    </div>
                  )}

                  <div>
                    <span className="eyebrow block text-[0.62rem]">
                      {bridesmaid.role}
                    </span>
                    <h2 className="mt-2 font-display text-2xl font-normal text-ink group-hover:text-ink">
                      {bridesmaid.name}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                      {bridesmaid.message}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4 font-sans text-[0.68rem] tracking-wider text-ink-soft uppercase">
                    <span>Open letter ✉︎</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Footer Link */}
        <footer className="mt-20 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="btn-ghost text-xs"
            >
              Private Admin Dashboard
            </Link>
            <span className="text-muted">·</span>
            <form action={logoutAdminAction}>
              <button type="submit" className="btn-ghost text-xs">
                Sign out
              </button>
            </form>
          </div>
          <p className="text-[0.72rem] text-muted">
            Each link opens a unique, personalized proposal experience.
          </p>
        </footer>
      </main>
    </div>
  )
}
