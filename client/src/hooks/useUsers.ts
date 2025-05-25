import { useQuery } from '@tanstack/react-query'
import { apiBase } from '../api/client'

interface User {
  id: string
  name: string
}

const useUsers = () => {
  const {
    data: users,
    isLoading,
    error
  } = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: () => apiBase<User[]>('/users')
  })

  const getUserName = (userId: string) => {
    if (isLoading || !users) return userId
    const user = users.find(user => user.id === userId)
    return user ? user.name : userId
  }

  return {
    users,
    isLoading,
    error,
    getUserName
  }
}

export default useUsers
