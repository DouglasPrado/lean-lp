"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export function Hero() {
  const t = useTranslations("hero")

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />

      {/* Floating orbs */}
      <motion.div
        className="absolute -top-32 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        animate={{ y: [0, 30, 0], x: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as const }}
      />
      <motion.div
        className="absolute top-1/3 -right-16 h-48 w-48 rounded-full bg-primary/5 blur-3xl"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" as const }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mx-auto max-w-4xl text-center"
        >
          {/* Badge with pulse glow */}
          <motion.div variants={fadeUp}>
            <motion.div
              className="inline-block"
              animate={{ boxShadow: ["0 0 0 0 hsl(var(--primary) / 0)", "0 0 0 8px hsl(var(--primary) / 0.08)", "0 0 0 0 hsl(var(--primary) / 0)"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" as const }}
              style={{ borderRadius: "9999px" }}
            >
              <Badge variant="outline" className="border-primary/30 text-primary mb-6">
                {t("badge")}
              </Badge>
            </motion.div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          >
            {t("title")}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            {t("subtitle")}
          </motion.p>

          {/* CTAs with hover micro-interactions */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button asChild size="lg" className="gap-2 text-base">
                <a href="#agendar-demo">
                  {t("ctaPrimary")}
                  <motion.span
                    className="inline-block"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring" as const, stiffness: 400, damping: 15 }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
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

          {/* Example card with shimmer border */}
          <motion.div
            variants={fadeUp}
            className="relative mt-12 rounded-xl border border-border/50 bg-card/50 p-4 md:p-6 backdrop-blur-sm overflow-hidden group"
            whileHover={{ borderColor: "hsl(var(--primary) / 0.3)" }}
            transition={{ duration: 0.3 }}
          >
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/5 to-transparent"
              animate={{ translateX: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" as const }}
            />
            <p className="relative text-sm text-muted-foreground font-mono">
              {t("example")}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
