'use client'

import { motion } from 'framer-motion'
import type { Bridesmaid } from '@/lib/bridesmaids'
import { easeSoft, fadeUp, stagger } from './motion'

type Props = {
  bridesmaid: Bridesmaid
  onContinue: () => void
}

/** Mojoyinola's colours are chosen, not randomised. */
export function ChiefColors({ bridesmaid, onContinue }: Readonly<Props>) {
  const colors = bridesmaid.colors ?? []

  return (
    <motion.section
      variants={stagger(0.4, 0.2)}
      initial="hidden"
      animate="show"
      className="flex flex-1 flex-col items-center justify-center px-6 pt-8 pb-20 text-center"
    >
      <motion.p variants={fadeUp} className="font-display text-[1.5rem] text-muted italic sm:text-[1.7rem]">
        Now, about your colors...
      </motion.p>

      <motion.h2
        variants={fadeUp}
        className="mt-7 max-w-lg font-display text-[clamp(2rem,7vw,3.1rem)] leading-[1.12] font-light text-balance text-ink"
      >
        My girls are finding their colors by chance.
      </motion.h2>

      <motion.p variants={fadeUp} className="mt-6 font-display text-[1.45rem] font-semibold text-ink italic">
        But you, my anchor, were never left to chance.
      </motion.p>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 40 },
          show: { opacity: 1, y: 0, transition: { duration: 1.3, ease: easeSoft } },
        }}
        className="mt-14 flex items-end justify-center gap-5 sm:gap-8"
      >
        {colors.map((color, index) => (
          <figure key={color.name} className="flex flex-col items-center">
            <motion.div
              initial={{ rotate: index === 0 ? -4 : 4 }}
              animate={{ rotate: index === 0 ? -2 : 2 }}
              transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
              className="relative h-50 w-33 overflow-hidden rounded-t-full rounded-b-xl sm:h-62.5 sm:w-41"
              style={{
                background:
                  index === 0
                    ? `linear-gradient(160deg, #efdcb4 0%, ${color.hex} 45%, #b8995c 100%)`
                    : `linear-gradient(160deg, #8f3a4f 0%, ${color.hex} 50%, #4a1422 100%)`,
                boxShadow: `0 36px 70px -30px ${color.hex}, 0 20px 36px -22px rgba(60,45,30,.4)`,
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,.5),transparent_55%)]" />
              <div className="absolute inset-2.5 rounded-t-full rounded-b-[7px] border border-white/40" />
            </motion.div>
            <figcaption className="mt-5">
              <span className="block font-display text-xl text-ink">{color.name}</span>
              <span className="mt-1 block font-mono text-[0.7rem] tracking-[0.2em] text-muted">{color.hex}</span>
            </figcaption>
          </figure>
        ))}
      </motion.div>

      <motion.p
        variants={fadeUp}
        className="mt-12 font-display text-[clamp(1.9rem,7vw,2.6rem)] tracking-[0.06em] text-ink uppercase"
      >
        Champagne Gold <span className="text-muted">/</span> Wine
      </motion.p>

      <motion.p variants={fadeUp} className="mt-4 font-display text-[1.6rem] text-ink italic">
        These are yours. 🤍
      </motion.p>

      <motion.button id="chief-continue" variants={fadeUp} type="button" onClick={onContinue} className="btn-primary mt-12">
        Continue <span aria-hidden>→</span>
      </motion.button>
    </motion.section>
  )
}
