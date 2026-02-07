import type { ComponentType } from 'react'

type LazyModule = Promise<{ Component: ComponentType }>

type RouteModuleLoaders = {
  overview: () => LazyModule
  analytics: () => LazyModule
  customers: () => LazyModule
  settings: () => LazyModule
  notFound: () => LazyModule
}

const routeModuleLoaders: RouteModuleLoaders = {
  overview: async () => {
    const module = await import('@/pages/OverviewPage')
    return { Component: module.OverviewPage }
  },
  analytics: async () => {
    const module = await import('@/pages/AnalyticsPage')
    return { Component: module.AnalyticsPage }
  },
  customers: async () => {
    const module = await import('@/pages/CustomersPage')
    return { Component: module.CustomersPage }
  },
  settings: async () => {
    const module = await import('@/pages/SettingsPage')
    return { Component: module.SettingsPage }
  },
  notFound: async () => {
    const module = await import('@/pages/NotFoundPage')
    return { Component: module.NotFoundPage }
  },
}

export const routeLazy = {
  overview: routeModuleLoaders.overview,
  analytics: routeModuleLoaders.analytics,
  customers: routeModuleLoaders.customers,
  settings: routeModuleLoaders.settings,
  notFound: routeModuleLoaders.notFound,
}

const routePrefetchersByPath: Record<string, () => Promise<void>> = {
  '/overview': async () => {
    await routeModuleLoaders.overview()
  },
  '/analytics': async () => {
    await routeModuleLoaders.analytics()
  },
  '/customers': async () => {
    await routeModuleLoaders.customers()
  },
  '/settings': async () => {
    await routeModuleLoaders.settings()
  },
}

export const prefetchRouteModule = (path: string): void => {
  const prefetch = routePrefetchersByPath[path]
  if (!prefetch) {
    return
  }

  void prefetch()
}
