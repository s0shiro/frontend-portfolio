import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProject, updateProject, deleteProject } from '@/features/admin/api'
import type { CreateProjectInput, UpdateProjectInput } from '@/features/admin/api'

export function useProjectMutations() {
  const queryClient = useQueryClient()

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })

  const createMutation = useMutation({
    mutationFn: (data: CreateProjectInput) => createProject(data),
    onSuccess: () => void invalidate(),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectInput }) =>
      updateProject(id, data),
    onSuccess: () => void invalidate(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => void invalidate(),
  })

  return { createMutation, updateMutation, deleteMutation }
}
