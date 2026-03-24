"use client"

import { cn } from "@/lib/utils"

export interface BentoItem {
  title: string
  description: string
  icon: React.ReactNode
  status?: string
  tags?: string[]
  meta?: string
  cta?: string
  ctaHref?: string
  colSpan?: number
  hasPersistentHover?: boolean
}

interface BentoGridProps {
  items: BentoItem[]
}

function BentoGrid({ items }: BentoGridProps) {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 md:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "group relative overflow-hidden rounded-xl p-4 transition-all duration-300",
            "border border-border/80 bg-card",
            "hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)]",
            "hover:-translate-y-0.5 will-change-transform",
            item.colSpan === 2 ? "md:col-span-2" : "col-span-1",
            {
              "shadow-[0_2px_12px_rgba(0,0,0,0.03)] -translate-y-0.5":
                item.hasPersistentHover,
              "dark:shadow-[0_2px_12px_rgba(255,255,255,0.03)]":
                item.hasPersistentHover,
            }
          )}
        >
          <div
            className={`absolute inset-0 ${
              item.hasPersistentHover
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            } transition-opacity duration-300`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:4px_4px] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
          </div>

          <div className="relative flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted transition-all duration-300 group-hover:bg-gradient-to-br">
                {item.icon}
              </div>
              <span
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-medium backdrop-blur-sm",
                  "bg-muted text-muted-foreground",
                  "transition-colors duration-300 group-hover:bg-muted/80"
                )}
              >
                {item.status || "Active"}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-[15px] font-medium tracking-tight text-foreground">
                {item.title}
                {item.meta && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    {item.meta}
                  </span>
                )}
              </h3>
              <p className="text-sm font-[425] leading-snug text-muted-foreground">
                {item.description}
              </p>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {item.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-muted px-2 py-1 backdrop-blur-sm transition-all duration-200 hover:bg-muted/80"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              {item.ctaHref ? (
                <a
                  href={item.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary"
                >
                  {item.cta || "Explore →"}
                </a>
              ) : (
                <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  {item.cta || "Explore →"}
                </span>
              )}
            </div>
          </div>

          <div
            className={`absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-transparent via-border/50 to-transparent p-px ${
              item.hasPersistentHover
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            } transition-opacity duration-300`}
          />
        </div>
      ))}
    </div>
  )
}

export { BentoGrid }
