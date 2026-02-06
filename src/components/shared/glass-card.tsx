import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-background/50 border-border/50 rounded-2xl border p-6 backdrop-blur-xl md:p-8",
        hover &&
          "hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  )
}
