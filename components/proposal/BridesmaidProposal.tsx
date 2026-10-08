'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { Bridesmaid } from '@/lib/bridesmaids'
import { Bloom } from './Bloom'
import { easeSoft, fadeUp } from './motion'

type Props = {
  bridesmaid: Bridesmaid
  onAccept: (hesitations: number) => void
  onBack: () => void
}

/** What the "Let me think..." button says after each tap */
const THINK_COPY = ['Let me think...', 'You know you\u2019re saying yes 😂', 'Hmm\u2026 still thinking? 🤭']
/** Where it playfully hops to — small, so it never leaves the screen */
const THINK_OFFSETS = [
  { x: 0, y: 0 },
  { x: -24, y: 20 },
  { x: 26, y: -16 },
]
const MAX_HESITATIONS = THINK_COPY.length

export function BridesmaidProposal({ bridesmaid, onAccept, onBack }: Readonly<Props>) {
  const [hesitations, setHesitations] = useState(0)
  const [accepted, setAccepted] = useState(false)

  const isChief = bridesmaid.type === 'chief'
  const roleWord = isChief ? 'Chief Bridesmaid' : 'bridesmaid'
  const surrendered = hesitations >= MAX_HESITATIONS

  const accept = () => {
    if (accepted) return
    setAccepted(true)
    window.setTimeout(() => onAccept(hesitations), 1500)
  }

  const think = () => {
    if (accepted) return
    if (surrendered) return accept()
    setHesitations((count) => count + 1)
  }

  const offset = THINK_OFFSETS[Math.min(hesitations, THINK_OFFSETS.length - 1)]

  return (
    <section className="flex flex-1 flex-col items-center justify-center overflow-x-clip px-4 pt-6 pb-16 text-center sm:px-6 sm:pt-8 sm:pb-20">
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0.3}
        className="font-display text-[1.35rem] text-muted italic sm:text-[1.7rem]"
      >
        There is one more thing...
      </motion.p>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={1.5}
        className="mt-6 max-w-xl px-2 font-display text-[clamp(1.7rem,6vw,2.9rem)] leading-[1.2] font-light text-balance text-ink sm:mt-8"
      >
        I don&apos;t want to imagine this day without you standing beside me.
      </motion.p>

      <motion.span
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={2.6}
        className="mt-8 block h-px w-14 bg-ink/25 sm:mt-10"
      />

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={3}
        className="mt-8 max-w-md px-2 font-display text-[1.2rem] text-pretty text-ink-soft italic sm:mt-10 sm:text-[1.3rem]"
      >
        {bridesmaid.leadIn}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, scale: 0.94, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.4, ease: easeSoft, delay: 3.9 }}
        className="mt-5 max-w-[16ch] px-2 font-display text-[clamp(2.3rem,9.5vw,5.2rem)] leading-[1.02] font-normal tracking-[-0.02em] text-balance text-ink"
      >
        Will you be my{' '}
        <span className="relative inline-block italic">
          {roleWord}?
          <motion.span
            aria-hidden
            className="absolute right-0 -bottom-1 left-0 h-[0.18em] origin-left rounded-full bg-accent/70"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: easeSoft, delay: 4.9 }}
          />
        </span>
      </motion.h2>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={5.2}
        className="mt-6 max-w-md px-2 text-[0.9rem] leading-relaxed text-pretty text-muted sm:mt-8 sm:text-[0.95rem]"
      >
        {bridesmaid.postscript}
      </motion.p>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={5.8}
        className="relative mt-10 flex w-full max-w-md flex-col items-center gap-3.5 px-2 sm:mt-12 sm:flex-row sm:justify-center sm:gap-4"
      >
        <Bloom play={accepted} colors={['var(--accent)', '#E7D3A8', '#FFFDF8', '#F6C6D6']} />

        <motion.button
          id="proposal-yes"
          type="button"
          onClick={accept}
          className="btn-primary w-full sm:w-auto"
          animate={{ scale: accepted ? 1.06 : 1 + hesitations * 0.06 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={accepted ? 'yay' : 'yes'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {accepted ? 'Yay! 🤍' : 'Yes, of course 🤍'}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <motion.button
          id="proposal-think"
          type="button"
          onClick={think}
          disabled={accepted}
          className={surrendered ? 'btn-primary w-full sm:w-auto' : 'btn-ghost w-full sm:w-auto'}
          animate={{ x: offset.x, y: offset.y, opacity: accepted ? 0 : 1, rotate: hesitations % 2 ? -2 : 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 14 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={hesitations}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {surrendered ? 'Okay fine, YES 🤍' : THINK_COPY[hesitations]}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </motion.div>

      <motion.button
        id="proposal-back"
        type="button"
        onClick={onBack}
        className="btn-link mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: accepted ? 0 : 1 }}
        transition={{ delay: accepted ? 0 : 6.4, duration: 0.8 }}
        disabled={accepted}
      >
        <span className="arrow rotate-180">→</span> Back
      </motion.button>
    </section>
  )
}
