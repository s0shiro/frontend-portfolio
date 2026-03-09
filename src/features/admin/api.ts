import type { Experience, Message, Project } from './types'

type ApiResponse<T> = {
  success: boolean
  data: T
}

type MessageFilters = {
  isRead?: boolean
  search?: string
}

async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  const payload = (await response.json()) as ApiResponse<T>
  return payload.data
}

export function fetchProjects(): Promise<Project[]> {
  return requestJson<Project[]>('/api/admin/projects')
}

export function fetchExperiences(): Promise<Experience[]> {
  return requestJson<Experience[]>('/api/admin/experiences')
}

export function fetchMessages(filters?: MessageFilters): Promise<Message[]> {
  const params = new URLSearchParams()

  if (filters?.isRead !== undefined) {
    params.set('isRead', String(filters.isRead))
  }

  if (filters?.search) {
    params.set('search', filters.search)
  }

  const queryString = params.toString()
  const endpoint = queryString.length > 0 ? `/api/admin/messages?${queryString}` : '/api/admin/messages'

  return requestJson<Message[]>(endpoint)
}

export function markMessageRead(id: string): Promise<Message> {
  return requestJson<Message>(`/api/admin/messages/${id}/read`, {
    method: 'PATCH',
  })
}

export function markMessageUnread(id: string): Promise<Message> {
  return requestJson<Message>(`/api/admin/messages/${id}/unread`, {
    method: 'PATCH',
  })
}

export function deleteMessage(id: string): Promise<Message> {
  return requestJson<Message>(`/api/admin/messages/${id}`, {
    method: 'DELETE',
  })
}

// ── Project mutations ──

export type CreateProjectInput = {
  title: string
  description: string
  link?: string
  imageUrl?: string
  tags?: string[]
  orderIndex?: number
}

export type UpdateProjectInput = Partial<CreateProjectInput>

export function createProject(data: CreateProjectInput): Promise<Project> {
  return requestJson<Project>('/api/admin/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateProject(id: string, data: UpdateProjectInput): Promise<Project> {
  return requestJson<Project>(`/api/admin/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteProject(id: string): Promise<Project> {
  return requestJson<Project>(`/api/admin/projects/${id}`, {
    method: 'DELETE',
  })
}

// ── Experience mutations ──

export type CreateExperienceInput = {
  company: string
  role: string
  startDate: string
  endDate?: string | null
  description: string
  employmentType?: string
  skills?: string[]
  orderIndex?: number
}

export type UpdateExperienceInput = Partial<CreateExperienceInput>

export function createExperience(data: CreateExperienceInput): Promise<Experience> {
  return requestJson<Experience>('/api/admin/experiences', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateExperience(id: string, data: UpdateExperienceInput): Promise<Experience> {
  return requestJson<Experience>(`/api/admin/experiences/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export function deleteExperience(id: string): Promise<Experience> {
  return requestJson<Experience>(`/api/admin/experiences/${id}`, {
    method: 'DELETE',
  })
}
