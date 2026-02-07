import type { CustomerQueryParams, RevenueRange } from '@/types/domain'

export const queryKeys = {
  kpis: ['kpis'] as const,
  revenue: (range: RevenueRange) => ['revenue', range] as const,
  customers: (params: Required<CustomerQueryParams>) => ['customers', params] as const,
  settings: ['settings'] as const,
}
