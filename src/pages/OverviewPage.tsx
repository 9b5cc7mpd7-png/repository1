import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingState } from '@/components/common/LoadingState'
import { CustomersTable } from '@/components/customers/CustomersTable'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { queryKeys } from '@/lib/queryKeys'
import { customerService, DEFAULT_CUSTOMER_PARAMS } from '@/lib/services/customerService'
import { dashboardService } from '@/lib/services/dashboardService'

export const OverviewPage = () => {
  const [customerPage, setCustomerPage] = useState(1)

  const customerParams = useMemo(
    () => ({
      ...DEFAULT_CUSTOMER_PARAMS,
      pageSize: 5,
      page: customerPage,
    }),
    [customerPage],
  )

  const kpisQuery = useQuery({
    queryKey: queryKeys.kpis,
    queryFn: dashboardService.getKpis,
  })

  const revenueQuery = useQuery({
    queryKey: queryKeys.revenue('7d'),
    queryFn: () => dashboardService.getRevenueSeries('7d'),
  })

  const customersQuery = useQuery({
    queryKey: queryKeys.customers(customerParams),
    queryFn: () => customerService.list(customerParams),
    placeholderData: (previous) => previous,
  })

  if (kpisQuery.isLoading || revenueQuery.isLoading || customersQuery.isLoading) {
    return <LoadingState message="Preparing your performance snapshot..." />
  }

  if (kpisQuery.isError || revenueQuery.isError || customersQuery.isError) {
    return (
      <ErrorState
        message="One or more overview panels could not load."
        onRetry={() => {
          void Promise.all([
            kpisQuery.refetch(),
            revenueQuery.refetch(),
            customersQuery.refetch(),
          ])
        }}
      />
    )
  }

  const kpis = kpisQuery.data
  const revenue = revenueQuery.data
  const customersPage = customersQuery.data

  if (!kpis || !revenue || !customersPage) {
    return <EmptyState title="No data yet" message="Your dashboard will populate soon." />
  }

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((metric) => (
          <div key={metric.id} className="motion-safe:animate-fade-up">
            <KpiCard metric={metric} />
          </div>
        ))}
      </section>

      <RevenueChart points={revenue} title="7-day revenue trajectory" />

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">
          Recently active customers
        </h2>
        <CustomersTable
          rows={customersPage.items}
          page={customersPage.page}
          totalPages={customersPage.totalPages}
          total={customersPage.total}
          isFetching={customersQuery.isFetching}
          onPageChange={setCustomerPage}
        />
      </section>
    </>
  )
}
