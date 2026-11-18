// Payoff illustration (decision #80): the squad chat goes quiet, then Spark flies in, bursts into sparkles,
// drops the user's own Spark and the squad reacts. Abstract chat (gray bars, no real messages) so the
// only real content is the Spark made from the user's answers. Replays every few seconds; static in ?still.
import { useEffect, useState } from 'react'
import { motion, useReducedMotionConfig } from 'framer-motion'
import { Heart, Smiley, Fire } from '@phosphor-icons/react'
import { squad, topics } from '../data.js'
import Avatar, { AvatarStack } from './Avatar.jsx'
import SparkIcon from './SparkIcon.jsx'

const LOOP = 6500 // ms
const quietRows = [
  { who: 0, width: 110 },
  { who: 1, width: 70 },
  { who: 2, width: 130 },
]
const reactions = [
  { Icon: Heart, x: 226, y: 70, delay: 1.5 },
  { Icon: Smiley, x: 264, y: 52, delay: 1.7 },
  { Icon: Fire, x: 302, y: 72, delay: 1.9 },
]
// Sparkles that burst out where the star lands
const burst = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2
  return { x: Math.cos(a) * 34, y: Math.sin(a) * 26 }
})

export default function PayoffIllustration({ spark }) {
  const still = useReducedMotionConfig()
  const [run, setRun] = useState(0)
  const topic = topics[spark.topic]

  useEffect(() => {
    if (still) return
    const t = setInterval(() => setRun((r) => r + 1), LOOP)
    return () => clearInterval(t)
  }, [still])

  // Each step starts at its own time (s), or shows its end state right away in ?still
  const at = (delay, from, to, extra = {}) =>
    still ? { initial: false, animate: to } : { initial: from, animate: to, transition: { delay, ...extra } }

  return (
    <div key={run} className="relative h-[212px] overflow-hidden rounded-sheet bg-surface ring-1 ring-line" aria-hidden>
      {/* The quiet chat: gray bars that dim once the silence is broken */}
      <motion.div className="absolute left-4 top-4 space-y-2.5" {...at(1.1, { opacity: 1 }, { opacity: 0.35 }, { duration: 0.4 })}>
        {quietRows.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <Avatar member={squad.members[r.who]} size={20} />
            <span className="h-[18px] rounded-full bg-white/[0.07]" style={{ width: r.width }} />
          </div>
        ))}
      </motion.div>
      <motion.span
        className="absolute right-4 top-4 text-caption-2 font-semibold text-label-3"
        {...at(1.0, { opacity: 1 }, { opacity: 0 }, { duration: 0.3 })}
      >
        Quiet · 4h
      </motion.span>

      {/* Spark flies in from the top right and lands on the card's star */}
      {!still && (
        <motion.span
          className="absolute left-[28px] top-[134px]"
          initial={{ x: 280, y: -110, rotate: -180, scale: 1.6, opacity: 0 }}
          animate={{ x: 0, y: 0, rotate: 0, scale: [1.6, 1.6, 1], opacity: [0, 1, 1, 0] }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeIn', opacity: { times: [0, 0.1, 0.9, 1] } }}
        >
          <SparkIcon size={22} />
        </motion.span>
      )}
      {!still && burst.map((b, i) => (
        <motion.span
          key={i}
          className="absolute left-[36px] top-[142px] size-1.5 rounded-full bg-spark"
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{ x: b.x, y: b.y, opacity: [0, 1, 0], scale: [0, 1, 0.4] }}
          transition={{ delay: 1.15, duration: 0.6, ease: 'easeOut' }}
        />
      ))}

      {/* The user's own Spark */}
      <motion.div
        className="spark-ring absolute inset-x-4 bottom-4 rounded-card bg-surface-2 px-3 py-2.5"
        style={{ transformOrigin: '20px 18px' }}
        {...at(1.15, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1 }, { type: 'spring', stiffness: 380, damping: 26 })}
      >
        <p className="flex items-center gap-1.5 text-caption-1 font-semibold">
          <SparkIcon size={13} /> Spark
          <span className="flex items-center gap-1 font-normal text-label-2">· <topic.icon size={12} /> {topic.label}</span>
        </p>
        <p className="mt-0.5 line-clamp-1 text-subhead font-medium">{spark.question}</p>
        <motion.p className="mt-1.5 flex items-center gap-1.5 text-caption-1 text-label-2" {...at(2.2, { opacity: 0 }, { opacity: 1 })}>
          <AvatarStack members={squad.members.slice(0, 3)} size={16} /> 3 joined in
        </motion.p>
      </motion.div>

      {/* The squad reacts */}
      {reactions.map(({ Icon, x, y, delay }) => (
        <motion.span
          key={x}
          className="absolute flex size-8 items-center justify-center rounded-full bg-surface-2 text-label shadow-[0_6px_14px_-6px_rgb(0_0_0/0.9)] ring-1 ring-white/10"
          style={{ left: x, top: y }}
          {...at(delay, { opacity: 0, scale: 0, y: 10 }, { opacity: 1, scale: 1, y: 0 }, { type: 'spring', stiffness: 420, damping: 16 })}
        >
          <Icon size={16} weight="fill" />
        </motion.span>
      ))}
    </div>
  )
}
