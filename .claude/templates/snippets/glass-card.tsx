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
        "bg-background/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6 md:p-8",
        hover && "transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  )
}
