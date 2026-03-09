import { useRef, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'

export function useSecretClick(targetCount = 5, timeoutMs = 600) {
  const navigate = useNavigate()
  const countRef = useRef(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handleSecretClick = useCallback(() => {
    countRef.current += 1

    if (countRef.current >= targetCount) {
      countRef.current = 0
      navigate({ to: '/admin' })
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      countRef.current = 0
    }, timeoutMs)
  }, [navigate, targetCount, timeoutMs])

  return handleSecretClick
}
