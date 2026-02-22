"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const checkItem = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
}

const checkStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const items = ["item1", "item2", "item3", "item4"]

export function DemoCta() {
  const t = useTranslations("demoCta")

  return (
    <section id="agendar-demo" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-background p-8 md:p-12 text-center overflow-hidden"
          whileHover={{ borderColor: "hsl(var(--primary) / 0.35)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated gradient shimmer on the border */}
          <motion.div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/5 to-transparent pointer-events-none"
            animate={{ translateX: ["-100%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" as const }}
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="relative"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-8"
            >
              {t("title")}
            </motion.h2>

            {/* Staggered check items */}
            <motion.ul
              variants={checkStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4 text-left max-w-md mx-auto mb-8"
            >
              {items.map((item) => (
                <motion.li
                  key={item}
                  variants={checkItem}
                  className="flex items-start gap-3"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring" as const, stiffness: 400, damping: 12 }}
                  >
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  </motion.div>
                  <span className="text-muted-foreground">{t(item)}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="flex flex-col items-center gap-3">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button asChild size="lg" className="gap-2 text-base">
                  <a href="#agendar-demo">
                    {t("cta")}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
              <p className="text-sm text-muted-foreground">{t("microcopy")}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
