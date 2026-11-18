// The Squad+ tag: one look everywhere it appears (decision #76) — a soft purple pill with light lavender bold text.
// Contrast: #c4b5fd on the pill is 10:1.
export default function SquadPlusTag({ className = '' }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full bg-accent/20 px-2.5 py-0.5 text-caption-1 font-bold text-[#c4b5fd] ${className}`}>
      Squad+
    </span>
  )
}
