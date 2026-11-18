import { motion } from 'framer-motion'

// iOS action sheet: a group of actions + a separate Cancel button.
// actions: [{ label, onClick, destructive }]
export default function ActionSheet({ title, actions, onClose }) {
  return (
    <div className="absolute inset-0 z-40">
      <motion.div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      />
      <motion.div
        className="absolute inset-x-2 bottom-[calc(var(--safe-bottom)+8px)] space-y-2"
        initial={{ y: '120%' }} animate={{ y: 0 }} exit={{ y: '120%' }}
        transition={{ type: 'spring', stiffness: 420, damping: 42 }}
      >
        <div className="overflow-hidden rounded-[14px] bg-surface-2/95 backdrop-blur-xl">
          {title && <p className="border-b border-line px-4 py-3 text-center text-footnote text-label-2">{title}</p>}
          {actions.map((a, i) => (
            <button
              key={a.label}
              onClick={() => { a.onClick(); onClose() }}
              className={`h-[57px] w-full text-[20px] active:bg-white/10 ${i > 0 ? 'border-t border-line' : ''} ${a.destructive ? 'text-danger' : 'text-accent-text'}`}
            >
              {a.label}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="h-[57px] w-full rounded-[14px] bg-surface-2 text-[20px] font-semibold text-accent-text active:bg-white/10">
          Cancel
        </button>
      </motion.div>
    </div>
  )
}
