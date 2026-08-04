import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAdminProjects } from "@/features/admin-projects/hooks/use-admin-projects";
import { useAdminMessages } from "@/features/admin-messages/hooks/use-admin-messages";
import { useAdminExperiences } from "@/features/admin-experiences/hooks/use-admin-experiences";
import { AdminPageHeader, AdminSectionHeading, AdminStatus } from "./admin-page";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

type LedgerEntry = {
  label: string;
  value: number;
  to: string;
  emphasis?: boolean;
};

/**
 * The state of the record, read as one line of figures. Deliberately not four
 * cards: these numbers belong together, and comparing them is the whole point.
 */
function Ledger({ entries }: { entries: LedgerEntry[] }) {
  return (
    // gap-px over a border-coloured background draws the hairlines, which keeps
    // the rules correct at every breakpoint without per-cell border juggling.
    <dl className="grid grid-cols-2 gap-px border-y border-border/60 bg-border/60 lg:grid-cols-4">
      {entries.map((entry) => (
        <Link
          key={entry.label}
          to={entry.to as never}
          className="group bg-background px-4 py-6 transition-colors hover:bg-muted/30"
        >
          <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
            {entry.label}
          </dt>
          <dd
            className={cn(
              "pt-2 font-display text-4xl font-semibold tabular-nums tracking-tight lg:text-5xl",
              entry.emphasis && entry.value > 0
                ? "text-violet-600 dark:text-violet-400"
                : "text-foreground",
            )}
          >
            {String(entry.value).padStart(2, "0")}
          </dd>
        </Link>
      ))}
    </dl>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function AdminDashboard() {
  const { projects } = useAdminProjects();
  const { messages } = useAdminMessages();
  const { experiences } = useAdminExperiences();

  const unread = messages.filter((message) => !message.isRead);
  const recentMessages = [...messages]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const ledger: LedgerEntry[] = [
    { label: "Projects", value: projects.length, to: "/admin/projects" },
    { label: "Experiences", value: experiences.length, to: "/admin/experiences" },
    { label: "Unread", value: unread.length, to: "/admin/messages", emphasis: true },
    { label: "Messages", value: messages.length, to: "/admin/messages" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-14">
      <motion.div variants={item}>
        <AdminPageHeader
          eyebrow="Overview"
          title="The record, at a glance"
          description="What is published, what is waiting, and what needs a reply."
        />
      </motion.div>

      <motion.section variants={item}>
        <Ledger entries={ledger} />
      </motion.section>

      <motion.section variants={item}>
        <AdminSectionHeading index="01" label="Needs attention" />
        {unread.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">
            Nothing waiting. The inbox is clear.
          </p>
        ) : (
          <Link
            to="/admin/messages"
            className="group flex items-baseline gap-4 border-b border-border/60 py-4 transition-colors hover:bg-muted/30"
          >
            <span className="font-display text-2xl font-semibold tabular-nums text-violet-600 dark:text-violet-400">
              {String(unread.length).padStart(2, "0")}
            </span>
            <span className="flex-1 text-sm text-foreground">
              unread message{unread.length === 1 ? "" : "s"} awaiting a reply
            </span>
            <ArrowRight className="size-4 shrink-0 self-center text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </motion.section>

      <motion.section variants={item}>
        <AdminSectionHeading
          index="02"
          label="Recent messages"
          action={
            <Link
              to="/admin/messages"
              className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
            >
              View all
            </Link>
          }
        />

        {recentMessages.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          <ul className="border-t border-border/60">
            {recentMessages.map((message) => (
              <li key={message.id} className="border-b border-border/60">
                <Link
                  to="/admin/messages"
                  className="grid gap-x-4 gap-y-1 py-3.5 transition-colors hover:bg-muted/30 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline"
                >
                  <span className="truncate text-sm font-medium text-foreground">
                    {message.name}
                  </span>
                  <span className="truncate text-sm text-muted-foreground">
                    {message.body}
                  </span>
                  <span className="flex items-center justify-between gap-3 sm:justify-end">
                    {message.isRead ? null : <AdminStatus label="New" tone="attention" />}
                    <span className="font-mono text-[0.6875rem] tabular-nums whitespace-nowrap text-muted-foreground">
                      {formatDate(message.createdAt)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </motion.section>
    </motion.div>
  );
}
