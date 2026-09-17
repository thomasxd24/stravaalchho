import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { BacPoint } from '../lib/bac'

function formatMinutes(t: number): string {
  const h = Math.floor(t / 60)
  const m = t % 60
  if (h === 0) return `${m}m`
  return `${h}h${m > 0 ? m.toString().padStart(2, '0') : ''}`
}

export function BacChart({ curve }: { curve: BacPoint[] }) {
  const chartData = curve.map((p) => ({ ...p, label: formatMinutes(p.t) }))
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="bacFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            axisLine={{ stroke: '#ffffff22' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={52}
            tickFormatter={(v: number) => `${v.toFixed(2)}%`}
          />
          <ReferenceLine y={0.08} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.6} />
          <Tooltip
            contentStyle={{
              background: '#1c1917',
              border: '1px solid #ffffff22',
              borderRadius: 12,
              color: '#fff',
              fontSize: 12,
            }}
            formatter={(value) => [`${Number(value).toFixed(3)}%`, 'BAC estimé']}
            labelFormatter={(label) => `+${label}`}
          />
          <Area type="monotone" dataKey="bac" stroke="#f59e0b" strokeWidth={2.5} fill="url(#bacFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
