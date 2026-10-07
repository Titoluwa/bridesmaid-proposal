'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { bridesmaidColors, type BridesmaidColor } from '@/lib/bridesmaids'
import { Bloom } from './Bloom'
import { easeSoft, fadeUp, stagger } from './motion'

type Phase = 'intro' | 'spinning' | 'landed' | 'revealed'

type Props = {
  /** Colour already assigned on a previous visit, if any */
  assigned: BridesmaidColor | null
  /** Persists (or fetches the existing) colour. Must resolve to her colour. */
  reveal: () => Promise<BridesmaidColor>
  /** Lets the page wash follow the cycling colours */
  onAccentChange: (hex: string | null) => void
  onRevealed: (color: BridesmaidColor) => void
  onContinue: () => void
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function getSafeRandomIndex(length: number): number {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const array = new Uint32Array(1)
    window.crypto.getRandomValues(array)
    return array[0] % length
  }
  return Math.floor(Math.random() * length)
}

export function ColorReveal({
  assigned,
  reveal,
  onAccentChange,
  onRevealed,
  onContinue,
}: Readonly<Props>) {
  const [phase, setPhase] = useState<Phase>(assigned ? 'revealed' : 'intro')
  const [active, setActive] = useState<number | null>(null)
  const [color, setColor] = useState<BridesmaidColor | null>(assigned)
  const [error, setError] = useState<string | null>(null)
  const [freshReveal, setFreshReveal] = useState(false)
  const alive = useRef(true)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  const highlight = (index: number) => {
    setActive(index)
    onAccentChange(bridesmaidColors[index].hex)
  }

  const start = async () => {
    if (phase !== 'intro') return
    setError(null)
    setPhase('spinning')

    const request = reveal()
    let current = -1
    const hop = (avoid?: number) => {
      let next = current
      while (next === current || next === avoid) {
        next = getSafeRandomIndex(bridesmaidColors.length)
      }
      current = next
      highlight(next)
    }

    try {
      if (!reduceMotion) {
        // Fast shuffle sequence while server picks/saves
        const fastSteps = Array.from({ length: 9 }, (_, i) => 85 + i * 8)
        await fastSteps.reduce(async (prevPromise, delayMs) => {
          await prevPromise
          if (alive.current) {
            hop()
            await sleep(delayMs)
          }
        }, Promise.resolve())
      }

      const result = await request
      const target = bridesmaidColors.findIndex((c) => c.name === result.name)

      if (!reduceMotion) {
        // Slow deceleration sequence settling on target
        const slowSteps = Array.from({ length: 7 }, (_, i) => 170 + i * i * 14)
        await slowSteps.reduce(async (prevPromise, delayMs) => {
          await prevPromise
          if (alive.current) {
            hop(target)
            await sleep(delayMs)
          }
        }, Promise.resolve())
      }

      if (!alive.current) return
      current = target
      highlight(target)
      setColor(result)
      setPhase('landed')
      await sleep(reduceMotion ? 200 : 1300)
      if (!alive.current) return
      setFreshReveal(true)
      setPhase('revealed')
      onRevealed(result)
    } catch {
      if (!alive.current) return
      setActive(null)
      onAccentChange(null)
      setError('The colours got a little shy. Please try again. 🤍')
      setPhase('intro')
    }
  }

  return (
    <section className="relative flex flex-1 flex-col items-center justify-center px-5 pt-8 pb-20 text-center">
      <AnimatePresence mode="wait">
        {phase !== 'revealed' ? (
          <motion.div
            key="picker"
            variants={stagger(0.4, 0.2)}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)', transition: { duration: 0.6 } }}
            className="flex w-full flex-col items-center"
          >
            <motion.p variants={fadeUp} className="font-display text-[1.5rem] text-muted italic sm:text-[1.7rem]">
              Now I have one tiny request...
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="mt-7 max-w-lg font-display text-[clamp(2rem,7vw,3.1rem)] leading-[1.12] font-light text-balance text-ink"
            >
              There are seven colors waiting for my girls.
            </motion.h2>

            <motion.p variants={fadeUp} className="mt-6 font-display text-[1.3rem] text-ink-soft">
              But I&apos;m not letting you choose yours.
            </motion.p>

            <motion.p variants={fadeUp} className="mt-2 font-display text-[1.45rem] font-semibold text-ink italic">
              Let&apos;s see which one finds you. 🎨
            </motion.p>

            <motion.ul
              variants={fadeUp}
              aria-label="The seven bridesmaid colours"
              className="mt-12 flex max-w-105 flex-wrap justify-center gap-2.5 sm:max-w-180 sm:gap-4"
            >
              {bridesmaidColors.map((swatch, index) => {
                const isActive = active === index
                const dimmed = active !== null && !isActive

                let scale = 1
                if (isActive) {
                  scale = phase === 'landed' ? 1.14 : 1.08
                }

                let opacity = 1
                if (dimmed) {
                  opacity = phase === 'landed' ? 0.25 : 0.5
                }

                const isPastel = swatch.name.startsWith('Pastel ')
                const prefix = isPastel ? 'Pastel' : null
                const colorTitle = isPastel ? swatch.name.replace('Pastel ', '') : swatch.name

                return (
                  <motion.li
                    key={swatch.name}
                    className="w-21 rounded-[11px] bg-paper p-1.5 pb-2.5 shadow-[0_10px_24px_-14px_rgba(60,45,30,.35),0_0_0_1px_rgba(120,95,65,.08)] sm:w-24 sm:p-2 sm:pb-3"
                    animate={{
                      y: isActive ? -12 : 0,
                      scale,
                      opacity,
                    }}
                    transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                  >
                    <span
                      className="block aspect-4/5 w-full rounded-md"
                      style={{
                        backgroundColor: swatch.hex,
                        boxShadow: isActive
                          ? `inset 0 0 0 1px rgba(0,0,0,.05), 0 0 0 2px #fffdf8, 0 0 0 3.5px #2f2a24`
                          : 'inset 0 0 0 1px rgba(0,0,0,.05)',
                      }}
                    />
                    <div className="mt-1.5 flex min-h-7 flex-col items-center justify-center px-0.5 text-center">
                      {prefix && (
                        <span className="block text-[0.48rem] leading-none font-medium tracking-[0.14em] text-muted uppercase sm:text-[0.52rem]">
                          {prefix}
                        </span>
                      )}
                      <span className="mt-0.5 block text-[0.62rem] leading-tight font-semibold tracking-[0.06em] text-ink uppercase sm:text-[0.7rem]">
                        {colorTitle}
                      </span>
                    </div>
                  </motion.li>
                )
              })}
            </motion.ul>

            <motion.div variants={fadeUp} className="mt-12 flex min-h-27.5 flex-col items-center gap-4">
              {phase === 'intro' && (
                <button id="reveal-color" type="button" onClick={start} className="btn-primary">
                  Reveal my color ✨
                </button>
              )}
              {phase === 'spinning' && (
                <p className="eyebrow animate-pulse" aria-live="polite">
                  Finding your color&hellip;
                </p>
              )}
              {phase === 'landed' && color && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-2xl text-ink italic"
                  aria-live="polite"
                >
                  Oh, it&apos;s this one&hellip;
                </motion.p>
              )}
              {error && <p className="max-w-xs text-sm text-wine">{error}</p>}
              {phase === 'intro' && !error && (
                <p className="max-w-xs text-[0.8rem] leading-relaxed text-muted">
                  Once it finds you, it&apos;s yours to keep. No take-backs. 😌
                </p>
              )}
            </motion.div>
          </motion.div>
        ) : (
          color && <ColorResult key="result" color={color} fresh={freshReveal} onContinue={onContinue} />
        )}
      </AnimatePresence>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

function ColorResult({
  color,
  fresh,
  onContinue,
}: Readonly<{
  color: BridesmaidColor
  fresh: boolean
  onContinue: () => void
}>) {
  return (
    <motion.div
      key="result"
      variants={stagger(0.45, 0.2)}
      initial="hidden"
      animate="show"
      className="relative flex w-full flex-col items-center"
    >
      <motion.p variants={fadeUp} className="font-display text-[1.5rem] text-muted italic">
        Your color is...
      </motion.p>

      {/* the arch */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 40, scale: 0.9 },
          show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.3, ease: easeSoft } },
        }}
        className="relative mt-10"
      >
        <Bloom play={fresh} colors={[color.hex, '#FFFDF8', '#E7D3A8', color.hex]} />
        <div
          className="relative h-57.5 w-44 overflow-hidden rounded-t-full rounded-b-[14px] sm:h-67.5 sm:w-51.5"
          style={{
            backgroundColor: color.hex,
            boxShadow: `0 40px 80px -30px ${color.hex}, 0 24px 40px -24px rgba(60,45,30,.35), inset 0 0 0 1px rgba(0,0,0,.04)`,
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.55),transparent_55%)]" />
          <div className="absolute inset-3 rounded-t-full rounded-b-[8px] border border-white/50" />
        </div>
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="mt-12 px-4 text-balance font-display text-[clamp(2.2rem,10vw,4.5rem)] leading-tight font-normal tracking-wide sm:tracking-widest text-ink uppercase"
      >
        {color.name}
      </motion.h2>

      <motion.p variants={fadeUp} className="mt-4 font-mono text-sm tracking-[0.25em] text-ink-soft">
        {color.hex}
      </motion.p>

      <motion.p variants={fadeUp} className="mt-10 font-display text-[1.7rem] text-ink italic">
        This one is yours. {color.emoji}
      </motion.p>

      {!fresh && (
        <motion.p variants={fadeUp} className="mt-3 max-w-xs text-[0.8rem] leading-relaxed text-muted">
          It already found you, and it&apos;s staying yours.
        </motion.p>
      )}

      <motion.button
        id="color-continue"
        variants={fadeUp}
        type="button"
        onClick={onContinue}
        className="btn-primary mt-12"
      >
        Continue <span aria-hidden>→</span>
      </motion.button>
    </motion.div>
  )
}
