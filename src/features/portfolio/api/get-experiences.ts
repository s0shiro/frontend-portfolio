import { clientEnv } from '@/lib/env'

export type ApiExperience = {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string | null
  description: string | null
  employmentType?: string | null
  skills?: string[]
  orderIndex: number
}

export async function fetchPublicExperiences(): Promise<ApiExperience[]> {
  const res = await fetch(`${clientEnv.VITE_API_URL}/api/portfolio/experiences`)
  if (!res.ok) return []
  const json = await res.json() as { data: ApiExperience[] }
  return json.data
}
