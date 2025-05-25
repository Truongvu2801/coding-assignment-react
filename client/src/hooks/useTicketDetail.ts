import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiBase } from '../api/client'
import { Ticket } from '../types/ticket'

export function useTicketDetail(id?: string) {
  const queryClient = useQueryClient()

  // Get ticket details
  const {
    data: ticket,
    isLoading,
    error,
    refetch
  } = useQuery<Ticket, Error>({
    queryKey: ['ticket', id],
    queryFn: () => apiBase<Ticket>(`/tickets/${id}`),
    enabled: !!id
  })

  // Assign user to ticket
  const assignUser = useMutation({
    mutationFn: (userId: string) =>
      apiBase<void>(`/tickets/${id}/assign/${userId}`, {
        method: 'PUT'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    }
  })

  // Mark ticket as complete
  const completeTicket = useMutation({
    mutationFn: () =>
      apiBase<void>(`/tickets/${id}/complete`, {
        method: 'PUT'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    }
  })

  // Mark ticket as incomplete
  const incompleteTicket = useMutation({
    mutationFn: () =>
      apiBase<void>(`/tickets/${id}/complete`, {
        method: 'DELETE'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    }
  })

  const handleAssign = async (assigneeId: string) => {
    try {
      await assignUser.mutateAsync(assigneeId)
    } catch (error) {
      console.error('Error assigning ticket:', error)
    }
  }

  const handleToggleComplete = async () => {
    try {
      if (ticket?.completed) {
        await incompleteTicket.mutateAsync()
      } else {
        await completeTicket.mutateAsync()
      }
    } catch (error) {
      console.error('Error toggling ticket status:', error)
    }
  }

  return {
    ticket,
    isLoading,
    error,
    refetch,
    handleAssign,
    handleToggleComplete,
    assignUser,
    completeTicket,
    incompleteTicket,
    assignUserLoading: assignUser.isPending,
    completeTicketLoading: completeTicket.isPending,
    incompleteTicketLoading: incompleteTicket.isPending
  }
}
