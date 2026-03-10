import { Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  Briefcase,
  Mail,
  Users,
  Key,
  ArrowLeft,
  Menu,
  X,
  Play,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";
import { useAdminSession } from "@/features/admin-auth";
import { useImpersonate } from "@/features/admin-users/hooks/use-impersonate";

const adminNavItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/admin/projects", label: "Projects", icon: FolderOpen },
  { path: "/admin/experiences", label: "Experiences", icon: Briefcase },
  { path: "/admin/messages", label: "Messages", icon: Mail },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/apikeys", label: "API Keys", icon: Key },
] as const;

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const matchRoute = useMatchRoute();
  const { data: sessionData } = useAdminSession();
  const { stopImpersonating, isStopping } = useImpersonate();

  const isImpersonating = !!sessionData?.session?.impersonatedBy;

  const handleStopImpersonating = () => {
    stopImpersonating();
  };

  return (
    <div className="flex min-h-screen bg-background flex-col">
      {isImpersonating && (
        <div className="sticky top-0 z-[100] flex items-center justify-between bg-emerald-500 px-4 py-2 text-emerald-50 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Play className="size-4" />
            <span>
              Impersonating user:{" "}
              <strong className="font-bold">{sessionData?.user?.name}</strong>
            </span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="h-7 text-xs"
            onClick={handleStopImpersonating}
            disabled={isStopping}
          >
            {isStopping ? "Stopping..." : "Stop Impersonating"}
          </Button>
        </div>
      )}

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-border/40 bg-background/70 backdrop-blur-md md:flex">
          <div className="flex h-14 items-center gap-2 border-b border-border/40 px-5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
              <LayoutDashboard className="size-3.5 text-primary" />
            </div>
            <span className="text-sm font-bold tracking-tight text-foreground">
              Admin Panel
            </span>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {adminNavItems.map((item, i) => {
            const isExact = 'exact' in item ? item.exact : false
            const isActive = isExact
                ? matchRoute({ to: item.path, fuzzy: false })
                : matchRoute({ to: item.path });

              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                >
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <div className="space-y-3 border-t border-border/40 p-4">
            <ThemeToggle />
            <Link
              to="/"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back to Portfolio
            </Link>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border/40 bg-background/80 px-4 backdrop-blur-md md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
              <LayoutDashboard className="size-3.5 text-primary" />
            </div>
            <span className="text-sm font-bold tracking-tight">Admin</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-9"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -240 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -240 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-40 w-[240px] border-r border-border/40 bg-background/95 pt-14 backdrop-blur-xl md:hidden"
          >
            <nav className="space-y-1 p-3">
              {adminNavItems.map((item) => {
              const isExact = 'exact' in item ? item.exact : false
              const isActive = isExact
                  ? matchRoute({ to: item.path, fuzzy: false })
                  : matchRoute({ to: item.path });

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <Separator className="mx-3" />

            <div className="space-y-3 p-4">
              <ThemeToggle />
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                Back to Portfolio
              </Link>
            </div>
          </motion.div>
        )}

        {/* Backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1 pt-14 md:pt-0">
          <div className="p-6 md:p-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
