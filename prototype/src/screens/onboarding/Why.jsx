// Onboarding 3 — "Why are you here?" (decisions #15, #81)
// Purpose shapes the payoff screen; interests set the topics of this user's Sparks.
// Layout: one 3-column grid for everything, so the purpose tiles and the interest chips line up.
// 9 interests show first (the most picked); "9 more" opens the rest in place.
// Selected = white fill, black text (neutral); purple stays for the one action, Continue.
import { useState } from 'react'
import { purposes, interests } from '../../data.js'
import NavBar from '../../components/NavBar.jsx'
import Button from '../../components/Button.jsx'
import { Check, CaretDown } from '@phosphor-icons/react'
import ActionFooter from '../../components/ActionFooter.jsx'
import { SectionTitle } from '../../components/Headings.jsx'

const FIRST = 9

export default function Why({ go, profile, setProfile }) {
  const [picked, setPicked] = useState({ purposes: profile.purposes, interests: profile.interests })
  // Open the full list right away if an interest from the second half is already picked
  const [all, setAll] = useState(() => interests.slice(FIRST).some((it) => profile.interests.includes(it.id)))

  function toggle(group, id) {
    const list = picked[group]
    setPicked({ ...picked, [group]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] })
  }

  const ready = picked.purposes.length > 0 && picked.interests.length > 0
  const shown = all ? interests : interests.slice(0, FIRST)

  function next() {
    setProfile({ ...profile, ...picked })
    go('payoff')
  }

  return (
    <div className="flex h-full flex-col pt-[var(--safe-top)]">
      <NavBar onBack={() => go('ageGate', -1)} step={1} steps={3} />

      <div className="flex-1 overflow-y-auto px-5 pt-3">
        <h1 className="text-title-1 brand-title">Why are you here?</h1>
        <p className="mt-1.5 text-body text-label-2">You can change these anytime.</p>

        {/* Both sections share one structure: heading, helper line, 3-column grid */}
        <Section title="What's your squad for?" hint="Pick one or more.">
          {purposes.map((p) => (
            <Tile key={p.id} on={picked.purposes.includes(p.id)} onClick={() => toggle('purposes', p.id)}>
              <p.icon size={24} />
              <span className="text-footnote font-semibold">{p.label}</span>
            </Tile>
          ))}
        </Section>

        <Section title="What are you into?" hint="Your Sparks will be about these.">
          {shown.map((it) => (
            <Pill key={it.id} on={picked.interests.includes(it.id)} onClick={() => toggle('interests', it.id)}>
              <it.icon size={16} className="shrink-0" />
              <span className="truncate">{it.label}</span>
            </Pill>
          ))}
        </Section>

        {!all && (
          <button onClick={() => setAll(true)} className="mx-auto mt-2 flex h-11 items-center gap-1 px-3 text-subhead font-semibold text-accent-text active:opacity-60">
            {interests.length - FIRST} more <CaretDown size={14} weight="bold" />
          </button>
        )}
      </div>

      <ActionFooter>
        <Button onClick={next} disabled={!ready}>Continue</Button>
      </ActionFooter>
    </div>
  )
}

function Section({ title, hint, children }) {
  return (
    <section className="mt-6">
      <SectionTitle>{title}</SectionTitle>
      <p className="mt-0.5 text-footnote text-label-2">{hint}</p>
      <div className="mt-3 grid grid-cols-3 gap-x-2 gap-y-1.5">{children}</div>
    </section>
  )
}

// Selected look, shared by tiles and pills: white fill, black content (decision #81)
const look = (on) => (on ? 'bg-label text-bg' : 'bg-surface text-label ring-1 ring-inset ring-line')

function Tile({ on, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`relative flex h-[78px] flex-col items-center justify-center gap-1.5 rounded-card transition active:scale-[0.97] ${look(on)}`}
    >
      {children}
      {on && (
        <span className="absolute right-2 top-2 flex size-[18px] items-center justify-center rounded-full bg-bg text-label">
          <Check size={11} weight="bold" />
        </span>
      )}
    </button>
  )
}

function Pill({ on, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-full px-2.5 text-subhead font-medium transition active:scale-[0.97] ${look(on)}`}
    >
      {children}
    </button>
  )
}
