import { useParams, useNavigate } from 'react-router-dom'
import Loading from '../../components/Loading'
import styles from './ticket-details.module.scss'
import Button from '../../components/Button'
import Select from '../../components/Select'
import { useEffect } from 'react'
import { useTicketDetail } from '../../hooks/useTicketDetail'
import { Status } from '../../contants'
import useUsers from '../../hooks/useUsers'

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    ticket,
    isLoading,
    error,
    handleAssign,
    handleToggleComplete,
    assignUserLoading,
    completeTicketLoading,
    incompleteTicketLoading
  } = useTicketDetail(id!)
  const { users, isLoading: loadingUsers } = useUsers()

  useEffect(() => {
    const navigateBack = () => {
      navigate('/', { replace: true })
    }

    return () => {
      navigateBack()
    }
  }, [navigate])

  if (error)
    return <div className={styles['error']}>Error: {error.message}</div>
  if (!ticket) return null

  return (
    <div className={styles['detailWrap']}>
      <Button variant="secondary" onClick={() => navigate(-1)}>
        Back
      </Button>
      <div className={styles['header']}>
        <h2>Ticket Detail</h2>
        {isLoading || loadingUsers ? <Loading /> : null}
      </div>
      <div className={styles['ticket-info']}>
        <div>
          <label>Description: </label>
          <p>{ticket.description}</p>
        </div>
        <div>
          <label>Status: </label>
          <span
            className={`${styles['status-badge']} ${
              styles[
                'status-badge--' +
                  (ticket.completed ? Status.COMPLETED : Status.INCOMPLETED)
              ]
            }`}
          >
            {ticket.completed ? Status.COMPLETED : Status.INCOMPLETED}
          </span>
        </div>
      </div>
      <div className={styles['form-group']}>
        <label>Assignee to</label>
        <Select
          options={
            users?.map(u => ({ value: u.id as Status, label: u.name })) || []
          }
          value={ticket.assigneeId as Status}
          onChange={handleAssign}
          disabled={assignUserLoading}
          placeholder="Select assignee"
        />
      </div>
      <div className={styles['action-buttons']}>
        <Button
          variant="primary"
          onClick={handleToggleComplete}
          disabled={
            completeTicketLoading ||
            incompleteTicketLoading ||
            assignUserLoading
          }
        >
          {ticket.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </Button>
      </div>
      {completeTicketLoading ||
        incompleteTicketLoading ||
        (assignUserLoading && <Loading />)}
    </div>
  )
}

export default TicketDetail
