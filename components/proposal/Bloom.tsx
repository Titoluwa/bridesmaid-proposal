'use client'

import { motion, useReducedMotion } from 'framer-motion'

const COUNT = 16

/**
 * A soft, restrained bloom of petals — used for "yes" and the colour reveal.
 * Not confetti: a handful of small shapes that drift out and fade.
 */
export function Bloom({ colors, play }: { colors: string[]; play: boolean }) {
  const reduceMotion = useReducedMotion()
  if (!play || reduceMotion) return null

  return (
    <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 z-20 h-0 w-0">
      {Array.from({ length: COUNT }).map((_, index) => {
        const angle = (index / COUNT) * Math.PI * 2 + (index % 2 ? 0.2 : -0.1)
        const distance = 90 + (index % 4) * 28
        const size = 6 + (index % 3) * 3
        return (
          <motion.span
            key={index}
            className="absolute block"
            style={{
              width: size,
              height: size * 1.3,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              borderRadius: index % 3 === 0 ? '50%' : '80% 0 80% 0',
              background: colors[index % colors.length],
              boxShadow: '0 1px 3px rgba(60,45,30,.15)',
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: 0 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance + 30,
              opacity: [0, 1, 1, 0],
              scale: [0.4, 1, 1, 0.8],
              rotate: index % 2 ? 160 : -160,
            }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], times: [0, 0.15, 0.7, 1] }}
          />
        )
      })}
    </div>
  )
}
