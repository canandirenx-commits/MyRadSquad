// Onboarding — the invite (after the three intro screens).
// The user arrived from a friend's invite (decision #9), so the hook is the squad itself (decision #69):
// the squad's photos are blurred and locked, with how much is waiting inside. Join to catch up.
import { squad, moments } from '../../data.js'
import Photo from '../../components/Photo.jsx'
import { AvatarStack } from '../../components/Avatar.jsx'
import Button from '../../components/Button.jsx'
import Logo from '../../components/Logo.jsx'
import { Camera, Microphone, VideoCamera, LockSimple, ChatCircle, Image } from '@phosphor-icons/react'
import { CtaNote } from '../../components/ActionFooter.jsx'

const features = [
  { icon: Camera, label: 'Moments' },
  { icon: Microphone, label: 'Voice rooms' },
  { icon: VideoCamera, label: 'Video messages' },
]

const { stats } = squad
const locked = [
  { icon: ChatCircle, value: stats.messages.toLocaleString('en-US'), label: 'messages' },
  { icon: Microphone, value: stats.voice, label: 'voice notes' },
  { icon: Image, value: stats.photos, label: 'photos' },
]

export default function Invite({ go }) {
  return (
    <div className="flex h-full flex-col">
      {/* Brand at the top, same place as on the intro screens */}
      <div className="flex justify-center pb-3 pt-[calc(var(--safe-top)+6px)]">
        <Logo size={20} />
      </div>

      {/* The squad's moments, blurred: they're private until you join */}
      <div className="relative flex-1 overflow-hidden">
        {/* Each photo is blurred inside its own card, so the pile still reads as photos */}
        <div className="absolute inset-x-0 top-1 grid grid-cols-2 gap-2.5 px-4" aria-hidden>
          {moments.map((m, i) => (
            <div key={m.photo} className={`overflow-hidden rounded-card ${i % 2 ? 'translate-y-8 rotate-2' : '-rotate-2'}`}>
              <Photo src={m.photo} className="aspect-[4/5] w-full scale-110 blur-[12px] brightness-[0.6]" />
            </div>
          ))}
        </div>
        {/* Fade the collage into the black background */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />

        {/* What's waiting inside */}
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <div className="w-full rounded-card bg-black/55 px-4 py-4 text-center ring-1 ring-white/10 backdrop-blur-xl">
            <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-white/10">
              <LockSimple size={20} />
            </span>
            <p className="mt-2.5 text-headline font-semibold">Already shared in {squad.name}</p>
            <div className="mt-3 grid grid-cols-3">
              {locked.map((l) => (
                <span key={l.label} className="flex flex-col items-center">
                  <span className="flex items-center gap-1 text-title-3 font-bold tabular-nums">
                    <l.icon size={16} className="text-label-2" /> {l.value}
                  </span>
                  <span className="text-caption-1 text-label-2">{l.label}</span>
                </span>
              ))}
            </div>
            <p className="mt-3 text-footnote text-label-2">Join now to catch up on everything.</p>
          </div>
        </div>
      </div>

      <div className="px-5 pb-[calc(var(--safe-bottom)+16px)]">
        {/* Small label: which squad this is */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-caption-1 font-semibold text-label-2">
          <squad.icon size={14} /> {squad.name}
        </span>

        <h1 className="mt-3 text-large-title brand-title">Your squad is waiting</h1>

        <p className="mt-2 text-body text-label-2">
          <span className="font-semibold text-label">{squad.invitedBy}</span> invited you to {squad.name}.
        </p>
        <div className="mt-3 flex items-center gap-2.5">
          <AvatarStack members={squad.members} size={26} />
          <p className="text-subhead text-label-2">{squad.members.length} friends are already in</p>
        </div>

        <div className="mt-4 flex gap-2">
          {features.map((f) => (
            <span key={f.label} className="flex items-center gap-1 whitespace-nowrap rounded-full bg-surface px-2.5 py-1.5 text-caption-1 font-medium text-label-2">
              <f.icon size={14} /> {f.label}
            </span>
          ))}
        </div>

        {/* Supporting text above the CTA, like every screen (decision #82) */}
        <div className="mt-6">
          <CtaNote>By joining you agree to our Terms and Privacy Policy</CtaNote>
          <Button onClick={() => go('ageGate')}>Join the squad</Button>
        </div>
      </div>
    </div>
  )
}
