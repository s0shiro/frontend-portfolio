import { useMutation, useQueryClient } from '@tanstack/react-query'
import { clearProjectImage, setProjectImage } from '@/features/admin/api'

export function useProjectImage(projectId: string | null) {
  const queryClient = useQueryClient()

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
    // The public projects page renders the same cover.
    void queryClient.invalidateQueries({ queryKey: ['portfolio', 'projects'] })
  }

  const uploadMutation = useMutation({
    mutationFn: (file: File) => setProjectImage(projectId as string, file),
    onSuccess: invalidate,
  })

  const clearMutation = useMutation({
    mutationFn: () => clearProjectImage(projectId as string),
    onSuccess: invalidate,
  })

  return { uploadMutation, clearMutation }
}
