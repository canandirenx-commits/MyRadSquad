// iOS tab bar: Squads · Camera · You — three destinations that look alike (decision #73).
// No raised round center button: that's Android's floating action button, and iOS tab bars are for navigation, not actions
import { UsersThree, Camera, UserCircle } from '@phosphor-icons/react'
import { notBuilt } from './Toast.jsx'

export default function TabBar({ active = 'squads' }) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 border-t border-line bg-bg/80 pb-[var(--safe-bottom)] backdrop-blur-xl">
      <div className="flex h-[56px] items-center justify-around px-6">
        <Tab icon={UsersThree} label="Squads" selected={active === 'squads'} />
        <Tab icon={Camera} label="Camera" onClick={() => notBuilt('The camera')} />
        <Tab icon={UserCircle} label="You" selected={active === 'you'} onClick={() => notBuilt('Your profile')} />
      </div>
    </nav>
  )
}

function Tab({ icon: Icon, label, selected, onClick }) {
  return (
    <button onClick={onClick} aria-current={selected ? 'page' : undefined} className={`flex w-16 flex-col items-center gap-0.5 ${selected ? 'text-label' : 'text-label-3'}`}>
      <Icon size={26} />
      <span className="text-caption-2 font-medium">{label}</span>
    </button>
  )
}
