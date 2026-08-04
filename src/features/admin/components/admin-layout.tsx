import { startTransition, useState } from "react";
import { Link, Outlet, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2, LogOut, Menu, Play, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";
import { useAdminSession } from "@/features/admin-auth";
import { useAdminMessages } from "@/features/admin-messages/hooks/use-admin-messages";
import { useImpersonate } from "@/features/admin-users/hooks/use-impersonate";
import { signOut } from "@/features/auth/lib/auth-client";

const adminNavItems = [
  { path: "/admin", label: "Overview", exact: true },
  { path: "/admin/projects", label: "Projects" },
  { path: "/admin/experiences", label: "Experiences" },
  { path: "/admin/messages", label: "Messages" },
  { path: "/admin/users", label: "Users" },
  { path: "/admin/apikeys", label: "API keys" },
] as const;

type AdminNavProps = {
  unreadCount: number;
  onNavigate?: () => void;
};

function AdminNav({ unreadCount, onNavigate }: AdminNavProps) {
  const matchRoute = useMatchRoute();

  return (
    <nav className="border-t border-border/60">
      {adminNavItems.map((item, index) => {
        const isExact = "exact" in item ? item.exact : false;
        const isActive = isExact
          ? matchRoute({ to: item.path, fuzzy: false })
          : matchRoute({ to: item.path });
        const badge = item.path === "/admin/messages" && unreadCount > 0 ? unreadCount : null;

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={cn(
              "group flex items-baseline gap-3 border-b border-border/60 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors md:px-6",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "tabular-nums transition-colors",
                isActive ? "text-muted-foreground" : "text-border group-hover:text-muted-foreground",
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex-1">{item.label}</span>

            {badge ? (
              <span className="tabular-nums text-violet-600 dark:text-violet-400">
                {badge}
              </span>
            ) : null}

            {isActive ? (
              <motion.span
                layoutId="admin-nav-active"
                className="size-1.5 rounded-full bg-violet-500"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

type AdminAccountFooterProps = {
  userName?: string | null;
  userEmail?: string | null;
  onNavigate?: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
};

function AdminAccountFooter({
  userName,
  userEmail,
  onNavigate,
  onLogout,
  isLoggingOut,
}: AdminAccountFooterProps) {
  return (
    <div className="space-y-4 px-5 pb-8 pt-8 md:px-6">
      <div className="space-y-0.5">
        <p className="truncate font-display text-sm font-semibold tracking-tight text-foreground">
          {userName || "Admin"}
        </p>
        {userEmail ? (
          <p className="truncate font-mono text-[0.6875rem] text-muted-foreground">
            {userEmail}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
        >
          {isLoggingOut ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <LogOut className="size-3.5" />
          )}
          {isLoggingOut ? "Signing out" : "Sign out"}
        </button>

        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to portfolio
        </Link>
      </div>

      <ThemeToggle />
    </div>
  );
}

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: sessionData } = useAdminSession();
  const { stopImpersonating, isStopping } = useImpersonate();
  // Shares a cache entry with the messages page, so this costs no extra request.
  const { messages } = useAdminMessages();

  const unreadCount = messages.filter((message) => !message.isRead).length;

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await signOut();
    },
    onSuccess: () => {
      queryClient.clear();
      startTransition(() => {
        void navigate({ to: "/admin/login" as never });
      });
    },
  });

  const isImpersonating = !!sessionData?.session?.impersonatedBy;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {isImpersonating && (
        <div className="sticky top-0 z-100 flex items-center justify-between gap-3 border-b border-violet-500/30 bg-violet-500/10 px-4 py-2">
          <p className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-violet-700 dark:text-violet-300">
            <Play className="size-3.5" />
            Impersonating {sessionData?.user?.name}
          </p>
          <button
            type="button"
            onClick={() => stopImpersonating()}
            disabled={isStopping}
            className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-violet-700 underline underline-offset-4 transition-opacity hover:opacity-70 disabled:opacity-50 dark:text-violet-300"
          >
            {isStopping ? "Stopping" : "Stop"}
          </button>
        </div>
      )}

      <div className="flex flex-1">
        {/* Desktop rail */}
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-border/60 md:flex">
          <div className="px-6 pb-6 pt-8">
            <p className="eyebrow">Console</p>
            <p className="pt-1 font-display text-lg font-semibold tracking-tight text-foreground">
              Portfolio
            </p>
          </div>

          <AdminNav unreadCount={unreadCount} />

          <div className="mt-auto">
            <AdminAccountFooter
              userName={sessionData?.user?.name}
              userEmail={sessionData?.user?.email}
              onLogout={() => logoutMutation.mutate()}
              isLoggingOut={logoutMutation.isPending}
            />
          </div>
        </aside>

        {/* Mobile header */}
        <div className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border/60 bg-background/90 px-4 backdrop-blur-md md:hidden">
          <div>
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
              Console
            </p>
            <p className="font-display text-sm font-semibold tracking-tight">Portfolio</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-9"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-30 bg-background/60 md:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", stiffness: 320, damping: 34 }}
                className="fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col overflow-y-auto border-r border-border/60 bg-background pt-14 md:hidden"
              >
                <AdminNav
                  unreadCount={unreadCount}
                  onNavigate={() => setMobileOpen(false)}
                />
                <div className="mt-auto">
                  <AdminAccountFooter
                    userName={sessionData?.user?.name}
                    userEmail={sessionData?.user?.email}
                    onNavigate={() => setMobileOpen(false)}
                    onLogout={() => logoutMutation.mutate()}
                    isLoggingOut={logoutMutation.isPending}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="min-w-0 flex-1 pt-14 md:pt-0">
          <div className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-14">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
