import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus } from 'lucide-react'
import { DRINK_PRESETS } from '../data/drinkPresets'
import type { DrinkEntry, DrinkType, Session } from '../types'
import { computeBacCurve, peakBac, standardDrinks } from '../lib/bac'
import { uid } from '../lib/format'
import { useStore } from '../state/store'
import { BacBadge } from '../components/BacBadge'
import { BacChart } from '../components/BacChart'
import { SafetyNote } from '../components/SafetyNote'
import { PageHeader } from '../components/PageHeader'

const COVER_EMOJIS = ['🍻', '🍹', '🍷', '🎉', '🥂', '🔥', '🌇', '🎲', '🧀']

interface DraftDrink {
  id: string
  type: DrinkType
  qty: number
  minutesFromStart: number
}

export function LogSession() {
  const navigate = useNavigate()
  const { data, addSession } = useStore()
  const [title, setTitle] = useState('')
  const [locationName, setLocationName] = useState('')
  const [cover, setCover] = useState(COVER_EMOJIS[0])
  const [drafts, setDrafts] = useState<DraftDrink[]>([])
  const [durationHours, setDurationHours] = useState(2)
  const [notes, setNotes] = useState('')

  const startedAt = useMemo(() => new Date(Date.now() - durationHours * 3600 * 1000).toISOString(), [durationHours])
  const endedAt = useMemo(() => new Date().toISOString(), [])

  const drinkEntries: DrinkEntry[] = useMemo(
    () =>
      drafts.map((d) => {
        const preset = DRINK_PRESETS.find((p) => p.type === d.type)!
        return {
          id: d.id,
          type: d.type,
          label: preset.label,
          emoji: preset.emoji,
          volumeMl: preset.defaultVolumeMl * d.qty,
          abv: preset.defaultAbv,
          at: new Date(new Date(startedAt).getTime() + d.minutesFromStart * 60000).toISOString(),
        }
      }),
    [drafts, startedAt],
  )

  const curve = useMemo(
    () => computeBacCurve(drinkEntries, data.profile.weightKg, data.profile.sex, startedAt, endedAt),
    [drinkEntries, data.profile.weightKg, data.profile.sex, startedAt, endedAt],
  )
  const peak = peakBac(curve)
  const totalStandardDrinks = drinkEntries.reduce((sum, d) => sum + standardDrinks(d), 0)

  function addDrink(type: DrinkType) {
    setDrafts((prev) => {
      const existing = prev.find((d) => d.type === type)
      if (existing) {
        return prev.map((d) => (d.type === type ? { ...d, qty: d.qty + 1 } : d))
      }
      return [...prev, { id: uid(), type, qty: 1, minutesFromStart: durationHours * 60 }]
    })
  }

  function decDrink(type: DrinkType) {
    setDrafts((prev) =>
      prev
        .map((d) => (d.type === type ? { ...d, qty: d.qty - 1 } : d))
        .filter((d) => d.qty > 0),
    )
  }

  function submit() {
    if (!title.trim() || drinkEntries.length === 0) return
    const session: Session = {
      id: uid(),
      userId: 'me',
      title: title.trim(),
      locationName: locationName.trim() || 'Non précisé',
      startedAt,
      endedAt,
      drinks: drinkEntries,
      photoUrl: cover,
      notes: notes.trim() || undefined,
      kudos: [],
      comments: [],
    }
    addSession(session)
    navigate(`/session/${session.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <PageHeader title="Nouvelle session" subtitle="Enregistre ta soirée comme une activité sportive" />

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-500">Titre</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Apéro terrasse entre amis"
            className="w-full rounded-xl bg-white/5 px-3.5 py-2.5 text-sm outline-none placeholder:text-stone-600 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-500">Lieu</label>
          <input
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Ex : Le Perchoir, Paris"
            className="w-full rounded-xl bg-white/5 px-3.5 py-2.5 text-sm outline-none placeholder:text-stone-600 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-500">
            Durée écoulée : {durationHours}h
          </label>
          <input
            type="range"
            min={0.5}
            max={8}
            step={0.5}
            value={durationHours}
            onChange={(e) => setDurationHours(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-500">Photo (emoji)</label>
          <div className="flex flex-wrap gap-2">
            {COVER_EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setCover(e)}
                className={`h-10 w-10 rounded-xl text-lg ${
                  cover === e ? 'bg-amber-500/25 ring-1 ring-amber-500' : 'bg-white/5'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-stone-500">Boissons</label>
          <div className="grid grid-cols-3 gap-2">
            {DRINK_PRESETS.map((preset) => {
              const draft = drafts.find((d) => d.type === preset.type)
              return (
                <div
                  key={preset.type}
                  className="flex flex-col items-center gap-1.5 rounded-xl bg-white/5 p-3 text-center"
                >
                  <span className="text-2xl">{preset.emoji}</span>
                  <span className="text-xs text-stone-400">{preset.label}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decDrink(preset.type)}
                      disabled={!draft}
                      className="rounded-full bg-white/10 p-1 disabled:opacity-30"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-4 text-sm font-semibold">{draft?.qty ?? 0}</span>
                    <button onClick={() => addDrink(preset.type)} className="rounded-full bg-amber-500/20 p-1 text-amber-400">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {drinkEntries.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-stone-900/60 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-stone-200">Aperçu alcoolémie estimée</p>
              <BacBadge bac={peak} size="sm" />
            </div>
            <p className="mt-1 text-xs text-stone-500">{totalStandardDrinks.toFixed(1)} verres standard au total</p>
            <div className="mt-3">
              <BacChart curve={curve} />
            </div>
          </div>
        )}

        <SafetyNote />

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-500">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Comment s’est passée la soirée ?"
            className="w-full rounded-xl bg-white/5 px-3.5 py-2.5 text-sm outline-none placeholder:text-stone-600 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <button
          onClick={submit}
          disabled={!title.trim() || drinkEntries.length === 0}
          className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-stone-950 disabled:opacity-30"
        >
          Publier la session
        </button>
      </div>
    </div>
  )
}
