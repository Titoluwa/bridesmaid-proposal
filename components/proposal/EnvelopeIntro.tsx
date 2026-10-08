'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { Bridesmaid } from '@/lib/bridesmaids'
import { site } from '@/lib/site'
import { easeSoft, fadeUp, stagger } from './motion'

type Phase = 'closed' | 'seal' | 'flap' | 'rise'

type Props = {
  bridesmaid: Bridesmaid
  /** Already said yes on a previous visit */
  completed: boolean
  onOpen: () => void
  onOpened: () => void
  onSkipToKeepsake: () => void
}

export function EnvelopeIntro({
  bridesmaid,
  completed,
  onOpen,
  onOpened,
  onSkipToKeepsake,
}: Readonly<Props>) {
  const [phase, setPhase] = useState<Phase>('closed')
  const timers = useRef<number[]>([])
  const reduceMotion = useReducedMotion()

  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  const open = () => {
    if (phase !== 'closed') return
    onOpen()
    if (reduceMotion) {
      onOpened()
      return
    }
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))
    setPhase('seal')
    at(380, () => setPhase('flap'))
    at(1150, () => setPhase('rise'))
    at(2500, onOpened)
  }

  const isChief = bridesmaid.type === 'chief'

  return (
    <motion.section
      variants={stagger(0.18, 0.2)}
      initial="hidden"
      animate="show"
      className="flex flex-1 flex-col items-center justify-center px-4 pt-6 pb-14 text-center sm:px-6 sm:pt-10 sm:pb-16"
    >
      <motion.p variants={fadeUp} className="eyebrow">
        A little letter for
      </motion.p>

      <motion.h1
        variants={fadeUp}
        className="mt-3 px-2 text-balance break-words font-display text-[clamp(2.3rem,11vw,6.5rem)] leading-[0.95] font-light tracking-tight text-ink"
      >
        {bridesmaid.shortName}
      </motion.h1>

      <motion.p variants={fadeUp} className="mt-4 font-display text-[1.2rem] text-muted italic sm:mt-5 sm:text-[1.35rem]">
        From your bride-to-be 🤍
      </motion.p>

      <motion.div variants={fadeUp} className="mt-16 mb-10 sm:mt-28 sm:mb-14">
        <Envelope phase={phase} name={bridesmaid.shortName} wine={isChief} onClick={open} />
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col items-center gap-4">
        <motion.button
          id="open-letter"
          type="button"
          onClick={open}
          disabled={phase !== 'closed'}
          className="btn-primary disabled:cursor-default"
          animate={{ opacity: phase === 'closed' ? 1 : 0, y: phase === 'closed' ? 0 : 8 }}
          transition={{ duration: 0.5, ease: easeSoft }}
        >
          Open your letter{' '}
          <span aria-hidden>✉︎</span>
        </motion.button>

        <motion.p
          className="max-w-xs text-[0.8rem] leading-relaxed text-muted"
          animate={{ opacity: phase === 'closed' ? 1 : 0 }}
        >
          Find a quiet little moment. This one was written just for you.
        </motion.p>

        {completed && phase === 'closed' && (
          <button id="skip-to-keepsake" type="button" onClick={onSkipToKeepsake} className="btn-link mt-2">
            You already said yes · see your keepsake <span className="arrow">→</span>
          </button>
        )}
      </motion.div>
    </motion.section>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Envelope                                  */
/* -------------------------------------------------------------------------- */

function Envelope({
  phase,
  name,
  wine,
  onClick,
}: Readonly<{
  phase: Phase
  name: string
  wine: boolean
  onClick: () => void
}>) {
  const flapOpen = phase === 'flap' || phase === 'rise'
  const sealGone = phase !== 'closed'
  const rising = phase === 'rise'

  return (
    <motion.div
      role="button"
      tabIndex={-1}
      aria-label={`Open the letter for ${name}`}
      onClick={onClick}
      className="group relative aspect-3/2 w-[min(340px,80vw)] cursor-pointer select-none"
      style={{ perspective: 1400 }}
      animate={
        phase === 'closed'
          ? { y: [0, -6, 0], rotate: [-0.6, 0.4, -0.6] }
          : { y: 0, rotate: 0, scale: rising ? 1.04 : 1 }
      }
      transition={
        phase === 'closed'
          ? { duration: 6, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 1, ease: easeSoft }
      }
    >
      {/* soft shadow */}
      <div className="absolute -bottom-6 left-[8%] h-8 w-[84%] rounded-[50%] bg-[#4a3a28]/15 blur-xl" />

      {/* back of envelope */}
      <div className="absolute inset-0 rounded-md bg-linear-to-b from-[#e3d9cb] to-[#e9e0d4] shadow-[inset_0_0_0_1px_rgba(120,95,65,.12)]" />

      {/* the letter inside */}
      <motion.div
        className="letter-paper paper-grain absolute inset-x-[7%] top-[6%] bottom-[8%] z-2 flex flex-col items-center rounded-[3px] px-5 pt-5"
        initial={false}
        animate={{ y: rising ? '-58%' : '0%' }}
        transition={{ duration: 1.15, ease: easeSoft }}
      >
        <Image
          src={site.logo}
          alt={site.couple}
          width={28}
          height={28}
          className="h-6 w-6 object-contain opacity-80"
        />
        <span className="mt-2 font-script text-[1.9rem] leading-none text-ink">My {name},</span>
        <span className="mt-4 h-px w-3/4 bg-line" />
        <span className="mt-3 h-px w-2/3 bg-line" />
        <span className="mt-3 h-px w-3/4 bg-line" />
      </motion.div>

      {/* front pocket */}
      <svg viewBox="0 0 300 200" className="absolute inset-0 z-3 h-full w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="env-left" x1="0" x2="1">
            <stop offset="0" stopColor="#efe7dc" />
            <stop offset="1" stopColor="#e8dfd2" />
          </linearGradient>
          <linearGradient id="env-right" x1="1" x2="0">
            <stop offset="0" stopColor="#ece4d8" />
            <stop offset="1" stopColor="#e4dacc" />
          </linearGradient>
          <linearGradient id="env-bottom" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#f3ede4" />
            <stop offset="1" stopColor="#ece4d9" />
          </linearGradient>
        </defs>
        <path d="M0 6 Q0 0 6 0 L150 112 L6 200 Q0 200 0 194 Z" fill="url(#env-left)" />
        <path d="M300 6 Q300 0 294 0 L150 112 L294 200 Q300 200 300 194 Z" fill="url(#env-right)" />
        <path d="M0 194 L150 98 L300 194 Q300 200 294 200 L6 200 Q0 200 0 194 Z" fill="url(#env-bottom)" />
        <path d="M0 194 L150 98 L300 194" fill="none" stroke="rgba(120,95,65,.12)" strokeWidth="0.8" />
      </svg>

      {/* name on the front */}
      <span className="pointer-events-none absolute inset-x-0 bottom-[9%] z-4 font-script text-[1.65rem] text-ink-soft">
        for {name}
      </span>

      {/* flap */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[58%] origin-top"
        style={{ transformStyle: 'preserve-3d', zIndex: phase === 'rise' ? 1 : 5 }}
        initial={false}
        animate={{ rotateX: flapOpen ? 180 : 0 }}
        whileHover={phase === 'closed' ? { rotateX: 14 } : undefined}
        transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* outside face */}
        <svg
          viewBox="0 0 300 116"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full drop-shadow-[0_4px_6px_rgba(90,70,45,.12)]"
          style={{ backfaceVisibility: 'hidden' }}
          aria-hidden
        >
          <defs>
            <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e2d7c7" />
              <stop offset="1" stopColor="#dccfbd" />
            </linearGradient>
          </defs>
          <path d="M0 6 Q0 0 6 0 L294 0 Q300 0 300 6 L156 112 Q150 116 144 112 Z" fill="url(#env-flap)" />
        </svg>
        {/* inside face */}
        <svg
          viewBox="0 0 300 116"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
          aria-hidden
        >
          <path d="M0 6 Q0 0 6 0 L294 0 Q300 0 300 6 L156 112 Q150 116 144 112 Z" fill="#f2ece3" />
        </svg>
      </motion.div>

      {/* wax seal */}
      <motion.div
        className="absolute top-[58%] left-1/2 z-6 -mt-7 -ml-7 grid h-14 w-14 place-items-center rounded-full"
        style={{
          background: wine
            ? 'radial-gradient(circle at 35% 30%, #a2475c 0%, #6d2335 55%, #4a1422 100%)'
            : 'radial-gradient(circle at 35% 30%, #ecd8ac 0%, #c9ab6e 55%, #a3843f 100%)',
          boxShadow:
            '0 6px 14px -4px rgba(60,40,20,.45), inset 0 -2px 4px rgba(0,0,0,.18), inset 0 2px 3px rgba(255,255,255,.35)',
        }}
        initial={false}
        animate={sealGone ? { scale: [1, 1.15, 0], opacity: [1, 1, 0], rotate: -20 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: easeSoft }}
      >
        <span className="absolute inset-1.25 rounded-full border border-white/30" />
        <Image
          src={wine ? '/logo/TM-logo-white.png' : site.logo}
          alt={site.couple}
          width={36}
          height={36}
          className="h-8 w-8 object-contain drop-shadow-xs"
        />
      </motion.div>
    </motion.div>
  )
}
