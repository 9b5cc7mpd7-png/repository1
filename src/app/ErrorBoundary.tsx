import { Component, type ErrorInfo, type ReactNode } from 'react'

import { logError } from '@/lib/monitoring/logger'

interface ErrorBoundaryState {
  hasError: boolean
}

interface ErrorBoundaryProps {
  children: ReactNode
}

export class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logError(error, {
      source: 'AppErrorBoundary',
      componentStack: info.componentStack,
    })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6">
          <div className="rounded-2xl border border-danger/30 bg-danger/10 p-8 text-center">
            <h1 className="font-display text-2xl font-semibold">Unexpected error</h1>
            <p className="mt-3 text-sm text-muted">
              The app hit an unexpected state. Refresh the page to continue.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
