// Reviewer tool, NOT part of the app (decision #56).
// A small tab hides on the right edge of the phone. Tap it or pull it left → a drawer
// lists every prototype screen, so the jury can jump straight to any state.
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ArrowCounterClockwise, SquaresFour } from '@phosphor-icons/react'

// Every stop in the prototype. `plan` and `intent` set up the state the screen needs.
export const stops = [
  { group: 'Onboarding', items: [
    { label: 'Launch', screen: 'launch' },
    { label: 'Intro 1', note: 'Your closest friends', screen: 'intro' },
    { label: 'Intro 2', note: 'Share every moment', screen: 'introFeatures' },
    { label: 'Intro 3', note: 'Go bigger with Squad+', screen: 'introPlus' },
    { label: 'Invite', screen: 'invite' },
    { label: '13+ age gate', screen: 'ageGate' },
    { label: 'Why are you here?', screen: 'why' },
    { label: 'Payoff', screen: 'payoff' },
    { label: 'Joining Lunch Table', note: 'After the paywall', screen: 'joining' },
  ] },
  { group: 'Squad+ paywall', items: [
    { label: 'Variant A', note: 'Benefit list + timeline', screen: 'paywall' },
    { label: 'Variant B', note: 'Spark deck + plain terms', screen: 'paywallB' },
  ] },
  { group: 'Home', items: [
    { label: 'New member', note: 'Free', screen: 'home', plan: 'free' },
    { label: 'New member', note: 'Squad+ trial', screen: 'home', plan: 'trial' },
    { label: "What's Spark?", note: 'Free', screen: 'home', plan: 'free', intent: 'sparkInfo' },
    { label: 'Regular user', note: '4 squads · weeks later', screen: 'home', plan: 'trial', intent: 'regular' },
  ] },
  { group: 'AI feature · Spark', items: [
    { label: 'Alex turns Spark on', note: 'State 1', screen: 'chat', plan: 'trial' },
    { label: 'What the squad sees', note: 'State 2 · Jordan', screen: 'chatSquad', plan: 'trial' },
  ] },
]

export default function ProtoNav({ current, onJump }) {
  const [open, setOpen] = useState(false)
  // Once per visit, the tab slides out with its label so reviewers notice it
  const [hint, setHint] = useState(false)

  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem('protonav-hint') === '1' } catch { /* storage blocked */ }
    if (seen) return
    const show = setTimeout(() => setHint(true), 1800)
    const hide = setTimeout(() => {
      setHint(false)
      try { sessionStorage.setItem('protonav-hint', '1') } catch { /* storage blocked */ }
    }, 4800)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [])

  function jump(stop) {
    setOpen(false)
    onJump(stop)
  }

  const isCurrent = (s) =>
    s.screen === current.screen && (s.plan ?? current.plan) === current.plan && (s.intent ?? null) === (current.intent ?? null)

  return (
    <>
      {/* The pull tab: only its grip shows on every screen; the icon and label slide out on the first-visit hint or a pull */}
      {!open && (
        <motion.button
          aria-label="Prototype screens"
          onClick={() => setOpen(true)}
          drag="x"
          dragConstraints={{ left: -64, right: 0 }}
          dragElastic={0.2}
          dragSnapToOrigin
          onDragEnd={(_, info) => info.offset.x < -16 && setOpen(true)}
          animate={{ x: hint ? -72 : 0 }}
          whileHover={{ x: -6 }}
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          className="absolute -right-[80px] top-[38%] z-[60] flex h-14 w-[92px] before:absolute before:inset-y-0 before:-left-4 before:w-4 before:content-[''] touch-none items-center gap-1.5 rounded-l-[14px] border border-r-0 border-white/15 bg-surface-2/90 pl-1.5 shadow-lg backdrop-blur-xl"
        >
          {/* Grip */}
          <span className="h-7 w-1 rounded-full bg-label-3" />
          <SquaresFour size={18} className="shrink-0 text-label-2" />
          <span className="whitespace-nowrap text-caption-1 font-semibold text-label-2">Screens</span>
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="absolute inset-0 z-[60] bg-black/50"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-label="Prototype screens"
              className="absolute inset-y-0 right-0 z-[70] flex w-[284px] flex-col rounded-l-[28px] border-l border-white/10 bg-surface-2/95 backdrop-blur-2xl"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0, right: 0.6 }}
              onDragEnd={(_, info) => info.offset.x > 60 && setOpen(false)}
            >
              <div className="flex items-start justify-between px-5 pb-3 pt-[calc(var(--safe-top)+12px)]">
                <div>
                  <p className="text-caption-1 font-semibold uppercase tracking-wide text-label-3">Prototype</p>
                  <p className="text-title-3 font-bold">Jump to a screen</p>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Close" className="-mr-2 -mt-1 flex size-11 items-center justify-center active:opacity-60">
                  <span className="flex size-[30px] items-center justify-center rounded-full bg-white/10 text-label-2"><X size={15} /></span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 pb-[calc(var(--safe-bottom)+12px)]">
                {/* First, so going back to the very start is one tap */}
                <button
                  onClick={() => jump({ screen: 'launch', plan: 'free', reset: true })}
                  className="mb-4 flex h-11 w-full items-center justify-center gap-1.5 rounded-card bg-white/10 text-subhead font-semibold text-label active:bg-white/15"
                >
                  <ArrowCounterClockwise size={16} /> Start the flow over
                </button>
                {stops.map((g) => (
                  <section key={g.group} className="mt-3 first:mt-0">
                    <h3 className="mb-1 px-2 text-footnote font-semibold text-label-3">{g.group}</h3>
                    <ul className="overflow-hidden rounded-card bg-black/30">
                      {g.items.map((s, i) => {
                        const on = isCurrent(s)
                        return (
                          <li key={s.label + (s.note ?? '')}>
                            <button
                              onClick={() => jump(s)}
                              aria-current={on ? 'page' : undefined}
                              className={`flex min-h-11 w-full items-center gap-2 px-3 py-2 text-left active:bg-white/10 ${i > 0 ? 'border-t border-line' : ''}`}
                            >
                              <span className="flex-1">
                                <span className={`block text-subhead ${on ? 'font-semibold text-label' : 'text-label'}`}>{s.label}</span>
                                {s.note && <span className="block text-caption-1 text-label-2">{s.note}</span>}
                              </span>
                              {on && <span className="size-2 rounded-full bg-accent" aria-hidden />}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                ))}

                <p className="mt-4 px-2 text-center text-caption-2 text-label-3">For reviewers · not part of the app</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
