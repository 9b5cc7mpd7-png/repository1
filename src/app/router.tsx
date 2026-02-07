import type { RouteObject } from 'react-router-dom'
import { Navigate, createBrowserRouter } from 'react-router-dom'

import { RouteErrorBoundary } from '@/app/RouteErrorBoundary'
import { routeLazy } from '@/app/routeModules'
import { AppLayout } from '@/components/layout/AppLayout'

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/overview" replace />,
      },
      {
        path: 'overview',
        lazy: routeLazy.overview,
      },
      {
        path: 'analytics',
        lazy: routeLazy.analytics,
      },
      {
        path: 'customers',
        lazy: routeLazy.customers,
      },
      {
        path: 'settings',
        lazy: routeLazy.settings,
      },
      {
        path: '*',
        lazy: routeLazy.notFound,
      },
    ],
  },
]

export const router = createBrowserRouter(appRoutes)
