import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { ErrorState } from '@/components/common/ErrorState'
import { LoadingState } from '@/components/common/LoadingState'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { queryKeys } from '@/lib/queryKeys'
import { dashboardService } from '@/lib/services/dashboardService'
import { formatCurrency, formatPercent } from '@/lib/utils/format'
import type { RevenueRange } from '@/types/domain'

const ranges: RevenueRange[] = ['7d', '30d', '90d']

export const AnalyticsPage = () => {
  const [range, setRange] = useState<RevenueRange>('30d')

  const revenueQuery = useQuery({
    queryKey: queryKeys.revenue(range),
    queryFn: () => dashboardService.getRevenueSeries(range),
  })

  const summary = useMemo(() => {
    if (!revenueQuery.data || revenueQuery.data.length === 0) {
      return null
    }

    const revenueTotal = revenueQuery.data.reduce((acc, point) => acc + point.revenue, 0)
    const costTotal = revenueQuery.data.reduce((acc, point) => acc + point.cost, 0)
    const margin = ((revenueTotal - costTotal) / revenueTotal) * 100

    return {
      revenueTotal,
      costTotal,
      margin,
    }
  }, [revenueQuery.data])

  return (
    <>
      <section className="rounded-2xl border border-border/70 bg-surface/70 p-4">
        <div
          className="flex flex-wrap gap-2"
          role="radiogroup"
          aria-label="Select revenue range"
        >
          {ranges.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRange(value)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                range === value
                  ? 'border-accent bg-accent/15 text-text'
                  : 'border-border bg-panel text-muted hover:text-text'
              }`}
              aria-pressed={range === value}
            >
              {value}
            </button>
          ))}
        </div>
      </section>

      {revenueQuery.isLoading ? <LoadingState message="Crunching analytics..." /> : null}

      {revenueQuery.isError ? (
        <ErrorState
          message="Analytics data is temporarily unavailable."
          onRetry={() => {
            void revenueQuery.refetch()
          }}
        />
      ) : null}

      {revenueQuery.data && summary ? (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-border/70 bg-surface/70 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-muted">
                Total Revenue
              </p>
              <p className="mt-2 font-display text-2xl font-semibold">
                {formatCurrency(summary.revenueTotal)}
              </p>
            </article>
            <article className="rounded-2xl border border-border/70 bg-surface/70 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-muted">Total Cost</p>
              <p className="mt-2 font-display text-2xl font-semibold">
                {formatCurrency(summary.costTotal)}
              </p>
            </article>
            <article className="rounded-2xl border border-border/70 bg-surface/70 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-muted">
                Gross Margin
              </p>
              <p className="mt-2 font-display text-2xl font-semibold">
                {formatPercent(summary.margin)}
              </p>
            </article>
          </section>

          <RevenueChart
            points={revenueQuery.data}
            title={`Revenue breakdown (${range})`}
          />
        </>
      ) : null}
    </>
  )
}
