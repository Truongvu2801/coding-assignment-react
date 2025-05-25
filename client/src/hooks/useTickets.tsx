import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { apiBase } from '../api/client'
import { Status } from '../contants'
import { Ticket } from '../types/ticket'

const useTickets = () => {
  const [status, setStatus] = useState(Status.ALL)
  const [ticket, setTicket] = useState<string>('')
  const queryClient = useQueryClient()

  const { data, isLoading, error, refetch } = useQuery<Ticket[], Error>({
    queryKey: ['tickets'],
    queryFn: () => apiBase<Ticket[]>('/tickets')
  })

  const filterTickets = (tickets: Ticket[], status: string) => {
    if (status === Status.ALL) return tickets
    if (status === Status.COMPLETED) return tickets.filter(t => t.completed)
    if (status === Status.INCOMPLETED) return tickets.filter(t => !t.completed)
    return tickets
  }
  const filtered = filterTickets(data || [], status)

  const createTicketMutation = useMutation({
    mutationFn: async ({ ticket }: { ticket: string }) =>
      apiBase<Ticket>(`/tickets`, {
        method: 'POST',
        body: { description: ticket }
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      setTicket('')
    }
  })

  return {
    data: filtered,
    isLoading,
    error,
    refetch,
    setStatus,
    filtered,
    status,
    createTicketMutation,
    setTicket,
    ticket
  }
}

export default useTickets
