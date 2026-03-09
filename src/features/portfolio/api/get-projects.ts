export type ApiProject = {
  id: string
  title: string
  description: string
  link: string | null
  imageUrl: string | null
  tags: string[]
  orderIndex: number
}

export async function fetchPublicProjects(): Promise<ApiProject[]> {
  const res = await fetch('/api/portfolio/projects')
  if (!res.ok) throw new Error('Failed to fetch projects')
  const json = await res.json() as { success: boolean; data: ApiProject[] }
  return json.data
}
