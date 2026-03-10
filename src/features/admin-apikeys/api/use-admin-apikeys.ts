import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authClient } from '@/features/auth/lib/auth-client'

export const apiKeysKeys = {
  all: ['admin-apikeys'] as const,
  lists: () => [...apiKeysKeys.all, 'list'] as const,
}

export function useApiKeys() {
  return useQuery({
    queryKey: apiKeysKeys.lists(),
    queryFn: async () => {
      const { data, error } = await authClient.apiKey.list()
      if (error) {
        throw new Error(error.message || 'Failed to fetch API keys')
      }
      return data?.apiKeys || []
    },
  })
}

export function useCreateApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: { name: string; expiresIn?: number }) => {
      const { data, error } = await authClient.apiKey.create({
        name: params.name,
        expiresIn: params.expiresIn,
      })
      if (error) {
        throw new Error(error.message || 'Failed to create API key')
      }
      return data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: apiKeysKeys.lists() })
    },
  })
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (keyId: string) => {
      const { error } = await authClient.apiKey.delete({ keyId })
      if (error) {
        throw new Error(error.message || 'Failed to delete API key')
      }
      return true
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: apiKeysKeys.lists() })
    },
  })
}
