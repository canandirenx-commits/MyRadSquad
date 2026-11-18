import { useState } from 'react'
import { DotsThree } from '@phosphor-icons/react'
import { motion, useReducedMotionConfig } from 'framer-motion'
import SparkIcon from './SparkIcon.jsx'
import { topics } from '../data.js'

// The AI card. The aurora gradient appears ONLY here (decision #6).
// sentBy = null → automatic Spark, topic chip only (decision #17)
// Interactive mode (pass `results`): answers stay hidden until you vote, then results show.
// Signature motion (decision #55): every Spark arrives the same way —
// the ✦ spins in and flashes, the card unfolds from it, one light sweeps the frame. ~0.8s.
export default function SparkCard({ spark, sentBy = null, footer, results, voters = [], onMenu, drop = true, delay = 0 }) {
  const still = useReducedMotionConfig()
  const play = drop && !still
  const [picked, setPicked] = useState(null)
  const topic = topics[spark.topic]
  const TopicIcon = topic.icon
  const interactive = Boolean(results)
  const total = interactive ? Object.values(results).reduce((a, b) => a + b, 0) + (picked ? 1 : 0) : 0

  return (
    <div className="relative">
    <motion.div
      className="spark-ring relative rounded-card px-3.5 py-3"
      style={{ transformOrigin: '21px 20px' }}
      initial={play ? { opacity: 0, scale: 0.85 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.22, type: 'spring', stiffness: 420, damping: 30 }}
    >
      <div className="flex items-center gap-1.5 text-caption-1 font-semibold">
        <SparkIcon size={14} />
        <span className="text-label">{sentBy ? `${sentBy} sent a Spark` : 'Spark'}</span>
        <span className="flex items-center gap-1 text-label-2">· <TopicIcon size={13} /> {topic.label}</span>
        {onMenu && (
          <button onClick={onMenu} aria-label="Spark options" className="-my-2 -mr-2 ml-auto flex size-9 items-center justify-center rounded-full text-label-2 active:bg-white/10">
            <DotsThree size={22} />
          </button>
        )}
      </div>

      <p className="mt-1.5 text-body">{spark.question}</p>

      {/* Game with a scoreboard: everyone's points, highest first */}
      {spark.scores && <Scoreboard scores={spark.scores} />}

      {/* Prompt-only Sparks (no options) are just a question to the squad */}
      {spark.options.length > 0 && (
      <div className={`mt-2.5 grid gap-1.5 ${spark.options.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {spark.options.map((o) => {
          if (interactive && picked) {
            const votes = (results[o] ?? 0) + (picked === o ? 1 : 0)
            const pct = Math.round((votes / total) * 100)
            return (
              <div key={o} className={`relative h-9 overflow-hidden rounded-control bg-surface-2 ${picked === o ? 'ring-[1.5px] ring-inset ring-white/60' : ''}`}>
                <div className="absolute inset-y-0 left-0 bg-white/15 transition-all duration-500" style={{ width: `${pct}%` }} />
                <span className="relative flex h-full items-center justify-between px-3 text-subhead font-medium">
                  {o}<span className={picked === o ? 'text-label' : 'text-label-2'}>{pct}%</span>
                </span>
              </div>
            )
          }
          return (
            <button
              key={o}
              onClick={() => interactive && setPicked(o)}
              className="h-9 rounded-control bg-surface-2 px-2 text-subhead active:scale-[0.97]"
            >
              {o}
            </button>
          )
        })}
      </div>
      )}

      {interactive ? (
        <p className="mt-2.5 text-caption-1 text-label-2">
          {picked
            ? voters.length ? `You + ${voters.length} others answered` : 'You answered first'
            : voters.length ? `${voters[0]} + ${voters.length - 1} others answered · answers hidden until you vote` : 'Be the first to answer'}
        </p>
      ) : (
        (footer ?? spark.footer) && <p className="mt-2.5 text-caption-1 text-label-2">{footer ?? spark.footer}</p>
      )}
      {play && <span className="spark-sheen rounded-card" style={{ animationDelay: `${delay + 0.45}s` }} />}
    </motion.div>

    {/* The star that the card unfolds from: sits exactly on the card's own ✦ */}
    {play && (
      <motion.span
        className="pointer-events-none absolute left-[14px] top-[13px] drop-shadow-[0_0_6px_rgb(125_211_252)]"
        initial={{ scale: 0, rotate: -140, opacity: 0 }}
        animate={{ scale: [0, 1.9, 1], rotate: [-140, 0, 0], opacity: [0, 1, 0] }}
        transition={{ delay, duration: 0.8, times: [0, 0.4, 1], ease: 'easeOut' }}
      >
        <SparkIcon size={14} />
      </motion.span>
    )}
    </div>
  )
}

function Scoreboard({ scores }) {
  const sorted = [...scores].sort((a, b) => b.points - a.points)
  const top = sorted[0].points
  return (
    <ol className="mt-2.5 space-y-1">
      {sorted.map((s, i) => (
        <li key={s.name} className={`relative flex h-8 items-center overflow-hidden rounded-control bg-surface-2 px-3 text-subhead ${s.name === 'You' ? 'ring-1 ring-label' : ''}`}>
          {/* Bars grow in, one after another */}
          <motion.span
            className="absolute inset-y-0 left-0 bg-white/10"
            initial={{ width: 0 }}
            animate={{ width: `${(s.points / top) * 100}%` }}
            transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 120, damping: 20 }}
          />
          <span className="relative w-5 font-semibold text-label-2 tabular-nums">{i + 1}</span>
          <span className="relative flex-1 font-medium">{s.name}</span>
          <span className="relative font-semibold tabular-nums">{s.points}</span>
        </li>
      ))}
    </ol>
  )
}
