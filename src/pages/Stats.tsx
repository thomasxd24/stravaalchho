import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Award, Droplets, GlassWater, TrendingUp } from 'lucide-react'
import { useStore } from '../state/store'
import { computeBacCurve, peakBac, standardDrinks } from '../lib/bac'
import { PageHeader } from '../components/PageHeader'

function startOfWeek(d: Date): string {
  const date = new Date(d)
  const day = date.getDay() || 7
  date.setDate(date.getDate() - day + 1)
  date.setHours(0, 0, 0, 0)
  return date.toISOString().slice(0, 10)
}

export function Stats() {
  const { data } = useStore()
  const sessions = data.sessions

  const totals = useMemo(() => {
    const totalSessions = sessions.length
    const totalStandardDrinks = sessions.reduce(
      (sum, s) => sum + s.drinks.reduce((a, d) => a + standardDrinks(d), 0),
      0,
    )
    const totalWater = sessions.reduce((sum, s) => sum + s.drinks.filter((d) => d.type === 'water').length, 0)
    const peaks = sessions.map((s) =>
      peakBac(computeBacCurve(s.drinks, data.profile.weightKg, data.profile.sex, s.startedAt, s.endedAt)),
    )
    const avgPeak = peaks.length ? peaks.reduce((a, b) => a + b, 0) / peaks.length : 0
    const bestPeak = peaks.length ? Math.max(...peaks) : 0
    return { totalSessions, totalStandardDrinks, totalWater, avgPeak, bestPeak }
  }, [sessions, data.profile])

  const weekly = useMemo(() => {
    const map = new Map<string, number>()
    for (const s of sessions) {
      const week = startOfWeek(new Date(s.startedAt))
      const drinks = s.drinks.reduce((a, d) => a + standardDrinks(d), 0)
      map.set(week, (map.get(week) ?? 0) + drinks)
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-8)
      .map(([week, drinks]) => ({
        week: new Date(week).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        drinks: Math.round(drinks * 10) / 10,
      }))
  }, [sessions])

  const badges = useMemo(() => {
    const list: { emoji: string; label: string; earned: boolean }[] = [
      { emoji: '🎬', label: 'Première session', earned: totals.totalSessions >= 1 },
      { emoji: '💧', label: 'Hydratation Hero (10 eaux)', earned: totals.totalWater >= 10 },
      { emoji: '📅', label: 'Régulier (5 sessions)', earned: totals.totalSessions >= 5 },
      { emoji: '🧊', label: 'Toujours sous 0.05%', earned: sessions.length > 0 && totals.bestPeak < 0.05 },
    ]
    return list
  }, [totals, sessions.length])

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <PageHeader title="Statistiques" subtitle="Ta progression, en toute conscience" />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={GlassWater} label="Sessions" value={totals.totalSessions.toString()} />
        <StatCard icon={TrendingUp} label="Verres std" value={totals.totalStandardDrinks.toFixed(1)} />
        <StatCard icon={Droplets} label="Verres d’eau" value={totals.totalWater.toString()} />
        <StatCard icon={Award} label="Pic moyen" value={`${totals.avgPeak.toFixed(2)}%`} />
      </div>

      {weekly.length > 0 && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-stone-900/60 p-4">
          <p className="mb-3 text-sm font-semibold text-stone-200">Verres standard par semaine</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: '#ffffff22' }} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                <Tooltip
                  contentStyle={{ background: '#1c1917', border: '1px solid #ffffff22', borderRadius: 12, color: '#fff' }}
                />
                <Bar dataKey="drinks" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold text-stone-200">Badges</p>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((b) => (
            <div
              key={b.label}
              className={`rounded-xl border p-3 text-center ${
                b.earned ? 'border-amber-500/30 bg-amber-500/10' : 'border-white/5 bg-white/5 opacity-40'
              }`}
            >
              <p className="text-2xl">{b.emoji}</p>
              <p className="mt-1 text-xs text-stone-300">{b.label}</p>
            </div>
          ))}
        </div>
      </div>

      {sessions.length === 0 && (
        <p className="mt-6 text-center text-sm text-stone-500">
          Log ta première session pour voir tes stats apparaître ici.
        </p>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Award; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-stone-900/60 p-3.5">
      <Icon className="h-4 w-4 text-amber-500" />
      <p className="mt-2 text-lg font-bold">{value}</p>
      <p className="text-[11px] text-stone-500">{label}</p>
    </div>
  )
}
