export type AppRole = 'admin' | 'editor'

export type SessionUser = {
  id: string
  name: string
  email: string
  role: AppRole
  image?: string | null
  banned?: boolean | null
  banReason?: string | null
}

export type SessionState = {
  user: SessionUser
  session: {
    impersonatedBy?: string | null
  }
}

export type GuardResult = {
  isAuthenticated: boolean
  role: AppRole | null
}

export type AuthClientSession = {
  user?: {
    id?: string
    name?: string
    email?: string
    role?: string | null
    image?: string | null
    banned?: boolean | null
    banReason?: string | null
  }
  session?: {
    impersonatedBy?: string | null
  }
} | null