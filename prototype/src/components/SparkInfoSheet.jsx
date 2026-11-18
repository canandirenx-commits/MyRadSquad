// "What's Spark?" — opened from the Spark row on a free user's Home (decisions #41, #54).
// Apple-style product page in a sheet: hero → how it works (mini chat) → try a sample → what it can see → CTA.
// Color rule: blue = AI only (the Spark step and the Spark cards). Purple = the action you take. Gray = the rest.
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { sparkFor, sparkSamples, trialDays } from '../data.js'
import Sheet from './Sheet.jsx'
import Button from './Button.jsx'
import SparkIcon from './SparkIcon.jsx'
import SparkCard from './SparkCard.jsx'
import WhatSparkCanSee from './WhatSparkCanSee.jsx'
import SparkDemo from './SparkDemo.jsx'
import { GroupLabel } from './Headings.jsx'

// Sections rise in one after another when the sheet opens
const rise = (i) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.12 + i * 0.08, type: 'spring', stiffness: 320, damping: 30 },
})

export default function SparkInfoSheet({ profile, onTry, onClose }) {
  // The poll sample comes from the user's own onboarding answers (fallback: sports)
  const hasAnswers = profile.interests.length || profile.purposes.length
  const poll = hasAnswers ? { ...sparkFor(profile), footer: "Made from what you're into" } : sparkSamples[1]
  const samples = [
    { id: 'question', label: 'Question', spark: sparkSamples[0] },
    { id: 'poll', label: 'Poll', spark: poll, results: Object.fromEntries(poll.options.map((o, i) => [o, [2, 1, 1, 0][i] ?? 0])) },
    { id: 'game', label: 'Game', spark: sparkSamples[2] },
  ]
  const [tab, setTab] = useState('poll')
  const current = samples.find((s) => s.id === tab)

  return (
    <Sheet onClose={onClose}>
      {/* Soft blue halo behind the hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(60%_70%_at_50%_0%,rgb(56_189_248/0.16),transparent_70%)]" />

      <div className="relative">
        {/* Hero */}
        <motion.div {...rise(0)} className="flex flex-col items-center pt-4 text-center">
          <motion.div
            initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="flex size-16 items-center justify-center rounded-[20px] bg-spark-deep"
          >
            <SparkIcon size={34} />
          </motion.div>
          <p className="mt-4 text-footnote font-semibold text-spark">What's Spark?</p>
          <h2 className="mt-1 text-title-1 brand-title text-heading">Your squad,<br />never quiet.</h2>
          <p className="mt-2 max-w-[290px] text-subhead text-label-2">
            Spark is the AI in Squad+. When the chat goes silent, it drops something fun to get everyone talking again.
          </p>
        </motion.div>

        {/* How it works: a tiny chat that plays once (decision #55) */}
        <motion.div {...rise(1)}>
          <Eyebrow>How it works</Eyebrow>
          <SparkDemo />
        </motion.div>

        {/* Samples: an iOS segmented control; the poll is playable */}
        <motion.div {...rise(2)}>
          <Eyebrow>Try a sample</Eyebrow>
          <div className="relative flex rounded-[9px] bg-surface-2 p-0.5" role="tablist">
            {samples.map((s) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={tab === s.id}
                onClick={() => setTab(s.id)}
                className={`relative h-8 flex-1 text-footnote font-semibold transition-colors ${tab === s.id ? 'text-heading' : 'text-label-2'}`}
              >
                {tab === s.id && (
                  <motion.span layoutId="sample-thumb" className="absolute inset-0 rounded-[7px] bg-[#3a3a3c] shadow-sm" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />
                )}
                <span className="relative">{s.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 min-h-[190px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.18 }}
              >
                <SparkCard spark={current.spark} results={current.results} voters={current.results ? ['Maya', 'Zoe', 'Leo'] : []} />
                {current.results && <p className="mt-2 text-center text-caption-1 text-label-3">Tap an answer to see how it works</p>}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div {...rise(3)} className="mt-6">
          <WhatSparkCanSee />
        </motion.div>
      </div>

      {/* Sticky actions: one primary, one tertiary */}
      <div className="sticky -bottom-[calc(var(--safe-bottom)+16px)] -mx-5 mt-6 bg-surface/90 px-5 pb-[calc(var(--safe-bottom)+4px)] pt-3 backdrop-blur-xl">
        <Button onClick={onTry}>Try Squad+ free for {trialDays} days</Button>
        <div className="mt-2"><Button variant="tertiary" size="sm" onClick={onClose}>Not now</Button></div>
      </div>
    </Sheet>
  )
}

function Eyebrow({ children }) {
  return <GroupLabel className="mb-2 mt-7 px-1">{children}</GroupLabel>
}
