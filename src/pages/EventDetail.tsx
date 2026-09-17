import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, MapPin, Users } from 'lucide-react'
import { COMMUNITY_EVENTS, COMMUNITY_SESSIONS, communityUser } from '../data/community'
import { useStore } from '../state/store'
import { SessionCard } from '../components/SessionCard'

export function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, toggleAttend } = useStore()

  const event = useMemo(
    () => data.events.find((e) => e.id === id) ?? COMMUNITY_EVENTS.find((e) => e.id === id),
    [data.events, id],
  )

  const linkedSessions = useMemo(
    () => [...data.sessions, ...COMMUNITY_SESSIONS].filter((s) => s.eventId === id),
    [data.sessions, id],
  )

  if (!event) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center text-stone-400">
        Événement introuvable.
        <div className="mt-4">
          <Link to="/app/events" className="text-amber-400">
            Retour aux événements
          </Link>
        </div>
      </div>
    )
  }

  const going = event.attendees.includes('me')

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-sm text-stone-400">
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <div className="rounded-2xl border border-white/10 bg-stone-900/60 p-5">
        <div className="flex items-start gap-3">
          <span className="text-4xl">{event.emoji}</span>
          <div>
            <h1 className="text-xl font-bold">{event.title}</h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-stone-400">
              <CalendarDays className="h-3.5 w-3.5" />
              {new Date(event.date).toLocaleString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="mt-1 flex items-center gap-1 text-sm text-stone-400">
              <MapPin className="h-3.5 w-3.5" /> {event.locationName}
            </p>
          </div>
        </div>

        {event.description && <p className="mt-4 text-sm text-stone-300">{event.description}</p>}

        <button
          onClick={() => toggleAttend(event.id)}
          className={`mt-4 w-full rounded-xl py-2.5 text-sm font-bold ${
            going ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-500 text-stone-950'
          }`}
        >
          {going ? 'Tu participes ✓' : 'Participer à l’événement'}
        </button>

        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-stone-500">
            <Users className="h-3.5 w-3.5" /> {event.attendees.length} participant(s)
          </p>
          <div className="flex flex-wrap gap-2">
            {event.attendees.map((a) => {
              const user = a === 'me' ? data.profile : communityUser(a)
              return (
                <span key={a} className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs">
                  {user?.avatarEmoji ?? '🙂'} {user?.name ?? a}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {linkedSessions.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">Sessions de cet événement</h2>
          <div className="space-y-4">
            {linkedSessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
