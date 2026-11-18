import { useEffect, useState } from 'react'

// On a phone: the app fills the screen.
// On a laptop: the app sits inside an iPhone-sized frame (393 × 852, shorter if the window is short).
// `screen` resets the status bar blur whenever the screen changes.
// ?shot = design-file screenshots: the desktop frame's status bar and safe areas, but square and borderless,
// so a capture of the phone area is exactly one clean 393 × 852 iPhone screen
const shot = new URLSearchParams(location.search).has('shot')

export default function PhoneFrame({ children, screen }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => setScrolled(false), [screen])

  // Listen to every vertical scroll inside the phone (except wheel pickers)
  function handleScroll(e) {
    const el = e.target
    if (el.closest('[data-wheel]') || el.scrollHeight <= el.clientHeight) return
    setScrolled(el.scrollTop > 4)
  }

  return (
    <div className="min-h-dvh sm:flex sm:items-center sm:justify-center sm:bg-neutral-900 sm:py-8">
      <div
        onScrollCapture={handleScroll}
        className={`phone relative h-dvh w-full overflow-hidden bg-bg sm:h-[min(852px,calc(100dvh-64px))] sm:w-[393px] ${shot ? '' : 'sm:rounded-[55px] sm:shadow-2xl sm:ring-[10px] sm:ring-neutral-800'}`}
      >
        <StatusBar scrolled={scrolled} />
        {children}
      </div>
    </div>
  )
}

// Fake iOS status bar, only shown in the desktop frame.
// When content scrolls under it, a translucent blurred background fades in (iOS "material").
function StatusBar({ scrolled }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-50 hidden h-[54px] sm:block">
      <div className={`absolute inset-0 bg-bg/60 backdrop-blur-xl transition-opacity duration-200 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />
      <div className="relative flex h-full items-center justify-between pl-10 pr-8 pt-1">
        <span className="w-[54px] text-[17px] font-semibold tracking-tight">9:41</span>
        {/* Dynamic Island */}
        <div className="absolute left-1/2 top-[11px] h-[34px] w-[124px] -translate-x-1/2 rounded-full bg-black" />
        <span className="flex items-center gap-[6px]">
          <Cellular />
          <Wifi />
          <Battery />
        </span>
      </div>
    </div>
  )
}

function Cellular() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
      <rect x="0" y="7.5" width="3.2" height="4.5" rx="1" />
      <rect x="4.9" y="5" width="3.2" height="7" rx="1" />
      <rect x="9.8" y="2.5" width="3.2" height="9.5" rx="1" />
      <rect x="14.7" y="0" width="3.2" height="12" rx="1" />
    </svg>
  )
}

function Wifi() {
  // Three nested arcs fanning up from a point, like the iOS Wi-Fi glyph
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden>
      <path d="M8 2.1c2.3 0 4.4.9 6 2.4.2.2.5.2.7 0l1-1c.2-.2.2-.5 0-.7A11 11 0 0 0 8 0C5.1 0 2.4 1.1.3 2.8c-.2.2-.2.5 0 .7l1 1c.2.2.5.2.7 0A8.6 8.6 0 0 1 8 2.1Z" />
      <path d="M8 5.6c1.3 0 2.5.5 3.5 1.3.2.2.5.2.7 0l1-1c.2-.2.2-.5 0-.7A7.4 7.4 0 0 0 8 3.5c-1.9 0-3.7.7-5.1 1.7-.2.2-.2.5 0 .7l1 1c.2.2.5.2.7 0 .9-.8 2.1-1.3 3.4-1.3Z" />
      <path d="M10.1 8.6c.2-.2.2-.5 0-.7A3.2 3.2 0 0 0 8 7.1c-.8 0-1.5.3-2.1.8-.2.2-.2.5 0 .7l1.7 1.7c.2.2.5.2.7 0l1.8-1.7Z" />
    </svg>
  )
}

function Battery() {
  return (
    <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden>
      <rect x="0.5" y="0.5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <rect x="2" y="2" width="20" height="9" rx="2.5" fill="currentColor" />
      <path d="M25 4.5v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2Z" fill="currentColor" fillOpacity="0.4" />
    </svg>
  )
}
