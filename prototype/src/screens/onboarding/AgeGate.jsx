// Onboarding 2 — 13+ age gate with an iOS-style date wheel.
// Under 13 shows a blocking state on the same screen (no extra screen).
import { useState } from 'react'
import NavBar from '../../components/NavBar.jsx'
import Button from '../../components/Button.jsx'
import Wheel, { WheelHighlight } from '../../components/Wheel.jsx'
import { Lock } from '@phosphor-icons/react'
import SorryIllustration from '../../components/SorryIllustration.jsx'
import { CtaNote } from '../../components/ActionFooter.jsx'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)
const YEARS = Array.from({ length: 30 }, (_, i) => 2026 - i) // 2026 … 1997
const TODAY = new Date(2026, 10, 10) // prototype "today": Nov 10, 2026

function ageOn(today, year, monthIndex, day) {
  let age = today.getFullYear() - year
  const hadBirthday = today.getMonth() > monthIndex || (today.getMonth() === monthIndex && today.getDate() >= day)
  return hadBirthday ? age : age - 1
}

export default function AgeGate({ go, profile, setProfile }) {
  const [month, setMonth] = useState(profile.birth?.month ?? 'March')
  const [day, setDay] = useState(profile.birth?.day ?? 14)
  const [year, setYear] = useState(profile.birth?.year ?? 2011)
  // ?screen=ageGate&under13 opens the blocked state directly (for reviews and screenshots)
  const [blocked, setBlocked] = useState(() => new URLSearchParams(location.search).has('under13'))

  function next() {
    const age = ageOn(TODAY, year, MONTHS.indexOf(month), day)
    if (age < 13) return setBlocked(true)
    setProfile({ ...profile, birth: { month, day, year } })
    go('why')
  }

  if (blocked) return <UnderThirteen onBack={() => setBlocked(false)} />

  return (
    <div className="flex h-full flex-col pt-[var(--safe-top)]">
      <NavBar onBack={() => go('invite', -1)} step={0} steps={3} />

      <div className="px-5 pt-4">
        <h1 className="text-title-1 brand-title">When's your birthday?</h1>
        <p className="mt-2 text-body text-label-2">MyRadSquad is for ages 13 and up.</p>
      </div>

      <div className="relative mx-5 mt-10 flex gap-1">
        <WheelHighlight />
        <Wheel items={MONTHS} value={month} onChange={setMonth} width="w-[46%]" align="text-left pl-4" />
        <Wheel items={DAYS} value={day} onChange={setDay} width="w-[20%]" />
        <Wheel items={YEARS} value={year} onChange={setYear} width="flex-1" />
      </div>

      <div className="mt-auto px-5 pb-[calc(var(--safe-bottom)+16px)]">
        <CtaNote><Lock size={14} /> Keeps the app safe. Never shown to your squad.</CtaNote>
        <Button onClick={next}>Continue</Button>
      </div>
    </div>
  )
}

function UnderThirteen({ onBack }) {
  return (
    <div className="flex h-full flex-col px-5 pt-[var(--safe-top)]">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <SorryIllustration className="w-[200px]" />
        <h1 className="mt-6 text-title-2 brand-title">MyRadSquad is for 13+</h1>
        <p className="mt-2 max-w-[290px] text-body text-label-2">
          We can't create an account for you yet. We'll be here when you turn 13.
        </p>
      </div>
      <div className="pb-[calc(var(--safe-bottom)+16px)]">
        <Button variant="secondary" onClick={onBack}>I entered the wrong date</Button>
      </div>
    </div>
  )
}
