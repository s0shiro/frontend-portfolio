import { createAuthClient } from 'better-auth/react'
import { adminClient } from 'better-auth/client/plugins'
import { apiKeyClient } from "@better-auth/api-key/client"
import { clientEnv } from '@/lib/env'

export const authClient = createAuthClient({
  baseURL: clientEnv.VITE_API_URL,
  plugins: [adminClient(), apiKeyClient()],
})

export const { signIn, signUp, signOut, useSession } = authClient
