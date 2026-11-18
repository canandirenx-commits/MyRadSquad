// Chat building blocks: member messages (neutral) and system lines.
import { useEffect, useState } from 'react'
import { Play, Pause, Fire, Smiley, VideoCamera } from '@phosphor-icons/react'
import { squad, me } from '../../data.js'
import Avatar from '../../components/Avatar.jsx'
import Photo from '../../components/Photo.jsx'

const people = [...squad.members, me]
const person = (name) => people.find((m) => m.name === name)

// One member message. `mine` = sent by the person viewing → right side.
export function Message({ m, mine }) {
  return (
    <div className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
      {!mine && <Avatar member={person(m.by)} size={28} />}
      <div className={`flex max-w-[75%] flex-col ${mine ? 'items-end' : 'items-start'}`}>
        {!mine && <span className="mb-1 ml-1 text-caption-1 text-label-2">{m.by}</span>}

        {m.kind === 'text' && (
          <div className={`rounded-card px-3.5 py-2 text-body ${mine ? 'rounded-br-[6px] bg-accent text-on-accent' : 'rounded-bl-[6px] bg-surface'}`}>
            {m.text}
          </div>
        )}

        {m.kind === 'photo' && (
          <>
            <Photo src={m.photo} className="aspect-[4/5] w-[190px] rounded-sheet" />
            <div className="mt-1 flex gap-1.5">
              <Reaction icon={Fire} count={m.reactions.fire} />
              <Reaction icon={Smiley} count={m.reactions.laugh} />
            </div>
          </>
        )}

        {/* Video messages: a hint only (decision #14) */}
        {m.kind === 'video' && (
          <div className="relative">
            <Photo src={m.photo} className="aspect-[3/4] w-[150px] rounded-sheet" />
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-caption-2 font-semibold backdrop-blur-md">
              <VideoCamera size={12} /> Video message
            </span>
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-black/45 backdrop-blur-md">
                <Play size={22} weight="fill" />
              </span>
            </span>
            <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-caption-2 font-medium">{m.duration}</span>
          </div>
        )}

        {m.kind === 'voice' && <VoiceNote seconds={m.seconds} mine={mine} />}
      </div>
    </div>
  )
}

// Waveform bar heights (px) — a fixed, natural-looking shape
const WAVE = [6, 10, 16, 9, 20, 14, 8, 18, 24, 12, 7, 15, 22, 17, 9, 13, 19, 11, 6, 14, 20, 10, 8, 5]

// Voice message: tap play → the waveform fills up and the timer counts (no real audio)
function VoiceNote({ seconds, mine }) {
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => {
      setElapsed((e) => {
        if (e + 0.1 >= seconds) { setPlaying(false); return 0 }
        return e + 0.1
      })
    }, 100)
    return () => clearInterval(t)
  }, [playing, seconds])

  const progress = elapsed / seconds
  const shown = Math.ceil(playing || elapsed ? seconds - elapsed : seconds)
  const time = `0:${String(shown).padStart(2, '0')}`

  return (
    <div className={`flex items-center gap-2.5 rounded-card py-2 pl-2 pr-3.5 ${mine ? 'rounded-br-[6px] bg-accent text-on-accent' : 'rounded-bl-[6px] bg-surface'}`}>
      <button
        onClick={() => setPlaying(!playing)}
        aria-label={playing ? 'Pause voice message' : 'Play voice message'}
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-label text-bg active:scale-95"
      >
        {playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
      </button>
      <div className="flex h-6 items-center gap-[2px]">
        {WAVE.map((h, i) => (
          <span
            key={i}
            className={`w-[3px] rounded-full transition-colors ${i / WAVE.length < progress ? 'bg-label' : 'bg-label-3'}`}
            style={{ height: h }}
          />
        ))}
      </div>
      <span className="w-8 text-right text-caption-1 tabular-nums text-label-2">{time}</span>
    </div>
  )
}

function Reaction({ icon: Icon, count }) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-caption-1 text-label-2">
      <Icon size={13} /> {count}
    </span>
  )
}

// Small centered line, e.g. "Quiet for 4h" or "You snoozed Spark"
export function SystemLine({ children }) {
  return <p className="py-1 text-center text-caption-1 text-label-3">{children}</p>
}
