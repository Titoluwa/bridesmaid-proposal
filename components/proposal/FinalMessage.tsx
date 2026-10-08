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
    <section className="flex flex-1 flex-col items-center px-4 pt-8 pb-20 text-center sm:px-6 sm:pt-12 sm:pb-24">
      <motion.h2
        initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.4, ease: easeSoft, delay: 0.2 }}
        className="px-2 text-balance font-display text-[clamp(2.3rem,10vw,4.8rem)] leading-none font-light tracking-[-0.02em] text-ink"
      >
        {closing.heading}
      </motion.h2>

      <div className="mt-8 max-w-md space-y-4 px-2 sm:mt-12 sm:space-y-5">
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
                  ? 'font-display text-[1.45rem] leading-snug text-ink italic sm:text-[1.7rem]'
                  : 'font-display text-[1.12rem] leading-[1.65] font-medium text-pretty text-ink-soft sm:text-[1.25rem] sm:leading-[1.7]'
              }
            >
              {paragraph}
            </motion.p>
          )
        })}
      </div>

      <motion.p {...inView(0.2)} className="mt-10 font-display text-[1.9rem] text-ink sm:mt-14 sm:text-[2.2rem]">
        {closing.love}
      </motion.p>
      <motion.p {...inView(0.5)} className="mt-2 font-script text-[2.5rem] leading-none text-ink-soft sm:mt-3 sm:text-[3rem]">
        &mdash; {site.bride}
      </motion.p>

      {/* WhatsApp Group Invite Card */}
      <motion.div
        {...inView(0.3)}
        className="mt-12 w-full max-w-md rounded-2xl border border-line bg-paper/85 p-5 text-center shadow-xs backdrop-blur-xs sm:p-7"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366] shadow-xs">
          <svg
            viewBox="0 0 24 24"
            width="26"
            height="26"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.07-.942.07-.942 0-2.02-.387-3.037-1.404-1.353-1.354-1.89-2.73-1.89-3.666 0-.616.273-1.178.694-1.442.127-.08.273-.122.42-.122.102 0 .204.025.297.07.28.136.671 1.042.723 1.15.05.109.077.228.025.352-.05.123-.153.272-.255.394-.103.12-.218.239-.103.444.254.453.79 1.144 1.488 1.62.482.33 1.017.519 1.258.625.178.077.332.062.445-.062.158-.175.467-.604.629-.838.12-.172.278-.174.453-.105.176.069 1.118.528 1.311.625.193.097.322.144.37.225.048.081.048.47-.096.875zM12 2C6.477 2 2 6.477 2 12c0 1.81.487 3.506 1.334 4.966L2 22l5.176-1.309A9.94 9.94 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.583 0-3.06-.445-4.324-1.218l-.31-.188-3.058.773.816-2.983-.207-.33A8.156 8.156 0 0 1 3.8 12c0-4.521 3.679-8.2 8.2-8.2 4.522 0 8.2 3.679 8.2 8.2 0 4.522-3.678 8.2-8.2 8.2z" />
          </svg>
        </div>
        <p className="eyebrow mt-3 text-[0.62rem]">Official Bridal Party Chat</p>
        <h3 className="mt-1 font-display text-2xl font-light text-ink sm:text-[1.75rem]">
          Join Our WhatsApp Group
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
          Let the planning, excitement, and gist begin! Click below to join the official WhatsApp group for all bridal party updates.
        </p>
        <a
          href="https://chat.whatsapp.com/IYC7ytqtX0aCXO9fojjCPc?s=cl&p=i&ilr=4&iam=0"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-xs font-semibold tracking-wider text-white uppercase shadow-sm transition-all duration-300 hover:bg-[#20ba5a] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>Join WhatsApp Group 💬</span>
          <span aria-hidden>→</span>
        </a>
      </motion.div>

      <motion.div {...inView(0.3)} className="mt-16 flex w-full max-w-xs items-center gap-4 sm:mt-20">
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
          className="h-12 w-12 object-contain drop-shadow-xs sm:h-14 sm:w-14"
        />
      </motion.div>

      <motion.p
        {...inView(0.3)}
        className="mt-4 px-2 text-balance font-display text-[clamp(2.2rem,9vw,4rem)] leading-none font-light tracking-[0.04em] text-ink"
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
        className="btn-link mt-14 sm:mt-16"
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
    <div className="mt-8 flex max-w-full justify-center gap-2 sm:gap-4" role="timer" aria-label="Countdown to the wedding">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex w-15 flex-col items-center rounded-[10px] border border-line bg-paper/70 py-2.5 backdrop-blur sm:w-19.5 sm:py-3"
        >
          <span className="font-display text-[1.5rem] leading-none text-ink tabular-nums sm:text-[1.9rem]">
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="mt-1 text-[0.5rem] font-semibold tracking-[0.16em] text-muted uppercase sm:text-[0.55rem] sm:tracking-[0.2em]">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  )
}
