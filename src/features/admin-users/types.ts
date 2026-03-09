import type { AppRole } from '@/features/admin-auth'

export type AdminUser = {
  id: string
  name: string
  email: string
  role: AppRole
  image?: string | null
  banned?: boolean | null
  banReason?: string | null
}

export type UpdateUserRoleInput = {
  id: string
  role: AppRole
}