import { useEffect, useRef } from 'react'

const ROW = 36 // height of one row in px
const VISIBLE = 5 // rows visible at once (center row = selected)

// One column of an iOS-style wheel picker, built with CSS scroll-snap.
export default function Wheel({ items, value, onChange, width = 'flex-1', align = 'text-center' }) {
  const ref = useRef(null)
  const index = items.indexOf(value)

  // Start scrolled to the current value
  useEffect(() => {
    ref.current.scrollTop = index * ROW
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleScroll() {
    const i = Math.round(ref.current.scrollTop / ROW)
    const next = items[Math.min(Math.max(i, 0), items.length - 1)]
    if (next !== value) onChange(next)
  }

  return (
    <div
      ref={ref}
      data-wheel
      onScroll={handleScroll}
      className={`${width} snap-y snap-mandatory overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
      style={{ height: ROW * VISIBLE, paddingBlock: ROW * 2 }}
    >
      {items.map((item, i) => {
        const distance = Math.abs(i - index)
        return (
          <div
            key={item}
            className={`snap-center ${align} text-[21px] transition-opacity`}
            style={{ height: ROW, lineHeight: `${ROW}px`, opacity: distance === 0 ? 1 : distance === 1 ? 0.45 : 0.2 }}
          >
            {item}
          </div>
        )
      })}
    </div>
  )
}

// Gray highlight bar behind the selected row; place inside a relative container.
export function WheelHighlight() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 rounded-control bg-white/[0.08]"
      style={{ top: ROW * 2, height: ROW }}
    />
  )
}
