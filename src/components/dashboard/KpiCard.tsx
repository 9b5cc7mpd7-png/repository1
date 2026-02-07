import clsx from 'clsx'

import { formatCompactNumber, formatPercent } from '@/lib/utils/format'
import type { KpiMetric } from '@/types/domain'

interface KpiCardProps {
  metric: KpiMetric
}

const trendText: Record<KpiMetric['trend'], string> = {
  up: 'Upward trend',
  down: 'Downward trend',
  flat: 'Flat trend',
}

export const KpiCard = ({ metric }: KpiCardProps) => {
  const trendColor =
    metric.trend === 'up'
      ? 'text-success'
      : metric.trend === 'down'
        ? 'text-danger'
        : 'text-muted'

  return (
    <article className="rounded-2xl border border-border/70 bg-surface/70 p-5 shadow-card">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{metric.label}</p>
      <p className="mt-3 font-display text-2xl font-bold">
        {formatCompactNumber(metric.value)}
      </p>
      <p className={clsx('mt-2 text-sm font-medium', trendColor)}>
        {formatPercent(metric.delta)} - {trendText[metric.trend]}
      </p>
    </article>
  )
}
