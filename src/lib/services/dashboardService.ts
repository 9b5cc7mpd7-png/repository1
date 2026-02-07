import { apiClient } from '@/lib/api/client'
import { kpiResponseSchema, revenueResponseSchema } from '@/lib/api/schemas'
import type { RevenueRange } from '@/types/domain'

export const dashboardService = {
  async getKpis() {
    const response = await apiClient.get('/api/kpis', kpiResponseSchema)
    return response.data
  },
  async getRevenueSeries(range: RevenueRange) {
    const response = await apiClient.get('/api/revenue', revenueResponseSchema, { range })
    return response.data
  },
}
