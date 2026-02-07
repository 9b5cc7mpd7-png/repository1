export type Trend = 'up' | 'down' | 'flat'
export type RevenueRange = '7d' | '30d' | '90d'

export type CustomerTier = 'starter' | 'growth' | 'enterprise'
export type CustomerStatus = 'active' | 'trial' | 'paused'

export type ThemeMode = 'sunrise' | 'midnight'
export type DensityMode = 'comfortable' | 'compact'

export interface KpiMetric {
  id: string
  label: string
  value: number
  delta: number
  trend: Trend
}

export interface RevenuePoint {
  timestamp: string
  revenue: number
  cost: number
}

export interface Customer {
  id: string
  name: string
  email: string
  tier: CustomerTier
  status: CustomerStatus
  joinedAt: string
  ltv: number
}

export interface SettingsNotifications {
  email: boolean
  push: boolean
  weeklyDigest: boolean
}

export interface SettingsModel {
  theme: ThemeMode
  density: DensityMode
  locale: string
  notifications: SettingsNotifications
}

export interface CustomerQueryParams {
  q?: string
  status?: CustomerStatus | 'all'
  tier?: CustomerTier | 'all'
  page?: number
  pageSize?: number
}
