import { motion } from "framer-motion";
import { startTransition, useEffect, useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { LogOut, FolderOpen, Mail, Briefcase, MailOpen, ArrowRight, ChevronRight } from "lucide-react";
import { fetchProjects, fetchMessages, fetchExperiences } from "../api.ts";
import type { Project, Message, Experience } from "../types.ts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { signOut } from "@/features/auth/lib/auth-client";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 20 } },
};

type StatCardProps = {
  label: string;
  value: number;
  icon: React.ElementType;
  accent: string;
  iconBg: string;
  description: string;
};

function StatCard({ label, value, icon: Icon, accent, iconBg, description }: StatCardProps) {
  return (
    <motion.div variants={item} whileHover={{ y: -4 }} className="col-span-12 sm:col-span-6 lg:col-span-3">
      <Card className="h-full bg-background/60 backdrop-blur-md border-border/60 ring-0">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
            <span className={cn("flex size-8 items-center justify-center rounded-lg", iconBg)}>
              <Icon className={cn("size-4", accent)} />
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-4xl font-bold tracking-tighter text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects().then(setProjects);
    fetchMessages().then(setMessages);
    fetchExperiences().then(setExperiences);
  }, []);

  async function handleLogout() {
    await signOut();
    startTransition(() => {
      void navigate({ to: "/admin/login" as never });
    });
  }

  const unread = messages.filter((m) => !m.isRead);
  const recentMessages = [...messages]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats: StatCardProps[] = [
    { label: "Projects", value: projects.length, icon: FolderOpen, accent: "text-blue-500", iconBg: "bg-blue-500/10", description: "Portfolio items published" },
    { label: "Experiences", value: experiences.length, icon: Briefcase, accent: "text-violet-500", iconBg: "bg-violet-500/10", description: "Resume entries" },
    { label: "Unread", value: unread.length, icon: Mail, accent: "text-amber-500", iconBg: "bg-amber-500/10", description: "Messages awaiting reply" },
    { label: "Total Messages", value: messages.length, icon: MailOpen, accent: "text-emerald-500", iconBg: "bg-emerald-500/10", description: "All contact submissions" },
  ];

  const quickActions = [
    { label: "Manage Projects", icon: FolderOpen, to: "/admin/projects", accent: "text-blue-500" },
    { label: "View Messages", icon: Mail, to: "/admin/messages", accent: "text-amber-500" },
    { label: "Edit Experiences", icon: Briefcase, to: "/admin/experiences", accent: "text-violet-500" },
  ] as const;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={item} className="mb-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Welcome back</p>
          <h1 className="mt-1 text-4xl font-bold tracking-tighter text-foreground">Admin Dashboard</h1>
        </div>
        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleLogout()}
            className="gap-2 border-border/60 bg-background/60 backdrop-blur-md hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40"
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Row */}
      <div className="mb-6 grid grid-cols-12 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Recent Messages */}
        <motion.div variants={item} className="col-span-12 lg:col-span-8">
          <Card className="h-full bg-background/60 backdrop-blur-md border-border/60 ring-0">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold tracking-tight text-foreground">Recent Messages</CardTitle>
                  <CardDescription className="mt-0.5 text-xs">Latest contact form submissions</CardDescription>
                </div>
                <Link
                  to="/admin/messages"
                  className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  View all <ArrowRight className="size-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {recentMessages.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-muted-foreground">No messages yet.</p>
              ) : (
                <ul className="divide-y divide-border/40">
                  {recentMessages.map((msg, i) => (
                    <motion.li
                      key={msg.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      className="flex items-start gap-4 px-4 py-3.5 transition-colors hover:bg-muted/30"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/60 text-xs font-bold uppercase text-foreground">
                        {msg.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{msg.name}</span>
                          {!msg.isRead && (
                            <Badge className="h-4 rounded-full px-1.5 text-[10px] bg-amber-500/15 text-amber-500 border-amber-500/20">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{msg.body}</p>
                      </div>
                      <span className="shrink-0 text-[10px] text-muted-foreground/60">
                        {new Date(msg.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-4">
          {/* Quick Actions */}
          <motion.div variants={item}>
            <Card className="bg-background/60 backdrop-blur-md border-border/60 ring-0">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="text-base font-semibold tracking-tight text-foreground">Quick Actions</CardTitle>
                <CardDescription className="text-xs">Jump to a section</CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                {quickActions.map(({ label, icon: Icon, to, accent }) => (
                  <motion.div key={label} whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to={to as never}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
                    >
                      <Icon className={cn("size-4", accent)} />
                      {label}
                      <ChevronRight className="ml-auto size-3.5 text-muted-foreground/50" />
                    </Link>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Unread alert */}
          {unread.length > 0 && (
            <motion.div variants={item} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
              <Link to="/admin/messages" className="block">
                <Card className="border-amber-500/20 bg-amber-500/5 ring-0 backdrop-blur-md">
                  <CardContent className="flex items-center gap-4 py-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                      <Mail className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {unread.length} unread message{unread.length !== 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">Tap to review inbox</p>
                    </div>
                    <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground/60" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
