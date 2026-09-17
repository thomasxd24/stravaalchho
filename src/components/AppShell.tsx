import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3, CalendarDays, Home, PlusCircle, ShieldAlert, User } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/app', label: 'Feed', icon: Home, end: true },
  { to: '/app/events', label: 'Events', icon: CalendarDays },
  { to: '/app/new', label: 'Log', icon: PlusCircle },
  { to: '/app/stats', label: 'Stats', icon: BarChart3 },
  { to: '/app/profile', label: 'Profil', icon: User },
]

export function AppShell() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="mx-auto flex max-w-6xl">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 px-4 py-6 md:flex">
          <Logo />
          <nav className="mt-8 flex flex-1 flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? 'bg-amber-500/15 text-amber-400' : 'text-stone-400 hover:bg-white/5 hover:text-stone-100'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <NavLink
            to="/app/safety"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-white/10 text-stone-100' : 'text-stone-500 hover:bg-white/5 hover:text-stone-200'
              }`
            }
          >
            <ShieldAlert className="h-5 w-5" />
            Sécurité
          </NavLink>
        </aside>

        <main className="min-h-screen w-full pb-24 md:pb-0">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-white/10 bg-stone-950/95 backdrop-blur md:hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
                isActive ? 'text-amber-400' : 'text-stone-500'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className={`flex items-center gap-2 font-black tracking-tight ${small ? 'text-lg' : 'text-xl'}`}>
      <span className="text-2xl">🍻</span>
      <span>
        Ach<span className="text-amber-500">cool</span>
      </span>
    </div>
  )
}
