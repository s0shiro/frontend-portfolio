import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, UserX, UserCheck, Play } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAdminUsers } from '../hooks/use-admin-users'
import { useImpersonate } from '../hooks/use-impersonate'
import { useBanState } from '../hooks/use-ban-state'
import { BanUserDialog } from './ban-user-dialog'
import { useAdminSession } from '@/features/admin-auth'
import type { AppRole } from '@/features/admin-auth'
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
      {
        onSuccess: () => setBanningUser(null),
      },
    )
  }

  const currentUserId = sessionData?.user?.id

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Users</p>
        <h1 className="text-4xl font-bold tracking-tighter">Manage access levels</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Promote or restrict access to portfolio administration based on editor and admin roles.
        </p>
      </section>

      {error ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="border-border/60 bg-background/70 backdrop-blur-md">
                <CardContent className="py-8 text-sm text-muted-foreground">Loading users...</CardContent>
              </Card>
            ))
          : users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
              >
                <Card className="border-border/60 bg-background/70 backdrop-blur-md">
                  <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2 text-xl tracking-tight">
                        <Users className="size-4" />
                        {user.name}
                        {user.banned && (
                          <Badge variant="destructive" className="ml-2 uppercase text-[10px]">
                            Banned
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                      {user.banned && user.banReason && (
                        <p className="text-xs text-destructive/80">Reason: {user.banReason}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-fit uppercase">
                        <Shield className="size-3 mr-1" />
                        {user.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3 items-center">
                    {roleOptions.map((roleOption) => (
                      <Button
                        key={roleOption}
                        type="button"
                        variant={user.role === roleOption ? 'default' : 'outline'}
                        disabled={isPending}
                        onClick={() => changeRole(user.id, roleOption)}
                      >
                        Set as {roleOption}
                      </Button>
                    ))}
                    
                    <div className="flex-1" />

                    {currentUserId !== user.id && (
                      <>
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={isImpersonating}
                          onClick={() => impersonate(user.id)}
                        >
                          <Play className="size-4 mr-2" />
                          Impersonate
                        </Button>

                        {user.banned ? (
                          <Button
                            type="button"
                            variant="outline"
                            className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                            disabled={isUnbanning}
                            onClick={() => unbanUser(user.id)}
                          >
                            <UserCheck className="size-4 mr-2" />
                            Unban
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setBanningUser(user)}
                          >
                            <UserX className="size-4 mr-2" />
                            Ban
                          </Button>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>

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