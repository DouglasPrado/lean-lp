"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { siteConfig } from "@/config/site"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export function FinalCta() {
  const t = useTranslations("finalCta")

  return (
    <section className="relative py-20 md:py-32 bg-muted/30 overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-0 left-1/3 h-72 w-72 rounded-full bg-primary/5 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" as const }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-primary/5 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" as const }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight"
          >
            {t("title")}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button asChild size="lg" className="gap-2 text-base">
                <a href={siteConfig.links.demo} target="_blank" rel="noopener noreferrer">
                  {t("ctaPrimary")}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button asChild variant="outline" size="lg" className="text-base">
                <a href="#como-funciona">{t("ctaSecondary")}</a>
              </Button>
            </motion.div>
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
