import { captureSentryException, isSentryEnabled } from '@/lib/monitoring/sentry'

interface ErrorContext {
  [key: string]: unknown
}

export const logError = (error: unknown, context: ErrorContext = {}): void => {
  if (isSentryEnabled()) {
    void captureSentryException(error, context)
    return
  }

  console.error('Application error', { error, context })
}
