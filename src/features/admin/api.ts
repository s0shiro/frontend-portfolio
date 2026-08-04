import { clientEnv } from '@/lib/env'
import type { Accomplishment, Experience, Message, Project } from './types'

type ApiResponse<T> = {
  success: boolean
  data: T
}

type ApiErrorPayload = {
  error?: string
}

/** Pulls the server's error message out of a failed response, if it sent one. */
async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const payload = (await response.json()) as ApiErrorPayload
    return payload.error ?? fallback
  } catch {
    return fallback
  }
}

type MessageFilters = {
  isRead?: boolean
  search?: string
}

async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const urlString = typeof input === 'string' ? input : input.toString()
  const url = urlString.startsWith('http') ? urlString : `${clientEnv.VITE_API_URL}${urlString}`

  const response = await fetch(url, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, `Request failed: ${response.status}`))
  }

  const payload = (await response.json()) as ApiResponse<T>
  return payload.data
}

/**
 * Multipart sibling of requestJson. Content-Type is deliberately left unset so
 * the browser can append the multipart boundary itself — setting it by hand
 * produces a body the server cannot parse.
 */
async function requestFormData<T>(
  endpoint: string,
  formData: FormData,
  method = 'POST',
): Promise<T> {
  const response = await fetch(`${clientEnv.VITE_API_URL}${endpoint}`, {
    method,
    credentials: 'include',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, `Upload failed: ${response.status}`))
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

// ── Experience accomplishments ──

export function fetchAccomplishments(experienceId: string): Promise<Accomplishment[]> {
  return requestJson<Accomplishment[]>(
    `/api/admin/experiences/${experienceId}/accomplishments`,
  )
}

export function uploadAccomplishment(
  experienceId: string,
  file: File,
  caption?: string,
): Promise<Accomplishment> {
  const formData = new FormData()
  formData.append('image', file)

  if (caption?.trim()) {
    formData.append('caption', caption.trim())
  }

  return requestFormData<Accomplishment>(
    `/api/admin/experiences/${experienceId}/accomplishments`,
    formData,
  )
}

export function updateAccomplishment(
  experienceId: string,
  accomplishmentId: string,
  data: { caption?: string | null; orderIndex?: number },
): Promise<Accomplishment> {
  return requestJson<Accomplishment>(
    `/api/admin/experiences/${experienceId}/accomplishments/${accomplishmentId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  )
}

export function deleteAccomplishment(
  experienceId: string,
  accomplishmentId: string,
): Promise<Accomplishment> {
  return requestJson<Accomplishment>(
    `/api/admin/experiences/${experienceId}/accomplishments/${accomplishmentId}`,
    {
      method: 'DELETE',
    },
  )
}

export function reorderAccomplishments(
  experienceId: string,
  updates: Array<{ id: string; orderIndex: number }>,
): Promise<Accomplishment[]> {
  return requestJson<Accomplishment[]>(
    `/api/admin/experiences/${experienceId}/accomplishments/reorder`,
    {
      method: 'PATCH',
      body: JSON.stringify({ updates }),
    },
  )
}

// ── Project cover image ──

export function setProjectImage(projectId: string, file: File): Promise<Project> {
  const formData = new FormData()
  formData.append('image', file)

  return requestFormData<Project>(`/api/admin/projects/${projectId}/image`, formData, 'PUT')
}

export function clearProjectImage(projectId: string): Promise<Project> {
  return requestJson<Project>(`/api/admin/projects/${projectId}/image`, {
    method: 'DELETE',
  })
}
