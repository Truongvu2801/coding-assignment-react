import useTickets from '../../hooks/useTickets'
import styles from './tickets.module.scss'
import { Status, statusOptions } from '../../contants'
import Loading from '../../components/Loading'
import Select from '../../components/Select'
import Textarea from '../../components/Textarea'
import Button from '../../components/Button'
import TicketItem from '../../components/TicketItem'

const TicketList = () => {
  const {
    data: tickets,
    isLoading,
    error,
    setStatus,
    filtered,
    status,
    createTicketMutation,
    setTicket,
    ticket
  } = useTickets()

  if (error)
    return <div className={styles['error']}>Error: {error.message}</div>
  if (!tickets) return null

  return (
    <div className={styles['listWrap']}>
      {isLoading && <Loading />}
      <h2>Tickets</h2>
      <div className={styles['filter-controls']}>
        <Select
          options={statusOptions}
          value={status}
          onChange={value => setStatus(value as Status)}
        />
      </div>
      <div className={styles['add-controls']}>
        <Textarea
          value={ticket}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setTicket(e.target.value)
          }
          placeholder="Add Ticket"
        />
        <Button
          variant="primary"
          onClick={() => createTicketMutation.mutate({ ticket })}
          disabled={ticket === '' || createTicketMutation.isPending}
        >
          {createTicketMutation.isPending ? 'Adding...' : 'Add Ticket'}
        </Button>
      </div>
      <ul className={styles['ticketList']}>
        {filtered.map(ticket => (
          <TicketItem key={ticket.id} ticket={ticket} />
        ))}
      </ul>
    </div>
  )
}

export default TicketList
