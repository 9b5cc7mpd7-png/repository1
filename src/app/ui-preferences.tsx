import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { UI_DENSITY_KEY, UI_SIDEBAR_COLLAPSED_KEY, UI_THEME_KEY } from '@/lib/storageKeys'
import { readBooleanStorage, readLocalStorage, writeLocalStorage } from '@/lib/storage'
import type { DensityMode, ThemeMode } from '@/types/domain'

interface UiPreferencesContextValue {
  theme: ThemeMode
  density: DensityMode
  sidebarCollapsed: boolean
  setTheme: (theme: ThemeMode) => void
  setDensity: (density: DensityMode) => void
  setSidebarCollapsed: (isCollapsed: boolean) => void
  toggleSidebar: () => void
}

const UiPreferencesContext = createContext<UiPreferencesContextValue | undefined>(
  undefined,
)

const isThemeMode = (value: string | null): value is ThemeMode => {
  return value === 'sunrise' || value === 'midnight'
}

const isDensityMode = (value: string | null): value is DensityMode => {
  return value === 'comfortable' || value === 'compact'
}

const getInitialTheme = (): ThemeMode => {
  const stored = readLocalStorage(UI_THEME_KEY)
  return isThemeMode(stored) ? stored : 'sunrise'
}

const getInitialDensity = (): DensityMode => {
  const stored = readLocalStorage(UI_DENSITY_KEY)
  return isDensityMode(stored) ? stored : 'comfortable'
}

export const UiPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme())
  const [density, setDensity] = useState<DensityMode>(() => getInitialDensity())
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() =>
    readBooleanStorage(UI_SIDEBAR_COLLAPSED_KEY),
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    writeLocalStorage(UI_THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.dataset.density = density
    writeLocalStorage(UI_DENSITY_KEY, density)
  }, [density])

  useEffect(() => {
    writeLocalStorage(UI_SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed))
  }, [sidebarCollapsed])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((current) => !current)
  }, [])

  const value = useMemo(
    () => ({
      theme,
      density,
      sidebarCollapsed,
      setTheme,
      setDensity,
      setSidebarCollapsed,
      toggleSidebar,
    }),
    [density, sidebarCollapsed, theme, toggleSidebar],
  )

  return (
    <UiPreferencesContext.Provider value={value}>
      {children}
    </UiPreferencesContext.Provider>
  )
}

export const useUiPreferences = (): UiPreferencesContextValue => {
  const context = useContext(UiPreferencesContext)
  if (!context) {
    throw new Error('useUiPreferences must be used within UiPreferencesProvider')
  }
  return context
}
