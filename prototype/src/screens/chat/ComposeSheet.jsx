// Manual Spark: the activator picks a type + topic, "AI" writes it (canned), Shuffle or Send.
import { useEffect, useState } from 'react'
import { Question, ChartBar, GameController, ChatCircleText, VideoCamera, ArrowsClockwise } from '@phosphor-icons/react'
import { sparkTypes, topics, makeSpark } from '../../data.js'
import Sheet from '../../components/Sheet.jsx'
import Button from '../../components/Button.jsx'
import SparkCard from '../../components/SparkCard.jsx'
import { GroupLabel } from '../../components/Headings.jsx'

const typeIcons = { quiz: Question, poll: ChartBar, game: GameController, prompt: ChatCircleText, video: VideoCamera }

export default function ComposeSheet({ profile, onSend, onClose }) {
  // The activator's own topics from onboarding (decision #8)
  const myTopics = [...new Set([...profile.purposes, ...profile.interests])].filter((t) => t !== 'close' && t !== 'moments')
  const topicList = myTopics.length ? myTopics : ['study', 'sports']

  const [type, setType] = useState('quiz')
  const [topic, setTopic] = useState(topicList[0])
  const [shuffles, setShuffles] = useState(0)
  const [thinking, setThinking] = useState(true)
  const spark = makeSpark(type, topic, shuffles)

  // Fake "AI is writing" moment whenever the input changes
  useEffect(() => {
    setThinking(true)
    const t = setTimeout(() => setThinking(false), 700)
    return () => clearTimeout(t)
  }, [type, topic, shuffles])

  return (
    <Sheet onClose={onClose}>
      <h2 className="text-title-2 font-bold">Send a Spark</h2>
      <p className="mt-1 text-subhead text-label-2">Pick a type and a topic. Spark writes it for your squad.</p>

      <Label>Type</Label>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sparkTypes.map((t) => {
          const Icon = typeIcons[t.id]
          return (
            <Chip key={t.id} selected={type === t.id} onClick={() => { setType(t.id); setShuffles(0) }}>
              <Icon size={16} /> {t.label}
            </Chip>
          )
        })}
      </div>

      <Label>Topic</Label>
      <div className="flex flex-wrap gap-2">
        {topicList.map((id) => {
          const Icon = topics[id].icon
          return (
            <Chip key={id} selected={topic === id} onClick={() => { setTopic(id); setShuffles(0) }}>
              <Icon size={16} /> {topics[id].label}
            </Chip>
          )
        })}
      </div>

      <Label>Preview</Label>
      {thinking ? <Thinking /> : <SparkCard key={spark.question} spark={spark} sentBy="You" />}

      <div className="mt-5 flex gap-2">
        <div className="w-[38%]">
          <Button variant="secondary" onClick={() => setShuffles(shuffles + 1)}>
            <span className="flex items-center justify-center gap-1.5"><ArrowsClockwise size={18} /> Shuffle</span>
          </Button>
        </div>
        <div className="flex-1"><Button disabled={thinking} onClick={() => onSend(spark)}>Send to squad</Button></div>
      </div>
    </Sheet>
  )
}

function Label({ children }) {
  return <GroupLabel className="mb-2 mt-5">{children}</GroupLabel>
}

function Chip({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-subhead font-medium transition active:scale-[0.97]
        ${selected ? 'border-transparent bg-label text-bg' : 'border-transparent bg-surface-2'}`}
    >
      {children}
    </button>
  )
}

// Placeholder while the "AI" writes: a shimmering aurora outline
function Thinking() {
  return (
    <div className="spark-ring animate-pulse rounded-card px-3.5 py-3">
      <div className="h-3 w-24 rounded-full bg-surface-2" />
      <div className="mt-2.5 h-4 w-4/5 rounded-full bg-surface-2" />
      <div className="mt-2 h-4 w-3/5 rounded-full bg-surface-2" />
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="h-9 rounded-control bg-surface-2" />
        <div className="h-9 rounded-control bg-surface-2" />
      </div>
    </div>
  )
}
