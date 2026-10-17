import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'portfolio-motion'
const CHANGE_EVENT = 'portfolio-motion-change'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
let transientPreference: boolean | undefined

function subscribe(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener('change', callback)
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    query.removeEventListener('change', callback)
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

function getSnapshot() {
  if (window.matchMedia(REDUCED_MOTION).matches) return false
  if (transientPreference !== undefined) return transientPreference
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'off'
  } catch {
    return true
  }
}

export function useMotionPreference() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, () => false)
  const reducedMotion = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true,
  )

  function toggleMotion() {
    try {
      window.localStorage.setItem(STORAGE_KEY, enabled ? 'off' : 'on')
      transientPreference = undefined
    } catch {
      transientPreference = !enabled
    }
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }

  return { enabled, reducedMotion, toggleMotion }
}
