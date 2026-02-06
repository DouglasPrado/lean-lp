"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { CtaButtonPair } from "@/components/shared/cta-button-pair"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

export function FinalCta() {
  const t = useTranslations("finalCta")

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="relative rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-border/50 p-12 md:p-20 text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            {t("subtitle")}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10">
            <CtaButtonPair
              primaryText={t("cta.primary")}
              secondaryText={t("cta.secondary")}
              className="justify-center"
            />
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-sm text-muted-foreground"
          >
            {t("microcopy")}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
