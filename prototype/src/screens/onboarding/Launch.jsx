// Launch screen: the brand moment while the app opens. No tap needed — moves on by itself.
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Logo from '../../components/Logo.jsx'

// Opened directly with ?screen=launch (e.g. for a screenshot)? Then it stays until tapped.
const pinned = new URLSearchParams(location.search).get('screen') === 'launch'

export default function Launch({ go }) {
  useEffect(() => {
    if (pinned) return
    const t = setTimeout(() => go('intro'), 1400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <button onClick={() => go('intro')} className="flex h-full w-full flex-col items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Logo size={40} />
      </motion.div>
      <p className="mt-3 text-subhead text-label-2">Close friends, one squad.</p>
    </button>
  )
}
