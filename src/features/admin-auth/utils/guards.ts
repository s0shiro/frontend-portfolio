import type { AppRole, AuthClientSession, GuardResult, SessionState } from '../types'

export function getGuardResult(session: SessionState | null | undefined): GuardResult {
  if (!session?.user) {
    return {
      isAuthenticated: false,
      role: null,
    }
  }

  return {
    isAuthenticated: true,
    role: session.user.role,
  }
}

export function hasRequiredRole(role: AppRole | null, allowedRoles: AppRole[]): boolean {
  if (!role) {
    return false
  }

  return allowedRoles.includes(role)
}

export function getSessionRole(session: AuthClientSession): AppRole | null {
  const role = session?.user?.role

  if (role === 'admin' || role === 'editor') {
    return role
  }

  return null
}

export function toSessionState(session: AuthClientSession): SessionState | null {
  const role = getSessionRole(session)

  if (!session?.user?.id || !session.user.name || !session.user.email || !role) {
    return null
  }

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role,
      image: session.user.image ?? null,
      banned: session.user.banned ?? null,
      banReason: session.user.banReason ?? null,
    },
    session: {
      impersonatedBy: session.session?.impersonatedBy ?? null,
    },
  }
}