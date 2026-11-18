import { useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import PhoneFrame from './components/PhoneFrame.jsx'
import StyleCheck from './screens/StyleCheck.jsx'
import SparkKit from './screens/SparkKit.jsx'
import Launch from './screens/onboarding/Launch.jsx'
import Intro from './screens/onboarding/Intro.jsx'
import Invite from './screens/onboarding/Invite.jsx'
import AgeGate from './screens/onboarding/AgeGate.jsx'
import Why from './screens/onboarding/Why.jsx'
import Payoff from './screens/onboarding/Payoff.jsx'
import Joining from './screens/onboarding/Joining.jsx'
import Paywall from './screens/Paywall.jsx'
import Home from './screens/Home.jsx'
import Chat from './screens/chat/Chat.jsx'
import ProtoNav from './components/ProtoNav.jsx'
import ToastHost from './components/Toast.jsx'

// Every screen is listed here by name.
// To move between screens, a screen calls go('screenName') — or go('name', -1) to go back.
const screens = {
  launch: Launch,
  // Three intro screens before the invite: the purpose, what you share, Squad+
  intro: Intro,
  introFeatures: (props) => <Intro {...props} step={1} />,
  introPlus: (props) => <Intro {...props} step={2} />,
  invite: Invite,
  ageGate: AgeGate,
  why: Why,
  payoff: Payoff,
  paywall: Paywall,
  // Onboarding → Home: "Joining Lunch Table…" (only after the onboarding paywall)
  joining: Joining,
  // Variant B: same screen, weekly preselected. Open with ?screen=paywallB
  paywallB: (props) => <Paywall {...props} variant="B" />,
  home: Home,
  // Squad chat + Spark, state 1: Alex turns Spark on
  chat: Chat,
  // State 2: what the rest of the squad (Jordan) sees. Open with ?screen=chatSquad
  chatSquad: (props) => <Chat {...props} view="jordan" />,
  styleCheck: StyleCheck,
  // Spark component sheet for the presentation (?screen=sparkKit&still)
  sparkKit: SparkKit,
}

// Open a screen directly with ?screen=name (and ?plan=free) in the URL — handy for reviews
const params = new URLSearchParams(location.search)
const startScreen = params.get('screen') ?? 'launch'
// Default: Free (a new user who closed the paywall). Spark screens default to trial, since Spark needs Squad+
const startPlan = params.get('plan') ?? (startScreen.startsWith('chat') ? 'trial' : 'free')
// ?still turns animations off — for screenshots of the design file
const still = params.has('still')

// iOS push: new screen slides in from the right, old one shifts slightly left
const slide = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-30%', opacity: dir > 0 ? 1 : 0.6 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-30%' : '100%', opacity: dir > 0 ? 0.6 : 1 }),
}

export default function App() {
  const [screen, setScreen] = useState(startScreen)
  const [direction, setDirection] = useState(1)
  // What the user told us during onboarding
  const [profile, setProfile] = useState({ birth: null, purposes: [], interests: [] })
  // 'trial' = started the Squad+ trial · 'free' = closed the paywall
  const [plan, setPlan] = useState(startPlan)

  // Set by the prototype drawer, e.g. 'sparkInfo' opens the What's Spark? sheet on Home
  // ?intent=sparkInfo opens the What's Spark? sheet on Home directly (for reviews and screenshots)
  const [intent, setIntent] = useState(params.get('intent'))
  // Bumped on every drawer jump, so the screen starts fresh even if it's already open
  const [visit, setVisit] = useState(0)
  // Where the paywall was opened from, so it can send the user back there (e.g. the chat)
  const [paywallFrom, setPaywallFrom] = useState('home')
  // What Alex did in the chat (Spark on, rhythm, Sparks sent), so the squad's view shows the same thing (decision #104)
  const [squadChat, setSquadChat] = useState(null)

  // nextIntent: what the next screen should open with, e.g. go('chat', 1, 'sparkSetup') opens the Spark settings
  function go(name, dir = 1, nextIntent = null) {
    if (name.startsWith('paywall')) setPaywallFrom(screen)
    setIntent(nextIntent)
    setDirection(dir)
    setScreen(name)
  }

  // Prototype drawer: jump straight to any state (decision #56)
  function jump(stop) {
    if (stop.reset) { setProfile({ birth: null, purposes: [], interests: [] }); setSquadChat(null) }
    setPlan(stop.plan ?? (stop.screen.startsWith('chat') ? 'trial' : plan))
    setPaywallFrom('home')
    setIntent(stop.intent ?? null)
    setDirection(1)
    setScreen(stop.screen)
    setVisit((v) => v + 1)
  }

  const Screen = screens[screen]

  return (
    <MotionConfig reducedMotion={still ? 'always' : 'never'} transition={still ? { duration: 0 } : undefined}>
    <PhoneFrame screen={screen}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={`${screen}-${visit}`}
          custom={direction}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 380, damping: 40 }}
          className="absolute inset-0 bg-bg"
          style={{ zIndex: direction > 0 ? 1 : 0 }}
        >
          <Screen go={go} profile={profile} setProfile={setProfile} plan={plan} setPlan={setPlan} intent={intent} paywallFrom={paywallFrom} squadChat={squadChat} setSquadChat={setSquadChat} />
        </motion.div>
      </AnimatePresence>
      <ToastHost />
      {/* Reviewer drawer: hidden in ?still so it never shows in design-file screenshots */}
      {!still && <ProtoNav current={{ screen, plan, intent }} onJump={jump} />}
    </PhoneFrame>
    </MotionConfig>
  )
}
