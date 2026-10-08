'use client'

import Image from 'next/image'
import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import type { Bridesmaid, BridesmaidColor } from '@/lib/bridesmaids'
import { site } from '@/lib/site'
import { sendKeepsakeAction } from '@/app/actions/email'
import { easeSoft, fadeUp, stagger } from './motion'

type Props = {
  bridesmaid: Bridesmaid
  color: BridesmaidColor | null
  onContinue: () => void
}

function resolveDisplayColors(
  isChief: boolean,
  bridesmaid: Bridesmaid,
  color: BridesmaidColor | null,
): BridesmaidColor[] {
  if (isChief) {
    return bridesmaid.colors ?? []
  }
  if (color) {
    return [color]
  }
  return []
}

/** A keepsake place-card summarising her role and colour. */
export function ColorSummary({ bridesmaid, color, onContinue }: Readonly<Props>) {
  const isChief = bridesmaid.type === 'chief'
  const colors = resolveDisplayColors(isChief, bridesmaid, color)

  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || isPending) return

    setErrorMessage(null)
    startTransition(async () => {
      const res = await sendKeepsakeAction({
        slug: bridesmaid.slug,
        email,
        customColor: color,
      })

      if (res.success) {
        setEmailStatus('success')
      } else {
        setEmailStatus('error')
        setErrorMessage(res.error || 'Could not send email. Please try again.')
      }
    })
  }

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-3.5 pt-6 pb-16 text-center sm:px-5 sm:pt-8 sm:pb-20">
      <motion.article
        initial={{ opacity: 0, y: 50, rotate: 1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 1.3, ease: easeSoft }}
        className="letter-paper paper-grain relative w-full max-w-100 overflow-hidden rounded-[4px] px-5 py-9 sm:px-8 sm:py-12"
        aria-label={`${bridesmaid.shortName}'s keepsake card`}
      >
        {/* frames */}
        <div aria-hidden className="pointer-events-none absolute inset-2.5 border border-line sm:inset-3" />
        <div aria-hidden className="pointer-events-none absolute inset-3.5 border border-accent/60 sm:inset-4.5" />
        {/* colour wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[130%] -translate-x-1/2 rounded-[50%] bg-accent/35 blur-2xl"
        />

        <motion.div variants={stagger(0.22, 0.6)} initial="hidden" animate="show" className="relative">
          <motion.div variants={fadeUp} className="mb-2.5 flex justify-center">
            <Image
              src={site.logo}
              alt={site.couple}
              width={34}
              height={34}
              className="h-8 w-8 object-contain drop-shadow-xs"
            />
          </motion.div>
          <motion.p variants={fadeUp} className="eyebrow">
            The bridal party of
          </motion.p>
          <motion.p variants={fadeUp} className="mt-2 font-script text-[1.9rem] leading-tight text-ink sm:text-[2.1rem]">
            {site.couple}
          </motion.p>

          <motion.span variants={fadeUp} className="mx-auto mt-5 block h-px w-10 bg-ink/25 sm:mt-6" />

          <motion.h2
            variants={fadeUp}
            className="mt-5 px-1 text-balance break-words font-display text-[clamp(2.1rem,9.5vw,3.6rem)] leading-tight font-light text-ink sm:mt-7"
          >
            {bridesmaid.shortName}
          </motion.h2>

          <motion.p variants={fadeUp} className="mt-2 font-display text-[1.3rem] text-ink-soft italic sm:mt-3 sm:text-[1.5rem]">
            {bridesmaid.role}
          </motion.p>

          {isChief && (
            <motion.p variants={fadeUp} className="eyebrow mt-2.5 text-ink-soft sm:mt-3">
              {bridesmaid.weddingRole}
            </motion.p>
          )}

          <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-[24ch] text-[0.88rem] leading-relaxed text-ink-soft sm:mt-7 sm:text-[0.95rem]">
            You are officially part of my bridal party. 🤍
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6 flex items-center gap-3 sm:mt-8">
            <span className="h-px flex-1 bg-line" />
            <span className="eyebrow">{colors.length > 1 ? 'Your colors' : 'Your color'}</span>
            <span className="h-px flex-1 bg-line" />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-5 flex flex-col items-center sm:mt-6">
            <div className="flex -space-x-2">
              {colors.map((c) => (
                <span
                  key={c.name}
                  className="h-10 w-10 rounded-full border-[3px] border-paper shadow-[0_6px_14px_-6px_rgba(60,45,30,.4)] sm:h-11 sm:w-11"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <p className="mt-3.5 font-display text-[1.5rem] leading-tight font-medium text-ink sm:mt-4 sm:text-[1.75rem]">
              {colors.map((c) => c.name).join(' / ')}
            </p>
            <p className="mt-1 font-display text-sm text-muted italic sm:text-base">{colors.map((c) => c.hex).join(' · ')}</p>
          </motion.div>
        </motion.div>
      </motion.article>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: easeSoft, delay: 2.4 }}
        className="mt-10 flex w-full max-w-sm flex-col items-center"
      >
        <p className="font-display text-[1.6rem] leading-snug text-ink italic">I can&apos;t wait to have you beside me.</p>
        <p className="eyebrow mt-3">Screenshot this little card 📸</p>

        {/* Email Keepsake Form */}
        <div className="mt-5 w-full rounded-2xl border border-line bg-paper/85 p-4 text-left shadow-xs backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">✉️</span>
            <div>
              <p className="eyebrow text-[0.62rem]">Digital Keepsake</p>
              <p className="font-display text-xs text-ink">Email a copy of this card to yourself</p>
            </div>
          </div>

          <form onSubmit={handleSendEmail} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              disabled={isPending || emailStatus === 'success'}
              className="w-full rounded-xl border border-line bg-ivory/80 px-3.5 py-2.5 text-xs text-ink placeholder-muted/60 focus:border-ink focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isPending || emailStatus === 'success' || !email.trim()}
              className="btn-primary shrink-0 py-2.5 px-4 text-xs disabled:opacity-50"
            >
              {isPending ? 'Sending...' : emailStatus === 'success' ? 'Sent 💌' : 'Send Card'}
            </button>
          </form>

          {emailStatus === 'success' && (
            <p className="mt-2.5 text-[0.72rem] text-sage font-medium">
              Keepsake sent to {email}! Check your inbox 🤍
            </p>
          )}

          {emailStatus === 'error' && errorMessage && (
            <p className="mt-2.5 text-[0.72rem] text-wine font-medium">
              {errorMessage}
            </p>
          )}
        </div>

        <button id="summary-continue" type="button" onClick={onContinue} className="btn-primary mt-8">
          One last thing <span aria-hidden>→</span>
        </button>
      </motion.div>
    </section>
  )
}
