"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { SectionHeader } from "@/components/shared/section-header"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const numberPop = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 15 },
  },
}

const steps = ["step1", "step2", "step3", "step4"]

export function HowItWorks() {
  const t = useTranslations("howItWorks")

  return (
    <section id="como-funciona" className="py-20 md:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step}
              variants={fadeUp}
              className="relative group"
            >
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <motion.div
                  className="hidden lg:block absolute top-5 left-[calc(2.5rem+1rem)] right-0 h-px"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.15, duration: 0.5, ease: "easeOut" as const }}
                  style={{ originX: 0 }}
                >
                  <div className="h-full w-full bg-gradient-to-r from-primary/40 to-primary/10" />
                </motion.div>
              )}

              {/* Step number with spring pop */}
              <motion.div
                variants={numberPop}
                className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold"
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 12 }}
              >
                {index + 1}
                {/* Pulse ring on appear */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20"
                  initial={{ scale: 1, opacity: 0.5 }}
                  whileInView={{ scale: [1, 1.6, 1.6], opacity: [0.5, 0, 0] }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.15, duration: 0.6 }}
                />
              </motion.div>

              <h3 className="text-lg font-semibold mb-2">{t(`${step}.title`)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(`${step}.description`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
