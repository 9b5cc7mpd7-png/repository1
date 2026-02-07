const shouldEnableMocks = (): boolean => {
  if (!import.meta.env.DEV) {
    return false
  }

  return import.meta.env.VITE_ENABLE_API_MOCKS !== 'false'
}

export const initializeMockApi = async (): Promise<void> => {
  if (!shouldEnableMocks()) {
    return
  }

  const { worker } = await import('@/mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })
}
