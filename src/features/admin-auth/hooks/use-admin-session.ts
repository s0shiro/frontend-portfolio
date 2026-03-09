import { useMemo } from 'react'
import { useSession } from '@/features/auth/lib/auth-client'
import { getGuardResult, toSessionState } from '../utils/guards'

export function useAdminSession() {
  const sessionQuery = useSession()

  const guard = useMemo(() => {
    return getGuardResult(toSessionState(sessionQuery.data ?? null))
  }, [sessionQuery.data])

  return {
    ...sessionQuery,
    guard,
  }
}