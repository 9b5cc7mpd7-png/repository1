import type { DensityMode, SettingsNotifications, ThemeMode } from '@/types/domain'

export interface UpdateSettingsPayload {
  theme?: ThemeMode
  density?: DensityMode
  locale?: string
  notifications?: Partial<SettingsNotifications>
}
