import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAdminUsers, updateAdminUserRole } from '../api'
import type { AppRole } from '@/features/admin-auth'
import type { AdminUser } from '../types'

export function useAdminUsers() {
  const queryClient = useQueryClient()
  const usersQuery = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: fetchAdminUsers,
  })

  const roleMutation = useMutation({
    mutationFn: updateAdminUserRole,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(
        ['admin', 'users'],
        (currentUsers: AdminUser[] | undefined) => {
          if (!currentUsers) {
            return [updatedUser]
          }

          return currentUsers.map((user) => (user.id === updatedUser.id ? { ...user, ...updatedUser } : user))
        },
      )
    }
  })

  function changeRole(id: string, role: AppRole) {
    roleMutation.mutate({ id, role })
  }

  return {
    users: usersQuery.data ?? [],
    isLoading: usersQuery.isLoading,
    isPending: roleMutation.isPending,
    error: usersQuery.error?.message ?? roleMutation.error?.message ?? null,
    changeRole,
  }
}