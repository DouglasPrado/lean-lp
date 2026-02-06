"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function AnimatedSection({ children, className, id }: AnimatedSectionProps) {
  return (
    <section id={id} className={cn("py-20 md:py-32", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}
