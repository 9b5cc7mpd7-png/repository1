import { apiClient } from '@/lib/api/client'
import { settingsResponseSchema, updateSettingsPayloadSchema } from '@/lib/api/schemas'
import type { UpdateSettingsPayload } from '@/lib/api/types'

export const settingsService = {
  async get() {
    const response = await apiClient.get('/api/settings', settingsResponseSchema)
    return response.data
  },
  async update(payload: UpdateSettingsPayload) {
    const validated = updateSettingsPayloadSchema.parse(payload)
    const response = await apiClient.patch(
      '/api/settings',
      settingsResponseSchema,
      validated,
    )
    return response.data
  },
}
