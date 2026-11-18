// Squad chat — home of the AI feature (Spark), in two states:
//   view="alex"   → the member who turns Spark on (state 1) — screen "chat"
//   view="jordan" → what the rest of the squad sees (state 2) — screen "chatSquad"
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CaretLeft, Microphone, Camera, VideoCamera } from '@phosphor-icons/react'
import { squad, chat, me, autoSpark, swapSpark, sparkRhythm } from '../../data.js'
import Avatar, { AvatarStack } from '../../components/Avatar.jsx'
import SparkIcon from '../../components/SparkIcon.jsx'
import SparkCard from '../../components/SparkCard.jsx'
import Sheet from '../../components/Sheet.jsx'
import ActionSheet from '../../components/ActionSheet.jsx'
import WhatSparkCanSee from '../../components/WhatSparkCanSee.jsx'
import { Message, SystemLine } from './Messages.jsx'
import SetupSheet from './SetupSheet.jsx'
import ComposeSheet from './ComposeSheet.jsx'
import { notBuilt } from '../../components/Toast.jsx'
import SquadPlusTag from '../../components/SquadPlusTag.jsx'

export default function Chat({ go, plan, profile, view = 'alex', squadChat, setSquadChat, intent }) {
  // What Alex already did in this chat (decision #104): Jordan's view shows the same Spark, rhythm and sent Sparks.
  // Without it (e.g. a direct link), Jordan's view is the default state 2 with the automatic Spark
  const shared = squadChat?.sparkOn ? squadChat : null
  // Jordan's view is state 2 — Alex has already turned Spark on
  const [sparkOn, setSparkOn] = useState(view === 'jordan' || Boolean(shared))
  const [quiet, setQuiet] = useState(shared?.quiet ?? '4h')
  const [frequency, setFrequency] = useState(shared?.frequency ?? 'Once a day')
  const [sent, setSent] = useState(shared?.sent ?? []) // manual Sparks sent by Alex
  // Came from Home's "Turn on Spark for Lunch Table"? Open straight on the Spark settings (decision #105)
  const [sheet, setSheet] = useState(() =>
    intent === 'sparkSetup' && view === 'alex' && plan === 'trial' && !shared ? 'setup' : null
  ) // 'setup' | 'compose' | 'canSee' | 'menu'
  const [auto, setAuto] = useState('live') // Jordan's auto Spark: 'live' | 'swapped' | 'removed' | 'snoozed'
  const [notify, setNotify] = useState(false)
  const listRef = useRef(null)

  const viewer = view === 'alex' ? me.name : 'Jordan'
  const isAlex = view === 'alex'
  // Alex on "When I ask" → no automatic Spark in the squad's view, only the ones Alex sends
  const autoOn = frequency !== 'When I ask'
  const lastSent = sent[sent.length - 1]

  // Keep the squad's view in sync with what Alex does here
  useEffect(() => {
    if (isAlex && setSquadChat) setSquadChat({ sparkOn, quiet, frequency, sent })
  }, [isAlex, sparkOn, quiet, frequency, sent, setSquadChat])

  // Jordan's view opens with the batched notification (decision #7)
  useEffect(() => {
    if (view !== 'jordan') return setNotify(false)
    const show = setTimeout(() => setNotify(true), 500)
    const hide = setTimeout(() => setNotify(false), 5000)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [view])

  // Keep the newest item in view
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [view, sparkOn, sent.length, auto])

  function tapSpark() {
    if (plan !== 'trial') return go('paywall')
    setSheet(sparkOn ? 'compose' : 'setup')
  }

  const autoCard = auto === 'swapped' ? swapSpark : autoSpark

  return (
    <div className="relative flex h-full flex-col">
      {/* Header */}
      <header className="z-10 border-b border-line bg-bg/80 pt-[var(--safe-top)] backdrop-blur-xl">
        <div className="flex h-12 items-center gap-1 px-1.5">
          <button onClick={() => go('home', -1)} aria-label="Back" className="flex size-11 items-center justify-center rounded-full active:bg-white/10">
            <CaretLeft size={24} />
          </button>
          <span className="flex size-9 items-center justify-center rounded-control bg-surface-2">
            <squad.icon size={20} />
          </span>
          <span className="ml-1.5 flex-1">
            <span className="block text-headline font-semibold leading-tight">{squad.name}</span>
            <span className="block text-caption-1 text-label-2">{squad.members.length + 1} friends</span>
          </span>
          <AvatarStack members={squad.members} size={24} />
          <span className="w-2" />
        </div>

        {/* Live voice room: a strip attached to the header (decision #14). Neutral background (decision #97):
            green is only the small "live" dot, and Join is purple like every other tappable text */}
        {isAlex && (
          <button onClick={() => notBuilt('Voice rooms')} className="flex h-10 w-full items-center gap-2.5 border-t border-line bg-surface px-4 text-footnote active:bg-surface-2">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#30d158] opacity-60" />
              <span className="relative size-2 rounded-full bg-[#30d158]" />
            </span>
            <Microphone size={15} className="text-label-2" />
            <span className="flex-1 text-left text-label-2"><span className="font-semibold text-label">Jordan</span> is in a voice room</span>
            <span className="font-semibold text-accent-text">Join</span>
          </button>
        )}
      </header>

      {/* Messages */}
      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-3 pb-4 pt-3">
        <SystemLine>Today</SystemLine>
        {chat.map((m, i) => <Message key={i} m={m} mine={m.by === viewer} />)}

        {/* Where Alex came in: everything above was before they joined (decision #97) */}
        <p className="flex items-center justify-center gap-2 py-1 text-caption-1 text-label-2">
          <span className="h-px w-6 bg-line" />
          <Avatar member={me} size={18} />
          <span><span className="font-semibold text-label">{isAlex ? "You're" : `${me.name} is`}</span> now part of the squad</span>
          <span className="h-px w-6 bg-line" />
        </p>

        {/* Who turned Spark on — visible to everyone (decision #4) */}
        {sparkOn && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-6 rounded-card border border-line px-4 py-3 text-center">
            <p className="flex items-center justify-center gap-1.5 text-footnote">
              <SparkIcon size={14} />
              <span><span className="font-semibold">{isAlex ? 'You' : me.name}</span> turned on Spark</span>
            </p>
            <p className="mt-0.5 text-caption-1 text-label-2">{sparkRhythm(quiet, frequency)}</p>
            <button onClick={() => setSheet('canSee')} className="mt-1.5 text-caption-1 font-semibold text-accent-text">
              See what Spark can see
            </button>
          </motion.div>
        )}

        {/* Manual Sparks from Alex */}
        {sent.map((s) => (
          <SparkCard key={s.question} spark={s} sentBy={isAlex ? 'You' : me.name}
            footer={isAlex ? 'Sent to Lunch Table · the squad is notified once' : undefined}
            results={isAlex ? undefined : Object.fromEntries(s.options.map((o) => [o, 0]))}
            voters={[]} />
        ))}

        {/* State 2: the automatic Spark, after the squad went quiet */}
        {!isAlex && autoOn && (
          <>
            <SystemLine>Quiet for {quiet}</SystemLine>
            {auto === 'live' || auto === 'swapped' ? (
              <SparkCard key={auto} spark={autoCard} results={autoCard.results} voters={autoCard.voters} onMenu={() => setSheet('menu')} />
            ) : (
              <SystemLine>{auto === 'removed' ? 'You removed a Spark · the squad sees it was removed' : 'You snoozed Spark for everyone · 24h · the squad sees this'}</SystemLine>
            )}
          </>
        )}
      </div>

      {/* Spark nudge above the composer (Alex, before turning it on) */}
      {isAlex && !sparkOn && (
        <button onClick={tapSpark} className="mx-3 mb-2 flex items-center gap-2 rounded-card bg-surface px-3 py-2.5 text-left text-footnote active:opacity-70">
          <SparkIcon size={16} />
          <span className="flex-1 text-label-2"><span className="font-semibold text-label">{squad.name} goes quiet a lot.</span> Spark can fix that.</span>
          {plan === 'trial' ? <span className="font-semibold text-accent-text">Turn on</span> : <SquadPlusTag />}
        </button>
      )}

      {/* Composer (decision #97): photo, a voice note inside the field (like iMessage), video message, and Spark.
          Each button has a 44px tap area around a 36px circle */}
      <div className="flex items-center gap-1 border-t border-line px-1.5 pb-[calc(var(--safe-bottom)+6px)] pt-1">
        <ComposerButton label="Photo" onClick={() => notBuilt('Photo sharing')}><Camera size={20} /></ComposerButton>
        <div className="flex h-9 min-w-0 flex-1 items-center rounded-full bg-surface-2 pl-4">
          <button onClick={() => notBuilt('Typing')} className="h-full flex-1 text-left text-body text-label-3">Message</button>
          <button onClick={() => notBuilt('Voice notes')} aria-label="Voice note" className="-my-1 flex size-11 items-center justify-center text-label-2 active:opacity-60">
            <Microphone size={20} />
          </button>
        </div>
        <ComposerButton label="Video message" onClick={() => notBuilt('Video messages')}><VideoCamera size={20} /></ComposerButton>
        {isAlex && (
          <button onClick={tapSpark} aria-label="Spark" className="flex size-11 shrink-0 items-center justify-center active:scale-95">
            <span className="spark-ring flex size-9 items-center justify-center rounded-full"><SparkIcon size={18} /></span>
          </button>
        )}
      </div>

      {/* Batched notification (Jordan) */}
      <AnimatePresence>
        {notify && (
          <motion.button
            onClick={() => setNotify(false)}
            className="absolute inset-x-2 top-[calc(var(--safe-top)+4px)] z-50 flex items-center gap-3 rounded-[22px] bg-surface-2/90 p-3 text-left shadow-2xl backdrop-blur-xl"
            initial={{ y: -120 }} animate={{ y: 0 }} exit={{ y: -120 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-accent text-on-accent">
              <squad.icon size={22} />
            </span>
            <span className="flex-1">
              <span className="flex justify-between text-footnote font-semibold">{squad.name}<span className="font-normal text-label-2">now</span></span>
              <span className="block text-footnote">
                {!autoOn && lastSent ? `${me.name} sent a Spark. Tap to play.` : 'Maya + 2 others answered a Spark. Your turn.'}
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sheets */}
      <AnimatePresence>
        {sheet === 'setup' && (
          <SetupSheet quiet={quiet} setQuiet={setQuiet} frequency={frequency} setFrequency={setFrequency} onClose={() => setSheet(null)}
            onTurnOn={() => { setSparkOn(true); setSheet(null) }} />
        )}
        {sheet === 'compose' && (
          <ComposeSheet profile={profile} onClose={() => setSheet(null)}
            onSend={(s) => { setSent([...sent.filter((x) => x.question !== s.question), s]); setSheet(null) }} />
        )}
        {sheet === 'canSee' && (
          <Sheet onClose={() => setSheet(null)}>
            <h2 className="mb-1 text-title-2 font-bold">How Spark works</h2>
            <p className="mb-4 text-subhead text-label-2">
              {isAlex ? 'You' : me.name} turned it on. {sparkRhythm(quiet, frequency)}. Anyone can swap, remove or snooze a Spark.
            </p>
            <WhatSparkCanSee />
          </Sheet>
        )}
        {sheet === 'menu' && (
          <ActionSheet
            title="Anyone in the squad can change this Spark"
            onClose={() => setSheet(null)}
            actions={[
              { label: 'Swap for a different one', onClick: () => setAuto('swapped') },
              { label: 'Snooze Spark for everyone · 24h', onClick: () => setAuto('snoozed') },
              { label: 'Not for us — remove', onClick: () => setAuto('removed'), destructive: true },
            ]}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// A round composer button: 36px circle inside a 44px tap area
function ComposerButton({ label, onClick, children }) {
  return (
    <button onClick={onClick} aria-label={label} className="flex size-11 shrink-0 items-center justify-center active:opacity-70">
      <span className="flex size-9 items-center justify-center rounded-full bg-surface-2">{children}</span>
    </button>
  )
}
