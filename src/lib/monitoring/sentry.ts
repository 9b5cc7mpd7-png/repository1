interface ErrorContext {
  [key: string]: unknown
}

type SentryModule = typeof import('@sentry/react')

let sentryModulePromise: Promise<SentryModule> | undefined

const loadSentry = async (): Promise<SentryModule> => {
  sentryModulePromise ??= import('@sentry/react')
  return sentryModulePromise
}

const parseTracesSampleRate = (): number => {
  const rawRate = import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE
  if (!rawRate) {
    return 0.1
  }

  const parsed = Number(rawRate)
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 1) {
    return 0.1
  }

  return parsed
}

export const isSentryEnabled = (): boolean => {
  return Boolean(import.meta.env.VITE_SENTRY_DSN)
}

export const initSentry = async (): Promise<void> => {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) {
    return
  }

  const Sentry = await loadSentry()
  const release = import.meta.env.VITE_RELEASE

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_APP_ENV ?? 'development',
    tracesSampleRate: parseTracesSampleRate(),
    integrations: [Sentry.browserTracingIntegration()],
    ...(release ? { release } : {}),
  })
}

export const captureSentryException = async (
  error: unknown,
  context: ErrorContext,
): Promise<void> => {
  try {
    const Sentry = await loadSentry()
    Sentry.captureException(error, {
      extra: context,
    })
  } catch {
    console.error('Application error', { error, context })
  }
}
