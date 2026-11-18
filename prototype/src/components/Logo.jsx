// The MyRadSquad wordmark: heavy, tight, each word capitalized like the brief, with a purple dot.
// Same type language as the "Squad+" wordmark (decision #53).
export default function Logo({ size = 22, className = '' }) {
  return (
    <span
      className={`inline-flex items-baseline font-black tracking-tight text-label ${className}`}
      style={{ fontSize: size, lineHeight: 1, letterSpacing: '-0.04em' }}
      aria-label="MyRadSquad"
    >
      MyRadSquad
      <span className="ml-[0.06em] inline-block rounded-full bg-accent" style={{ width: size * 0.24, height: size * 0.24 }} />
    </span>
  )
}

// The short mark: "M" + the same purple dot. Used as the app icon (Home header, intro orbit)
export function Mark({ size = 22 }) {
  return (
    <span className="flex items-baseline font-black text-label" style={{ fontSize: size, lineHeight: 1, letterSpacing: '-0.04em' }} aria-hidden>
      M<span className="ml-[0.06em] inline-block rounded-full bg-accent" style={{ width: size * 0.24, height: size * 0.24 }} />
    </span>
  )
}
