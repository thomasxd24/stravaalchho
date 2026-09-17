import { useState } from 'react'
import { Camera, Music2 } from 'lucide-react'
import { useStore } from '../state/store'
import { PageHeader } from '../components/PageHeader'

export function Profile() {
  const { data, updateProfile } = useStore()
  const [name, setName] = useState(data.profile.name)
  const [bio, setBio] = useState(data.profile.bio)

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <PageHeader title="Profil" subtitle="Tes infos servent uniquement à estimer ton alcoolémie" />

      <div className="rounded-2xl border border-white/10 bg-stone-900/60 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 text-3xl">
            {data.profile.avatarEmoji}
          </div>
          <div className="flex-1">
            <input
              value={name}
              onBlur={() => updateProfile({ name })}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm font-semibold outline-none focus:ring-1 focus:ring-amber-500"
            />
            <p className="mt-1 text-xs text-stone-500">{data.profile.handle}</p>
          </div>
        </div>

        <textarea
          value={bio}
          onBlur={() => updateProfile({ bio })}
          onChange={(e) => setBio(e.target.value)}
          rows={2}
          className="mt-3 w-full rounded-lg bg-white/5 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-stone-900/60 p-5">
        <p className="text-sm font-semibold text-stone-200">Pour un calcul d’alcoolémie plus juste</p>
        <p className="mt-1 text-xs text-stone-500">
          Ces données restent uniquement sur ton appareil et servent au calcul Widmark (estimation, pas un diagnostic).
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs text-stone-500">Poids (kg)</label>
            <input
              type="number"
              value={data.profile.weightKg}
              onChange={(e) => updateProfile({ weightKg: Number(e.target.value) || 0 })}
              className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-stone-500">Sexe (physio.)</label>
            <select
              value={data.profile.sex}
              onChange={(e) => updateProfile({ sex: e.target.value as 'male' | 'female' })}
              className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="male">Masculin</option>
              <option value="female">Féminin</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-stone-900/60 p-5">
        <p className="text-sm font-semibold text-stone-200">Réseaux sociaux</p>
        <p className="mt-1 text-xs text-stone-500">
          Démo locale : ceci simule la connexion pour préparer le partage. Une vraie intégration nécessite
          l’inscription d’Achcool comme app auprès de Meta / TikTok et un serveur pour l’auth OAuth.
        </p>

        <div className="mt-4 space-y-2">
          <button
            onClick={() => updateProfile({ connectedInstagram: !data.profile.connectedInstagram })}
            className="flex w-full items-center justify-between rounded-xl bg-white/5 px-4 py-3"
          >
            <span className="flex items-center gap-2 text-sm">
              <Camera className="h-4 w-4" /> Instagram
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                data.profile.connectedInstagram ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-stone-400'
              }`}
            >
              {data.profile.connectedInstagram ? 'Connecté' : 'Connecter'}
            </span>
          </button>
          <button
            onClick={() => updateProfile({ connectedTiktok: !data.profile.connectedTiktok })}
            className="flex w-full items-center justify-between rounded-xl bg-white/5 px-4 py-3"
          >
            <span className="flex items-center gap-2 text-sm">
              <Music2 className="h-4 w-4" /> TikTok
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                data.profile.connectedTiktok ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-stone-400'
              }`}
            >
              {data.profile.connectedTiktok ? 'Connecté' : 'Connecter'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
