// State 1 — the member turning Spark on.
// They decide how often Spark posts and after how much quiet (decisions #2, #42).
import { Eye } from '@phosphor-icons/react'
import { squad, quietOptions, frequencyOptions } from '../../data.js'
import Sheet from '../../components/Sheet.jsx'
import Button from '../../components/Button.jsx'
import SparkIcon from '../../components/SparkIcon.jsx'
import WhatSparkCanSee from '../../components/WhatSparkCanSee.jsx'
import { GroupLabel } from '../../components/Headings.jsx'

export default function SetupSheet({ quiet, setQuiet, frequency, setFrequency, onTurnOn, onClose }) {
  return (
    <Sheet onClose={onClose}>
      <SparkIcon size={36} />
      <h2 className="mt-3 text-title-2 font-bold">Turn on Spark for {squad.name}</h2>
      <p className="mt-1.5 text-subhead text-label-2">
        When the squad goes quiet, Spark drops a quiz, poll or game. You decide how often, and you can ask for one anytime.
      </p>

      <Label>How often</Label>
      <Segmented options={frequencyOptions} value={frequency} onChange={setFrequency} />

      {/* Quiet time only matters when Spark posts on its own */}
      {frequency !== 'When I ask' && (
        <>
          <Label>After this much quiet</Label>
          <Segmented options={quietOptions} value={quiet} onChange={setQuiet} />
        </>
      )}

      <div className="mt-5"><WhatSparkCanSee /></div>

      <p className="mt-4 flex items-start gap-2 text-footnote text-label-2">
        <Eye size={16} className="mt-px shrink-0" />
        Everyone in {squad.name} will see that you turned it on. Anyone can swap, remove or snooze a Spark.
      </p>

      <div className="mt-5"><Button onClick={onTurnOn}>Turn on Spark</Button></div>
    </Sheet>
  )
}

function Label({ children }) {
  return <GroupLabel className="mb-2 mt-5">{children}</GroupLabel>
}

// iOS segmented control: gray thumb, same as "Try a sample" in the Spark info sheet (decision #94)
function Segmented({ options, value, onChange }) {
  return (
    <div className="flex rounded-control bg-surface-2 p-0.5">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`h-9 flex-1 rounded-[8px] text-subhead font-semibold transition ${value === o ? 'bg-[#3a3a3c] text-heading shadow-sm' : 'text-label-2'}`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}
