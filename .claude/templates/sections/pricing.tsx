"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { SectionHeader } from "@/components/shared/section-header"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export function Pricing() {
  const t = useTranslations("pricing")

  const plans = [
    {
      name: t("starter.name"),
      price: t("starter.price"),
      description: t("starter.description"),
      features: [
        t("starter.feature1"),
        t("starter.feature2"),
        t("starter.feature3"),
        t("starter.feature4"),
      ],
      cta: t("starter.cta"),
      popular: false,
    },
    {
      name: t("pro.name"),
      price: t("pro.price"),
      description: t("pro.description"),
      features: [
        t("pro.feature1"),
        t("pro.feature2"),
        t("pro.feature3"),
        t("pro.feature4"),
        t("pro.feature5"),
      ],
      cta: t("pro.cta"),
      popular: true,
    },
    {
      name: t("enterprise.name"),
      price: t("enterprise.price"),
      description: t("enterprise.description"),
      features: [
        t("enterprise.feature1"),
        t("enterprise.feature2"),
        t("enterprise.feature3"),
        t("enterprise.feature4"),
        t("enterprise.feature5"),
        t("enterprise.feature6"),
      ],
      cta: t("enterprise.cta"),
      popular: false,
    },
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
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
        >
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={cn(
                "rounded-2xl border p-8 flex flex-col",
                plan.popular
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 md:scale-105 relative"
                  : "border-border bg-background/50"
              )}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {t("recommended")}
                </Badge>
              )}
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {plan.description}
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/{t("month")}</span>
              </div>
              <ul className="mt-8 space-y-3 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 w-full rounded-full"
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
