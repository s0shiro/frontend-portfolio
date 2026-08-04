import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Users, UserCheck, UserX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoadingState,
  AdminPageHeader,
  AdminStatus,
} from '@/features/admin/components/admin-page'
import { cn } from '@/lib/utils'
import { useAdminSession } from '@/features/admin-auth'
import type { AppRole } from '@/features/admin-auth'
import { useAdminUsers } from '../hooks/use-admin-users'
import { useBanState } from '../hooks/use-ban-state'
import { useImpersonate } from '../hooks/use-impersonate'
import { BanUserDialog } from './ban-user-dialog'
import type { AdminUser } from '../types'

const roleOptions: AppRole[] = ['admin', 'editor']

export function AdminUsersView() {
  const { users, isLoading, isPending, error, changeRole } = useAdminUsers()
  const { impersonate, isImpersonating } = useImpersonate()
  const { banUser, unbanUser, isBanning, isUnbanning } = useBanState()
  const { data: sessionData } = useAdminSession()

  const [banningUser, setBanningUser] = useState<AdminUser | null>(null)

  const handleBanConfirm = (reason: string) => {
    if (!banningUser) return
    banUser(
      { userId: banningUser.id, banReason: reason },
      { onSuccess: () => setBanningUser(null) },
    )
  }

  const currentUserId = sessionData?.user?.id

  return (
    <div className="space-y-12">
      <AdminPageHeader
        eyebrow="Users"
        title="Access control"
        description="Set roles, impersonate an account to see what they see, or revoke access."
      />

      {error ? <AdminErrorState description={error} /> : null}

      {isLoading ? (
        <AdminLoadingState description="Loading users..." />
      ) : users.length === 0 ? (
        <AdminEmptyState
          icon={Users}
          title="No users found"
          description="Accounts with portfolio access will appear here."
        />
      ) : (
        <div className="border-t border-border/60">
          {users.map((user, index) => {
            const isCurrentUser = currentUserId === user.id

            return (
              <motion.article
                key={user.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="grid gap-x-6 gap-y-4 border-b border-border/60 py-6 lg:grid-cols-[1fr_auto]"
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h2 className="font-display text-base font-semibold tracking-tight text-foreground">
                      {user.name}
                    </h2>
                    {user.banned ? (
                      <AdminStatus label="Banned" tone="danger" />
                    ) : (
                      <AdminStatus label="Active" tone="active" />
                    )}
                    {isCurrentUser ? (
                      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                        You
                      </span>
                    ) : null}
                  </div>

                  <p className="truncate font-mono text-xs text-muted-foreground">
                    {user.email}
                  </p>

                  {user.banned && user.banReason ? (
                    <p className="text-xs text-destructive/90">Reason: {user.banReason}</p>
                  ) : null}

                  {/* Role switch reads as a segmented set of labels, not buttons-as-badges */}
                  <div className="flex items-center gap-3 pt-1">
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                      Role
                    </span>
                    {roleOptions.map((roleOption) => (
                      <button
                        key={roleOption}
                        type="button"
                        disabled={isPending || user.role === roleOption}
                        onClick={() => changeRole(user.id, roleOption)}
                        className={cn(
                          'font-mono text-[0.6875rem] uppercase tracking-[0.14em] underline-offset-4 transition-colors disabled:cursor-default',
                          user.role === roleOption
                            ? 'text-foreground underline'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {roleOption}
                      </button>
                    ))}
                  </div>
                </div>

                {!isCurrentUser ? (
                  <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isImpersonating}
                      onClick={() => impersonate(user.id)}
                    >
                      <Play className="size-4" />
                      Impersonate
                    </Button>

                    {user.banned ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isUnbanning}
                        onClick={() => unbanUser(user.id)}
                      >
                        <UserCheck className="size-4" />
                        Unban
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setBanningUser(user)}
                      >
                        <UserX className="size-4" />
                        Ban
                      </Button>
                    )}
                  </div>
                ) : null}
              </motion.article>
            )
          })}
        </div>
      )}

      <BanUserDialog
        isOpen={banningUser !== null}
        onClose={() => setBanningUser(null)}
        onConfirm={handleBanConfirm}
        userName={banningUser?.name ?? ''}
        isBanning={isBanning}
      />
    </div>
  )
}
