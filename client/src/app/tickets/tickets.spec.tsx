import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import Tickets from './tickets'
import * as useTicketsHook from '../../hooks/useTickets'

// Mock the useTickets hook
jest.mock('../../hooks/useTickets')

const mockUseTickets = useTicketsHook.default as jest.Mock

describe('Tickets', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    })

    jest.clearAllMocks()
  })

  it('should render error state', () => {
    const errorMessage = 'Failed to fetch tickets'
    mockUseTickets.mockReturnValue({
      isLoading: false,
      error: new Error(errorMessage),
      data: null
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Tickets />
        </MemoryRouter>
      </QueryClientProvider>
    )

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
  })

  it('should render ticket list', () => {
    const mockTickets = [
      { id: '1', description: 'Ticket 1', completed: false, assigneeId: null },
      { id: '2', description: 'Ticket 2', completed: true, assigneeId: 'user1' }
    ]

    mockUseTickets.mockReturnValue({
      isLoading: false,
      error: null,
      data: mockTickets,
      filtered: mockTickets,
      status: 'all',
      setStatus: jest.fn(),
      ticket: '',
      setTicket: jest.fn(),
      createTicketMutation: { mutate: jest.fn(), isPending: false }
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Tickets />
        </MemoryRouter>
      </QueryClientProvider>
    )

    expect(screen.getByText('Tickets')).toBeInTheDocument()
    expect(screen.getByText('Ticket 1')).toBeInTheDocument()
    expect(screen.getByText('Ticket 2')).toBeInTheDocument()
  })

  it('should handle adding a new ticket', async () => {
    const mutateMock = jest.fn()
    const setTicketMock = jest.fn()

    mockUseTickets.mockReturnValue({
      isLoading: false,
      error: null,
      data: [],
      filtered: [],
      status: 'all',
      setStatus: jest.fn(),
      ticket: 'New ticket',
      setTicket: setTicketMock,
      createTicketMutation: { mutate: mutateMock, isPending: false }
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Tickets />
        </MemoryRouter>
      </QueryClientProvider>
    )

    const addButton = screen.getByText('Add Ticket')
    fireEvent.click(addButton)

    expect(mutateMock).toHaveBeenCalledWith({ ticket: 'New ticket' })
  })

  it('should disable add button when ticket text is empty', () => {
    mockUseTickets.mockReturnValue({
      isLoading: false,
      error: null,
      data: [],
      filtered: [],
      status: 'all',
      setStatus: jest.fn(),
      ticket: '',
      setTicket: jest.fn(),
      createTicketMutation: { mutate: jest.fn(), isPending: false }
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Tickets />
        </MemoryRouter>
      </QueryClientProvider>
    )

    const addButton = screen.getByText('Add Ticket')
    expect(addButton).toBeDisabled()
  })
})
