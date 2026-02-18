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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="from-primary/10 via-primary/5 to-background border-border/50 relative rounded-3xl border bg-gradient-to-r p-12 text-center md:p-20"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg md:text-xl"
          >
            {t("subtitle")}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10">
            <CtaButtonPair
              primaryText={t("cta.primary")}
              secondaryText={t("cta.secondary")}
              secondaryHref="https://github.com/DouglasPrado/dify-agent"
              className="justify-center"
            />
          </motion.div>
          <motion.p variants={fadeUp} className="text-muted-foreground mt-4 text-sm">
            {t("microcopy")}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
