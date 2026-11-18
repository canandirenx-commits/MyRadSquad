// Onboarding 4 — Personalized payoff, the last step before the paywall (decision #80).
// Builds desire before asking for money: a bold "one last step" line, an illustration of Spark waking up
// the quiet chat with a Spark made from the user's own answers, and what Squad+ gets them.
import { UsersThree, Palette } from '@phosphor-icons/react'
import { squad, sparkFor, limits } from '../../data.js'
import NavBar from '../../components/NavBar.jsx'
import Button from '../../components/Button.jsx'
import SparkIcon from '../../components/SparkIcon.jsx'
import SquadPlusTag from '../../components/SquadPlusTag.jsx'
import PayoffIllustration from '../../components/PayoffIllustration.jsx'
import ActionFooter from '../../components/ActionFooter.jsx'
import { SectionTitle } from '../../components/Headings.jsx'

const gains = [
  { icon: (p) => <SparkIcon {...p} mono />, ai: true, title: `Sparks for ${squad.name}`, text: 'AI dares, polls and games when it gets quiet' },
  { icon: UsersThree, title: `Room for ${limits.plus} friends`, text: `Free squads fit ${limits.free}` },
  { icon: Palette, title: 'Fun extras', text: 'Squad themes and voice room effects' },
]

export default function Payoff({ go, profile }) {
  const spark = sparkFor(profile)

  return (
    <div className="flex h-full flex-col pt-[var(--safe-top)]">
      <NavBar onBack={() => go('why', -1)} step={2} steps={3} />

      <div className="flex-1 overflow-y-auto px-5 pt-2">
        <p className="flex items-center gap-2 text-subhead font-semibold text-label-2">One last step <SquadPlusTag /></p>
        <h1 className="mt-2 text-title-1 brand-title">Turn on Squad+ for the full squad experience</h1>

        <div className="mt-5">
          <PayoffIllustration spark={spark} />
          <p className="mt-2 text-caption-1 text-label-2">Made from what you're into · only your squad sees it</p>
        </div>

        {/* What's in it for me */}
        <SectionTitle className="mt-5">What you get</SectionTitle>
        <ul className="mt-2 space-y-2.5">
          {gains.map((g) => (
            <li key={g.title} className="flex items-center gap-3">
              <span className={`flex size-9 shrink-0 items-center justify-center rounded-[10px] ${g.ai ? 'bg-spark-deep text-spark' : 'bg-surface-2 text-label-2'}`}>
                <g.icon size={18} />
              </span>
              <span>
                <span className="block text-subhead font-semibold">{g.title}</span>
                <span className="block text-footnote text-label-2">{g.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <ActionFooter>
        <Button onClick={() => go('paywall')}>Unlock Sparks for your squad</Button>
      </ActionFooter>
    </div>
  )
}
