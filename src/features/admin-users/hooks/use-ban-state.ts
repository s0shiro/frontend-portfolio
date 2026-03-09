import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authClient } from '@/features/auth/lib/auth-client'

export function useBanState() {
  const queryClient = useQueryClient()

  const banMutation = useMutation({
    mutationFn: async ({ userId, banReason }: { userId: string; banReason?: string }) => {
      const { data, error } = await authClient.admin.banUser({
        userId,
        banReason,
      })

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })

  const unbanMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await authClient.admin.unbanUser({
        userId,
      })

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })

  return {
    banUser: banMutation.mutate,
    unbanUser: unbanMutation.mutate,
    isBanning: banMutation.isPending,
    isUnbanning: unbanMutation.isPending,
    error: banMutation.error?.message ?? unbanMutation.error?.message ?? null,
  }
}
