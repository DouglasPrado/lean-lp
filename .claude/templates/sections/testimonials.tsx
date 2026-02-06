"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { SectionHeader } from "@/components/shared/section-header"
import { AnimatedSection } from "@/components/shared/animated-section"

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
    <AnimatedSection id="testimonials" className="py-20 md:py-32">
      <SectionHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="flex flex-col items-center gap-10">
        {/* Quote container */}
        <div className="relative px-8">
          <span className="absolute -left-2 -top-6 text-7xl font-serif text-foreground/[0.06] select-none pointer-events-none">
            &ldquo;
          </span>
          <p
            className={cn(
              "text-2xl md:text-3xl font-light text-foreground text-center max-w-lg leading-relaxed transition-all duration-400 ease-out",
              isAnimating
                ? "opacity-0 blur-sm scale-[0.98]"
                : "opacity-100 blur-0 scale-100"
            )}
          >
            {t(`${displayedKey}.quote`)}
          </p>
          <span className="absolute -right-2 -bottom-8 text-7xl font-serif text-foreground/[0.06] select-none pointer-events-none">
            &rdquo;
          </span>
        </div>

        <div className="flex flex-col items-center gap-6 mt-2">
          {/* Role text */}
          <p
            className={cn(
              "text-xs text-muted-foreground tracking-[0.2em] uppercase transition-all duration-500 ease-out",
              isAnimating
                ? "opacity-0 translate-y-2"
                : "opacity-100 translate-y-0"
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
                    "relative flex items-center gap-0 rounded-full cursor-pointer",
                    "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    isActive
                      ? "bg-foreground shadow-lg"
                      : "bg-transparent hover:bg-muted/80",
                    showName ? "pr-4 pl-2 py-2" : "p-0.5"
                  )}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.avatar}
                      alt={t(`${item.key}.author`)}
                      className={cn(
                        "w-8 h-8 rounded-full object-cover",
                        "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                        isActive ? "ring-2 ring-background/30" : "ring-0",
                        !isActive && "hover:scale-105"
                      )}
                    />
                  </div>

                  {/* Name reveal */}
                  <div
                    className={cn(
                      "grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                      showName
                        ? "grid-cols-[1fr] opacity-100 ml-2"
                        : "grid-cols-[0fr] opacity-0 ml-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <span
                        className={cn(
                          "text-sm font-medium whitespace-nowrap block",
                          "transition-colors duration-300",
                          isActive ? "text-background" : "text-foreground"
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
