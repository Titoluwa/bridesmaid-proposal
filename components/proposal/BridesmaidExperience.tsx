'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Bridesmaid, BridesmaidColor } from '@/lib/bridesmaids'
import type { ResponseRecord } from '@/lib/store/types'
import {
  acceptProposalAction,
  openLetterAction,
  revealColorAction,
} from '@/app/bridesmaids/[slug]/actions'
import { Backdrop } from './Backdrop'
import { BridesmaidProposal } from './BridesmaidProposal'
import { ChiefColors } from './ChiefColors'
import { ColorReveal } from './ColorReveal'
import { ColorSummary } from './ColorSummary'
import { EnvelopeIntro } from './EnvelopeIntro'
import { FinalMessage } from './FinalMessage'
import { PersonalLetter } from './PersonalLetter'
import { RoleReveal } from './RoleReveal'
import { StoryHeader } from './StoryHeader'
import { screen } from './motion'

type Step = 'envelope' | 'letter' | 'role' | 'proposal' | 'colors' | 'summary' | 'final'

const STEPS: Step[] = ['envelope', 'letter', 'role', 'proposal', 'colors', 'summary', 'final']

type Props = {
  bridesmaid: Bridesmaid
  initialRecord: ResponseRecord | null
  preview?: boolean
}

export function BridesmaidExperience({ bridesmaid, initialRecord, preview = false }: Readonly<Props>) {
  const [step, setStep] = useState<Step>('envelope')
  const [assignedColor, setAssignedColor] = useState<BridesmaidColor | null>(() => {
    if (initialRecord?.colorName && initialRecord.colorHex) {
      return {
        name: initialRecord.colorName,
        hex: initialRecord.colorHex,
        emoji: '💜',
      }
    }
    return null
  })
  const [accentOverride, setAccentOverride] = useState<string | null>(null)
  const isChief = bridesmaid.type === 'chief'
  const alreadyAccepted = Boolean(initialRecord?.acceptedAt)

  // Determine current active accent color
  const activeAccent = useMemo(() => {
    if (accentOverride) return accentOverride
    if (assignedColor?.hex) return assignedColor.hex
    if (isChief && bridesmaid.colors?.[0]?.hex) return bridesmaid.colors[0].hex
    return '#E7D3A8'
  }, [accentOverride, assignedColor, isChief, bridesmaid.colors])

  // Track letter opening
  const handleOpen = useCallback(() => {
    if (!preview) {
      openLetterAction(bridesmaid.slug)
    }
  }, [bridesmaid.slug, preview])

  const handleOpened = useCallback(() => {
    setStep('letter')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Skip directly to keepsake if she has already accepted on previous visit
  const handleSkipToKeepsake = useCallback(() => {
    setStep('summary')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Acceptance handler
  const handleAccept = useCallback(
    (hesitations: number) => {
      if (!preview) {
        acceptProposalAction(bridesmaid.slug, hesitations)
      }
      setStep('colors')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [bridesmaid.slug, preview],
  )

  // Color reveal handler
  const handleRequestColor = useCallback(async (): Promise<BridesmaidColor> => {
    if (preview) {
      const fallback: BridesmaidColor = {
        name: 'Pastel Purple',
        hex: '#D8C7ED',
        emoji: '💜',
      }
      setAssignedColor(fallback)
      return fallback
    }

    const res = await revealColorAction(bridesmaid.slug)
    if (!res.ok) {
      throw new Error(res.error)
    }
    setAssignedColor(res.data)
    return res.data
  }, [bridesmaid.slug, preview])

  const handleColorConfirmed = useCallback((col: BridesmaidColor) => {
    setAssignedColor(col)
    setAccentOverride(col.hex)
  }, [])

  // Progress chapter index
  const chapterIndex = STEPS.indexOf(step)
  const totalChapters = STEPS.length

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [step])

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-x-hidden transition-colors duration-700"
      style={{ '--accent': activeAccent } as React.CSSProperties}
    >
      <Backdrop />
      <StoryHeader current={chapterIndex} total={totalChapters} preview={preview} />

      <main className="relative flex flex-1 flex-col">
        <AnimatePresence mode="wait">
          {step === 'envelope' && (
            <motion.div key="envelope" variants={screen} initial="initial" animate="animate" exit="exit" className="flex flex-1 flex-col">
              <EnvelopeIntro
                bridesmaid={bridesmaid}
                completed={alreadyAccepted}
                onOpen={handleOpen}
                onOpened={handleOpened}
                onSkipToKeepsake={handleSkipToKeepsake}
              />
            </motion.div>
          )}

          {step === 'letter' && (
            <motion.div key="letter" variants={screen} initial="initial" animate="animate" exit="exit" className="flex flex-1 flex-col">
              <PersonalLetter
                bridesmaid={bridesmaid}
                onContinue={() => setStep('role')}
              />
            </motion.div>
          )}

          {step === 'role' && (
            <motion.div key="role" variants={screen} initial="initial" animate="animate" exit="exit" className="flex flex-1 flex-col">
              <RoleReveal
                bridesmaid={bridesmaid}
                onBack={() => setStep('letter')}
                onContinue={() => setStep('proposal')}
              />
            </motion.div>
          )}

          {step === 'proposal' && (
            <motion.div key="proposal" variants={screen} initial="initial" animate="animate" exit="exit" className="flex flex-1 flex-col">
              <BridesmaidProposal
                bridesmaid={bridesmaid}
                onBack={() => setStep('role')}
                onAccept={handleAccept}
              />
            </motion.div>
          )}

          {step === 'colors' && (
            <motion.div key="colors" variants={screen} initial="initial" animate="animate" exit="exit" className="flex flex-1 flex-col">
              {isChief ? (
                <ChiefColors
                  bridesmaid={bridesmaid}
                  onContinue={() => setStep('summary')}
                />
              ) : (
                <ColorReveal
                  assigned={assignedColor}
                  reveal={handleRequestColor}
                  onAccentChange={setAccentOverride}
                  onRevealed={handleColorConfirmed}
                  onContinue={() => setStep('summary')}
                />
              )}
            </motion.div>
          )}

          {step === 'summary' && (
            <motion.div key="summary" variants={screen} initial="initial" animate="animate" exit="exit" className="flex flex-1 flex-col">
              <ColorSummary
                bridesmaid={bridesmaid}
                color={assignedColor}
                onContinue={() => setStep('final')}
              />
            </motion.div>
          )}

          {step === 'final' && (
            <motion.div key="final" variants={screen} initial="initial" animate="animate" exit="exit" className="flex flex-1 flex-col">
              <FinalMessage
                bridesmaid={bridesmaid}
                onReadAgain={() => setStep('letter')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
