import { useQuery } from '@tanstack/react-query'
import { fetchProjects } from '@/features/admin/api'

export function useAdminProjects() {
  const projectsQuery = useQuery({
    queryKey: ['admin', 'projects'],
    queryFn: fetchProjects,
  })

  return {
    projects: projectsQuery.data ?? [],
    isLoading: projectsQuery.isLoading,
  }
}