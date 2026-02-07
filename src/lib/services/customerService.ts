import { apiClient } from '@/lib/api/client'
import { customersResponseSchema } from '@/lib/api/schemas'
import type { CustomerQueryParams } from '@/types/domain'

const DEFAULT_CUSTOMER_PARAMS = {
  q: '',
  status: 'all',
  tier: 'all',
  page: 1,
  pageSize: 10,
} as const

export const customerService = {
  async list(params?: CustomerQueryParams) {
    const normalized = {
      ...DEFAULT_CUSTOMER_PARAMS,
      ...params,
    }

    const response = await apiClient.get(
      '/api/customers',
      customersResponseSchema,
      normalized,
    )
    return response.data
  },
}

export { DEFAULT_CUSTOMER_PARAMS }
