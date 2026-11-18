// "How it works" as a 3-frame story strip (decision #55): readable at a glance.
// quiet chat → Spark drops (signature motion) → friends answer. Frames appear one after another.
import { motion, useReducedMotionConfig } from 'framer-motion'
import { MoonStars, Check } from '@phosphor-icons/react'
import { squad } from '../data.js'
import { AvatarStack } from './Avatar.jsx'
import SparkIcon from './SparkIcon.jsx'

const answered = squad.members.filter((m) => ['Maya', 'Zoe', 'Leo'].includes(m.name))

// Each frame rises in a beat after the one before
const beat = (i) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.25 + i * 0.35, type: 'spring', stiffness: 320, damping: 28 },
})

export default function SparkDemo() {
  const still = useReducedMotionConfig()

  return (
    <div>
      <ol className="grid grid-cols-3 gap-2">
        {/* 1 · The chat goes quiet */}
        <Frame i={0} title={`${squad.name} goes quiet`}>
          <div className="flex h-full flex-col justify-center gap-1.5 rounded-card border border-line bg-bg p-2.5">
            <span className="h-2 w-3/4 rounded-full bg-surface-2" />
            <span className="h-2 w-1/2 rounded-full bg-surface-2" />
            <span className="mt-1 flex items-center gap-1 text-caption-2 text-label-3">
              <MoonStars size={12} /> 4h quiet
            </span>
          </div>
        </Frame>

        {/* 2 · Spark drops: the only blue frame, with the signature motion */}
        <Frame i={1} title="Spark drops a poll or game" ai>
          <motion.div
            className="spark-ring relative flex h-full flex-col justify-center gap-1.5 rounded-card p-2.5"
            initial={still ? false : { scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.75, type: 'spring', stiffness: 420, damping: 30 }}
          >
            <span className="flex items-center gap-1 text-caption-2 font-semibold">
              <SparkIcon size={11} /> Spark
            </span>
            <span className="h-2 w-full rounded-full bg-surface-2" />
            <span className="flex gap-1">
              <span className="h-4 flex-1 rounded-[5px] bg-surface-2" />
              <span className="h-4 flex-1 rounded-[5px] bg-surface-2" />
            </span>
            {!still && <span className="spark-sheen rounded-card" style={{ animationDelay: '1s' }} />}
          </motion.div>
        </Frame>

        {/* 3 · Everyone jumps back in */}
        <Frame i={2} title="Everyone jumps back in">
          <div className="flex h-full flex-col items-center justify-center gap-1.5 rounded-card border border-line bg-bg p-2.5">
            <AvatarStack members={answered} size={22} />
            <span className="flex items-center gap-1 text-caption-2 text-label-2">
              <Check size={11} /> 3 answered
            </span>
          </div>
        </Frame>
      </ol>

      <p className="mt-3 px-1 text-footnote text-label-2">
        You pick how often: once a day, twice a day, or whenever you're bored. Just tap{' '}
        <SparkIcon size={12} className="inline-block -translate-y-px align-middle" />
      </p>
    </div>
  )
}

function Frame({ i, title, ai, children }) {
  return (
    <motion.li {...beat(i)} className="flex flex-col">
      <div className="h-[92px]">{children}</div>
      <p className="mt-2 flex gap-1.5 px-0.5 text-caption-1 font-semibold leading-tight text-heading">
        <span className={`tabular-nums ${ai ? 'text-spark' : 'text-label-3'}`}>{i + 1}</span>
        {title}
      </p>
    </motion.li>
  )
}
