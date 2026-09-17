import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, MapPin, Share2, Trash2 } from 'lucide-react'
import { COMMUNITY_SESSIONS, communityUser } from '../data/community'
import { useStore } from '../state/store'
import { computeBacCurve, hoursUntilSober, peakBac, standardDrinks } from '../lib/bac'
import { formatDate, formatDuration } from '../lib/format'
import { BacBadge } from '../components/BacBadge'
import { BacChart } from '../components/BacChart'
import { SafetyNote } from '../components/SafetyNote'
import { ShareModal } from '../components/ShareModal'

export function SessionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, toggleKudos, addComment, deleteSession } = useStore()
  const [commentText, setCommentText] = useState('')
  const [sharing, setSharing] = useState(false)

  const session = useMemo(
    () => data.sessions.find((s) => s.id === id) ?? COMMUNITY_SESSIONS.find((s) => s.id === id),
    [data.sessions, id],
  )

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center text-stone-400">
        Session introuvable.
        <div className="mt-4">
          <Link to="/app" className="text-amber-400">
            Retour au fil
          </Link>
        </div>
      </div>
    )
  }

  const isMine = session.userId === 'me'
  const author = isMine
    ? { name: data.profile.name, handle: data.profile.handle, avatarEmoji: data.profile.avatarEmoji }
    : communityUser(session.userId)
  const weightKg = isMine ? data.profile.weightKg : 70
  const sex = isMine ? data.profile.sex : 'male'

  const curve = computeBacCurve(session.drinks, weightKg, sex, session.startedAt, session.endedAt)
  const peak = peakBac(curve)
  const lastPoint = curve[curve.length - 1]?.bac ?? 0
  const soberInHours = hoursUntilSober(lastPoint)
  const totalStandardDrinks = session.drinks.reduce((sum, d) => sum + standardDrinks(d), 0)
  const hasKudos = session.kudos.includes('me')

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-sm text-stone-400">
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <div className="rounded-2xl border border-white/10 bg-stone-900/60 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/15 text-xl">
            {author?.avatarEmoji ?? '🙂'}
          </div>
          <div>
            <p className="text-sm font-semibold">{author?.name ?? 'Quelqu’un'}</p>
            <p className="text-xs text-stone-500">{formatDate(session.startedAt)}</p>
          </div>
          {session.photoUrl && <span className="ml-auto text-3xl">{session.photoUrl}</span>}
        </div>

        <h1 className="mt-4 text-xl font-bold">{session.title}</h1>
        <p className="mt-1 flex items-center gap-1 text-sm text-stone-400">
          <MapPin className="h-3.5 w-3.5" /> {session.locationName}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <Stat label="Durée" value={formatDuration(session.startedAt, session.endedAt)} />
          <Stat label="Verres std" value={totalStandardDrinks.toFixed(1)} />
          <Stat label="Pic estimé" value={`${peak.toFixed(2)}%`} />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <BacBadge bac={peak} />
          {soberInHours > 0.1 && (
            <p className="text-xs text-stone-500">~{soberInHours.toFixed(1)}h avant retour à zéro (estimé)</p>
          )}
        </div>

        <div className="mt-5">
          <BacChart curve={curve} />
        </div>

        <div className="mt-4">
          <SafetyNote compact />
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-500">Boissons</p>
          <div className="space-y-1.5">
            {session.drinks.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
                <span>
                  {d.emoji} {d.label}
                </span>
                <span className="text-stone-500">
                  {new Date(d.at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {session.notes && (
          <div className="mt-4 rounded-lg bg-white/5 p-3 text-sm text-stone-300">{session.notes}</div>
        )}

        <div className="mt-5 flex items-center gap-4 border-t border-white/10 pt-4 text-sm">
          <button
            onClick={() => toggleKudos(session.id)}
            className={`flex items-center gap-1.5 ${hasKudos ? 'text-rose-400' : 'text-stone-400 hover:text-rose-400'}`}
          >
            <Heart className={`h-4 w-4 ${hasKudos ? 'fill-rose-400' : ''}`} /> {session.kudos.length} kudos
          </button>
          <button onClick={() => setSharing(true)} className="flex items-center gap-1.5 text-stone-400 hover:text-amber-400">
            <Share2 className="h-4 w-4" /> Partager
          </button>
          {isMine && (
            <button
              onClick={() => {
                deleteSession(session.id)
                navigate('/app')
              }}
              className="ml-auto flex items-center gap-1.5 text-stone-500 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" /> Supprimer
            </button>
          )}
        </div>

        <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
          {session.comments.map((c) => {
            const commentAuthor = c.authorId === 'me' ? data.profile : communityUser(c.authorId)
            return (
              <p key={c.id} className="text-sm text-stone-300">
                <span className="font-semibold text-stone-100">{commentAuthor?.name ?? 'Anonyme'} </span>
                {c.text}
              </p>
            )
          })}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!commentText.trim()) return
              addComment(session.id, commentText.trim())
              setCommentText('')
            }}
            className="flex gap-2 pt-1"
          >
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Écrire un commentaire…"
              className="flex-1 rounded-full bg-white/5 px-3 py-1.5 text-sm outline-none placeholder:text-stone-500 focus:ring-1 focus:ring-amber-500"
            />
            <button type="submit" className="text-sm font-medium text-amber-400">
              Envoyer
            </button>
          </form>
        </div>
      </div>

      {sharing && <ShareModal session={session} onClose={() => setSharing(false)} />}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 py-2.5">
      <p className="text-base font-semibold">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-stone-500">{label}</p>
    </div>
  )
}
