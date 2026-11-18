import { CaretLeft } from '@phosphor-icons/react'

// Top bar with an iOS back chevron and optional step count.
// steps → "Join in 3 steps · 1/3" in the middle (the setup steps: age gate, why, payoff — decision #83).
// The intro screens use page dots instead (StepDots), so the two parts of onboarding don't look the same.
// center = something else in the middle (e.g. the logo) · right = an action on the right (e.g. Skip)
export default function NavBar({ onBack, step, steps, center, right }) {
  return (
    <div className="grid h-11 grid-cols-[88px_1fr_88px] items-center px-2">
      {onBack ? (
        <button onClick={onBack} aria-label="Back" className="flex size-11 items-center justify-center rounded-full active:bg-white/10">
          <CaretLeft size={24} />
        </button>
      ) : <span className="size-11" />}

      <div className="flex justify-center">
        {center ?? (steps && <StepCount step={step} steps={steps} />)}
      </div>

      <div className="flex justify-end">{right}</div>
    </div>
  )
}

// "Join in 3 steps · 1/3": says how long setup is, and where you are in it
function StepCount({ step, steps }) {
  return (
    <p className="whitespace-nowrap text-footnote text-label-2" aria-label={`Step ${step + 1} of ${steps}`}>
      Join in {steps} steps · <span className="font-semibold tabular-nums text-label">{step + 1}/{steps}</span>
    </p>
  )
}

export function StepDots({ step, steps }) {
  return (
    <div className="flex gap-1.5" aria-label={`Step ${step + 1} of ${steps}`}>
      {Array.from({ length: steps }).map((_, i) => (
        <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-5 bg-label' : 'w-1.5 bg-label-3'}`} />
      ))}
    </div>
  )
}
