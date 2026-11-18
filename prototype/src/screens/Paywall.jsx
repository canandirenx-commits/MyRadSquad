// Squad+ paywall — iOS-style, fits on one screen (decisions #47, #52).
// Variant A: benefit list + timeline, yearly preselected (decision #12).
// Variant B: Spark deck + icon tiles + trial terms in sentences, yearly preselected (decisions #61, #62).
// Exits: "Start trial" → trial Home · X → free Home · "Ask a parent" → request sent → free Home
// (opened from the chat → back to the chat instead)
//
// Color rules on this page:
//   purple = the action (CTA)   white = what you selected   blue = AI (Sparks only)   gray = everything else
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, UsersThree, Palette, Check } from '@phosphor-icons/react'
import { plans, limits, trialDays, squad } from '../data.js'
import Button from '../components/Button.jsx'
import SparkIcon from '../components/SparkIcon.jsx'
import Logo from '../components/Logo.jsx'
import { SparkDeck, PlusFeatures, TrialTerms } from '../components/PaywallVisuals.jsx'
import { notBuilt } from '../components/Toast.jsx'
import SquadPlusTag from '../components/SquadPlusTag.jsx'

const benefits = [
  { icon: (props) => <SparkIcon {...props} mono />, ai: true, title: 'Sparks', text: 'AI drops a quiz, poll or game when it’s quiet' },
  { icon: UsersThree, title: `Squads up to ${limits.plus}`, text: `Room for everyone, not just ${limits.free}` },
  { icon: Palette, title: 'Fun extras', text: 'Squad themes and voice room effects' },
]

export default function Paywall({ go, setPlan, paywallFrom, variant = 'A' }) {
  // Both variants preselect Yearly: the test changes only the design, nothing else (decision #62)
  const [selected, setSelected] = useState('yearly')
  const [askedParent, setAskedParent] = useState(false)
  const plan = plans[selected]
  const isB = variant === 'B'
  // Reached at the end of onboarding? Then say up front that the user is already in the squad (decision #96)
  const joined = paywallFrom === 'payoff'

  // Opened from the chat? Go back there, so the user lands where they wanted Spark. Otherwise Home.
  // At the end of onboarding (opened from Payoff) → the short "Joining Lunch Table…" screen first, then Home
  function exit(next) {
    setPlan(next)
    const back = paywallFrom === 'chat'
    if (back) return go('chat', next === 'free' ? -1 : 1)
    go(paywallFrom === 'payoff' ? 'joining' : 'home')
  }

  return (
    <div className="relative flex h-full flex-col">
      <div className="relative flex flex-1 flex-col overflow-y-auto px-5 pt-[var(--safe-top)] [&>*]:shrink-0">
        {/* Close: iOS gray circle, visible right away — no dark patterns for a teen audience */}
        <button
          onClick={() => exit('free')}
          aria-label="Close"
          className="absolute right-3 top-[calc(var(--safe-top)+4px)] z-10 flex size-11 items-center justify-center active:opacity-60"
        >
          <span className="flex size-[30px] items-center justify-center rounded-full bg-surface-2 text-label-2">
            <X size={15} />
          </span>
        </button>

        {/* Shared header, identical in A and B (decision #100): wordmark + Squad+ badge on one line, then the
            variant's own headline in the same style. Only the headline copy and the body below differ */}
        <PaywallHeader joined={joined} title={isB ? 'Bring your chat to life' : 'Keep your squad always alive'} />

        {/* B: a swipeable deck of Sparks + two feature tiles (experience-led) */}
        {isB && (
          <>
            <Gap min={20} />
            <SparkDeck />
            <Gap min={16} />
            <PlusFeatures />
          </>
        )}

        {/* A: benefits as an iOS inset grouped list. Only Sparks gets the AI blue */}
        {!isB && <Gap min={20} />}
        {!isB && <ul className="overflow-hidden rounded-card bg-surface">
          {benefits.map((b, i) => (
            <li key={b.title} className="flex items-center gap-3 pl-3.5">
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-[8px] ${b.ai ? 'bg-spark-deep text-spark' : 'bg-surface-2 text-label-2'}`}>
                <b.icon size={18} />
              </span>
              <span className={`flex-1 py-2.5 pr-3.5 ${i > 0 ? 'border-t border-line' : ''}`}>
                <span className="block text-subhead font-semibold">{b.title}</span>
                <span className="block text-footnote text-label-2">{b.text}</span>
              </span>
            </li>
          ))}
        </ul>}

        {/* Plans: same fixed card size in A and B (decision #100) */}
        <Gap min={isB ? 20 : 16} />
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Choose a plan">
          {Object.values(plans).map((p) => (
            <PlanCard key={p.id} plan={p} selected={selected === p.id} onSelect={() => setSelected(p.id)} />
          ))}
        </div>

        {/* Trial terms between two flexible gaps. The gap below starts at 0 because the footer adds its own 12px,
            so the visible space above and below stays equal (decisions #86, #98) */}
        <Gap min={12} />
        <div>
        {/* Trial timeline: gray pills joined by a line, real dates (same in A and B).
            A 3-day trial started today is billed on day 4 (today + 3); the reminder comes the day before */}
        {!isB && (
          <ol className="relative grid grid-cols-3">
            <span className="absolute left-[16.666%] right-[16.666%] top-[9px] h-px bg-label-3" />
            <Step title="Today" date={dayLabel(0)} text="Full access" />
            <Step title="Reminder" date={dayLabel(trialDays - 1)} text="We'll notify you" />
            <Step title="Trial ends" date={dayLabel(trialDays)} text={`${plan.price}/${plan.per} starts`} />
          </ol>
        )}

        {/* B: the same terms, as sentences */}
        {isB && <TrialTerms plan={plan} />}
        </div>
        <Gap min={0} />
      </div>

      {/* Sticky actions */}
      <div className="bg-bg px-5 pb-[calc(var(--safe-bottom)+4px)] pt-3">
        {/* Supporting text above the CTA, like every screen (decision #82):
            A's auto-renew terms (App Store rule, follows the selected plan; B says them in the body) + the legal line */}
        {/* Reserved for two lines in both variants, so the CTA sits at exactly the same height in A and B */}
        <div className="mb-3 flex min-h-9 flex-col justify-end space-y-1 text-center text-caption-1 text-label-2">
          {/* No price here: the plan card and the timeline already show it (decision #87) */}
          {!isB && <p>Auto-renews. Cancel anytime in Settings.</p>}
          {/* Links in one quiet line (decision #84): Restore is for the few who already paid, so it isn't a loud button */}
          <p><LegalLink>Terms</LegalLink> · <LegalLink>Privacy Policy</LegalLink> · Already purchased? <LegalLink>Restore</LegalLink></p>
        </div>
        <Button onClick={() => exit('trial')}>Start {trialDays}-day free trial</Button>
        {/* Below the CTA: only the tertiary action, its own 44px tap area, 8px from the CTA (decision #64) */}
        <div className="mt-2"><Button variant="tertiary" size="sm" onClick={() => setAskedParent(true)}>Ask a parent</Button></div>
      </div>

      <AnimatePresence>
        {askedParent && <AskParentAlert onDone={() => exit('free')} />}
      </AnimatePresence>
    </div>
  )
}

// Plan card (decision #85): premium = fewer, softer lines. Selected is a raised layer (lighter fill, 1.5px soft white
// frame, faint top highlight); unselected nearly loses its frame and its price steps back to gray
function PlanCard({ plan, selected, onSelect }) {
  return (
    <button
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex h-[72px] w-full items-center gap-3 rounded-card px-4 text-left ring-inset transition duration-200 active:scale-[0.99]
        ${selected
          ? 'bg-surface-2 ring-[1.5px] ring-white/60 shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_8px_24px_-12px_rgb(0_0_0/0.8)]'
          : 'bg-surface ring-1 ring-white/[0.06]'}`}
    >
      {/* A real radio (one plan only): ring + inner dot. Checks are for pick-many lists (decision #85) */}
      <span className={`flex size-5 shrink-0 items-center justify-center rounded-full ring-[1.5px] ring-inset transition ${selected ? 'ring-label' : 'ring-white/25'}`}>
        {selected && <span className="size-2.5 rounded-full bg-label" />}
      </span>
      <span className="flex-1">
        <span className="flex items-center gap-2 text-headline font-semibold">
          {plan.label}
          {plan.badge && <span className="rounded-full bg-accent/20 px-2 py-px text-caption-2 font-semibold text-[#c4b5fd]">{plan.badge}</span>}
        </span>
        {plan.note && <span className="block text-footnote text-label-2">{plan.note}</span>}
      </span>
      <span className="text-right">
        <span className={`block text-headline font-semibold tabular-nums transition ${selected ? 'text-label' : 'text-label-2'}`}>{plan.price}</span>
        <span className="block text-caption-1 text-label-2">per {plan.per}</span>
      </span>
    </button>
  )
}

// "Nov 12" for today + n days
function dayLabel(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function Step({ title, date, text }) {
  return (
    <li className="relative flex flex-col items-center px-1 text-center">
      {/* The label is the node: a filled neutral pill (no border, so it doesn't read as a button) */}
      <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-caption-1 font-semibold">{title}</span>
      <span className="mt-1.5 text-caption-2 text-label-3">{date}</span>
      <span className="text-caption-1 text-label-2">{text}</span>
    </li>
  )
}

// The header both variants share: MyRadSquad wordmark + Squad+ badge, the optional "You're in" note, the headline
function PaywallHeader({ joined, title }) {
  return (
    <div className="flex flex-col items-center pt-6 text-center">
      <span className="flex items-center gap-2">
        <Logo size={22} />
        <SquadPlusTag />
      </span>
      {joined && <JoinedNote className="mt-2.5" />}
      <h1 className="mt-3 text-balance text-title-1 brand-title">{title}</h1>
    </div>
  )
}

// "You're in Lunch Table · Squad+ is optional": closing the paywall never feels like leaving the squad
function JoinedNote({ className = '' }) {
  return (
    <p className={`flex items-center gap-1.5 rounded-full bg-white/[0.06] py-0.5 pl-1 pr-3 text-caption-1 text-label-2 ${className}`}>
      <span className="flex size-4 items-center justify-center rounded-full bg-label text-bg"><Check size={10} weight="bold" /></span>
      <span><span className="font-semibold text-label">You're in {squad.name}</span> · Squad+ is optional</span>
    </p>
  )
}

// A flexible gap between paywall sections (decision #98): never smaller than `min` (the 852pt layout), and on
// taller screens every gap grows by the same amount, so the extra room spreads evenly instead of piling up in one spot
function Gap({ min }) {
  return <div aria-hidden className="max-h-14" style={{ flex: '1 0 0', minHeight: min }} />
}

// Small inline link with extra vertical padding = a taller tap area
function LegalLink({ children }) {
  return <button onClick={() => notBuilt(children)} className="-my-1.5 py-1.5 underline active:text-label-2">{children}</button>
}

// iOS-style alert for "Ask to Buy"
function AskParentAlert({ onDone }) {
  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 px-12"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full overflow-hidden rounded-[14px] bg-surface-2/95 text-center backdrop-blur-xl"
        initial={{ scale: 1.1 }} animate={{ scale: 1 }}
      >
        <div className="px-4 pb-4 pt-5">
          <p className="text-headline font-semibold">Request sent</p>
          <p className="mt-1 text-footnote">
            We asked your parent to approve Squad+. We'll let you know when they answer. Keep chatting on Free until then.
          </p>
        </div>
        <button onClick={onDone} className="h-11 w-full border-t border-line text-body font-semibold text-accent-text active:bg-white/10">
          OK
        </button>
      </motion.div>
    </motion.div>
  )
}
