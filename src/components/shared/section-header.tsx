"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

type SectionHeaderProps = {
  title: string
  subtitle?: string
  className?: string
  align?: "center" | "left"
}

export function SectionHeader({
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUp}
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center",
        className
      )}
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
