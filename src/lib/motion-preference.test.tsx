import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useMotionPreference } from './motion-preference'

let reducedMotion = false
let mediaEvents: EventTarget

beforeEach(() => {
  localStorage.clear()
  reducedMotion = false
  mediaEvents = new EventTarget()
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      get matches() {
        return reducedMotion
      },
      addEventListener: mediaEvents.addEventListener.bind(mediaEvents),
      removeEventListener: mediaEvents.removeEventListener.bind(mediaEvents),
    })),
  )
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('portfolio motion preferences', () => {
  it('persists a pause and shares it with other mounted consumers', () => {
    const first = renderHook(useMotionPreference)
    const second = renderHook(useMotionPreference)
    expect(first.result.current.enabled).toBe(true)

    act(() => first.result.current.toggleMotion())

    expect(localStorage.getItem('portfolio-motion')).toBe('off')
    expect(first.result.current.enabled).toBe(false)
    expect(second.result.current.enabled).toBe(false)
    first.unmount()
    expect(renderHook(useMotionPreference).result.current.enabled).toBe(false)
  })

  it('responds to system changes and gives reduced motion priority over a saved preference', () => {
    localStorage.setItem('portfolio-motion', 'on')
    const { result } = renderHook(useMotionPreference)

    act(() => {
      reducedMotion = true
      mediaEvents.dispatchEvent(new Event('change'))
    })
    expect(result.current.enabled).toBe(false)
    expect(result.current.reducedMotion).toBe(true)

    act(() => {
      reducedMotion = false
      mediaEvents.dispatchEvent(new Event('change'))
    })
    expect(result.current.enabled).toBe(true)
  })

  it('responds to a preference saved in another tab', () => {
    const { result } = renderHook(useMotionPreference)
    act(() => {
      localStorage.setItem('portfolio-motion', 'off')
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'portfolio-motion',
          newValue: 'off',
        }),
      )
    })
    expect(result.current.enabled).toBe(false)
  })

  it('still pauses animations when browser storage is blocked', () => {
    const { result } = renderHook(useMotionPreference)
    const storage = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('Storage blocked')
      })
    act(() => result.current.toggleMotion())
    expect(result.current.enabled).toBe(false)
    storage.mockRestore()
    act(() => result.current.toggleMotion())
    expect(result.current.enabled).toBe(true)
  })
})
