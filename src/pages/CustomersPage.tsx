import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import {
  type CustomerFilterValue,
  CustomersFilters,
} from '@/components/customers/CustomersFilters'
import { CustomersTable } from '@/components/customers/CustomersTable'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingState } from '@/components/common/LoadingState'
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue'
import { queryKeys } from '@/lib/queryKeys'
import { customerService, DEFAULT_CUSTOMER_PARAMS } from '@/lib/services/customerService'

export const CustomersPage = () => {
  const [filters, setFilters] = useState<CustomerFilterValue>({
    q: '',
    status: 'all',
    tier: 'all',
  })
  const [page, setPage] = useState<number>(1)

  const debouncedFilters = useDebouncedValue(filters, 250)

  const params = useMemo(
    () => ({
      ...DEFAULT_CUSTOMER_PARAMS,
      ...debouncedFilters,
      page,
    }),
    [debouncedFilters, page],
  )

  const customersQuery = useQuery({
    queryKey: queryKeys.customers(params),
    queryFn: () => customerService.list(params),
    placeholderData: (previous) => previous,
  })

  const handleFiltersChange = (nextFilters: CustomerFilterValue) => {
    setFilters(nextFilters)
    setPage(1)
  }

  const resetFilters = () => {
    setFilters({ q: '', status: 'all', tier: 'all' })
    setPage(1)
  }

  return (
    <>
      <CustomersFilters
        value={filters}
        onChange={handleFiltersChange}
        onReset={resetFilters}
      />

      {customersQuery.isLoading ? <LoadingState message="Loading customers..." /> : null}

      {customersQuery.isError ? (
        <ErrorState
          message="Could not load customers at the moment."
          onRetry={() => {
            void customersQuery.refetch()
          }}
        />
      ) : null}

      {customersQuery.data ? (
        customersQuery.data.items.length > 0 ? (
          <CustomersTable
            rows={customersQuery.data.items}
            page={customersQuery.data.page}
            totalPages={customersQuery.data.totalPages}
            total={customersQuery.data.total}
            isFetching={customersQuery.isFetching}
            onPageChange={setPage}
          />
        ) : (
          <EmptyState
            title="No customers match this filter"
            message="Adjust your query or clear filters to view all accounts."
          />
        )
      ) : null}
    </>
  )
}
