import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, Plus, Users } from 'lucide-react'
import { COMMUNITY_EVENTS, communityUser } from '../data/community'
import { useStore } from '../state/store'
import { PageHeader } from '../components/PageHeader'
import { uid } from '../lib/format'
import type { EventItem } from '../types'

const EMOJIS = ['🍻', '🎉', '🍷', '🧀', '🎶', '🔥']

export function Events() {
  const { data, addEvent, toggleAttend } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [locationName, setLocationName] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [emoji, setEmoji] = useState(EMOJIS[0])

  const events = useMemo(
    () =>
      [...data.events, ...COMMUNITY_EVENTS].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [data.events],
  )

  function submit() {
    if (!title.trim() || !date) return
    const event: EventItem = {
      id: uid(),
      title: title.trim(),
      date: new Date(date).toISOString(),
      locationName: locationName.trim() || 'À définir',
      description: description.trim(),
      emoji,
      attendees: ['me'],
      createdBy: 'me',
    }
    addEvent(event)
    setShowForm(false)
    setTitle('')
    setLocationName('')
    setDate('')
    setDescription('')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <PageHeader title="Événements" subtitle="Organise et rejoins des soirées" />
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-stone-950"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {showForm && (
        <div className="mb-6 space-y-3 rounded-2xl border border-white/10 bg-stone-900/60 p-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nom de l'événement"
            className="w-full rounded-xl bg-white/5 px-3.5 py-2.5 text-sm outline-none placeholder:text-stone-600 focus:ring-1 focus:ring-amber-500"
          />
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl bg-white/5 px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-amber-500"
          />
          <input
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Lieu"
            className="w-full rounded-xl bg-white/5 px-3.5 py-2.5 text-sm outline-none placeholder:text-stone-600 focus:ring-1 focus:ring-amber-500"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={2}
            className="w-full rounded-xl bg-white/5 px-3.5 py-2.5 text-sm outline-none placeholder:text-stone-600 focus:ring-1 focus:ring-amber-500"
          />
          <div className="flex gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`h-9 w-9 rounded-lg text-base ${emoji === e ? 'bg-amber-500/25 ring-1 ring-amber-500' : 'bg-white/5'}`}
              >
                {e}
              </button>
            ))}
          </div>
          <button onClick={submit} className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-stone-950">
            Créer l’événement
          </button>
        </div>
      )}

      <div className="space-y-3">
        {events.map((event) => {
          const going = event.attendees.includes('me')
          const creator = event.createdBy === 'me' ? data.profile : communityUser(event.createdBy)
          return (
            <div key={event.id} className="rounded-2xl border border-white/10 bg-stone-900/60 p-4">
              <Link to={`/app/events/${event.id}`} className="block">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{event.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-stone-500">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(event.date).toLocaleString('fr-FR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-stone-500">
                      <MapPin className="h-3 w-3" /> {event.locationName}
                    </p>
                    {event.description && <p className="mt-2 text-sm text-stone-400">{event.description}</p>}
                  </div>
                </div>
              </Link>
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                <p className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Users className="h-3.5 w-3.5" /> {event.attendees.length} participant(s)
                  {creator && <span className="ml-1 text-stone-600">· par {creator.name}</span>}
                </p>
                <button
                  onClick={() => toggleAttend(event.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                    going ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-stone-200'
                  }`}
                >
                  {going ? 'J’y vais ✓' : 'Participer'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
