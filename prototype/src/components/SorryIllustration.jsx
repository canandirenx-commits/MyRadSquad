// Under-13 screen illustration (decision #77): a small round friend with a worried, apologetic face,
// holding a "13" balloon — "sorry, not yet; come back at 13". Kind, never scolding.
// Grays from the app palette; the balloon uses the light lavender of the Squad+ tag. Gentle motion, off in ?still.
import { motion, useReducedMotionConfig } from 'framer-motion'

const body = '#2c2c2e'
const limb = '#3a3a3c'
const face = '#e5e5ea'

export default function SorryIllustration({ className = '' }) {
  const still = useReducedMotionConfig()
  const loop = (animate, duration) => (still ? {} : { animate, transition: { duration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } })

  return (
    <svg viewBox="0 0 220 200" className={className} role="img" aria-label="A small friend holding a 13 balloon, looking sorry">
      {/* Ground shadow */}
      <ellipse cx="100" cy="188" rx="54" ry="6" fill="rgb(255 255 255 / 0.06)" />

      {/* Feet */}
      <ellipse cx="80" cy="182" rx="15" ry="6" fill={limb} />
      <ellipse cx="120" cy="182" rx="15" ry="6" fill={limb} />

      {/* Body breathes slowly */}
      <motion.g style={{ transformOrigin: '100px 182px' }} {...loop({ scaleY: [1, 1.025] }, 2.2)}>
        <rect x="48" y="80" width="104" height="102" rx="48" fill={body} />
        <ellipse cx="76" cy="102" rx="15" ry="8" fill="rgb(255 255 255 / 0.06)" transform="rotate(-20 76 102)" />

        {/* Worried brows: inner ends up */}
        <path d="M76 115 L90 110" stroke={face} strokeWidth="3" strokeLinecap="round" />
        <path d="M110 110 L124 115" stroke={face} strokeWidth="3" strokeLinecap="round" />

        {/* Eyes blink now and then */}
        <motion.g style={{ transformOrigin: '100px 125px' }} {...(still ? {} : { animate: { scaleY: [1, 1, 0.1, 1] }, transition: { duration: 4, times: [0, 0.9, 0.95, 1], repeat: Infinity } })}>
          <circle cx="84" cy="125" r="4.5" fill={face} />
          <circle cx="116" cy="125" r="4.5" fill={face} />
        </motion.g>

        {/* Blush + a small "sorry" mouth */}
        <ellipse cx="72" cy="139" rx="7" ry="4" fill="#c4b5fd" opacity="0.25" />
        <ellipse cx="128" cy="139" rx="7" ry="4" fill="#c4b5fd" opacity="0.25" />
        <path d="M92 148 Q100 142 108 148" stroke={face} strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Left arm resting */}
        <path d="M52 140 Q40 150 44 162" stroke={body} strokeWidth="11" fill="none" strokeLinecap="round" />
      </motion.g>

      {/* Right arm holds the balloon up */}
      <path d="M148 140 Q164 134 167 120" stroke={body} strokeWidth="11" fill="none" strokeLinecap="round" />
      <circle cx="167" cy="117" r="6.5" fill={limb} />

      {/* The "13" balloon sways on its string */}
      <motion.g style={{ transformOrigin: '167px 116px' }} {...loop({ rotate: [-5, 5] }, 2.6)}>
        <path d="M167 112 C160 98 182 86 177 70" stroke="rgb(235 235 245 / 0.5)" strokeWidth="1.5" fill="none" />
        <path d="M173 70 L181 70 L177 64 Z" fill="#a78bfa" />
        <ellipse cx="177" cy="40" rx="24" ry="27" fill="#a78bfa" />
        <ellipse cx="168" cy="29" rx="5" ry="8" fill="rgb(255 255 255 / 0.35)" transform="rotate(20 168 29)" />
        <text x="177" y="47" textAnchor="middle" fontSize="20" fontWeight="800" fill="#1c1033" style={{ letterSpacing: '-0.04em' }}>13</text>
      </motion.g>
    </svg>
  )
}
