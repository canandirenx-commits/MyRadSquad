// Home — for a user who joined Lunch Table 2 minutes ago.
// Job 1: show the squad is alive. Job 2: give the obvious first step.
// plan: 'trial' (started Squad+ trial) | 'free' (closed the paywall)
import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Camera, Microphone, VideoCamera, Bell, MapPin, LockSimple } from '@phosphor-icons/react'
import SparkInfoSheet from '../components/SparkInfoSheet.jsx'
import { homeSquads, regularSquads, presence, squad, me } from '../data.js'
import SquadCard, { SquadRow } from '../components/SquadCard.jsx'
import ActionSheet from '../components/ActionSheet.jsx'
import Avatar from '../components/Avatar.jsx'
import InviteCard from '../components/InviteCard.jsx'
import TabBar from '../components/TabBar.jsx'
import { notBuilt } from '../components/Toast.jsx'
import { Mark } from '../components/Logo.jsx'
import { SectionTitle, GroupLabel } from '../components/Headings.jsx'

// The three ways to share a first moment (brief: photos, voice, recorded video). Icons only, labels for VoiceOver
const shareOptions = [
  { icon: Camera, label: 'Photo' },
  { icon: Microphone, label: 'Voice note' },
  { icon: VideoCamera, label: 'Video message' },
]

export default function Home({ go, plan, profile, intent, squadChat }) {
  const member = (name) => squad.members.find((m) => m.name === name)
  const [sparkInfo, setSparkInfo] = useState(intent === 'sparkInfo')
  // The friend whose place bubble is open: { p, x } (x = center of their avatar inside the strip)
  const [pin, setPin] = useState(null)
  const strip = useRef(null)
  const [adding, setAdding] = useState(false)
  // The most active squad gets the big card; any others are compact rows under it
  // A regular user (weeks later) has several squads and has already shared: no first-moment card (decision #101)
  const regular = intent === 'regular'
  const squads = regular ? regularSquads : homeSquads
  const [lead, ...others] = squads

  function togglePlace(p, e) {
    if (pin?.p.name === p.name) return setPin(null)
    const btn = e.currentTarget
    setPin({ p, x: btn.offsetLeft - strip.current.scrollLeft + 17 })
  }

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-4 pb-[calc(var(--safe-bottom)+96px)] pt-[var(--safe-top)]" onScroll={() => setPin(null)}>
        {/* Top bar: the app mark on the left, notifications on the right (decisions #72, #73) */}
        <div className="flex h-11 items-center justify-between pt-1">
          <h1 aria-label="MyRadSquad" className="flex size-9 items-center justify-center rounded-[11px] bg-surface-2 ring-1 ring-line">
            <Mark size={18} />
          </h1>
          <button onClick={() => notBuilt('Notifications')} aria-label="Notifications" className="relative -mr-2 flex size-11 items-center justify-center active:opacity-60">
            <Bell size={23} />
            <span className="absolute right-[11px] top-[10px] size-2 rounded-full bg-accent ring-2 ring-bg" />
          </button>
        </div>

        {/* Vertical rhythm (decision #89): 24px between page blocks (mark · people · squads), 12px from a section
            title to its content, 12px between cards. Margins below are tuned so the VISIBLE gaps hit those numbers */}
        {/* Right now: who's around — the squad feels alive at a glance. Tap a friend → where they are */}
        <div className="relative mt-[22px]">
          <div
            ref={strip}
            onScroll={() => setPin(null)}
            className="-mx-4 flex gap-5 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {presence.map((p) => (
              <button key={p.name} onClick={(e) => togglePlace(p, e)} className="flex shrink-0 items-center gap-2 text-left active:opacity-70">
                <span className="relative">
                  <Avatar member={member(p.name)} size={34} />
                  {/* Green dot = online right now (the only green on the page) */}
                  {p.live && <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-[#30d158] ring-2 ring-bg" />}
                </span>
                <span>
                  <span className="block text-subhead font-semibold leading-tight">{p.name}</span>
                  <span className="block text-caption-1 text-label-2">{p.status}</span>
                </span>
              </button>
            ))}
            {/* Trailing space so the last friend never touches the screen edge */}
            <span className="w-1 shrink-0" aria-hidden />
          </div>

          <AnimatePresence>
            {pin && <PlaceBubble key={pin.p.name} place={pin.p} x={pin.x} squadName={squad.name} />}
          </AnimatePresence>
        </div>

        {/* Squads (n): a section with the iOS "+" to add one. "See all" only appears once there's more than fits here */}
        <div className="mt-3 flex items-center justify-between">
          <SectionTitle>
            Squads <span className="text-label-2">({squads.length})</span>
          </SectionTitle>
          <div className="-mr-2 flex items-center">
            {!regular && squads.length > 3 && (
              <button onClick={() => notBuilt('All squads')} className="h-11 px-2 text-subhead font-semibold text-accent-text active:opacity-60">See all</button>
            )}
            <button onClick={() => setAdding(true)} aria-label="Add a squad" className="flex size-11 items-center justify-center active:opacity-60">
              <span className="flex size-[30px] items-center justify-center rounded-full bg-surface-2 text-label"><Plus size={16} weight="bold" /></span>
            </button>
          </div>
        </div>

        {/* Regular user: every squad as an open card with its own Invite, one after another (decision #102).
            New member: the lead squad's card, any others as compact rows */}
        {regular ? (
          <div className="space-y-3">
            {squads.map((s, i) => (
              <SquadCard key={s.name} squad={s} plan={plan} onOpen={() => (i === 0 ? go('chat') : notBuilt(s.name))} onSparkInfo={() => setSparkInfo(true)} onInvite={() => notBuilt('Inviting')} />
            ))}
          </div>
        ) : (
          <>
            <SquadCard squad={squadChat?.sparkOn ? { ...lead, sparkOn: true } : lead} plan={plan} onOpen={() => go('chat')} onSparkInfo={() => setSparkInfo(true)} onTurnOnSpark={() => go('chat', 1, 'sparkSetup')} />
            {others.length > 0 && (
              <div className="mt-2 overflow-hidden rounded-sheet bg-surface">
                {others.slice(0, 2).map((s, i) => (
                  <SquadRow key={s.name} squad={s} first={i === 0} onOpen={() => notBuilt(s.name)} />
                ))}
              </div>
            )}
          </>
        )}

        {!regular && (
          <>
        {/* First step: the new member hasn't shared anything yet. Three equal ways to share (decision #90):
            round icon buttons with a purple tint — purple = the action, and sharing is Home's main action */}
        <div className="mt-3 rounded-sheet bg-surface p-4">
          <GroupLabel>Welcome, {me.name}</GroupLabel>
          <p className="mt-1 text-headline font-semibold">Share your first moment</p>
          <p className="mt-0.5 text-footnote text-label-2">{squad.members.length} friends are waiting to hear from you.</p>
          <div className="mt-4 grid grid-cols-3">
            {shareOptions.map((o) => (
              <button
                key={o.label}
                aria-label={o.label}
                onClick={() => notBuilt(`${o.label} sharing`)}
                className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent/15 text-accent-text transition active:scale-95 active:bg-accent/25"
              >
                <o.icon size={24} />
              </button>
            ))}
          </div>
        </div>

          </>
        )}

        {/* Capacity: free squads cap at 5 — this is where the limit is felt (decision #40).
            Regular users invite from each squad's card instead */}
        {!regular && (
          <div className="mt-3">
            <InviteCard squadName={squad.name} size={squad.members.length + 1} plan={plan} onUpgrade={() => go('paywall')} />
          </div>
        )}
      </div>

      {/* Tap anywhere else → the place bubble closes */}
      {pin && <div className="absolute inset-0 z-10" onClick={() => setPin(null)} aria-hidden />}

      <TabBar active="squads" />

      {/* "+" → the iOS way to add: an action sheet. Free squads fit 5, but there's no limit on how many squads you have */}
      <AnimatePresence>
        {adding && (
          <ActionSheet
            title="Add a squad"
            actions={[
              { label: 'Create a new squad', onClick: () => notBuilt('Creating a squad') },
              { label: 'Join with an invite link', onClick: () => notBuilt('Joining a squad') },
            ]}
            onClose={() => setAdding(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sparkInfo && <SparkInfoSheet profile={profile} onTry={() => go('paywall')} onClose={() => setSparkInfo(false)} />}
      </AnimatePresence>
    </div>
  )
}

// Where a friend is, Snapchat-style but safe for 13–17: a rough place they chose to share
// (no map, no address, no distance), only with this squad
const BUBBLE = 208
function PlaceBubble({ place, x, squadName }) {
  const left = Math.max(0, Math.min(x - 28, 361 - BUBBLE))
  return (
    <motion.div
      role="status"
      className="absolute top-[calc(100%+10px)] z-20 rounded-card bg-surface-2 px-3.5 py-3 shadow-[0_16px_32px_-12px_rgb(0_0_0/0.9)] ring-1 ring-white/10"
      style={{ left, width: BUBBLE, transformOrigin: `${x - left}px 0px` }}
      initial={{ opacity: 0, scale: 0.85, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
    >
      {/* The little arrow pointing at the friend */}
      <span className="absolute -top-[6px] size-3 rotate-45 rounded-[2px] bg-surface-2 ring-1 ring-white/10 [clip-path:polygon(0_0,100%_0,0_100%)]" style={{ left: x - left - 6 }} />
      <p className="flex items-center gap-1.5 text-subhead font-semibold">
        <MapPin size={16} weight="fill" className="text-label-2" /> {place.place}
      </p>
      <p className="mt-0.5 text-caption-1 text-label-2">{place.name} · updated {place.updated}</p>
      <p className="mt-2.5 flex items-center gap-1 border-t border-line pt-2 text-caption-2 text-label-3">
        <LockSimple size={11} /> Only {squadName} sees this
      </p>
    </motion.div>
  )
}
