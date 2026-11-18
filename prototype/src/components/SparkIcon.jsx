import { useId } from 'react'

// The Spark (AI) mark: a 4-point star filled with the aurora gradient.
// mono = one color (uses the text color), e.g. inside a tinted tile
export default function SparkIcon({ size = 16, className, mono = false }) {
  const id = useId()
  if (mono) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-label="AI" className={className} fill="currentColor">
        <path d="M12 1.5c.5 5.6 4.9 10 10.5 10.5-5.6.5-10 4.9-10.5 10.5C11.5 16.9 7.1 12.5 1.5 12 7.1 11.5 11.5 7.1 12 1.5Z" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="AI" className={className}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-aurora-1)" />
          <stop offset="55%" stopColor="var(--color-aurora-2)" />
          <stop offset="100%" stopColor="var(--color-aurora-3)" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M12 1.5c.5 5.6 4.9 10 10.5 10.5-5.6.5-10 4.9-10.5 10.5C11.5 16.9 7.1 12.5 1.5 12 7.1 11.5 11.5 7.1 12 1.5Z"
      />
    </svg>
  )
}
