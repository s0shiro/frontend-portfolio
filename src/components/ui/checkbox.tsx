import * as React from "react"

import { cn } from "@/lib/utils"

function Checkbox({ className, ...props }: Omit<React.ComponentProps<"input">, "type">) {
  return (
    <input
      type="checkbox"
      role="checkbox"
      className={cn(
        "size-4 shrink-0 rounded border border-primary/30 bg-background accent-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { Checkbox }
