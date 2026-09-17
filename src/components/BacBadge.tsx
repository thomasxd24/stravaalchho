import { bacZone, bacZoneMeta } from '../lib/bac'

export function BacBadge({ bac, size = 'md' }: { bac: number; size?: 'sm' | 'md' | 'lg' }) {
  const zone = bacZone(bac)
  const meta = bacZoneMeta[zone]
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizes[size]}`}
      style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
      {bac.toFixed(2)}% · {meta.label}
    </span>
  )
}
