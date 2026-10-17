import { clientEnv } from '@/lib/env'
import { z } from 'zod'
import { enrichProject, publishedProjects } from '../project-catalog'
import type { PublishedProject } from '../types'

export type ApiProject = PublishedProject

const webUrl = z
  .url()
  .refine((value) => ['http:', 'https:'].includes(new URL(value).protocol))
const projectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  link: webUrl.nullable().default(null),
  imageUrl: z
    .string()
    .refine(
      (value) =>
        (value.startsWith('/') && !value.startsWith('//')) ||
        webUrl.safeParse(value).success,
    )
    .nullable()
    .default(null),
  tags: z.array(z.string()).default([]),
  orderIndex: z.number().int().default(0),
})
const responseSchema = z.object({
  success: z.literal(true),
  data: z.array(projectSchema),
})
const snapshotSchema = z.object({
  savedAt: z.number(),
  projects: z.array(projectSchema),
})

export const PROJECT_SNAPSHOT_KEY = `portfolio-projects:v1:${clientEnv.VITE_API_URL}`

export type ProjectCollection = {
  projects: ApiProject[]
  source: 'live' | 'saved' | 'bundled'
}

function readSavedProjects(): ApiProject[] | null {
  try {
    const stored = window.localStorage.getItem(PROJECT_SNAPSHOT_KEY)
    if (!stored) return null
    const result = snapshotSchema.safeParse(JSON.parse(stored))
    if (!result.success) return null
    return result.data.projects.map(enrichProject)
  } catch {
    return null
  }
}

export function readProjectCollection(): ProjectCollection {
  const saved = readSavedProjects()
  return saved !== null
    ? { projects: saved, source: 'saved' }
    : { projects: publishedProjects, source: 'bundled' }
}

export async function fetchPublicProjects(
  signal?: AbortSignal,
): Promise<ApiProject[]> {
  const controller = new AbortController()
  const cancel = () => controller.abort(signal?.reason)
  const timeout = window.setTimeout(() => controller.abort(), 8000)
  signal?.addEventListener('abort', cancel, { once: true })
  if (signal?.aborted) cancel()
  try {
    const res = await fetch(
      `${clientEnv.VITE_API_URL}/api/portfolio/projects`,
      { signal: controller.signal },
    )
    if (!res.ok) throw new Error('Failed to fetch projects')
    const json = responseSchema.parse(await res.json())
    return json.data.map(enrichProject)
  } finally {
    window.clearTimeout(timeout)
    signal?.removeEventListener('abort', cancel)
  }
}

export async function fetchProjectCollection(
  signal?: AbortSignal,
): Promise<ProjectCollection> {
  try {
    const projects = await fetchPublicProjects(signal)
    try {
      window.localStorage.setItem(
        PROJECT_SNAPSHOT_KEY,
        JSON.stringify({ savedAt: Date.now(), projects }),
      )
    } catch {
      // The live result still works when storage is unavailable or full.
    }
    return { projects, source: 'live' }
  } catch (error) {
    if (signal?.aborted) throw error
    return readProjectCollection()
  }
}
