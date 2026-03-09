import { describe, expect, it } from 'vitest'
import { getSessionRole, hasRequiredRole, toSessionState } from './guards'

describe('admin auth guards', () => {
  it('extracts a valid app role from auth client session', () => {
    const role = getSessionRole({
      user: {
        role: 'admin',
      },
    })

    expect(role).toBe('admin')
  })

  it('returns null for unknown roles', () => {
    const role = getSessionRole({
      user: {
        role: 'viewer',
      },
    })

    expect(role).toBeNull()
  })

  it('maps auth session into strict session state', () => {
    const state = toSessionState({
      user: {
        id: 'user_1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
      },
    })

    expect(state?.user.role).toBe('admin')
    expect(hasRequiredRole(state?.user.role ?? null, ['admin'])).toBe(true)
  })
})
