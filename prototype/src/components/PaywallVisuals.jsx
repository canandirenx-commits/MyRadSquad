// Paywall B pieces (decisions #60, #61): show Squad+ instead of listing it, and say the trial terms in plain sentences.
import { useEffect, useState } from 'react'
import { motion, useAnimate, useReducedMotionConfig } from 'framer-motion'
import { UsersThree, Palette } from '@phosphor-icons/react'
import { squad, limits, trialDays, topics } from '../data.js'
import { AvatarStack } from './Avatar.jsx'
import SparkIcon from './SparkIcon.jsx'

// ---- Spark deck: a stack of real Spark examples. Push the top card left or right to see the next ----
const deck = [
  { id: 'poll', topic: 'close', kind: 'Poll', question: 'Saturday plan, squad vote:', bars: [['Beach day', 64], ['Movie night', 36]] },
  { id: 'quiz', topic: 'study', kind: 'Quiz', question: 'Bio quiz: what does the mitochondria make?', chips: ['ATP', 'DNA', 'Glucose'] },
  { id: 'game', topic: 'movies', kind: 'Game', question: 'Movie trivia · round 3 of 5', scores: [['Maya', 120], ['Zoe', 90], ['You', 60]] },
  { id: 'question', topic: 'close', kind: 'Question', question: 'What made you laugh today?', replies: 3 },
]

// Where each card sits in the pile: 0 = on top. The back cards fan out so it reads as a pile you can flip
const pile = [
  { rotate: 0, y: 0, scale: 1 },
  { rotate: -6, y: 8, x: -10, scale: 0.94 },
  { rotate: 6, y: 14, x: 10, scale: 0.88 },
  { rotate: 0, y: 16, x: 0, scale: 0.84 },
]

export function SparkDeck() {
  const still = useReducedMotionConfig()
  const [order, setOrder] = useState(deck.map((c) => c.id))
  const [touched, setTouched] = useState(false)
  const [scope, animate] = useAnimate()
  const top = order[0]

  // Until the user touches the deck, the top card leans aside now and then, showing the card under it.
  // This replaces a "Swipe for more" label: the motion itself says "this moves".
  useEffect(() => {
    if (still || touched) return
    const lean = () => scope.current && animate(scope.current, { x: [0, 46, 0], rotate: [0, 5, 0] }, { duration: 1.1, ease: 'easeInOut' })
    const first = setTimeout(lean, 1200)
    const again = setInterval(lean, 4200)
    return () => { clearTimeout(first); clearInterval(again) }
  }, [still, touched, scope, animate])

  // Top card goes to the bottom of the pile
  function next() {
    setTouched(true)
    setOrder(([first, ...rest]) => [...rest, first])
  }

  return (
    <div>
      <div className="relative mx-6 h-[120px]">
        {[...order].reverse().map((id) => {
          const card = deck.find((c) => c.id === id)
          const depth = order.indexOf(id)
          const isTop = id === top
          return (
            <motion.div
              key={id}
              className="absolute inset-0 touch-pan-y"
              style={{ zIndex: deck.length - depth }}
              initial={false}
              animate={{ x: 0, ...pile[depth], opacity: depth > 2 ? 0 : 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              drag={isTop ? 'x' : false}
              dragElastic={0.7}
              dragConstraints={{ left: 0, right: 0 }}
              onDragStart={() => setTouched(true)}
              onDragEnd={(_, info) => (Math.abs(info.offset.x) > 70 || Math.abs(info.velocity.x) > 400) && next()}
              whileDrag={{ rotate: 0, scale: 1.02 }}
            >
              <div className="h-full" ref={isTop ? scope : undefined}>
                <DeckCard card={card} />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Page dots: which Spark you're on. Tapping them flips to the next one too */}
      <button onClick={next} aria-label="Next Spark" className="mx-auto mt-4 flex h-6 items-center gap-1.5 px-3">
        {deck.map((c) => (
          <span key={c.id} className={`h-1.5 rounded-full transition-all duration-300 ${c.id === top ? 'w-4 bg-spark' : 'w-1.5 bg-label-3'}`} />
        ))}
      </button>
    </div>
  )
}

function DeckCard({ card }) {
  const topic = topics[card.topic]
  return (
    <div className="spark-ring flex h-full flex-col rounded-card bg-surface p-3.5 shadow-[0_10px_24px_-12px_rgb(0_0_0/0.9)]">
      <p className="flex items-center gap-1.5 text-caption-1 font-semibold">
        <SparkIcon size={13} /> Spark
        <span className="flex items-center gap-1 font-normal text-label-2">· <topic.icon size={12} /> {card.kind}</span>
      </p>
      <p className="mt-1 line-clamp-1 text-subhead font-medium">{card.question}</p>

      <div className="mt-auto">
        {card.bars && (
          <div className="grid grid-cols-2 gap-1.5">
            {card.bars.map(([label, pct]) => (
              <div key={label} className="relative h-8 overflow-hidden rounded-[8px] bg-surface-2">
                <span className="absolute inset-y-0 left-0 bg-white/15" style={{ width: `${pct}%` }} />
                <span className="relative flex h-full items-center justify-between px-2.5 text-caption-1 font-medium">
                  {label}<span className="text-label-2 tabular-nums">{pct}%</span>
                </span>
              </div>
            ))}
          </div>
        )}
        {card.chips && (
          <div className="grid grid-cols-3 gap-1.5">
            {card.chips.map((c) => <span key={c} className="flex h-8 items-center justify-center rounded-[8px] bg-surface-2 text-caption-1 font-medium">{c}</span>)}
          </div>
        )}
        {card.scores && (
          <div className="grid grid-cols-3 gap-1.5">
            {card.scores.map(([name, pts], i) => (
              <span key={name} className={`flex h-8 items-center justify-between rounded-[8px] bg-surface-2 px-2.5 text-caption-1 ${name === 'You' ? 'ring-1 ring-label' : ''}`}>
                <span className="font-medium">{i + 1}. {name}</span><span className="font-semibold tabular-nums">{pts}</span>
              </span>
            ))}
          </div>
        )}
        {card.replies && (
          <span className="flex h-8 items-center gap-2 text-caption-1 text-label-2">
            <AvatarStack members={squad.members.slice(0, card.replies)} size={20} />
            {card.replies} replies · your turn
          </span>
        )}
      </div>
    </div>
  )
}

// ---- The other two Squad+ features: icon + two lines, side by side ----
const extras = [
  { icon: UsersThree, title: `Up to ${limits.plus} friends`, text: `Free fits ${limits.free}` },
  { icon: Palette, title: 'Fun extras', text: 'Themes & effects' },
]

export function PlusFeatures() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {extras.map((f) => (
        <div key={f.title} className="flex items-center gap-2.5 rounded-card bg-surface p-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-surface-2 text-label-2">
            <f.icon size={20} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-footnote font-semibold">{f.title}</span>
            <span className="block truncate text-caption-1 text-label-2">{f.text}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

// ---- Trial terms in plain sentences (replaces the timeline). Left-aligned like body text (decision #98) ----
// A 3-day trial started today is free through day 3; the first payment is on day 4, the reminder the day before.
export function TrialTerms({ plan }) {
  return (
    <div className="space-y-1 text-footnote text-label-2">
      <p>
        <span className="font-semibold text-label">Free for {trialDays} days</span>, today through {dayLabel(trialDays - 1)}.
      </p>
      <p>We'll remind you on {dayLabel(trialDays - 1)}, a day before you pay.</p>
      <p>
        From {dayLabel(trialDays)}: <span className="font-semibold text-label">{plan.price}/{plan.per}</span>, auto-renews. Cancel anytime.
      </p>
    </div>
  )
}

// "Nov 14" for today + n days
export function dayLabel(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
