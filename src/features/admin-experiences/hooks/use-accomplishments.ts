import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteAccomplishment,
  fetchAccomplishments,
  reorderAccomplishments,
  updateAccomplishment,
  uploadAccomplishment,
} from '@/features/admin/api'
import type { Accomplishment } from '@/features/admin/types'

export function accomplishmentsQueryKey(experienceId: string) {
  return ['admin', 'experiences', experienceId, 'accomplishments'] as const
}

/**
 * @param experienceId - pass null to keep the query idle (e.g. dialog closed).
 */
export function useAccomplishments(experienceId: string | null) {
  const query = useQuery({
    queryKey: accomplishmentsQueryKey(experienceId ?? 'none'),
    queryFn: () => fetchAccomplishments(experienceId as string),
    enabled: Boolean(experienceId),
  })

  return {
    accomplishments: query.data ?? ([] as Accomplishment[]),
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}

export function useAccomplishmentMutations(experienceId: string | null) {
  const queryClient = useQueryClient()

  const invalidate = () => {
    if (!experienceId) return
    void queryClient.invalidateQueries({
      queryKey: accomplishmentsQueryKey(experienceId),
    })
    // The public about page embeds these images alongside each experience.
    void queryClient.invalidateQueries({ queryKey: ['portfolio', 'experiences'] })
  }

  const uploadMutation = useMutation({
    mutationFn: ({ file, caption }: { file: File; caption?: string }) =>
      uploadAccomplishment(experienceId as string, file, caption),
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: { caption?: string | null; orderIndex?: number }
    }) => updateAccomplishment(experienceId as string, id, data),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAccomplishment(experienceId as string, id),
    onSuccess: invalidate,
  })

  const reorderMutation = useMutation({
    mutationFn: (updates: Array<{ id: string; orderIndex: number }>) =>
      reorderAccomplishments(experienceId as string, updates),
    onSuccess: invalidate,
  })

  return { uploadMutation, updateMutation, deleteMutation, reorderMutation }
}
