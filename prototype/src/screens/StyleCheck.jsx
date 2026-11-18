// Temporary screen to review the visual language before building real screens.
import { squad, sampleSpark } from '../data.js'
import SparkCard from '../components/SparkCard.jsx'
import Avatar from '../components/Avatar.jsx'
import Photo from '../components/Photo.jsx'
import Button from '../components/Button.jsx'
import { GroupLabel } from '../components/Headings.jsx'

export default function StyleCheck() {
  return (
    <div className="h-full overflow-y-auto px-4 pb-[calc(var(--safe-bottom)+24px)] pt-[calc(var(--safe-top)+8px)]">
      <h1 className="text-large-title font-bold">Style check</h1>
      <p className="mt-1 text-subhead text-label-2">Tokens live in src/index.css</p>

      <Section title="Type">
        <p className="text-title-1 font-bold">Title 1 · 28</p>
        <p className="text-title-2 font-bold">Title 2 · 22</p>
        <p className="text-headline font-semibold">Headline · 17</p>
        <p className="text-body">Body · 17 — the squad's been quiet.</p>
        <p className="text-subhead text-label-2">Subhead · 15 secondary</p>
        <p className="text-footnote text-label-3">Footnote · 13 tertiary</p>
      </Section>

      <Section title="Member content (neutral)">
        <div className="flex gap-2">
          <Avatar member={squad.members[0]} />
          <div className="rounded-card rounded-tl-[6px] bg-surface px-3.5 py-2.5 text-body">bio test tmrw 💀 who's ready</div>
        </div>
        <Photo src="/photos/moment-sports.jpg" className="mt-3 aspect-[4/5] w-2/3 rounded-sheet" />
      </Section>

      <Section title="Spark (AI)">
        <SparkCard spark={sampleSpark} footer="Maya + 2 others answered · your turn" />
      </Section>

      <Section title="Primary button (CTA)">
        <Button>Start 3-day free trial</Button>
        <div className="mt-2"><Button variant="secondary">Neutral button</Button></div>
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="mt-7">
      <GroupLabel className="mb-2">{title}</GroupLabel>
      {children}
    </section>
  )
}
