// The app's two heading levels inside a screen or sheet (decision #88). Sentence case only, never ALL CAPS.
//   SectionTitle  a section of a screen: "Squads", "What you get", "What are you into?" — bold, white
//   GroupLabel    a small group inside a card or sheet: "Try a sample", "How often", "Never" — semibold, gray
// Screen and sheet titles (large/title sizes) are separate and stay as they are.
export function SectionTitle({ as: Tag = 'h2', className = '', children }) {
  return <Tag className={`text-headline font-semibold text-label ${className}`}>{children}</Tag>
}

export function GroupLabel({ className = '', children }) {
  return <p className={`text-footnote font-semibold text-label-2 ${className}`}>{children}</p>
}
