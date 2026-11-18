import { useState } from 'react'

// Round avatar: photo if it exists, colored initials if not.
export default function Avatar({ member, size = 36, ring = false }) {
  const [failed, setFailed] = useState(false)
  const style = { width: size, height: size, background: member.color }
  const ringClass = ring ? 'ring-2 ring-bg' : ''

  if (member.photo && !failed) {
    return (
      <img
        src={member.photo}
        alt={member.name}
        onError={() => setFailed(true)}
        style={style}
        className={`shrink-0 rounded-full object-cover ${ringClass}`}
      />
    )
  }
  return (
    <div style={style} className={`flex shrink-0 items-center justify-center rounded-full text-caption-1 font-bold text-black ${ringClass}`}>
      {member.initials}
    </div>
  )
}

// Overlapping row of avatars
export function AvatarStack({ members, size = 36 }) {
  return (
    <div className="flex -space-x-2.5">
      {members.map((m) => <Avatar key={m.name} member={m} size={size} ring />)}
    </div>
  )
}
