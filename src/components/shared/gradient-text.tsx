import { cn } from "@/lib/utils"

interface GradientTextProps {
  children: React.ReactNode
  className?: string
}

export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span
      className={cn(
        "from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  )
}
