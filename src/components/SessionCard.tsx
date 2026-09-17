import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin, MessageCircle, Share2 } from 'lucide-react'
import type { Session } from '../types'
import { computeBacCurve, peakBac, standardDrinks } from '../lib/bac'
import { formatDuration, formatRelativeDate } from '../lib/format'
import { BacBadge } from './BacBadge'
import { communityUser } from '../data/community'
import { useStore } from '../state/store'

export function SessionCard({ session, onShare }: { session: Session; onShare?: (s: Session) => void }) {
  const { data, toggleKudos, addComment } = useStore()
  const [commentText, setCommentText] = useState('')
  const [showComments, setShowComments] = useState(false)

  const isMine = session.userId === 'me'
  const author = isMine
    ? { name: data.profile.name, handle: data.profile.handle, avatarEmoji: data.profile.avatarEmoji }
    : communityUser(session.userId)

  const weightKg = isMine ? data.profile.weightKg : 70
  const sex = isMine ? data.profile.sex : 'male'

  const curve = useMemo(
    () => computeBacCurve(session.drinks, weightKg, sex, session.startedAt, session.endedAt),
    [session, weightKg, sex],
  )
  const peak = peakBac(curve)
  const totalStandardDrinks = session.drinks.reduce((sum, d) => sum + standardDrinks(d), 0)
  const hasKudos = session.kudos.includes('me')

  return (
    <div className="rounded-2xl border border-white/10 bg-stone-900/60 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 text-lg">
            {author?.avatarEmoji ?? '🙂'}
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-100">{author?.name ?? 'Quelqu’un'}</p>
            <p className="text-xs text-stone-500">{formatRelativeDate(session.startedAt)}</p>
          </div>
        </div>
        {session.photoUrl && <div className="text-2xl">{session.photoUrl}</div>}
      </div>

      <Link to={`/session/${session.id}`} className="mt-3 block">
        <h3 className="text-base font-semibold text-stone-100">{session.title}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-stone-500">
          <MapPin className="h-3 w-3" /> {session.locationName}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <Stat label="Durée" value={formatDuration(session.startedAt, session.endedAt)} />
          <Stat label="Verres std" value={totalStandardDrinks.toFixed(1)} />
          <Stat label="Pic estimé" value={`${peak.toFixed(2)}%`} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {session.drinks.map((d) => (
            <span key={d.id} className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-stone-300">
              {d.emoji} {d.label}
            </span>
          ))}
        </div>

        <div className="mt-3">
          <BacBadge bac={peak} size="sm" />
        </div>
      </Link>

      <div className="mt-4 flex items-center gap-4 border-t border-white/5 pt-3 text-sm text-stone-400">
        <button
          onClick={() => toggleKudos(session.id)}
          className={`flex items-center gap-1.5 transition ${hasKudos ? 'text-rose-400' : 'hover:text-rose-400'}`}
        >
          <Heart className={`h-4 w-4 ${hasKudos ? 'fill-rose-400' : ''}`} />
          {session.kudos.length}
        </button>
        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center gap-1.5 hover:text-amber-400"
        >
          <MessageCircle className="h-4 w-4" />
          {session.comments.length}
        </button>
        {onShare && (
          <button onClick={() => onShare(session)} className="ml-auto flex items-center gap-1.5 hover:text-amber-400">
            <Share2 className="h-4 w-4" />
            Partager
          </button>
        )}
      </div>

      {showComments && (
        <div className="mt-3 space-y-2 border-t border-white/5 pt-3">
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
            className="flex gap-2"
          >
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Écrire un commentaire…"
              className="flex-1 rounded-full bg-white/5 px-3 py-1.5 text-sm text-stone-100 outline-none placeholder:text-stone-500 focus:ring-1 focus:ring-amber-500"
            />
            <button type="submit" className="text-sm font-medium text-amber-400">
              Envoyer
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 py-2">
      <p className="text-sm font-semibold text-stone-100">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-stone-500">{label}</p>
    </div>
  )
}
