'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Bridesmaid } from '@/lib/bridesmaids'
import { site } from '@/lib/site'
import { easeSoft, fadeUp } from './motion'
import { RichText } from './RichText'

type Props = {
  bridesmaid: Bridesmaid
  onContinue: () => void
}

export function PersonalLetter({ bridesmaid, onContinue }: Readonly<Props>) {
  return (
    <section className="flex flex-1 flex-col items-center px-4 pt-8 pb-20 sm:px-6 sm:pt-12">
      <motion.article
        initial={{ opacity: 0, y: 60, rotate: -0.8 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 1.2, ease: easeSoft }}
        className="letter-paper paper-grain w-full max-w-145 rounded-xs px-7 pt-10 pb-12 sm:px-14 sm:pt-14 sm:pb-16"
        aria-labelledby="letter-salutation"
      >
        {/* accent edge */}
        <div className="absolute inset-x-0 top-0 h-0.75 bg-accent/70" />

        <header className="flex items-center justify-between">
          <span className="eyebrow">For {bridesmaid.shortName}</span>
          <Image
            src={site.logo}
            alt={site.couple}
            width={32}
            height={32}
            className="h-7 w-7 object-contain opacity-85"
          />
        </header>

        <motion.h2
          id="letter-salutation"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.5}
          className="mt-10 font-script text-[2.6rem] leading-tight text-ink sm:text-[3.2rem]"
        >
          {bridesmaid.salutation}
        </motion.h2>

        <div className="rich mt-6 space-y-5 font-display text-[1.24rem] leading-[1.7] font-medium text-ink-soft sm:text-[1.32rem]">
          {bridesmaid.letter.map((paragraph, index) => {
            const itemKey = `letter-para-${index + 1}`
            return (
              <motion.p
                key={itemKey}
                className="text-pretty"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                transition={{ duration: 0.9, ease: easeSoft, delay: index < 3 ? 0.7 + index * 0.25 : 0 }}
              >
                <RichText text={paragraph} />
              </motion.p>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="mt-12 flex items-center gap-4"
        >
          <span className="h-px flex-1 bg-line" />
          <span className="text-accent drop-shadow-[0_0_1px_rgba(0,0,0,.25)]">✦</span>
          <span className="h-px flex-1 bg-line" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: easeSoft, delay: 0.2 }}
          className="mt-8 text-center font-display text-lg text-muted italic"
        >
          There&apos;s a reason I&apos;m writing you all of this&hellip;
        </motion.p>
      </motion.article>

      <motion.button
        id="letter-continue"
        type="button"
        onClick={onContinue}
        className="btn-primary mt-12"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: easeSoft, delay: 0.4 }}
      >
        Keep going <span aria-hidden>→</span>
      </motion.button>
    </section>
  )
}
