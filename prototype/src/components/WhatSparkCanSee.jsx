// "What Spark can see" — the element that answers the biggest fear: "is the AI reading my chats?"
// Shown to the person turning Spark on AND to everyone else in the squad.
import { Check, Prohibit } from '@phosphor-icons/react'
import { sparkRules } from '../data.js'
import { SectionTitle, GroupLabel } from './Headings.jsx'

export default function WhatSparkCanSee() {
  return (
    <div className="rounded-card bg-surface-2 p-4">
      <SectionTitle as="p">What Spark can see</SectionTitle>
      <ul className="mt-3 space-y-2">
        {sparkRules.sees.map((s) => (
          <li key={s} className="flex items-start gap-2.5 text-subhead">
            <Check size={18} className="mt-px shrink-0" /> {s}
          </li>
        ))}
      </ul>
      <GroupLabel className="mt-4">Never</GroupLabel>
      <ul className="mt-2 space-y-2">
        {sparkRules.never.map((s) => (
          <li key={s} className="flex items-start gap-2.5 text-subhead text-label-2">
            <Prohibit size={18} className="mt-px shrink-0 text-danger" /> {s}
          </li>
        ))}
      </ul>
    </div>
  )
}
