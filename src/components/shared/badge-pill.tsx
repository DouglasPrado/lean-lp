import { cn } from "@/lib/utils"

interface BadgePillProps {
  children: React.ReactNode
  variant?: "default" | "primary" | "outline"
  className?: string
}

export function BadgePill({ children, variant = "default", className }: BadgePillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
        variant === "default" && "bg-muted text-muted-foreground",
        variant === "primary" && "bg-primary/10 text-primary",
        variant === "outline" && "border-border text-muted-foreground border",
        className,
      )}
    >
      {children}
    </span>
  )
}
