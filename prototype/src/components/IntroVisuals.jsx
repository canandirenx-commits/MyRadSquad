// The visuals of the three intro screens (decisions #65, #66). Each has a small thing to tap:
//   Orbit      tap a friend → they hop · tap the mark → a ripple
//   ShareRows  hold a row → it stops · tap a photo → a heart · tap a voice note → it plays
//   PlusVisual a new Spark every few seconds, friends answer in bubbles · tap the card → the next Spark
// Intro photos are from Unsplash (free license), in public/photos/intro/.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimate, useAnimationFrame, useMotionValue, useReducedMotionConfig } from 'framer-motion'
import {
  Microphone, Play, Pause, Heart, Camera, VideoCamera, ChartBar, ArrowsLeftRight, Question, ChatCircleText, User,
} from '@phosphor-icons/react'
import Avatar from './Avatar.jsx'
import Photo from './Photo.jsx'
import SparkIcon from './SparkIcon.jsx'
import { Mark } from './Logo.jsx'

const pic = (name) => `/photos/intro/${name}.jpg`

// Generic people for the intro — NOT the user's squad (that comes later, on the invite)
const person = (name, face, color) => ({ name, initials: name.slice(0, 2).toUpperCase(), color, photo: pic(face) })
const people = [
  person('Ava', 'face1', '#fb923c'),
  person('Noah', 'face4', '#38bdf8'),
  person('Mia', 'face5', '#c084fc'),
  person('Lily', 'face3', '#f87171'),
  person('Kai', 'face8', '#4ade80'),
  person('Sam', 'face7', '#facc15'),
  person('Ezra', 'face9', '#2dd4bf'),
  person('Ivy', 'face10', '#f472b6'),
]
const byName = (name) => people.find((p) => p.name === name)

// ================= 1 · Orbit: five friends slowly circle the app mark =================
const five = people.slice(0, 5)

export function Orbit() {
  const still = useReducedMotionConfig()
  const [ripple, setRipple] = useState(0)
  const R = 128
  // One slow turn a minute; each avatar turns back the other way so faces stay upright
  const turn = (dir) => still ? {} : { animate: { rotate: 360 * dir }, transition: { duration: 60, repeat: Infinity, ease: 'linear' } }

  return (
    <div className="relative size-[300px]">
      {/* Outer ring = the friends' path (radius R), inner ring halfway to the mark */}
      <span className="absolute inset-[22px] rounded-full border border-line" />
      <span className="absolute inset-[66px] rounded-full border border-line bg-white/[0.03]" />

      {/* Ripple from the mark when it's tapped */}
      <AnimatePresence>
        {ripple > 0 && (
          <motion.span
            key={ripple}
            className="pointer-events-none absolute inset-[104px] rounded-full border border-label-3"
            initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 3.2, opacity: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Center: the app mark, same type language as the wordmark */}
      <motion.button
        aria-label="MyRadSquad"
        onClick={() => setRipple((r) => r + 1)}
        whileTap={{ scale: 0.92 }}
        className="absolute left-1/2 top-1/2 -ml-[46px] -mt-[46px] flex size-[92px] items-center justify-center rounded-[26px] bg-surface-2 ring-1 ring-line"
        initial={still ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Mark size={46} />
      </motion.button>

      <motion.div className="absolute inset-0" {...turn(1)}>
        {five.map((m, i) => {
          const a = (i / five.length) * 2 * Math.PI - Math.PI / 2
          return (
            <motion.div
              key={m.name}
              className="absolute"
              style={{ left: 150 + R * Math.cos(a) - 28, top: 150 + R * Math.sin(a) - 28 }}
              initial={still ? false : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 300, damping: 18 }}
            >
              <motion.div {...turn(-1)}>
                <Hop><Avatar member={m} size={56} ring /></Hop>
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

// Tap → a little hop, like a friend waving back
function Hop({ children }) {
  const [scope, animate] = useAnimate()
  return (
    <button ref={scope} onClick={() => animate(scope.current, { y: [0, -14, 0], scale: [1, 1.12, 1] }, { duration: 0.45 })} className="block rounded-full">
      {children}
    </button>
  )
}

// ================= 2 · Two rows of shares, sliding in opposite directions =================
const rowA = [
  { type: 'photo', src: 'hearts', by: 'Ava', time: 'now' },
  { type: 'voice', by: people[1], length: '0:24' },
  { type: 'photo', src: 'pizza', by: 'Kai', time: '3m' },
  { type: 'video', src: 'skate', by: 'Noah', length: '0:08' },
  { type: 'photo', src: 'sunset', by: 'Mia', time: '12m' },
  { type: 'voice', by: people[3], length: '0:41' },
]
const rowB = [
  { type: 'photo', src: 'concert', by: 'Lily', time: '1m' },
  { type: 'photo', src: 'sleepover', by: 'Sam', time: '8m' },
  { type: 'voice', by: people[6], length: '0:12' },
  { type: 'photo', src: 'mural', by: 'Ezra', time: '20m' },
  { type: 'video', src: 'selfie', by: 'Ava', length: '0:15' },
  { type: 'photo', src: 'sky', by: 'Mia', time: '1h' },
]

export function ShareRows() {
  return (
    // A slight tilt makes the two rows feel like a live feed, not a grid
    <div className="flex w-full -rotate-6 scale-110 flex-col gap-2.5 [mask-image:linear-gradient(90deg,transparent,black_14%,black_86%,transparent)]">
      <Row items={rowA} speed={22} />
      {/* Starts half a tile over, so the two rows interlace like bricks */}
      <Row items={rowB} speed={22} reverse offset={-67} />
    </div>
  )
}

// All tiles: 164px tall, same corner, same hairline and shadow, so the rows read as one set
const tile = 'h-[164px] rounded-card ring-1 ring-line shadow-[0_12px_24px_-14px_rgb(0_0_0/0.9)]'
const chip = 'rounded-full bg-black/60 px-2 py-0.5 text-caption-2 font-medium text-label backdrop-blur-md'

// Slides forever. Hold it (press and keep the finger down) and it stops, so a tile can be looked at
function Row({ items, speed, reverse = false, offset = 0 }) {
  const still = useReducedMotionConfig()
  const ref = useRef(null)
  const x = useMotionValue(offset)
  const held = useRef(false)

  useAnimationFrame((_, delta) => {
    if (still || held.current || !ref.current) return
    const half = ref.current.scrollWidth / 2
    let v = x.get() + (reverse ? 1 : -1) * speed * (delta / 1000)
    if (v <= -half) v += half
    if (v > 0) v -= half
    x.set(v)
  })

  const hold = (on) => () => { held.current = on }
  return (
    <motion.div
      ref={ref}
      style={{ x }}
      className="flex w-max"
      onPointerDown={hold(true)} onPointerUp={hold(false)} onPointerLeave={hold(false)} onPointerCancel={hold(false)}
    >
      {/* Twice, so the row loops without a gap */}
      {[...items, ...items].map((item, i) => (
        <div key={i} className="mr-2.5">
          {item.type === 'photo' && <PhotoTile item={item} />}
          {item.type === 'voice' && <VoiceTile item={item} />}
          {item.type === 'video' && <VideoTile item={item} />}
        </div>
      ))}
    </motion.div>
  )
}

function PhotoTile({ item }) {
  const [hearts, setHearts] = useState(0)
  return (
    <button onClick={() => setHearts((h) => h + 1)} className={`relative block w-[124px] overflow-hidden ${tile}`}>
      <Photo src={pic(item.src)} className="size-full object-center" />
      <span className={`absolute bottom-2 left-2 ${chip}`}>
        {item.by} · {item.time}
      </span>
      {/* Tap → a heart pops */}
      <AnimatePresence>
        {hearts > 0 && (
          <motion.span
            key={hearts}
            className="absolute inset-0 flex items-center justify-center text-label"
            initial={{ scale: 0, opacity: 1 }} animate={{ scale: [0, 1.35, 1], opacity: [1, 1, 0] }}
            transition={{ duration: 0.9, times: [0, 0.35, 1] }}
          >
            <Heart size={44} weight="fill" className="drop-shadow-[0_4px_12px_rgb(0_0_0/0.6)]" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

// Fixed waveform shape, so it looks like a real recording
const wave = [6, 12, 20, 14, 26, 18, 10, 22, 28, 16, 8, 18, 24, 12, 20, 9, 15, 6]

function Waveform({ className = '' }) {
  return (
    <span className={`flex h-7 items-center gap-[3px] ${className}`}>
      {wave.map((h, i) => <span key={i} className="w-[3px] rounded-full bg-current" style={{ height: h }} />)}
    </span>
  )
}

function VoiceTile({ item }) {
  const [playing, setPlaying] = useState(false)
  return (
    <button
      onClick={() => setPlaying((p) => !p)}
      className={`flex w-[164px] flex-col justify-between bg-surface-2 p-3 text-left ${tile}`}
    >
      <span className="flex items-center gap-2">
        <Avatar member={item.by} size={26} />
        <span className="text-footnote font-semibold">{item.by.name}</span>
        <Microphone size={14} className="ml-auto text-label-2" />
      </span>

      {/* Tap → it plays: the waveform lights up from left to right */}
      <span className="relative block w-max text-label-3">
        <Waveform />
        <motion.span
          className="absolute inset-y-0 left-0 overflow-hidden text-label"
          initial={false}
          animate={{ width: playing ? '100%' : '0%' }}
          transition={playing ? { duration: 3, ease: 'linear' } : { duration: 0.2 }}
          onAnimationComplete={() => playing && setPlaying(false)}
        >
          <Waveform className="w-max" />
        </motion.span>
      </span>

      <span className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-white/10">
          {playing ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}
        </span>
        <span className="text-caption-1 font-medium tabular-nums text-label-2">{item.length}</span>
      </span>
    </button>
  )
}

// A round video message, like in the chat
function VideoTile({ item }) {
  return (
    <span className="flex h-[164px] w-[164px] items-center justify-center">
      <span className="relative size-[156px] overflow-hidden rounded-full ring-1 ring-line shadow-[0_12px_24px_-14px_rgb(0_0_0/0.9)]">
        <Photo src={pic(item.src)} className="size-full" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-black/55 text-label backdrop-blur-md">
            <Play size={18} weight="fill" />
          </span>
        </span>
        <span className={`absolute bottom-3 left-1/2 -translate-x-1/2 tabular-nums ${chip}`}>
          {item.by} · {item.length}
        </span>
      </span>
    </span>
  )
}

// ================= 3 · Squad+: the crowd around Spark =================
// One picture for both Squad+ benefits (decision #70):
//   the ring = room for 12 (5 friends + 7 open seats that fill in)
//   the core = Spark, the main feature: a glass card that reshapes into a new dare every few seconds,
//              and the friends answer it with small bubbles. Tap the card → the next Spark right away.
const sparks = [
  { kind: 'Photo dare', icon: Camera, prompt: 'Snap something red. Go!', photo: 'red', meta: 'Ava found shoes',
    reacts: [[0, 'on it'], [3, 'found one'], [2, 'wait for me']] },
  { kind: 'Funny video', icon: VideoCamera, prompt: 'Act out your cat on a keyboard. 10s.', video: 'cat2', meta: '3 videos in',
    reacts: [[1, 'i’m crying'], [4, 'mia wins'], [0, 'again!!']] },
  { kind: 'Poll', icon: ChartBar, prompt: 'Pizza or tacos tonight?', bars: [['Pizza', 60], ['Tacos', 40]],
    reacts: [[2, 'pizza!'], [1, 'tacos'], [4, 'both??']] },
  { kind: 'Photo dare', icon: Camera, prompt: 'Take a photo of a cat. Any cat.', photo: 'cat', meta: 'Kai got one in 40s',
    reacts: [[4, 'LOOK'], [3, 'mug counts?'], [0, 'cute']] },
  { kind: 'Would you rather', icon: ArrowsLeftRight, prompt: 'No phone for a week or no music?', chips: ['No phone', 'No music'],
    reacts: [[1, 'no music'], [2, 'how??'], [3, 'easy']] },
  { kind: 'Voice dare', icon: Microphone, prompt: 'Sing one line of your song of the week.', voice: 'Lily', meta: '0:07',
    reacts: [[3, 'don’t judge'], [0, 'on repeat'], [4, 'my turn']] },
  { kind: 'Caption this', icon: ChatCircleText, prompt: 'Caption this. Best one wins.', photo: 'concert', meta: '4 captions',
    reacts: [[2, 'me after 1 chip'], [1, 'lol'], [0, 'iconic']] },
  { kind: 'Quiz', icon: Question, prompt: 'Who sends “study call at 8?”', chips: ['Mia', 'Kai', 'Ava'],
    reacts: [[2, 'guilty'], [4, 'obviously mia'], [1, 'every day']] },
]
const CYCLE = 3600 // ms per Spark
const SEATS = 12
const R = 150 // ring radius
const SIZE = 340

// Seat i sits on the ring, starting at the top and going clockwise
const seat = (i) => {
  const a = (i / SEATS) * 2 * Math.PI - Math.PI / 2
  return { x: SIZE / 2 + R * Math.cos(a), y: SIZE / 2 + R * Math.sin(a) }
}
// The 5 friends take every other-ish seat so the open seats spread around the ring
const faceSeats = [0, 2, 5, 7, 10]

export function PlusVisual() {
  const still = useReducedMotionConfig()
  const [n, setN] = useState(0)
  const spark = sparks[n % sparks.length]

  useEffect(() => {
    if (still) return
    const t = setTimeout(() => setN((v) => v + 1), CYCLE)
    return () => clearTimeout(t)
  }, [n, still])

  const openSeats = Array.from({ length: SEATS }, (_, i) => i).filter((i) => !faceSeats.includes(i))

  return (
    <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
      {/* Soft pale-blue glow behind Spark (blue = AI) */}
      <span className="absolute inset-[70px] rounded-full bg-spark/15 blur-3xl" />

      {/* The ring: the squad's seats. A small light travels along it */}
      <span className="absolute rounded-full border border-line" style={{ inset: SIZE / 2 - R }} />
      {!still && (
        <motion.span
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
        >
          <span className="absolute left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-spark shadow-[0_0_10px_3px_rgb(125_211_252/0.6)]" style={{ top: SIZE / 2 - R }} />
        </motion.span>
      )}

      {/* 7 open seats: dashed and empty, then they fill in one by one */}
      {openSeats.map((i, k) => {
        const { x, y } = seat(i)
        return (
          <motion.span
            key={i}
            className="absolute flex size-[34px] items-center justify-center rounded-full border border-white/15 bg-surface-2 text-label-2"
            style={{ left: x - 17, top: y - 17 }}
            initial={still ? false : { scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 + k * 0.08, type: 'spring', stiffness: 320, damping: 18 }}
          >
            <User size={15} />
          </motion.span>
        )
      })}

      {/* The 5 friends */}
      {faceSeats.map((i, k) => {
        const { x, y } = seat(i)
        return (
          <span key={i} className="absolute" style={{ left: x - 21, top: y - 21 }}>
            <Hop><Avatar member={people[k]} size={42} ring /></Hop>
          </span>
        )
      })}

      {/* Their answers to the current Spark pop up above them */}
      <AnimatePresence>
        {!still && spark.reacts.map(([who, text], j) => {
          const { x, y } = seat(faceSeats[who])
          return (
            <motion.span
              key={`${n}-${j}`}
              className="pointer-events-none absolute z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-surface-2/90 px-2 py-0.5 text-caption-2 font-semibold text-label ring-1 ring-white/10 backdrop-blur-md"
              style={{ left: x, top: y - 42 }}
              initial={{ opacity: 0, y: 8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}
              transition={{ delay: 0.7 + j * 0.35, type: 'spring', stiffness: 380, damping: 22 }}
            >
              {text}
            </motion.span>
          )
        })}
      </AnimatePresence>

      {/* The core: one glass Spark card that reshapes into each new Spark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <SparkCore spark={spark} n={n} still={still} onNext={() => setN((v) => v + 1)} />
      </div>
    </div>
  )
}

function SparkCore({ spark, n, still, onNext }) {
  return (
    <motion.button
      layout
      onClick={onNext}
      aria-label="Next Spark"
      className="relative w-[204px] overflow-hidden rounded-[22px] bg-white/[0.06] p-3.5 text-left ring-1 ring-spark/40 shadow-[0_0_40px_-8px_rgb(125_211_252/0.35)] backdrop-blur-xl"
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={n}
          className="block"
          initial={{ opacity: 0, filter: 'blur(6px)', y: 6 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          exit={{ opacity: 0, filter: 'blur(6px)', y: -6 }}
          transition={{ duration: 0.35 }}
        >
          <span className="flex items-center gap-1.5 text-caption-1 font-semibold">
            <motion.span
              className="inline-flex"
              initial={still ? false : { scale: 0, rotate: -140 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.1 }}
            >
              <SparkIcon size={14} />
            </motion.span>
            Spark
            <span className="flex items-center gap-1 font-normal text-label-2">· <spark.icon size={12} /> {spark.kind}</span>
          </span>
          <span className="mt-1.5 block text-subhead font-semibold">{spark.prompt}</span>
          <span className="mt-2.5 block"><SparkBody spark={spark} /></span>
        </motion.span>
      </AnimatePresence>

      {/* Time to the next Spark */}
      {!still && (
        <span className="mt-3 block h-0.5 overflow-hidden rounded-full bg-white/10">
          <motion.span
            key={n}
            className="block h-full rounded-full bg-spark"
            initial={{ width: '0%' }} animate={{ width: '100%' }}
            transition={{ duration: CYCLE / 1000, ease: 'linear' }}
          />
        </span>
      )}
    </motion.button>
  )
}

// The bottom of the card, by Spark type — compact, so the card has no empty middle
function SparkBody({ spark }) {
  if (spark.photo || spark.video) {
    return (
      <span className="flex items-center gap-2.5">
        <span className="relative size-11 shrink-0 overflow-hidden rounded-[10px]">
          <Photo src={pic(spark.photo ?? spark.video)} className="size-full" />
          {spark.video && <span className="absolute inset-0 flex items-center justify-center bg-black/30"><Play size={14} weight="fill" /></span>}
        </span>
        <span className="text-caption-1 text-label-2">{spark.meta}</span>
      </span>
    )
  }
  if (spark.bars) {
    return (
      <span className="grid grid-cols-2 gap-1.5">
        {spark.bars.map(([label, pct]) => (
          <span key={label} className="relative h-8 overflow-hidden rounded-[8px] bg-white/[0.06]">
            <span className="absolute inset-y-0 left-0 bg-white/15" style={{ width: `${pct}%` }} />
            <span className="relative flex h-full items-center justify-between px-2 text-caption-1 font-medium">
              {label}<span className="tabular-nums text-label-2">{pct}%</span>
            </span>
          </span>
        ))}
      </span>
    )
  }
  if (spark.chips) {
    return (
      <span className="flex gap-1.5">
        {spark.chips.map((c) => <span key={c} className="flex h-8 flex-1 items-center justify-center rounded-[8px] bg-white/[0.06] text-caption-1 font-medium">{c}</span>)}
      </span>
    )
  }
  if (spark.voice) {
    return (
      <span className="flex items-center gap-2">
        <Avatar member={byName(spark.voice)} size={24} />
        <Waveform className="origin-left scale-[0.8] text-label" />
        <span className="-ml-6 text-caption-1 tabular-nums text-label-2">{spark.meta}</span>
      </span>
    )
  }
  return null
}
