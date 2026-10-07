'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { site } from '@/lib/site'
import { easeSoft } from './motion'

type Props = {
  /** 0-based index of the current chapter, or -1 to hide the progress */
  current: number
  total: number
  preview?: boolean
}

export function StoryHeader({ current, total, preview }: Readonly<Props>) {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-6 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-10">
      <div className="flex items-center gap-2">
        <Image
          src={site.logo}
          alt={site.couple}
          width={40}
          height={40}
          priority
          className="h-9 w-9 object-contain drop-shadow-xs"
        />
      </div>

      <motion.ol
        aria-label={current >= 0 ? `Chapter ${current + 1} of ${total}` : undefined}
        className="flex items-center gap-1.5"
        initial={false}
        animate={{ opacity: current >= 0 ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {Array.from({ length: total }).map((_, index) => {
          let opacity = 1
          if (index <= current) {
            opacity = index === current ? 0.85 : 0.35
          }
          const stepKey = `story-step-${index + 1}`

          return (
            <motion.li
              key={stepKey}
              className="h-0.75 rounded-full"
              initial={false}
              animate={{
                width: index === current ? 22 : 6,
                backgroundColor: index <= current ? '#2F2A24' : '#E6DDD2',
                opacity,
              }}
              transition={{ duration: 0.7, ease: easeSoft }}
            />
          )
        })}
      </motion.ol>

      <span className="eyebrow hidden sm:inline">{preview ? 'Preview · nothing is saved' : site.title}</span>
      {preview && <span className="eyebrow sm:hidden">Preview</span>}
    </header>
  )
}
