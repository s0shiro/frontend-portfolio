import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createExperience, updateExperience, deleteExperience } from '@/features/admin/api'
import type { CreateExperienceInput, UpdateExperienceInput } from '@/features/admin/api'

export function useExperienceMutations() {
  const queryClient = useQueryClient()

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admin', 'experiences'] })

  const createMutation = useMutation({
    mutationFn: (data: CreateExperienceInput) => createExperience(data),
    onSuccess: () => void invalidate(),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExperienceInput }) =>
      updateExperience(id, data),
    onSuccess: () => void invalidate(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteExperience(id),
    onSuccess: () => void invalidate(),
  })

  return { createMutation, updateMutation, deleteMutation }
}
