'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Bridesmaid, BridesmaidColor } from '@/lib/bridesmaids'
import { site } from '@/lib/site'
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

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-5 pt-8 pb-20 text-center">
      <motion.article
        initial={{ opacity: 0, y: 50, rotate: 1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 1.3, ease: easeSoft }}
        className="letter-paper paper-grain relative w-full max-w-100 overflow-hidden rounded-[4px] px-8 pt-12 pb-12"
        aria-label={`${bridesmaid.shortName}'s keepsake card`}
      >
        {/* frames */}
        <div aria-hidden className="pointer-events-none absolute inset-3 border border-line" />
        <div aria-hidden className="pointer-events-none absolute inset-4.5 border border-accent/60" />
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
          <motion.p variants={fadeUp} className="mt-2 font-script text-[2.1rem] leading-tight text-ink">
            {site.couple}
          </motion.p>

          <motion.span variants={fadeUp} className="mx-auto mt-6 block h-px w-10 bg-ink/25" />

          <motion.h2
            variants={fadeUp}
            className="mt-7 font-display text-[clamp(2.8rem,12vw,3.6rem)] leading-none font-light text-ink"
          >
            {bridesmaid.shortName}
          </motion.h2>

          <motion.p variants={fadeUp} className="mt-3 font-display text-[1.5rem] text-ink-soft italic">
            {bridesmaid.role}
          </motion.p>

          {isChief && (
            <motion.p variants={fadeUp} className="eyebrow mt-3 text-ink-soft">
              {bridesmaid.weddingRole}
            </motion.p>
          )}

          <motion.p variants={fadeUp} className="mx-auto mt-7 max-w-[24ch] text-[0.95rem] leading-relaxed text-ink-soft">
            You are officially part of my bridal party. 🤍
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="eyebrow">{colors.length > 1 ? 'Your colors' : 'Your color'}</span>
            <span className="h-px flex-1 bg-line" />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 flex flex-col items-center">
            <div className="flex -space-x-2">
              {colors.map((c) => (
                <span
                  key={c.name}
                  className="h-11 w-11 rounded-full border-[3px] border-paper shadow-[0_6px_14px_-6px_rgba(60,45,30,.4)]"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <p className="mt-4 font-display text-[1.75rem] leading-tight font-medium text-ink">
              {colors.map((c) => c.name).join(' / ')}
            </p>
            <p className="mt-1 font-display text-base text-muted italic">{colors.map((c) => c.hex).join(' · ')}</p>
          </motion.div>
        </motion.div>
      </motion.article>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: easeSoft, delay: 2.4 }}
        className="mt-10 flex flex-col items-center"
      >
        <p className="font-display text-[1.6rem] leading-snug text-ink italic">I can&apos;t wait to have you beside me.</p>
        <p className="eyebrow mt-4">Screenshot this little card 📸</p>
        <button id="summary-continue" type="button" onClick={onContinue} className="btn-primary mt-10">
          One last thing <span aria-hidden>→</span>
        </button>
      </motion.div>
    </section>
  )
}
