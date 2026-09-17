import { Link } from 'react-router-dom'
import { CalendarDays, Camera, LineChart, Music2, ShieldCheck } from 'lucide-react'
import { Logo } from '../components/AppShell'

const FEATURES = [
  {
    icon: LineChart,
    title: 'Suis ton alcoolémie estimée',
    desc: 'Log tes verres, on calcule une courbe d’alcoolémie en direct (formule Widmark) avec des repères clairs — jamais un prétexte pour prendre le volant.',
  },
  {
    icon: CalendarDays,
    title: 'Organise des événements',
    desc: 'Crée un bar crawl, un anniversaire ou une dégustation, invite ton crew, et suis qui participe.',
  },
  {
    icon: Camera,
    title: 'Partage sur Instagram & TikTok',
    desc: 'Génère une carte de session stylée et partage-la en story ou en post, en un tap.',
  },
  {
    icon: ShieldCheck,
    title: 'Pensé pour la sécurité',
    desc: 'Rappels constants : hydrate-toi, ne conduis pas, ressources d’aide toujours accessibles.',
  },
]

export function Landing() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <Link
          to="/app"
          className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-stone-950 transition hover:bg-amber-400"
        >
          Ouvrir l’appli
        </Link>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center md:py-24">
        <p className="mb-4 inline-block rounded-full bg-amber-500/10 px-4 py-1 text-xs font-semibold text-amber-400">
          Le Strava de tes soirées 🍻
        </p>
        <h1 className="text-4xl font-black leading-tight md:text-6xl">
          Track tes sorties.
          <br />
          Partage tes soirées.
          <br />
          <span className="text-amber-500">Bois responsable.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-stone-400">
          Achcool transforme tes soirées en activités trackées : verres, durée, alcoolémie estimée, événements
          entre potes, et partage direct sur Instagram et TikTok.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/app" className="rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-stone-950">
            Commencer gratuitement
          </Link>
          <Link to="/app/safety" className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold">
            Voir les repères sécurité
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-stone-900/60 p-6">
              <f.icon className="h-6 w-6 text-amber-500" />
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-stone-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 text-center">
        <div className="flex items-center justify-center gap-6 text-stone-500">
          <Camera className="h-5 w-5" />
          <Music2 className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm text-stone-500">
          Prêt·e à partager ta prochaine soirée ? Rejoins Achcool, garde un œil sur ton verre, et profite du moment.
        </p>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-stone-600">
        Achcool est un outil de suivi ludique, pas un dispositif médical. Ne conduis jamais après avoir bu.
      </footer>
    </div>
  )
}
