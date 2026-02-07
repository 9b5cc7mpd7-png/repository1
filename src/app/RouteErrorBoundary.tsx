import { useEffect } from 'react'
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'

import { logError } from '@/lib/monitoring/logger'

export const RouteErrorBoundary = () => {
  const error = useRouteError()

  useEffect(() => {
    logError(error, {
      source: 'RouteErrorBoundary',
    })
  }, [error])

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong while loading this route.'

  return (
    <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6">
      <div className="rounded-2xl border border-danger/30 bg-danger/10 p-8">
        <h1 className="font-display text-2xl font-semibold">Route error</h1>
        <p className="mt-3 text-sm text-muted">{message}</p>
        <Link
          to="/overview"
          className="mt-5 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-medium text-surface"
        >
          Back to overview
        </Link>
      </div>
    </div>
  )
}
