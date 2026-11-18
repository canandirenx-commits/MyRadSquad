// The lead squad on Home: the big card (decisions #71–#73). Other squads use SquadRow below it.
// It shows how alive the squad is: a pile of recent photos + how many messages and voice notes are inside.
import { CaretRight, ChatCircle, Microphone, UserPlus } from '@phosphor-icons/react'
import { limits } from '../data.js'
import Photo from './Photo.jsx'
import { AvatarStack } from './Avatar.jsx'
import SparkIcon from './SparkIcon.jsx'

// How the photos fan out in the pile
const tilt = [-8, -2, 4, 9]

export default function SquadCard({ squad, plan, onOpen, onSparkInfo, onInvite, onTurnOnSpark }) {
  const shown = squad.photos.slice(0, 4)
  const more = (squad.stats?.photos ?? shown.length) - shown.length

  return (
    <div className="flex flex-col overflow-hidden rounded-sheet bg-surface">
      <button onClick={onOpen} className="flex-1 p-4 text-left active:opacity-70">
        {/* Identity + unread */}
        <span className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-surface-2">
            <squad.icon size={22} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-headline font-semibold">{squad.name}</span>
            <span className="mt-0.5 flex items-center gap-1.5">
              <AvatarStack members={squad.members} size={18} />
              <span className="text-footnote text-label-2">{squad.members.length + 1} members</span>
            </span>
          </span>
          {/* Unread: a neutral info chip, not a purple button look (decision #91). The whole card opens the chat */}
          {squad.unread > 0 && (
            <span className="flex shrink-0 items-center gap-1.5 self-start rounded-full bg-white/[0.08] px-2.5 py-1 text-caption-1 font-medium text-label-2">
              <span className="size-1.5 rounded-full bg-label" />{squad.unread} new {squad.unread === 1 ? 'message' : 'messages'}
            </span>
          )}
        </span>

        {/* Recent photos, piled up like on a table */}
        <span className="relative mt-4 block h-[112px]">
          {shown.map((p, i) => (
            <span
              key={p.photo}
              className="absolute top-1.5 h-[100px] w-[78px] overflow-hidden rounded-[14px] shadow-[0_8px_16px_-8px_rgb(0_0_0/0.9)] ring-2 ring-surface"
              style={{ left: 4 + i * 64, transform: `rotate(${tilt[i]}deg)`, zIndex: i }}
            >
              <Photo src={p.photo} className="size-full" />
              {i === shown.length - 1 && more > 0 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-subhead font-bold">+{more}</span>
              )}
            </span>
          ))}
        </span>

        {/* What's inside */}
        <span className="mt-3 flex items-center gap-4 text-footnote text-label-2">
          <span className="flex items-center gap-1"><ChatCircle size={16} /> <b className="font-semibold tabular-nums text-label">{squad.stats.messages.toLocaleString('en-US')}</b> messages</span>
          <span className="flex items-center gap-1"><Microphone size={16} /> <b className="font-semibold tabular-nums text-label">{squad.stats.voice}</b> voice notes</span>
        </span>
      </button>

      {/* Spark (Spark lives in the chat, not on Home).
          Free → one quiet row, "What's Spark?" explains before selling (decision #41).
          Trial → a pale-blue framed prompt: trying Spark is what the trial is for (decision #74).
          Spark is unlocked but not on yet → opens the chat with the Spark settings already open (decision #105) */}
      {onInvite ? (
        // Regular user (decision #102): one footer per squad — Spark status on the left, Invite on the right
        <div className="flex h-12 items-center border-t border-line pl-4 pr-2">
          <button onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-2 text-left active:opacity-70">
            <SparkIcon size={15} />
            <span className="truncate text-footnote font-semibold">
              {squad.sparkOn ? 'Spark is on' : <span className="text-label-2">Spark is off</span>}
              {squad.sparkOn && <span className="font-normal text-label-2"> · after 4h of quiet</span>}
            </span>
          </button>
          <button onClick={onInvite} className="flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-footnote font-semibold text-accent-text active:bg-white/5">
            <UserPlus size={16} /> Invite <span className="font-normal tabular-nums text-label-2">{squad.members.length + 1}/{limits.plus}</span>
          </button>
        </div>
      ) : squad.sparkOn ? (
        // Spark already on in this squad (regular user): a quiet status row
        <button onClick={onOpen} className="flex h-12 w-full items-center gap-2 border-t border-line px-4 text-left active:bg-white/5">
          <SparkIcon size={15} />
          <span className="min-w-0 flex-1 truncate text-footnote font-semibold">
            Spark is on<span className="font-normal text-label-2"> · after 4h of quiet</span>
          </span>
          <CaretRight size={12} className="shrink-0 text-label-3" />
        </button>
      ) : plan === 'trial' ? (
        <button
          onClick={onTurnOnSpark ?? onOpen}
          className="spark-ring mx-3 mb-3 flex items-center gap-3 rounded-card bg-spark-deep/40 px-3.5 py-3 text-left active:scale-[0.99] active:bg-spark-deep/60"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-spark-deep"><SparkIcon size={18} /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-subhead font-semibold">Turn on Spark for {squad.name}</span>
            <span className="block text-caption-1 text-label-2">AI dares and games · in your trial</span>
          </span>
          <CaretRight size={14} className="shrink-0 text-label-2" />
        </button>
      ) : (
        <button
          onClick={onSparkInfo}
          className="flex h-12 w-full items-center gap-2 border-t border-line px-4 text-left active:bg-white/5"
        >
          <SparkIcon size={15} />
          <span className="min-w-0 flex-1 truncate text-footnote font-semibold">Spark</span>
          <span className="flex shrink-0 items-center gap-0.5 text-footnote font-semibold text-accent-text">
            What's Spark? <CaretRight size={12} />
          </span>
        </button>
      )}
    </div>
  )
}

// Any other squad: one compact row, like a list cell (icon · name · latest activity · unread)
export function SquadRow({ squad, first, onOpen }) {
  const last = squad.messages[squad.messages.length - 1]
  return (
    <button onClick={onOpen} className="flex w-full items-center gap-3 pl-4 text-left active:bg-white/5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-surface-2"><squad.icon size={22} /></span>
      <span className={`flex min-w-0 flex-1 items-center gap-2 py-3 pr-4 ${first ? '' : 'border-t border-line'}`}>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-subhead font-semibold">{squad.name}</span>
          {last && <span className="block truncate text-footnote text-label-2">{last.by}: {last.text}</span>}
        </span>
        {squad.unread > 0 && <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-caption-1 font-medium tabular-nums text-label-2">{squad.unread}</span>}
        <CaretRight size={14} className="text-label-3" />
      </span>
    </button>
  )
}
