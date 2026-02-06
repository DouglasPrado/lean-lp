"use client"

import { AnimatedSection } from "@/components/shared/animated-section"
import { SectionHeader } from "@/components/shared/section-header"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { useState } from "react"

// Replace avatar URLs with actual customer photos
const testimonialAvatars = [
  "https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=160&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=160&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=160&auto=format&fit=crop",
]

export function Testimonials() {
  const t = useTranslations("testimonials")

  const items = [
    { key: "item1", avatar: testimonialAvatars[0] },
    { key: "item2", avatar: testimonialAvatars[1] },
    { key: "item3", avatar: testimonialAvatars[2] },
  ]

  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayedKey, setDisplayedKey] = useState(items[0].key)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleSelect = (index: number) => {
    if (index === activeIndex || isAnimating) return

    setIsAnimating(true)
    setTimeout(() => {
      setDisplayedKey(items[index].key)
      setActiveIndex(index)
      setTimeout(() => setIsAnimating(false), 400)
    }, 200)
  }

  return (
    <AnimatedSection id="testimonials" className="py-10 md:py-32">
      <SectionHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="flex w-full flex-col items-center gap-10">
        {/* Quote container */}
        <div className="relative px-8">
          <span className="text-foreground/[0.06] pointer-events-none absolute -top-6 -left-2 font-serif text-7xl select-none">
            &ldquo;
          </span>
          <p
            className={cn(
              "text-foreground max-w-7xl text-center text-2xl leading-relaxed font-light transition-all duration-400 ease-out md:text-3xl",
              isAnimating ? "scale-[0.98] opacity-0 blur-sm" : "blur-0 scale-100 opacity-100",
            )}
          >
            {t(`${displayedKey}.quote`)}
          </p>
          <span className="text-foreground/[0.06] pointer-events-none absolute -right-2 -bottom-8 font-serif text-7xl select-none">
            &rdquo;
          </span>
        </div>

        <div className="mt-2 flex flex-col items-center gap-6">
          {/* Role text */}
          <p
            className={cn(
              "text-muted-foreground text-xs tracking-[0.2em] uppercase transition-all duration-500 ease-out",
              isAnimating ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100",
            )}
          >
            {t(`${displayedKey}.role`)}
          </p>

          {/* Avatar selector */}
          <div className="flex items-center justify-center gap-2">
            {items.map((item, index) => {
              const isActive = activeIndex === index
              const isHovered = hoveredIndex === index && !isActive
              const showName = isActive || isHovered

              return (
                <button
                  key={item.key}
                  onClick={() => handleSelect(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={cn(
                    "relative flex cursor-pointer items-center gap-0 rounded-full",
                    "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    isActive ? "bg-primary shadow-lg" : "hover:bg-muted/80 bg-transparent",
                    showName ? "py-2 pr-4 pl-2" : "p-0.5",
                  )}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.avatar}
                      alt={t(`${item.key}.author`)}
                      className={cn(
                        "h-8 w-8 rounded-full object-cover",
                        "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                        isActive ? "ring-background/30 ring-2" : "ring-0",
                        !isActive && "hover:scale-105",
                      )}
                    />
                  </div>

                  {/* Name reveal */}
                  <div
                    className={cn(
                      "grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                      showName
                        ? "ml-2 grid-cols-[1fr] opacity-100"
                        : "ml-0 grid-cols-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <span
                        className={cn(
                          "block text-sm font-medium whitespace-nowrap",
                          "transition-colors duration-300",
                          isActive ? "text-background" : "text-foreground",
                        )}
                      >
                        {t(`${item.key}.author`)}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
