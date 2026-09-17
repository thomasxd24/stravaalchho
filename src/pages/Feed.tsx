import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'
import { COMMUNITY_SESSIONS } from '../data/community'
import { useStore } from '../state/store'
import { SessionCard } from '../components/SessionCard'
import { ShareModal } from '../components/ShareModal'
import { Logo } from '../components/AppShell'
import type { Session } from '../types'

export function Feed() {
  const { data } = useStore()
  const [shareTarget, setShareTarget] = useState<Session | null>(null)

  const feed = useMemo(
    () =>
      [...data.sessions, ...COMMUNITY_SESSIONS].sort(
        (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
      ),
    [data.sessions],
  )

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between md:hidden">
        <Logo small />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fil d’activité</h1>
          <p className="mt-1 text-sm text-stone-500">Les dernières sessions de ton crew</p>
        </div>
        <Link
          to="/app/new"
          className="hidden items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-950 md:flex"
        >
          <PlusCircle className="h-4 w-4" /> Log
        </Link>
      </div>

      <div className="space-y-4">
        {feed.map((session) => (
          <SessionCard key={session.id} session={session} onShare={setShareTarget} />
        ))}
      </div>

      {shareTarget && <ShareModal session={shareTarget} onClose={() => setShareTarget(null)} />}
    </div>
  )
}
