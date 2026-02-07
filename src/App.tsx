import { RouterProvider } from 'react-router-dom'

import { AppErrorBoundary } from '@/app/ErrorBoundary'
import { AppProviders } from '@/app/providers'
import { router } from '@/app/router'
import { LoadingState } from '@/components/common/LoadingState'

const App = () => {
  return (
    <AppErrorBoundary>
      <AppProviders>
        <RouterProvider
          router={router}
          fallbackElement={<LoadingState message="Starting dashboard..." />}
        />
      </AppProviders>
    </AppErrorBoundary>
  )
}

export default App
