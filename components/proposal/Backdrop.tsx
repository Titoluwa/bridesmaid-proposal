'use client'

import { useReducedMotion } from 'framer-motion'

/** Deterministic petal layout (no Math.random → no hydration mismatch) */
const PETALS = [
  { id: 'petal-1', left: '8%', delay: 0, duration: 26, size: 10, x: 60, r: 260, opacity: 0.45 },
  { id: 'petal-2', left: '22%', delay: 9, duration: 31, size: 7, x: -40, r: -200, opacity: 0.35 },
  { id: 'petal-3', left: '41%', delay: 17, duration: 28, size: 9, x: 80, r: 300, opacity: 0.4 },
  { id: 'petal-4', left: '63%', delay: 4, duration: 33, size: 6, x: -70, r: -240, opacity: 0.3 },
  { id: 'petal-5', left: '79%', delay: 13, duration: 29, size: 11, x: 50, r: 220, opacity: 0.4 },
  { id: 'petal-6', left: '92%', delay: 21, duration: 35, size: 8, x: -30, r: -280, opacity: 0.35 },
]

/**
 * Warm ivory backdrop with soft accent glows, a whisper of paper grain and a
 * few very slow drifting petals. Everything reacts to the --accent colour.
 */
export function Backdrop({ petals = true }: Readonly<{ petals?: boolean }>) {
  const reduceMotion = useReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ivory">
      {/* accent glows */}
      <div
        className="absolute top-[-18vh] right-[-22vw] h-[70vh] w-[70vh] rounded-full opacity-60 blur-3xl"
        style={{
          background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 60%, transparent) 0%, transparent 68%)',
          animation: reduceMotion ? undefined : 'soft-pulse 14s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-[-22vh] left-[-25vw] h-[75vh] w-[75vh] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent) 45%, #ede7df) 0%, transparent 70%)',
          animation: reduceMotion ? undefined : 'soft-pulse 18s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute top-[35%] left-1/2 h-[40vh] w-[40vh] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
      />

      {/* paper grain */}
      <div className="paper-grain absolute inset-0 opacity-70 mix-blend-multiply" />

      {/* petals */}
      {petals &&
        !reduceMotion &&
        PETALS.map((petal, index) => (
          <span
            key={petal.id}
            className="absolute -top-8 block"
            style={
              {
                left: petal.left,
                width: petal.size,
                height: petal.size * 1.35,
                borderRadius: '80% 0 80% 0',
                background:
                  index % 2 === 0
                    ? 'color-mix(in srgb, var(--accent) 80%, #fff)'
                    : 'color-mix(in srgb, #e7d3a8 85%, #fff)',
                boxShadow: '0 1px 2px rgba(80,60,40,.08)',
                animation: `petal-drift ${petal.duration}s linear ${petal.delay}s infinite`,
                '--petal-x': `${petal.x}px`,
                '--petal-r': `${petal.r}deg`,
                '--petal-opacity': petal.opacity,
              } as React.CSSProperties
            }
          />
        ))}
    </div>
  )
}
