import { useQuery } from '@tanstack/react-query'
import { fetchExperiences } from '@/features/admin/api'

export function useAdminExperiences() {
  const experiencesQuery = useQuery({
    queryKey: ['admin', 'experiences'],
    queryFn: fetchExperiences,
  })

  return {
    experiences: experiencesQuery.data ?? [],
    isLoading: experiencesQuery.isLoading,
  }
}