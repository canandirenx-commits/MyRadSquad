// Onboarding intro: three optional screens before the invite (decisions #65–#68).
// 1 = what the app is for (a small circle of close friends)
// 2 = what you share (photos, voice notes, video messages, all day)
// 3 = what Squad+ adds (Sparks that break the silence; room for 12, said quietly)
// Next → the next step, then the invite · Back → the step before · Skip → the invite · swipe left/right also works.
// Skip only skips these intros: the invite still leads to the 13+ age gate, which can't be skipped.
//
// Same frame on all three: top bar (Back · logo · Skip), the visual, then the bottom block
// (headline, text, dots, Next) — so the dots and Next never move between screens.
import { motion } from 'framer-motion'
import { trialDays } from '../../data.js'
import Button from '../../components/Button.jsx'
import Logo from '../../components/Logo.jsx'
import NavBar, { StepDots } from '../../components/NavBar.jsx'
import { Orbit, ShareRows, PlusVisual } from '../../components/IntroVisuals.jsx'
import SquadPlusTag from '../../components/SquadPlusTag.jsx'

// Screen names in App.jsx, in order
const names = ['intro', 'introFeatures', 'introPlus']

const steps = [
  {
    title: 'Your closest friends, one squad',
    text: 'Not followers. Just your people, in one private group.',
    Visual: Orbit,
  },
  {
    title: 'Share every moment',
    text: 'Photos, voice notes and video messages, all day, only with your squad.',
    Visual: ShareRows,
  },
  {
    // Same layout as 1 and 2; the eyebrow says it's the paid plan.
    // Spark first (the main feature), then the bigger squad (decision #70)
    eyebrow: true,
    title: 'Quiet chat? Spark drops a dare.',
    text: (
      <><span className="text-spark">Spark</span>’s AI brings photo dares, games and funny videos to the whole squad. And there’s room for everyone, up to 12 friends.</>
    ),
    note: `You can try Squad+ free for ${trialDays} days later.`,
    Visual: PlusVisual,
  },
]

export default function Intro({ go, step = 0 }) {
  const { title, text, note, eyebrow, Visual } = steps[step]
  const last = step === steps.length - 1

  const next = () => go(last ? 'invite' : names[step + 1])
  const back = () => step > 0 && go(names[step - 1], -1)

  return (
    <motion.div
      className="flex h-full touch-pan-y flex-col pt-[var(--safe-top)]"
      // Swipe: left = next, right = back
      onPanEnd={(_, info) => {
        if (info.offset.x < -60) next()
        else if (info.offset.x > 60) back()
      }}
    >
      <NavBar
        onBack={step > 0 ? back : undefined}
        center={<Logo size={18} />}
        right={
          <button onClick={() => go('invite')} className="h-11 rounded-full px-3 text-subhead font-semibold text-accent-text active:bg-white/10">
            Skip
          </button>
        }
      />

      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <Visual />
      </div>

      <div className="px-5 pb-[calc(var(--safe-bottom)+16px)]">
        {eyebrow && (
          <p className="mb-2 flex items-center gap-2 text-subhead font-semibold text-label-2">Discover <SquadPlusTag /></p>
        )}
        <h1 className="text-large-title brand-title">{title}</h1>
        <p className="mt-2 text-body text-label-2">{text}</p>
        {note && <p className="mt-2 text-footnote text-label-2">{note}</p>}
        <div className="mt-6 flex justify-center">
          <StepDots step={step} steps={steps.length} />
        </div>
        <div className="mt-4">
          <Button onClick={next}>Next</Button>
        </div>
      </div>
    </motion.div>
  )
}
