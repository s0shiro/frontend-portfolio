import { useMutation } from '@tanstack/react-query'
import { signIn } from '@/features/auth/lib/auth-client'

export function useAdminSignIn() {
  return useMutation({
    mutationFn: async (credentials: Parameters<typeof signIn.email>[0]) => {
      const result = await signIn.email(credentials)
      if (result.error) {
        throw new Error(result.error.message || 'Failed to sign in')
      }
      return result.data
    },
  })
}
