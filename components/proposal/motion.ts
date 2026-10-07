import type { Transition, Variants } from 'framer-motion'

export const easeSoft: Transition['ease'] = [0.22, 1, 0.36, 1]

/** Screen-level enter / exit used by every step of the story */
export const screen: Variants = {
  initial: { opacity: 0, y: 24, filter: 'blur(6px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: easeSoft, when: 'beforeChildren' },
  },
  exit: {
    opacity: 0,
    y: -16,
    filter: 'blur(6px)',
    transition: { duration: 0.5, ease: easeSoft },
  },
}

/** Soft fade-up for individual elements */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeSoft, delay },
  }),
}

export const stagger = (staggerChildren = 0.12, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})
