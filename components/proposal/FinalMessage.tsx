'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { closingFor, type Bridesmaid } from '@/lib/bridesmaids'
import { site } from '@/lib/site'
import { easeSoft } from './motion'

type Props = {
  bridesmaid: Bridesmaid
  onReadAgain: () => void
}

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -6% 0px' },
  transition: { duration: 1, ease: easeSoft, delay },
})

export function FinalMessage({ bridesmaid, onReadAgain }: Readonly<Props>) {
  const closing = closingFor(bridesmaid)
  const isChief = bridesmaid.type === 'chief'

  return (
    <section className="flex flex-1 flex-col items-center px-6 pt-12 pb-24 text-center">
      <motion.h2
        initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.4, ease: easeSoft, delay: 0.2 }}
        className="font-display text-[clamp(3rem,13vw,5.5rem)] leading-none font-light tracking-[-0.02em] text-ink"
      >
        {closing.heading}
      </motion.h2>

      <div className="mt-12 max-w-md space-y-5">
        {closing.paragraphs.map((paragraph, index) => {
          // Mojoyinola's opening lines are short, poetic beats; give them weight.
          const isBeat = isChief ? index < 3 : index < 2
          const itemKey = `closing-para-${index + 1}`
          return (
            <motion.p
              key={itemKey}
              {...inView(index < 4 ? 0.8 + index * 0.45 : 0)}
              className={
                isBeat
                  ? 'font-display text-[1.7rem] leading-snug text-ink italic'
                  : 'font-display text-[1.25rem] leading-[1.7] font-medium text-pretty text-ink-soft'
              }
            >
              {paragraph}
            </motion.p>
          )
        })}
      </div>

      <motion.p {...inView(0.2)} className="mt-14 font-display text-[2.2rem] text-ink">
        {closing.love}
      </motion.p>
      <motion.p {...inView(0.5)} className="mt-3 font-script text-[3rem] leading-none text-ink-soft">
        &mdash; {site.bride}
      </motion.p>

      <motion.div {...inView(0.3)} className="mt-20 flex w-full max-w-xs items-center gap-4">
        <span className="h-px flex-1 bg-line" />
        <span className="text-accent drop-shadow-[0_0_1px_rgba(0,0,0,.3)]">✦</span>
        <span className="h-px flex-1 bg-line" />
      </motion.div>

      <motion.div {...inView(0.2)} className="mt-10 flex justify-center">
        <Image
          src={site.logo}
          alt={site.couple}
          width={56}
          height={56}
          className="h-14 w-14 object-contain drop-shadow-xs"
        />
      </motion.div>

      <motion.p
        {...inView(0.3)}
        className="mt-4 font-display text-[clamp(2.6rem,11vw,4rem)] leading-none font-light tracking-[0.04em] text-ink"
      >
        {site.couple.split('&')[0].trim()} <span className="font-script text-[0.85em] text-muted">&amp;</span>{' '}
        {site.couple.split('&')[1]?.trim()}
      </motion.p>
      <motion.p {...inView(0.5)} className="eyebrow mt-6">
        The countdown begins...
      </motion.p>

      {site.weddingDate && <Countdown date={site.weddingDate} />}

      <motion.button
        {...inView(0.6)}
        id="final-read-again"
        type="button"
        onClick={onReadAgain}
        className="btn-link mt-16"
      >
        Read my letter again <span className="arrow">↺</span>
      </motion.button>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

function Countdown({ date }: Readonly<{ date: string }>) {
  const target = new Date(date).getTime()
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  if (Number.isNaN(target) || now === null) return <div className="mt-8 h-19" />

  const diff = Math.max(0, target - now)
  const units = [
    { label: 'Days', value: Math.floor(diff / 86_400_000) },
    { label: 'Hours', value: Math.floor((diff / 3_600_000) % 24) },
    { label: 'Minutes', value: Math.floor((diff / 60_000) % 60) },
    { label: 'Seconds', value: Math.floor((diff / 1000) % 60) },
  ]

  return (
    <div className="mt-8 flex gap-3 sm:gap-4" role="timer" aria-label="Countdown to the wedding">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex w-17 flex-col items-center rounded-[10px] border border-line bg-paper/70 py-3 backdrop-blur sm:w-19.5"
        >
          <span className="font-display text-[1.9rem] leading-none text-ink tabular-nums">
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="mt-1.5 text-[0.55rem] font-semibold tracking-[0.2em] text-muted uppercase">{unit.label}</span>
        </div>
      ))}
    </div>
  )
}
