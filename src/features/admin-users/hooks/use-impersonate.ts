import { useMutation } from '@tanstack/react-query'
import { authClient } from '@/features/auth/lib/auth-client'
import { useRouter } from '@tanstack/react-router'
import { useAdminSession } from '@/features/admin-auth'

export function useImpersonate() {
  const router = useRouter()
  const { refetch } = useAdminSession()

  const impersonateMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await authClient.admin.impersonateUser({
        userId,
      })

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: async () => {
      await refetch()
      router.invalidate()
    },
  })

  const stopImpersonationMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.admin.stopImpersonating()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    onSuccess: async () => {
      await refetch()
      router.invalidate()
    },
  })

  return {
    impersonate: (userId: string) => impersonateMutation.mutate(userId),
    stopImpersonating: () => stopImpersonationMutation.mutate(),
    isImpersonating: impersonateMutation.isPending,
    isStopping: stopImpersonationMutation.isPending,
    error: impersonateMutation.error?.message ?? stopImpersonationMutation.error?.message ?? null,
  }
}
