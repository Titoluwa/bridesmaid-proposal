'use client'

import { motion } from 'framer-motion'
import type { Bridesmaid } from '@/lib/bridesmaids'
import { easeSoft, fadeUp, stagger } from './motion'

type Props = {
  bridesmaid: Bridesmaid
  onBack: () => void
  onContinue: () => void
}

export function RoleReveal({ bridesmaid, onBack, onContinue }: Props) {
  const title = bridesmaid.role.replace(/^My\s+/i, '')
  const isChief = bridesmaid.type === 'chief'

  return (
    <motion.section
      variants={stagger(0.35, 0.3)}
      initial="hidden"
      animate="show"
      className="flex flex-1 flex-col items-center justify-center px-6 pt-10 pb-20 text-center"
    >
      <motion.p variants={fadeUp} className="eyebrow">
        In my story, you are
      </motion.p>

      <motion.div variants={fadeUp} className="relative mt-10">
        {/* halo */}
        <motion.div
          aria-hidden
          className="absolute top-1/2 left-1/2 -z-10 h-[150%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/30 blur-3xl"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.4, ease: easeSoft, delay: 0.6 }}
        />
        <span className="block font-script text-[2.6rem] leading-none text-muted sm:text-5xl">My</span>
        <h2 className="mt-2 max-w-[14ch] font-display text-[clamp(3rem,13vw,6.5rem)] leading-[0.95] font-light tracking-[-0.02em] text-balance text-ink italic">
          {title}
        </h2>
      </motion.div>

      {isChief && (
        <motion.p
          variants={fadeUp}
          className="mt-8 inline-flex items-center gap-3 rounded-full border border-champagne-deep/40 bg-paper/70 px-5 py-2.5 backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-wine" />
          <span className="eyebrow text-ink-soft">and my {bridesmaid.weddingRole}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-champagne-deep" />
        </motion.p>
      )}

      <motion.span variants={fadeUp} className="mt-10 block h-px w-14 bg-ink/25" />

      <motion.p
        variants={fadeUp}
        className="mt-8 max-w-md font-display text-[1.4rem] leading-snug text-pretty text-ink-soft italic sm:text-[1.6rem]"
      >
        {bridesmaid.message}
      </motion.p>

      <motion.div variants={fadeUp} className="mt-14 flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-8">
        <button id="role-back" type="button" onClick={onBack} className="btn-link">
          <span className="arrow rotate-180">→</span> Read my letter again
        </button>
        <button id="role-continue" type="button" onClick={onContinue} className="btn-primary">
          One more thing <span aria-hidden>→</span>
        </button>
      </motion.div>
    </motion.section>
  )
}
