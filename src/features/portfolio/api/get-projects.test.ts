import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/env', () => ({
  clientEnv: { VITE_API_URL: 'https://api.example.test' },
}))

import {
  fetchProjectCollection,
  PROJECT_SNAPSHOT_KEY,
  readProjectCollection,
} from './get-projects'

const project = {
  id: 'api-project',
  title: 'Operations dashboard',
  description: 'A published project.',
  link: 'https://example.com/project',
  imageUrl: null,
  tags: ['TypeScript'],
  orderIndex: 0,
}
const liveResponse = (data: unknown) =>
  new Response(JSON.stringify({ success: true, data }), {
    headers: { 'Content-Type': 'application/json' },
  })

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('fetch', vi.fn())
})
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('published project availability', () => {
  it('shows the résumé-backed collection for a first visit when the API is unavailable', async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError('Failed to fetch'))
    const result = await fetchProjectCollection()
    expect(result.source).toBe('bundled')
    expect(result.projects.map((item) => item.title)).toEqual([
      'Crop Production Monitoring System',
      'Marinduque Vehicle Rental System',
    ])
    expect(
      result.projects.every((item) => item.caseStudy?.repositories.length),
    ).toBe(true)
  })

  it('keeps the last valid collection available across reloads and API failures', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(liveResponse([project]))
    expect((await fetchProjectCollection()).source).toBe('live')
    expect(readProjectCollection().projects).toEqual([project])
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('Network unavailable'))
    expect(await fetchProjectCollection()).toEqual({
      projects: [project],
      source: 'saved',
    })
  })

  it('honors an explicitly empty publication and does not resurrect removed projects', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(liveResponse([project]))
      .mockResolvedValueOnce(liveResponse([]))
      .mockRejectedValueOnce(new TypeError('Network unavailable'))
    await fetchProjectCollection()
    expect((await fetchProjectCollection()).projects).toEqual([])
    expect((await fetchProjectCollection()).projects).toEqual([])
  })

  it('preserves the good snapshot when a response is malformed or has an unsafe link', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(liveResponse([project]))
      .mockResolvedValueOnce(
        liveResponse([{ ...project, link: 'javascript:alert(1)' }]),
      )
    await fetchProjectCollection()
    expect(await fetchProjectCollection()).toEqual({
      projects: [project],
      source: 'saved',
    })
  })

  it('ignores corrupted and invalid saved collections', () => {
    localStorage.setItem(PROJECT_SNAPSHOT_KEY, '{broken')
    expect(readProjectCollection().source).toBe('bundled')
    localStorage.setItem(
      PROJECT_SNAPSHOT_KEY,
      JSON.stringify({ savedAt: 'invalid', projects: [project] }),
    )
    expect(readProjectCollection().source).toBe('bundled')
  })

  it('keeps working when browser storage is blocked', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Blocked')
    })
    vi.mocked(fetch)
      .mockResolvedValueOnce(liveResponse([project]))
      .mockRejectedValueOnce(new TypeError('Network unavailable'))
    expect((await fetchProjectCollection()).projects).toEqual([project])
    expect((await fetchProjectCollection()).source).toBe('bundled')
  })

  it('does not turn an aborted request into a fallback update', async () => {
    const controller = new AbortController()
    const error = new DOMException('Cancelled', 'AbortError')
    controller.abort()
    vi.mocked(fetch).mockRejectedValueOnce(error)
    await expect(fetchProjectCollection(controller.signal)).rejects.toBe(error)
  })

  it('attaches curated case studies even when the API uses a different project id', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      liveResponse([
        { ...project, title: 'Crop Production Monitoring System' },
      ]),
    )
    const result = await fetchProjectCollection()
    expect(result.projects[0].id).toBe('api-project')
    expect(result.projects[0].imageUrl).toBe(null)
    expect(result.projects[0].caseStudy?.slug).toBe(
      'crop-production-monitoring-system',
    )
  })

  it('falls back when a request stalls instead of waiting indefinitely', async () => {
    vi.useFakeTimers()
    vi.mocked(fetch).mockImplementation(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener(
            'abort',
            () => reject(new DOMException('Timed out', 'AbortError')),
            { once: true },
          )
        }),
    )
    const request = fetchProjectCollection()
    await vi.advanceTimersByTimeAsync(8000)
    expect((await request).source).toBe('bundled')
  })
})
