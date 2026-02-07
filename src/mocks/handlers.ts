import { HttpResponse, http } from 'msw'

import type {
  Customer,
  CustomerStatus,
  CustomerTier,
  KpiMetric,
  RevenuePoint,
  RevenueRange,
  SettingsModel,
} from '@/types/domain'
import type { UpdateSettingsPayload } from '@/lib/api/types'

const DAYS_BY_RANGE: Record<RevenueRange, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
}

const CUSTOMER_NAMES = [
  'Acme Logistics',
  'Nimbus Retail',
  'Atlas Biotech',
  'Luna Finance',
  'Northwind Labs',
  'Pioneer Health',
  'Summit Energy',
  'Vertex Studio',
  'Blue Harbor',
  'Solarline',
  'Redwood Systems',
  'Crest Foods',
  'Delta Motors',
  'Orbit Media',
  'Granite AI',
  'Cloudlane',
  'Aster Hotels',
  'Skylark Security',
  'Ivy Education',
  'Brightline Telecom',
  'Helios Manufacturing',
  'Oakline Legal',
  'Zenith Pharma',
  'Echo Mobility',
  'Mosaic Homes',
  'Arcadia Travel',
  'Flux Payments',
  'Signal Agritech',
  'Harbor Foods',
  'Prime Cargo',
]

const TIERS: CustomerTier[] = ['starter', 'growth', 'enterprise']
const STATUSES: CustomerStatus[] = ['active', 'trial', 'paused']

const customers: Customer[] = CUSTOMER_NAMES.map((name, index) => {
  const tier = TIERS[index % TIERS.length]
  const status = STATUSES[index % STATUSES.length]
  const joinedAt = new Date(Date.now() - (index + 4) * 86400000 * 12).toISOString()

  return {
    id: `cst_${(index + 1).toString().padStart(4, '0')}`,
    name,
    email: `ops+${index + 1}@${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.io`,
    tier,
    status,
    joinedAt,
    ltv: 2000 + index * 650 + (tier === 'enterprise' ? 12000 : tier === 'growth' ? 5500 : 0),
  }
})

const buildRevenueSeries = (days: number): RevenuePoint[] => {
  const now = new Date()
  const points: RevenuePoint[] = []

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(now)
    date.setDate(now.getDate() - offset)

    const trend = days - offset
    const baseRevenue = 42000 + trend * 230 + Math.round(Math.sin(trend / 4) * 1700)
    const baseCost = 25000 + trend * 120 + Math.round(Math.cos(trend / 5) * 900)

    points.push({
      timestamp: date.toISOString(),
      revenue: baseRevenue,
      cost: baseCost,
    })
  }

  return points
}

const kpis: KpiMetric[] = [
  {
    id: 'mrr',
    label: 'Monthly recurring revenue',
    value: 483000,
    delta: 8.7,
    trend: 'up',
  },
  {
    id: 'new-customers',
    label: 'New customers',
    value: 184,
    delta: 4.2,
    trend: 'up',
  },
  {
    id: 'churn-rate',
    label: 'Churn rate',
    value: 2.8,
    delta: -0.6,
    trend: 'down',
  },
  {
    id: 'support-sla',
    label: 'SLA met',
    value: 98.2,
    delta: 0.2,
    trend: 'flat',
  },
]

const createInitialSettingsState = (): SettingsModel => ({
  theme: 'sunrise',
  density: 'comfortable',
  locale: 'en-US',
  notifications: {
    email: true,
    push: false,
    weeklyDigest: true,
  },
})

let settingsState: SettingsModel = createInitialSettingsState()

export const resetMockState = (): void => {
  settingsState = createInitialSettingsState()
}

const normalizeInt = (value: string | null, fallback: number): number => {
  if (!value) {
    return fallback
  }

  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const handlers = [
  http.get('/api/kpis', () => {
    return HttpResponse.json({ data: kpis })
  }),

  http.get('/api/revenue', ({ request }) => {
    const { searchParams } = new URL(request.url)
    const rangeParam = searchParams.get('range') as RevenueRange | null
    const range: RevenueRange = rangeParam && rangeParam in DAYS_BY_RANGE ? rangeParam : '30d'

    return HttpResponse.json({
      data: buildRevenueSeries(DAYS_BY_RANGE[range]),
    })
  }),

  http.get('/api/customers', ({ request }) => {
    const { searchParams } = new URL(request.url)

    const q = (searchParams.get('q') ?? '').trim().toLowerCase()
    const status = searchParams.get('status')
    const tier = searchParams.get('tier')
    const page = normalizeInt(searchParams.get('page'), 1)
    const pageSize = normalizeInt(searchParams.get('pageSize'), 10)

    const filtered = customers.filter((customer) => {
      const queryMatches =
        q.length === 0 ||
        customer.name.toLowerCase().includes(q) ||
        customer.email.toLowerCase().includes(q)
      const statusMatches = !status || status === 'all' || customer.status === status
      const tierMatches = !tier || tier === 'all' || customer.tier === tier

      return queryMatches && statusMatches && tierMatches
    })

    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const safePage = Math.min(page, totalPages)
    const start = (safePage - 1) * pageSize

    return HttpResponse.json({
      data: {
        items: filtered.slice(start, start + pageSize),
        page: safePage,
        pageSize,
        total,
        totalPages,
      },
    })
  }),

  http.get('/api/settings', () => {
    return HttpResponse.json({ data: settingsState })
  }),

  http.patch('/api/settings', async ({ request }) => {
    const payload = (await request.json()) as UpdateSettingsPayload

    settingsState = {
      ...settingsState,
      ...payload,
      notifications: {
        ...settingsState.notifications,
        ...payload.notifications,
      },
    }

    return HttpResponse.json({ data: settingsState })
  }),

  http.post('/api/web-vitals', async () => {
    return HttpResponse.json({ ok: true }, { status: 202 })
  }),
]
