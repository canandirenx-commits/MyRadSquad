// Onboarding → Home transition (decision #95). Shown once, after the paywall at the end of onboarding
// (trial started, closed, or "Ask a parent"), never for paywalls opened from Home or the chat.
// The user already joined on the invite screen; this only confirms it — no new join action, no state change.
// ~3s: the mark turns, three lines cycle, "Alex joined Lunch Table" lands, then Home.
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotionConfig } from 'framer-motion'
import { Check } from '@phosphor-icons/react'
import { me, squad } from '../../data.js'
import { Mark } from '../../components/Logo.jsx'
import Avatar, { AvatarStack } from '../../components/Avatar.jsx'

const lines = [`Joining ${squad.name}…`, 'Getting your messages ready…', 'Your friends are waiting!']
const STEP = 1000 // ms per line

// Opened directly with ?screen=joining (e.g. for a screenshot)? Then it stays on the last step.
const pinned = new URLSearchParams(location.search).get('screen') === 'joining'

export default function Joining({ go }) {
  const still = useReducedMotionConfig()
  const [step, setStep] = useState(still || pinned ? lines.length - 1 : 0)

  useEffect(() => {
    if (pinned) return
    if (step < lines.length - 1) {
      const t = setTimeout(() => setStep((s) => s + 1), STEP)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => go('home'), still ? 600 : 1100)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const joined = step >= 1

  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      {/* The mark turns gently while we "set things up" */}
      <motion.span
        className="flex size-[88px] items-center justify-center rounded-[26px] bg-surface-2 ring-1 ring-line"
        initial={still ? false : { scale: 0.8, opacity: 0 }}
        animate={still ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1, rotate: [0, 0, 360] }}
        transition={still ? undefined : { scale: { type: 'spring', stiffness: 260, damping: 20 }, rotate: { duration: 1.6, times: [0, 0.25, 1], ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.2 } }}
      >
        <Mark size={44} />
      </motion.span>

      {/* One line at a time */}
      <div className="relative mt-8 h-7 w-full overflow-hidden" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={step}
            className="absolute inset-x-0 text-headline font-semibold"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
          >
            {lines[step]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Alex slides into the squad: the clear "you're in" */}
      <motion.div
        className="mt-5 flex items-center gap-3 rounded-full bg-surface py-2 pl-2 pr-4"
        initial={false}
        animate={{ opacity: joined ? 1 : 0, y: joined ? 0 : 8 }}
        transition={{ duration: 0.3 }}
      >
        <span className="flex items-center">
          <AvatarStack members={squad.members} size={26} />
          <motion.span
            className="-ml-2.5"
            initial={false}
            animate={{ x: joined ? 0 : 24, opacity: joined ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22, delay: still ? 0 : 0.15 }}
          >
            <Avatar member={me} size={26} ring />
          </motion.span>
        </span>
        <span className="flex items-center gap-1.5 text-subhead text-label-2">
          <span className="flex size-[18px] items-center justify-center rounded-full bg-label text-bg"><Check size={11} weight="bold" /></span>
          <span><span className="font-semibold text-label">{me.name}</span> joined {squad.name}</span>
        </span>
      </motion.div>
    </div>
  )
}
