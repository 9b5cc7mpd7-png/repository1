import { z } from 'zod'

export const trendSchema = z.enum(['up', 'down', 'flat'])
export const revenueRangeSchema = z.enum(['7d', '30d', '90d'])
export const customerTierSchema = z.enum(['starter', 'growth', 'enterprise'])
export const customerStatusSchema = z.enum(['active', 'trial', 'paused'])
export const themeModeSchema = z.enum(['sunrise', 'midnight'])
export const densityModeSchema = z.enum(['comfortable', 'compact'])

export const kpiMetricSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.number(),
  delta: z.number(),
  trend: trendSchema,
})

export const revenuePointSchema = z.object({
  timestamp: z.string(),
  revenue: z.number(),
  cost: z.number(),
})

export const customerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  tier: customerTierSchema,
  status: customerStatusSchema,
  joinedAt: z.string(),
  ltv: z.number(),
})

export const settingsNotificationsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  weeklyDigest: z.boolean(),
})

export const settingsSchema = z.object({
  theme: themeModeSchema,
  density: densityModeSchema,
  locale: z.string(),
  notifications: settingsNotificationsSchema,
})

export const paginatedCustomersSchema = z.object({
  items: z.array(customerSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
})

export const apiEnvelope = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    data: schema,
  })

export const kpiResponseSchema = apiEnvelope(z.array(kpiMetricSchema))
export const revenueResponseSchema = apiEnvelope(z.array(revenuePointSchema))
export const customersResponseSchema = apiEnvelope(paginatedCustomersSchema)
export const settingsResponseSchema = apiEnvelope(settingsSchema)

export const updateSettingsPayloadSchema = z.object({
  theme: themeModeSchema.optional(),
  density: densityModeSchema.optional(),
  locale: z.string().optional(),
  notifications: settingsNotificationsSchema.partial().optional(),
})
