import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import TicketDetail from './ticket-details'
import * as useTicketDetailHook from '../../hooks/useTicketDetail'
import * as useUsersHook from '../../hooks/useUsers'

jest.mock('../../hooks/useTicketDetail')
jest.mock('../../hooks/useUsers')

const mockUseTicketDetail = useTicketDetailHook.useTicketDetail as jest.Mock
const mockUseUsers = useUsersHook.default as jest.Mock

describe('TicketDetail', () => {
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

  const renderWithRouter = (ticketId = '123') => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/detail/${ticketId}`]}>
          <Routes>
            <Route path="/detail/:id" element={<TicketDetail />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('should render error state', () => {
    const errorMessage = 'Failed to fetch ticket details'
    mockUseTicketDetail.mockReturnValue({
      isLoading: false,
      error: new Error(errorMessage),
      ticket: null
    })

    mockUseUsers.mockReturnValue({
      users: [],
      isLoading: false
    })

    renderWithRouter()

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
  })

  it('should render ticket details', () => {
    const mockTicket = {
      id: '123',
      description: 'Test Ticket',
      completed: false,
      assigneeId: 'user1'
    }

    const mockUsers = [
      { id: 'user1', name: 'John Doe' },
      { id: 'user2', name: 'Jane Smith' }
    ]

    mockUseTicketDetail.mockReturnValue({
      isLoading: false,
      error: null,
      ticket: mockTicket,
      handleAssign: jest.fn(),
      handleToggleComplete: jest.fn(),
      assignUserLoading: false,
      completeTicketLoading: false,
      incompleteTicketLoading: false
    })

    mockUseUsers.mockReturnValue({
      users: mockUsers,
      isLoading: false
    })

    renderWithRouter()

    expect(screen.getByText('Ticket Detail')).toBeInTheDocument()
    expect(screen.getByText('Test Ticket')).toBeInTheDocument()
    expect(screen.getByText('incompleted')).toBeInTheDocument()
  })

  it('should handle marking a ticket complete', () => {
    const mockTicket = {
      id: '123',
      description: 'Test Ticket',
      completed: false,
      assigneeId: 'user1'
    }

    const handleToggleCompleteMock = jest.fn()

    mockUseTicketDetail.mockReturnValue({
      isLoading: false,
      error: null,
      ticket: mockTicket,
      handleAssign: jest.fn(),
      handleToggleComplete: handleToggleCompleteMock,
      assignUserLoading: false,
      completeTicketLoading: false,
      incompleteTicketLoading: false
    })

    mockUseUsers.mockReturnValue({
      users: [],
      isLoading: false
    })

    renderWithRouter()

    const completeButton = screen.getByText('Mark Complete')
    fireEvent.click(completeButton)

    expect(handleToggleCompleteMock).toHaveBeenCalled()
  })

  it('should disable action buttons when loading', () => {
    const mockTicket = {
      id: '123',
      description: 'Test Ticket',
      completed: false,
      assigneeId: 'user1'
    }

    mockUseTicketDetail.mockReturnValue({
      isLoading: false,
      error: null,
      ticket: mockTicket,
      handleAssign: jest.fn(),
      handleToggleComplete: jest.fn(),
      assignUserLoading: true,
      completeTicketLoading: false,
      incompleteTicketLoading: false
    })

    mockUseUsers.mockReturnValue({
      users: [],
      isLoading: false
    })

    renderWithRouter()

    const completeButton = screen.getByText('Mark Complete')
    expect(completeButton).toBeDisabled()
  })
})
