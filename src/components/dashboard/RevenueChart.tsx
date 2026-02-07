import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { formatCompactNumber, formatCurrency } from '@/lib/utils/format'
import type { RevenuePoint } from '@/types/domain'

interface RevenueChartProps {
  points: RevenuePoint[]
  title?: string
}

export const RevenueChart = ({
  points,
  title = 'Revenue vs Cost',
}: RevenueChartProps) => {
  return (
    <section className="rounded-2xl border border-border/70 bg-surface/70 p-5 shadow-card">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted">
        Tracking trend movement across selected range
      </p>
      <div className="mt-5 h-72">
        <ResponsiveContainer>
          <LineChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="hsl(var(--border) / 0.45)" strokeDasharray="4 4" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value: string) =>
                new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric',
                }).format(new Date(value))
              }
              stroke="hsl(var(--muted))"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(value: number) => formatCompactNumber(value)}
              stroke="hsl(var(--muted))"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(value: string) =>
                new Intl.DateTimeFormat('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }).format(new Date(value))
              }
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--panel))',
              }}
            />
            <Legend />
            <Line
              name="Revenue"
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--accent))"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              name="Cost"
              type="monotone"
              dataKey="cost"
              stroke="hsl(var(--danger))"
              strokeWidth={2.2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
