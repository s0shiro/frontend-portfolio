import { useQuery } from '@tanstack/react-query'
import {
  fetchProjectCollection,
  readProjectCollection,
} from '../api/get-projects'

export function usePublicProjects() {
  return useQuery({
    queryKey: ['portfolio', 'projects', 'published'],
    queryFn: ({ signal }) => fetchProjectCollection(signal),
    initialData: readProjectCollection,
    initialDataUpdatedAt: 0,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}
