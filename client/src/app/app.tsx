import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TicketList from './tickets/tickets'
import TicketDetail from './ticket-details/ticket-details'

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<TicketList />} />
        <Route path="/detail/:id" element={<TicketDetail />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
