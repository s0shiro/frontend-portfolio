import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, UserX, UserCheck, Play } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminEmptyState, AdminErrorState, AdminLoadingState, AdminPageHeader } from '@/features/admin/components/admin-page'
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
      {
        onSuccess: () => setBanningUser(null),
      },
    )
  }

  const currentUserId = sessionData?.user?.id

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Users"
        title="Manage access levels"
        description="Promote, restrict, impersonate, or ban users based on portfolio administration roles."
      />

      {error ? <AdminErrorState description={error} /> : null}

      {isLoading ? (
        <AdminLoadingState description="Loading users..." />
      ) : users.length === 0 ? (
        <AdminEmptyState icon={Users} title="No users found" description="Users with admin access will appear here." />
      ) : (
        <Card className="border-border/60 bg-background/70 backdrop-blur-md">
          <CardContent className="p-0">
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role actions</TableHead>
                    <TableHead className="text-right">Access actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.04 }}
                      className="border-b transition-colors hover:bg-muted/40 last:border-0"
                    >
                      <TableCell>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                          {user.banned && user.banReason ? (
                            <p className="mt-1 text-xs text-destructive/80">Reason: {user.banReason}</p>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase">
                          <Shield className="size-3 mr-1" />
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.banned ? (
                          <Badge variant="destructive" className="uppercase">Banned</Badge>
                        ) : (
                          <Badge variant="secondary" className="uppercase">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {roleOptions.map((roleOption) => (
                            <Button
                              key={roleOption}
                              type="button"
                              size="sm"
                              variant={user.role === roleOption ? 'default' : 'outline'}
                              disabled={isPending}
                              onClick={() => changeRole(user.id, roleOption)}
                            >
                              {roleOption}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {currentUserId !== user.id ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
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
                                className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
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
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setBanningUser(user)}
                              >
                                <UserX className="size-4" />
                                Ban
                              </Button>
                            )}
                          </div>
                        ) : (
                          <span className="block text-right text-xs text-muted-foreground">Current user</span>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="divide-y divide-border/50 lg:hidden">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className="space-y-4 p-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold tracking-tight text-foreground">{user.name}</p>
                      {user.banned ? <Badge variant="destructive" className="uppercase text-[10px]">Banned</Badge> : null}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.banned && user.banReason ? (
                      <p className="text-xs text-destructive/80">Reason: {user.banReason}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="uppercase">
                      <Shield className="size-3 mr-1" />
                      {user.role}
                    </Badge>
                    {roleOptions.map((roleOption) => (
                      <Button
                        key={roleOption}
                        type="button"
                        size="sm"
                        variant={user.role === roleOption ? 'default' : 'outline'}
                        disabled={isPending}
                        onClick={() => changeRole(user.id, roleOption)}
                      >
                        Set {roleOption}
                      </Button>
                    ))}
                  </div>

                  {currentUserId !== user.id ? (
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" size="sm" variant="secondary" disabled={isImpersonating} onClick={() => impersonate(user.id)}>
                        <Play className="size-4" />
                        Impersonate
                      </Button>
                      {user.banned ? (
                        <Button type="button" size="sm" variant="outline" className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10" disabled={isUnbanning} onClick={() => unbanUser(user.id)}>
                          <UserCheck className="size-4" />
                          Unban
                        </Button>
                      ) : (
                        <Button type="button" size="sm" variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setBanningUser(user)}>
                          <UserX className="size-4" />
                          Ban
                        </Button>
                      )}
                    </div>
                  ) : null}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
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
