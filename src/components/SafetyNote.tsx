import { AlertTriangle } from 'lucide-react'

export function SafetyNote({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="flex items-start gap-1.5 text-xs text-stone-400">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
        Estimation ludique, pas un éthylotest. Ne prends jamais le volant après avoir bu.
      </p>
    )
  }
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
      <div className="text-sm text-stone-300">
        <p className="font-medium text-amber-400">Ceci n’est pas un éthylotest.</p>
        <p className="mt-1 text-stone-400">
          L’estimation d’alcoolémie est basée sur une formule générique (Widmark) et n’a aucune valeur
          médicale ou légale. Ne conduis jamais après avoir bu, même si l’appli t’affiche « sobre ». En cas de
          doute, appelle un taxi, un proche, ou dors sur place.
        </p>
      </div>
    </div>
  )
}
