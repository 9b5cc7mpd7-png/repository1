import clsx from 'clsx'

import { formatCurrency, formatDate } from '@/lib/utils/format'
import type { Customer } from '@/types/domain'

interface CustomersTableProps {
  rows: Customer[]
  page: number
  totalPages: number
  total: number
  isFetching: boolean
  onPageChange: (page: number) => void
}

const statusClass: Record<Customer['status'], string> = {
  active: 'bg-success/15 text-success',
  trial: 'bg-accent/15 text-accent',
  paused: 'bg-danger/15 text-danger',
}

export const CustomersTable = ({
  rows,
  page,
  totalPages,
  total,
  isFetching,
  onPageChange,
}: CustomersTableProps) => {
  return (
    <section className="rounded-2xl border border-border/70 bg-surface/70 p-4 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">{total} customers found</p>
        {isFetching ? <span className="text-xs text-muted">Refreshing...</span> : null}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-[0.12em] text-muted">
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Tier</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Joined</th>
              <th className="pb-3 text-right font-medium">LTV</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((customer) => (
              <tr key={customer.id} className="border-b border-border/60">
                <td className="py-3">
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-xs text-muted">{customer.email}</p>
                </td>
                <td className="py-3 capitalize">{customer.tier}</td>
                <td className="py-3">
                  <span
                    className={clsx(
                      'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize',
                      statusClass[customer.status],
                    )}
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="py-3">{formatDate(customer.joinedAt)}</td>
                <td className="py-3 text-right font-medium">
                  {formatCurrency(customer.ltv)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="rounded-lg border border-border bg-panel px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-sm text-muted">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="rounded-lg border border-border bg-panel px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </section>
  )
}
