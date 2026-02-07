import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import { handlers, resetMockState } from '@/mocks/handlers'
import { customerService } from '@/lib/services/customerService'
import { dashboardService } from '@/lib/services/dashboardService'
import { settingsService } from '@/lib/services/settingsService'

const server = setupServer(...handlers)

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
  resetMockState()
})

afterAll(() => {
  server.close()
})

describe('service integrations with mock API', () => {
  it('returns KPI and revenue data in expected shape', async () => {
    const kpis = await dashboardService.getKpis()
    const revenue = await dashboardService.getRevenueSeries('7d')

    expect(kpis.length).toBeGreaterThan(0)
    expect(kpis[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        label: expect.any(String),
        value: expect.any(Number),
      }),
    )

    expect(revenue).toHaveLength(7)
    expect(revenue[0]).toEqual(
      expect.objectContaining({
        timestamp: expect.any(String),
        revenue: expect.any(Number),
        cost: expect.any(Number),
      }),
    )
  })

  it('applies customer filters and pagination', async () => {
    const filtered = await customerService.list({
      q: 'acme',
      status: 'active',
      tier: 'all',
      page: 1,
      pageSize: 10,
    })

    expect(filtered.total).toBe(1)
    expect(filtered.items).toHaveLength(1)
    expect(filtered.items[0].name).toBe('Acme Logistics')

    const paged = await customerService.list({
      page: 2,
      pageSize: 5,
    })

    expect(paged.page).toBe(2)
    expect(paged.items).toHaveLength(5)
    expect(paged.totalPages).toBeGreaterThan(1)
  })

  it('persists settings updates and keeps untouched fields', async () => {
    const initial = await settingsService.get()

    const updated = await settingsService.update({
      density: 'compact',
      notifications: { push: true },
    })

    expect(updated.density).toBe('compact')
    expect(updated.notifications.push).toBe(true)
    expect(updated.notifications.email).toBe(initial.notifications.email)

    const fetchedAgain = await settingsService.get()
    expect(fetchedAgain).toEqual(updated)
  })
})
