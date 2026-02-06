"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Zap, Shield, TrendingUp, Clock } from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const icons = [Zap, Shield, TrendingUp, Clock]

export function Benefits() {
  const t = useTranslations("benefits")

  const items = [
    { icon: icons[0], title: t("item1.title"), description: t("item1.description") },
    { icon: icons[1], title: t("item2.title"), description: t("item2.description") },
    { icon: icons[2], title: t("item3.title"), description: t("item3.description") },
    { icon: icons[3], title: t("item4.title"), description: t("item4.description") },
  ]

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className="text-center p-6"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
