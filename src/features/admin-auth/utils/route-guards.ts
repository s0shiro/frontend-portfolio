import { redirect } from '@tanstack/react-router'
import { authClient } from '@/features/auth/lib/auth-client'
import type { AppRole, AuthClientSession } from '../types'
import { getSessionRole, hasRequiredRole } from './guards'

async function getSessionSafe(): Promise<AuthClientSession> {
  try {
    const session = await authClient.getSession()
    return session.data ?? null
  } catch {
    return null
  }
}

export async function requireAuthenticatedSession(): Promise<AuthClientSession> {
  const session = await getSessionSafe()

  if (!session?.user) {
    throw redirect({ to: '/admin/login' as never })
  }

  return session
}

export async function redirectIfAuthenticated(): Promise<void> {
  const session = await getSessionSafe()

  if (session?.user) {
    throw redirect({ to: '/admin' as never })
  }
}

export async function requireSessionRoles(allowedRoles: AppRole[]): Promise<void> {
  const session = await requireAuthenticatedSession()
  const role = getSessionRole(session)

  if (!hasRequiredRole(role, allowedRoles)) {
    throw redirect({ to: '/admin' as never })
  }
}
