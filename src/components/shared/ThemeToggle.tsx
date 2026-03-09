import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

function ThemeOption({
  icon: Icon,
  value,
  isActive,
  onClick,
}: {
  icon: LucideIcon
  value: string
  isActive?: boolean
  onClick: (value: string) => void
}) {
  return (
    <button
      className={cn(
        "relative flex h-8 w-10 items-center justify-center rounded-full transition-colors",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
      onClick={() => onClick(value)}
    >
      <Icon className="relative z-10 size-4" />

      {isActive && (
        <motion.div
          layoutId="theme-active"
          className="absolute inset-0 rounded-full border border-border bg-background shadow-sm"
          transition={{
            type: "spring",
            bounce: 0.2,
            duration: 0.6,
          }}
        />
      )}
    </button>
  )
}

const THEME_OPTIONS = [
  { icon: Monitor, value: "system" },
  { icon: Sun, value: "light" },
  { icon: Moon, value: "dark" },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  if (!mounted) {
    return <div className="h-10 w-[120px] rounded-full bg-muted/20" />
  }

  return (
    <div className="flex w-fit items-center justify-center rounded-full border border-border/60 bg-muted/20 p-1 backdrop-blur-sm mx-auto">
      <div className="flex items-center gap-1">
        {THEME_OPTIONS.map((option) => (
          <ThemeOption
            key={option.value}
            icon={option.icon}
            value={option.value}
            isActive={theme === option.value}
            onClick={setTheme}
          />
        ))}
      </div>
    </div>
  )
}
