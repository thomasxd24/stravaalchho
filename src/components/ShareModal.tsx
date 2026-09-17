import { useEffect, useRef, useState } from 'react'
import { Download, Camera, Music2, Share2, X } from 'lucide-react'
import type { Session } from '../types'
import { computeBacCurve, peakBac, standardDrinks } from '../lib/bac'
import { formatDuration, formatDateShort } from '../lib/format'
import { useStore } from '../state/store'

const CARD_W = 1080
const CARD_H = 1350

export function ShareModal({ session, onClose }: { session: Session; onClose: () => void }) {
  const { data } = useStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const peak = peakBac(
    computeBacCurve(session.drinks, data.profile.weightKg, data.profile.sex, session.startedAt, session.endedAt),
  )
  const totalStandardDrinks = session.drinks.reduce((sum, d) => sum + standardDrinks(d), 0)

  const caption = `${session.title} 🍻 ${totalStandardDrinks.toFixed(1)} verres std · pic ${peak.toFixed(
    2,
  )}% estimé · ${formatDuration(session.startedAt, session.endedAt)} sur Achcool. Bois de l’eau, ne conduis jamais. #achcool`

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const grad = ctx.createLinearGradient(0, 0, 0, CARD_H)
    grad.addColorStop(0, '#1c1917')
    grad.addColorStop(1, '#451a03')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, CARD_W, CARD_H)

    ctx.fillStyle = '#f59e0b'
    ctx.font = '700 56px system-ui, sans-serif'
    ctx.fillText('🍻 Achcool', 64, 120)

    ctx.fillStyle = '#fff'
    ctx.font = '800 68px system-ui, sans-serif'
    wrapText(ctx, session.title, 64, 260, CARD_W - 128, 76)

    ctx.fillStyle = '#d6d3d1'
    ctx.font = '400 36px system-ui, sans-serif'
    ctx.fillText(`📍 ${session.locationName}`, 64, 400)
    ctx.fillText(`${formatDateShort(session.startedAt)}`, 64, 450)

    const stats: [string, string][] = [
      ['Durée', formatDuration(session.startedAt, session.endedAt)],
      ['Verres std', totalStandardDrinks.toFixed(1)],
      ['Pic BAC (est.)', `${peak.toFixed(2)}%`],
    ]
    const boxY = 560
    const boxW = (CARD_W - 128 - 2 * 24) / 3
    stats.forEach(([label, value], i) => {
      const x = 64 + i * (boxW + 24)
      ctx.fillStyle = '#ffffff14'
      roundRect(ctx, x, boxY, boxW, 220, 24)
      ctx.fill()
      ctx.fillStyle = '#f59e0b'
      ctx.font = '800 56px system-ui, sans-serif'
      ctx.fillText(value, x + 24, boxY + 100)
      ctx.fillStyle = '#a8a29e'
      ctx.font = '400 26px system-ui, sans-serif'
      ctx.fillText(label.toUpperCase(), x + 24, boxY + 150)
    })

    ctx.fillStyle = '#fff'
    ctx.font = '400 40px system-ui, sans-serif'
    let dy = 900
    session.drinks.slice(0, 8).forEach((d) => {
      ctx.fillText(`${d.emoji} ${d.label}`, 64, dy)
      dy += 58
    })

    ctx.fillStyle = '#78716c'
    ctx.font = '400 28px system-ui, sans-serif'
    wrapText(
      ctx,
      'Estimation ludique, pas un éthylotest. Ne conduis jamais après avoir bu.',
      64,
      CARD_H - 90,
      CARD_W - 128,
      36,
    )

    setImageUrl(canvas.toDataURL('image/png'))
  }, [session, data.profile, peak, totalStandardDrinks])

  const shareFiles = async () => {
    if (!imageUrl) return
    try {
      const res = await fetch(imageUrl)
      const blob = await res.blob()
      const file = new File([blob], 'achcool-session.png', { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: caption, title: session.title })
        return
      }
    } catch {
      // fall through to manual flow below
    }
    downloadImage()
    await copyCaption()
  }

  const downloadImage = () => {
    if (!imageUrl) return
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = 'achcool-session.png'
    a.click()
  }

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — the caption is still shown on screen to copy manually
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-stone-900 p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Partager la session</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <canvas ref={canvasRef} width={CARD_W} height={CARD_H} className="hidden" />
        {imageUrl && (
          <img src={imageUrl} alt="Carte de partage" className="w-full rounded-xl border border-white/10" />
        )}

        <p className="mt-3 rounded-xl bg-white/5 p-3 text-xs text-stone-400">{caption}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={shareFiles}
            className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-stone-950"
          >
            <Share2 className="h-4 w-4" /> Partager
          </button>
          <button
            onClick={downloadImage}
            className="flex items-center justify-center gap-2 rounded-xl bg-white/10 py-2.5 text-sm font-semibold"
          >
            <Download className="h-4 w-4" /> Télécharger
          </button>
          <a
            href="instagram://camera"
            onClick={() => copyCaption()}
            className="flex items-center justify-center gap-2 rounded-xl bg-white/10 py-2.5 text-sm font-semibold"
          >
            <Camera className="h-4 w-4" /> Instagram
          </a>
          <a
            href="tiktok://"
            onClick={() => copyCaption()}
            className="flex items-center justify-center gap-2 rounded-xl bg-white/10 py-2.5 text-sm font-semibold"
          >
            <Music2 className="h-4 w-4" /> TikTok
          </a>
        </div>
        <p className="mt-3 text-center text-[11px] text-stone-500">
          {copied
            ? 'Légende copiée ! Ouvre l’appli et colle l’image téléchargée.'
            : 'Télécharge l’image, puis partage-la depuis Instagram ou TikTok.'}
        </p>
      </div>
    </div>
  )
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ')
  let line = ''
  let cy = y
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy)
      line = word
      cy += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, cy)
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
