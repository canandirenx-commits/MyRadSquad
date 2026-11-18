// Honest feedback for buttons outside the prototype's scope, so nothing feels broken.
// Any button can call notBuilt(); <ToastHost /> (in App) shows the message.
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function notBuilt(what = 'This') {
  window.dispatchEvent(new CustomEvent('toast', { detail: `${what} isn't part of this prototype` }))
}

export default function ToastHost() {
  const [message, setMessage] = useState(null)

  useEffect(() => {
    let timer
    function show(e) {
      setMessage(e.detail)
      clearTimeout(timer)
      timer = setTimeout(() => setMessage(null), 1800)
    }
    window.addEventListener('toast', show)
    return () => { window.removeEventListener('toast', show); clearTimeout(timer) }
  }, [])

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="status"
          className="pointer-events-none absolute inset-x-0 top-[calc(var(--safe-top)+8px)] z-[55] flex justify-center px-6"
          initial={{ opacity: 0, y: -12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        >
          <span className="rounded-full bg-surface-2/95 px-4 py-2 text-footnote font-medium text-label shadow-xl ring-1 ring-white/10 backdrop-blur-xl">
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
