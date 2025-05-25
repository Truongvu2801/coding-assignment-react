import { Link } from 'react-router-dom'
import styles from './TicketItem.module.scss'
import { Ticket } from '../../types/ticket'
import { Status } from '../../contants'
import useUsers from '../../hooks/useUsers'

const TicketItem = ({ ticket }: { ticket: Ticket }) => {
  const { getUserName } = useUsers()

  return (
    <li className={styles['ticketItem']}>
      <Link to={`/detail/${ticket.id}`} className={styles['ticketLink']}>
        <div className={styles['ticketContent']}>
          <div className={styles['ticketHeader']}>
            <h3 className={styles['ticketTitle']}>{ticket.description}</h3>
            <span
              className={`${styles['ticketStatus']} ${
                ticket.completed ? styles['completed'] : styles['incomplete']
              }`}
            >
              {ticket.completed ? Status.COMPLETED : Status.INCOMPLETED}
            </span>
          </div>
          <div className={styles['ticketFooter']}>
            <span className={styles['ticketAssignee']}>
              {ticket.assigneeId
                ? `Assigned to: ${getUserName(ticket.assigneeId)}`
                : 'Unassigned'}
            </span>
          </div>
        </div>
      </Link>
    </li>
  )
}

export default TicketItem
