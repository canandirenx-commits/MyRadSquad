import { motion } from 'framer-motion'

// iOS bottom sheet. Wrap usage in <AnimatePresence> so it can animate out.
export default function Sheet({ onClose, children }) {
  return (
    <div className="absolute inset-0 z-40">
      <motion.div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 max-h-[88%] overflow-y-auto rounded-t-sheet bg-surface px-5 pb-[calc(var(--safe-bottom)+16px)]"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 420, damping: 42 }}
      >
        {/* Grabber */}
        <div className="flex justify-center pb-2 pt-2.5">
          <span className="h-[5px] w-9 rounded-full bg-label-3" />
        </div>
        {children}
      </motion.div>
    </div>
  )
}
