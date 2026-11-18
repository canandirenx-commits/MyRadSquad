// Bottom action area, the same on every screen (decision #82).
// Pinned to the bottom with the same padding, so the primary CTA sits in exactly the same spot from screen to screen.
// Rule: supporting text (why we ask, legal, renewal terms) goes ABOVE the CTA, 12px from it, at 12px (caption-1).
// Only secondary or tertiary actions go BELOW it.
export default function ActionFooter({ note, children, className = '' }) {
  return (
    <div className={`px-5 pb-[calc(var(--safe-bottom)+16px)] pt-3 ${className}`}>
      {note && <CtaNote>{note}</CtaNote>}
      {children}
    </div>
  )
}

// The supporting line above a CTA, for screens that build their own footer (e.g. the intro and invite)
export function CtaNote({ children }) {
  return <p className="mb-3 flex items-center justify-center gap-1.5 text-center text-caption-1 text-label-2">{children}</p>
}
