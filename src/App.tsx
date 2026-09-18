import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthGate } from './auth/AuthGate'
import { TodayScreen } from './features/today/TodayScreen'

const client = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: true },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={client}>
      <AuthGate>
        <TodayScreen />
      </AuthGate>
    </QueryClientProvider>
  )
}
