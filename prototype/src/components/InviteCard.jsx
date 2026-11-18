// Squad capacity / invite card on Home. A 12-slot strip shows what Squad+ adds at a glance.
// Three honest states — the button always says what it does (no share button that secretly opens the paywall):
//   free + room → Share link, small "Squad+" link
//   free + full → "Unlock N more spots · Squad+" → paywall
//   trial/plus  → Share link, "Squad+ gave you N more spots"
import { UserPlus, UsersThree, User, LockSimple, CaretRight } from '@phosphor-icons/react'
import { limits } from '../data.js'
import Button from './Button.jsx'
import { notBuilt } from './Toast.jsx'
import SquadPlusTag from './SquadPlusTag.jsx'

export default function InviteCard({ squadName, size, plan, onUpgrade }) {
  const plus = plan === 'trial'
  const limit = plus ? limits.plus : limits.free
  const full = size >= limit
  const extra = limits.plus - limits.free

  return (
    <div className="rounded-sheet bg-surface p-4">
      <div className="flex items-center justify-between">
        {/* Full on Free → a capacity heading ("Invite friends" would promise something you can't do) */}
        <span className="flex items-center gap-2 text-headline font-semibold">
          {!plus && full ? <><UsersThree size={22} /> {squadName} is full</> : <><UserPlus size={22} /> Invite friends</>}
        </span>
        <span className="flex items-center gap-2">
          {plus && <SquadPlusTag />}
          <span className="text-footnote font-semibold tabular-nums text-label-2">{size}/{limit}</span>
        </span>
      </div>

      {/* 12 slots: filled (a member) · open · locked (needs Squad+). Neutral on purpose: seats are status, not
          something to tap, and purple means "tap this" (decision #93) */}
      <div className="mt-3 flex gap-1" aria-hidden>
        {Array.from({ length: limits.plus }).map((_, i) => {
          const filled = i < size
          const locked = !plus && i >= limits.free
          return (
            <span
              key={i}
              className={`flex h-6 flex-1 items-center justify-center rounded-[6px]
                ${filled ? 'bg-white/[0.14]' : locked ? 'border border-dashed border-line bg-bg' : 'bg-surface-2'}`}
            >
              {filled && <User size={12} className="text-label" />}
              {locked && <LockSimple size={12} className="text-label-3" />}
            </span>
          )
        })}
      </div>

      {plus && (
        <>
          <p className="mt-3 text-footnote text-label-2">Squad+ gave {squadName} {extra} more spots. Only people with your link can join.</p>
          <div className="mt-3"><Button variant="secondary" size="sm" onClick={() => notBuilt('Sharing')}>Share invite link</Button></div>
        </>
      )}

      {!plus && full && (
        <>
          <p className="mt-3 text-footnote text-label-2">Free squads fit {limits.free}. Squad+ makes room for up to {limits.plus}.</p>
          {/* Quiet row, not a big button: the user just closed the paywall, and sharing a first moment stays Home's main action */}
          <button onClick={onUpgrade} className="mt-3 flex h-11 w-full items-center justify-between rounded-control bg-surface-2 px-3.5 text-subhead font-semibold active:bg-white/10">
            Unlock {extra} more spots
            <span className="flex items-center gap-1.5"><SquadPlusTag /> <CaretRight size={14} className="text-label-2" /></span>
          </button>
        </>
      )}

      {!plus && !full && (
        <>
          <p className="mt-3 text-footnote text-label-2">
            Room for {limit - size} more.{' '}
            <button onClick={onUpgrade} className="font-semibold text-accent-text">Want up to {limits.plus}? Squad+</button>
          </p>
          <div className="mt-3"><Button variant="secondary" size="sm" onClick={() => notBuilt('Sharing')}>Share invite link</Button></div>
        </>
      )}
    </div>
  )
}
