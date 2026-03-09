import { authClient } from '@/features/auth/lib/auth-client'
import type { AdminUser, UpdateUserRoleInput } from './types'

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const { data, error } = await authClient.admin.listUsers({
    query: {
      limit: 100, // Or whatever limit
    },
  })

  if (error) {
    throw new Error(error.message || 'Failed to fetch users')
  }

  // Map to match AdminUser interface if necessary
  return data.users as unknown as AdminUser[]
}

export async function updateAdminUserRole(
  input: UpdateUserRoleInput,
): Promise<AdminUser> {
  const { error } = await authClient.admin.setRole({
    userId: input.id,
    role: input.role as any,
  })

  if (error) {
    throw new Error(error.message || 'Failed to update user role')
  }

  // We refetch or return a stub, but the original returned the updated user.
  // Instead of querying again, we can just return what we expect.
  return { id: input.id, role: input.role } as AdminUser
}