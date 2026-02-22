"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { RotateCcw, Focus, ShieldCheck, Plug } from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const benefits = [
  { icon: RotateCcw, key: "item1" },
  { icon: Focus, key: "item2" },
  { icon: ShieldCheck, key: "item3" },
  { icon: Plug, key: "item4" },
]

export function Benefits() {
  const t = useTranslations("benefits")

  return (
    <section id="beneficios" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid gap-6 md:gap-8 sm:grid-cols-2"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.key}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" as const } }}
              className="group rounded-2xl border border-border/50 bg-card/50 p-6 md:p-8 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.15)]"
            >
              <motion.div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20"
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.4, ease: "easeInOut" as const }}
              >
                <benefit.icon className="h-6 w-6 text-primary" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{t(`${benefit.key}.title`)}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(`${benefit.key}.description`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
