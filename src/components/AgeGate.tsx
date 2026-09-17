import { useState } from 'react'
import { COUNTRIES, countryByCode, guessCountryFromBrowser } from '../data/countries'
import { useStore } from '../state/store'
import { Logo } from './AppShell'

function ageFromBirthDate(birthDate: string): number {
  const dob = new Date(birthDate)
  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  const monthDiff = now.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age--
  return age
}

export function AgeGate({ children }: { children: React.ReactNode }) {
  const { data, updateProfile } = useStore()

  if (data.profile.ageConfirmed) return <>{children}</>

  return <AgeGateForm onConfirmed={(patch) => updateProfile(patch)} />
}

function AgeGateForm({
  onConfirmed,
}: {
  onConfirmed: (patch: { country: string; birthDate: string; ageConfirmed: boolean }) => void
}) {
  const detected = guessCountryFromBrowser()
  const [countryCode, setCountryCode] = useState(detected.code)
  const [birthDate, setBirthDate] = useState('')
  const [blocked, setBlocked] = useState(false)

  const country = countryByCode(countryCode)

  function submit() {
    if (!birthDate) return
    const age = ageFromBirthDate(birthDate)
    if (age < country.legalDrinkingAge || country.alcoholContentRestricted) {
      setBlocked(true)
      return
    }
    onConfirmed({ country: countryCode, birthDate, ageConfirmed: true })
  }

  if (blocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950 px-6 text-center text-stone-100">
        <div className="max-w-sm">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>
          <p className="text-2xl">🔒</p>
          <h1 className="mt-4 text-lg font-bold">Accès non disponible</h1>
          <p className="mt-2 text-sm text-stone-400">
            Achcool contient du contenu lié à l’alcool réservé aux personnes ayant l’âge légal dans leur
            pays ({country.name} : {country.legalDrinkingAge} ans), et n’est pas proposé dans les pays où la
            promotion de l’alcool est restreinte. Reviens quand ce sera ton cas, ou choisis un autre pays si
            tu t’es trompé·e.
          </p>
          <button
            onClick={() => setBlocked(false)}
            className="mt-6 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold"
          >
            Revenir en arrière
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-950 px-6 text-stone-100">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-center text-lg font-bold">Avant de commencer</h1>
        <p className="mt-2 text-center text-sm text-stone-400">
          Achcool contient un suivi lié à la consommation d’alcool. On a besoin de vérifier ton pays et ton
          âge pour respecter la législation locale.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-500">
              Pays de résidence
            </label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full rounded-xl bg-white/5 px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-amber-500"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-stone-600">
              Pré-rempli depuis la langue de ton navigateur — corrige si besoin, ce n’est qu’une
              estimation.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-500">
              Date de naissance
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              className="w-full rounded-xl bg-white/5 px-3.5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <button
            onClick={submit}
            disabled={!birthDate}
            className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-stone-950 disabled:opacity-30"
          >
            Confirmer
          </button>

          <p className="text-center text-[11px] text-stone-600">
            Âge légal de consommation en {country.name} : {country.legalDrinkingAge} ans.
          </p>
        </div>
      </div>
    </div>
  )
}
