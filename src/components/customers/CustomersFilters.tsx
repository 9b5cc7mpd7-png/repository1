import type { CustomerStatus, CustomerTier } from '@/types/domain'

export interface CustomerFilterValue {
  q: string
  status: CustomerStatus | 'all'
  tier: CustomerTier | 'all'
}

interface CustomersFiltersProps {
  value: CustomerFilterValue
  onChange: (value: CustomerFilterValue) => void
  onReset: () => void
}

export const CustomersFilters = ({ value, onChange, onReset }: CustomersFiltersProps) => {
  return (
    <section className="grid gap-4 rounded-2xl border border-border/70 bg-surface/70 p-4 md:grid-cols-4">
      <label className="flex flex-col gap-2 text-sm">
        Search
        <input
          type="text"
          value={value.q}
          onChange={(event) => onChange({ ...value, q: event.target.value })}
          placeholder="Name or email"
          className="rounded-lg border border-border bg-panel px-3 py-2 text-sm outline-none transition focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm">
        Status
        <select
          value={value.status}
          onChange={(event) =>
            onChange({ ...value, status: event.target.value as CustomerStatus | 'all' })
          }
          className="rounded-lg border border-border bg-panel px-3 py-2 text-sm outline-none transition focus:border-accent"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="paused">Paused</option>
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm">
        Tier
        <select
          value={value.tier}
          onChange={(event) =>
            onChange({ ...value, tier: event.target.value as CustomerTier | 'all' })
          }
          className="rounded-lg border border-border bg-panel px-3 py-2 text-sm outline-none transition focus:border-accent"
        >
          <option value="all">All</option>
          <option value="starter">Starter</option>
          <option value="growth">Growth</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </label>

      <div className="flex items-end">
        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-lg border border-border bg-panel px-4 py-2 text-sm font-medium transition hover:border-accent"
        >
          Reset filters
        </button>
      </div>
    </section>
  )
}
