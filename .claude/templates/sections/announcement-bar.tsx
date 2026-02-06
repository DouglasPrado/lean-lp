"use client"

import * as React from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { X, Sparkles } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

const iconVariants = {
  hidden: { x: 0, y: 0, opacity: 0, rotate: 0 },
  visible: (custom: { x: number; y: number }) => ({
    x: custom.x,
    y: custom.y,
    opacity: 1,
    rotate: 360,
    transition: {
      x: { duration: 0.3, ease: "easeOut" },
      y: { duration: 0.3, ease: "easeOut" },
      opacity: { duration: 0.3 },
      rotate: {
        duration: 1,
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }),
}

export function AnnouncementBar() {
  const t = useTranslations("announcement")
  const [isVisible, setIsVisible] = React.useState(true)
  const [isHovered, setIsHovered] = React.useState(false)

  if (!isVisible) return null

  return (
    <div className="mx-auto flex items-center justify-center py-2">
      <AnimatePresence>
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
        >
          {/* Floating icon — top-left */}
          <motion.div
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
            variants={iconVariants}
            custom={{ x: -10, y: -10 }}
            className="pointer-events-none absolute left-[4px] top-[2px]"
          >
            <Sparkles className="size-4 text-primary" />
          </motion.div>

          {/* Floating icon — bottom-right */}
          <motion.div
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
            variants={iconVariants}
            custom={{ x: 10, y: 10 }}
            className="pointer-events-none absolute bottom-[2px] left-[6rem]"
          >
            <Sparkles className="size-4 text-primary" />
          </motion.div>

          {/* Banner pill */}
          <div
            className={cn(
              "relative flex h-[35px] items-center gap-1 rounded-md border pl-2.5 pr-1 text-sm",
              "border-primary/20 bg-primary/5",
              "dark:border-primary/30 dark:bg-primary/10"
            )}
          >
            <Link
              href={t("link")}
              className={cn(
                "my-[-1px] rounded-sm px-0 py-1 text-[13px] font-medium underline underline-offset-[5px] outline-none",
                "text-foreground decoration-primary/30",
                "hover:text-primary hover:decoration-primary/60",
                "focus-visible:ring-2 focus-visible:ring-primary"
              )}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {t("cta")}
            </Link>

            <span className="text-[0.8125rem] text-primary dark:text-primary/80">
              {t("text")}
            </span>

            <button
              onClick={() => setIsVisible(false)}
              aria-label={t("close")}
              className={cn(
                "m-0 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded border-0 bg-transparent p-0",
                "text-primary hover:bg-primary/10",
                "dark:hover:bg-primary/20"
              )}
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
