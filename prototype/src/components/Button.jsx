// iOS-style full-width button — the app's three button levels (decision #75):
//   'primary'   purple fill, one per screen     'secondary' gray fill     'tertiary' purple text, no fill
// Text buttons elsewhere (See all, Skip, What's Spark?) use the same purple text: text-accent-text font-semibold
// size: 'lg' (52px, screen actions) | 'sm' (44px, actions inside a card)
export default function Button({ children, onClick, disabled, variant = 'primary', size = 'lg' }) {
  const look = {
    primary: 'bg-accent text-on-accent',
    secondary: 'bg-surface-2 text-label',
    tertiary: 'text-accent-text active:bg-white/5',
  }[variant]
  const height = size === 'sm' ? 'h-11 rounded-control text-subhead' : 'h-[52px] rounded-card text-headline'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${height} w-full font-semibold transition active:scale-[0.98] active:opacity-80 disabled:opacity-35 disabled:active:scale-100 ${look}`}
    >
      {children}
    </button>
  )
}
