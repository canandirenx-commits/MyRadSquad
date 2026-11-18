// Spark component sheet (decision #103): every blue Spark element from the product on one page, for exporting
// as PNGs for the case presentation. Open with ?screen=sparkKit&still. Not part of the app flow.
// Real components where they exist; small pieces that live inline in a screen are mirrored here (marked "as in …").
import { CaretRight } from '@phosphor-icons/react'
import { sparks, autoSpark, squad, me } from '../data.js'
import SparkIcon from '../components/SparkIcon.jsx'
import SparkCard from '../components/SparkCard.jsx'
import SparkDemo from '../components/SparkDemo.jsx'
import PayoffIllustration from '../components/PayoffIllustration.jsx'
import { SparkDeck } from '../components/PaywallVisuals.jsx'
import { PlusVisual } from '../components/IntroVisuals.jsx'

export default function SparkKit() {
  return (
    <div className="h-full overflow-y-auto px-5 pb-16 pt-[calc(var(--safe-top)+16px)]">
      <div className="flex flex-col items-start gap-10">
        {/* The mark */}
        <Kit name="01-spark-icon"><SparkIcon size={120} /></Kit>
        <Kit name="02-spark-app-tile">
          <span className="flex size-24 items-center justify-center rounded-[28px] bg-spark-deep"><SparkIcon size={50} /></span>
        </Kit>
        <Kit name="03-spark-feature-tile">
          <span className="flex size-12 items-center justify-center rounded-[12px] bg-spark-deep text-spark"><SparkIcon size={24} mono /></span>
        </Kit>
        <Kit name="04-spark-composer-button">
          <span className="spark-ring flex size-14 items-center justify-center rounded-full"><SparkIcon size={26} /></span>
        </Kit>

        {/* Spark cards in the chat */}
        <Kit name="05-spark-card-poll" wide>
          <SparkCard spark={sparks.sports} drop={false} footer="Answers stay hidden until you vote" />
        </Kit>
        <Kit name="06-spark-card-squad-view" wide>
          <SparkCard spark={autoSpark} results={autoSpark.results} voters={autoSpark.voters} drop={false} />
        </Kit>
        <Kit name="07-spark-card-sent-by-a-member" wide>
          <SparkCard spark={sparks.music} sentBy={me.name} drop={false} footer={`Sent to ${squad.name} · the squad is notified once`} />
        </Kit>

        {/* As in the chat: who turned Spark on, and the nudge above the composer */}
        <Kit name="08-spark-turned-on-note" wide>
          <div className="rounded-card border border-line px-4 py-3 text-center">
            <p className="flex items-center justify-center gap-1.5 text-footnote">
              <SparkIcon size={14} />
              <span><span className="font-semibold">{me.name}</span> turned on Spark</span>
            </p>
            <p className="mt-0.5 text-caption-1 text-label-2">After 4h of quiet · once a day</p>
            <p className="mt-1.5 text-caption-1 font-semibold text-accent-text">See what Spark can see</p>
          </div>
        </Kit>
        <Kit name="09-spark-chat-nudge" wide>
          <div className="flex items-center gap-2 rounded-card bg-surface px-3 py-2.5 text-footnote">
            <SparkIcon size={16} />
            <span className="flex-1 text-label-2"><span className="font-semibold text-label">{squad.name} goes quiet a lot.</span> Spark can fix that.</span>
            <span className="font-semibold text-accent-text">Turn on</span>
          </div>
        </Kit>

        {/* As in the Home squad card */}
        <Kit name="10-spark-home-prompt-trial" wide>
          <div className="spark-ring flex items-center gap-3 rounded-card bg-spark-deep/40 px-3.5 py-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-spark-deep"><SparkIcon size={18} /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-subhead font-semibold">Turn on Spark for {squad.name}</span>
              <span className="block text-caption-1 text-label-2">AI dares and games · in your trial</span>
            </span>
            <CaretRight size={14} className="shrink-0 text-label-2" />
          </div>
        </Kit>
        <Kit name="11-spark-status-row" wide>
          <div className="flex h-12 items-center gap-2 rounded-card bg-surface px-4">
            <SparkIcon size={15} />
            <span className="flex-1 text-footnote font-semibold">Spark is on<span className="font-normal text-label-2"> · after 4h of quiet</span></span>
            <CaretRight size={12} className="text-label-3" />
          </div>
        </Kit>

        {/* Bigger pieces: onboarding, paywall, the What's Spark? sheet */}
        <Kit name="12-spark-how-it-works" wide><SparkDemo /></Kit>
        <Kit name="13-spark-deck-paywall-b" wide><SparkDeck /></Kit>
        <Kit name="14-spark-crowd-intro-3"><PlusVisual /></Kit>
        <Kit name="15-spark-payoff-illustration" wide><PayoffIllustration spark={sparks.close} /></Kit>
      </div>
    </div>
  )
}

// One exportable item: data-kit is the PNG file name. A little padding keeps glows and shadows inside the crop
function Kit({ name, wide = false, children }) {
  return (
    <div data-kit={name} className={`p-3 ${wide ? 'w-[377px] -mx-3' : '-m-3'}`}>
      {children}
    </div>
  )
}
