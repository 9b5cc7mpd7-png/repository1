import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/App'
import { logError } from '@/lib/monitoring/logger'
import { initSentry } from '@/lib/monitoring/sentry'
import { reportWebVitals } from '@/lib/monitoring/webVitals'
import { initializeMockApi } from '@/mocks'

import '@/styles.css'

const bootstrap = async (): Promise<void> => {
  void initSentry().catch((error) => {
    logError(error, { source: 'sentry-init' })
  })

  await initializeMockApi().catch((error) => {
    logError(error, { source: 'mock-api-init' })
  })

  const root = document.getElementById('root')
  if (!root) {
    throw new Error('Root element #root was not found')
  }

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )

  void reportWebVitals()
}

void bootstrap().catch((error) => {
  logError(error, { source: 'startup' })
})
