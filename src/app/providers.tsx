import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

import { createAppQueryClient } from '@/app/queryClient'
import { UiPreferencesProvider } from '@/app/ui-preferences'

interface AppProvidersProps {
  children: ReactNode
  queryClient?: QueryClient
}

export const AppProviders = ({ children, queryClient }: AppProvidersProps) => {
  const [client] = useState<QueryClient>(() => queryClient ?? createAppQueryClient())

  return (
    <QueryClientProvider client={client}>
      <UiPreferencesProvider>{children}</UiPreferencesProvider>
    </QueryClientProvider>
  )
}
