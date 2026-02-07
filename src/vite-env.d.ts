/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_APP_ENV?: string
  readonly VITE_ENABLE_API_MOCKS?: string
  readonly VITE_RELEASE?: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_SENTRY_TRACES_SAMPLE_RATE?: string
  readonly VITE_WEB_VITALS_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
