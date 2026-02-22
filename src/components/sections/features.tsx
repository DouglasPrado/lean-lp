"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Plug, Wrench, Zap, CalendarClock, ShieldCheck, Brain } from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const features = [
  { icon: Plug, key: "connections" },
  { icon: Wrench, key: "tools" },
  { icon: Zap, key: "realtime" },
  { icon: CalendarClock, key: "recurring" },
  { icon: ShieldCheck, key: "approval" },
  { icon: Brain, key: "models" },
]

export function Features() {
  const t = useTranslations("features")

  return (
    <section id="features" className="py-20 md:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.key}
              variants={fadeUp}
              whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" as const } }}
              className="group rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-[border-color] duration-300 hover:border-primary/30"
            >
              <motion.div
                className="inline-block mb-3"
                whileHover={{ scale: 1.2, rotate: 12 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 12 }}
              >
                <feature.icon className="h-5 w-5 text-primary" />
              </motion.div>
              <h3 className="text-base font-semibold mb-1">{t(`${feature.key}.title`)}</h3>
              <p className="text-sm text-muted-foreground">
                {t(`${feature.key}.description`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
