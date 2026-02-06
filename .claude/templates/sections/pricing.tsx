"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Check, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { SectionHeader } from "@/components/shared/section-header"
import { AnimatedSection } from "@/components/shared/animated-section"
import { useMediaQuery } from "@/hooks/use-media-query"
import confetti from "canvas-confetti"
import NumberFlow from "@number-flow/react"

export function Pricing() {
  const t = useTranslations("pricing")
  const [isMonthly, setIsMonthly] = useState(true)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const switchRef = useRef<HTMLButtonElement>(null)

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked)
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: [
          "hsl(var(--primary))",
          "hsl(var(--accent))",
          "hsl(var(--secondary))",
          "hsl(var(--muted))",
        ],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      })
    }
  }

  const plans = [
    {
      key: "starter" as const,
      featureCount: 4,
      isPopular: false,
    },
    {
      key: "pro" as const,
      featureCount: 5,
      isPopular: true,
    },
    {
      key: "enterprise" as const,
      featureCount: 6,
      isPopular: false,
    },
  ]

  return (
    <section id="pricing" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeader title={t("title")} subtitle={t("subtitle")} />
        </AnimatedSection>

        {/* Monthly / Annual toggle */}
        <div className="flex justify-center items-center gap-2 mb-10">
          <label className="relative inline-flex items-center cursor-pointer">
            <Label>
              <Switch
                ref={switchRef as React.Ref<HTMLButtonElement>}
                checked={!isMonthly}
                onCheckedChange={handleToggle}
                className="relative"
              />
            </Label>
          </label>
          <span className="font-semibold">
            {t("annualBilling")}{" "}
            <span className="text-primary">{t("savingsLabel")}</span>
          </span>
        </div>

        {/* Pricing cards with 3D perspective */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, index) => {
            const monthlyPrice = t(`${plan.key}.monthlyPrice`)
            const yearlyPrice = t(`${plan.key}.yearlyPrice`)
            const isNumeric =
              monthlyPrice !== "" && !isNaN(Number(monthlyPrice))

            // Try to get custom price for Enterprise-style plans
            let customPrice = ""
            try {
              customPrice = t(`${plan.key}.customPrice`)
            } catch {
              customPrice = ""
            }

            return (
              <motion.div
                key={plan.key}
                initial={{ y: 50, opacity: 0 }}
                whileInView={
                  isDesktop
                    ? {
                        y: plan.isPopular ? -20 : 0,
                        opacity: 1,
                        x: index === 2 ? -30 : index === 0 ? 30 : 0,
                        scale: index === 0 || index === 2 ? 0.94 : 1.0,
                      }
                    : { y: 0, opacity: 1 }
                }
                viewport={{ once: true }}
                transition={{
                  duration: 1.6,
                  type: "spring" as const,
                  stiffness: 100,
                  damping: 30,
                  delay: 0.4,
                  opacity: { duration: 0.5 },
                }}
                className={cn(
                  "rounded-2xl border p-6 bg-background text-center lg:flex lg:flex-col lg:justify-center relative flex flex-col",
                  plan.isPopular
                    ? "border-primary border-2"
                    : "border-border",
                  !plan.isPopular && "mt-5",
                  index === 0 || index === 2 ? "z-0" : "z-10",
                  index === 0 && "origin-right",
                  index === 2 && "origin-left"
                )}
              >
                {/* Popular badge */}
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-primary py-0.5 px-2 rounded-bl-xl rounded-tr-xl flex items-center">
                    <Star className="text-primary-foreground h-4 w-4 fill-current" />
                    <span className="text-primary-foreground ml-1 font-semibold">
                      {t("recommended")}
                    </span>
                  </div>
                )}

                <div className="flex-1 flex flex-col">
                  {/* Plan name */}
                  <p className="text-base font-semibold text-muted-foreground">
                    {t(`${plan.key}.name`)}
                  </p>

                  {/* Price with NumberFlow animation */}
                  <div className="mt-6 flex items-center justify-center gap-x-2">
                    {isNumeric ? (
                      <>
                        <span className="text-5xl font-bold tracking-tight text-foreground tabular-nums">
                          <NumberFlow
                            value={
                              isMonthly
                                ? Number(monthlyPrice)
                                : Number(yearlyPrice)
                            }
                            format={{
                              style: "currency",
                              currency: t("currency"),
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }}
                            transformTiming={{
                              duration: 500,
                              easing: "ease-out",
                            }}
                            willChange
                          />
                        </span>
                        <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                          / {t("period")}
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold tracking-tight text-foreground">
                        {customPrice}
                      </span>
                    )}
                  </div>

                  {/* Billing period label */}
                  {isNumeric && (
                    <p className="text-xs leading-5 text-muted-foreground">
                      {isMonthly ? t("billedMonthly") : t("billedAnnually")}
                    </p>
                  )}

                  {/* Plan description */}
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`${plan.key}.description`)}
                  </p>

                  {/* Features list */}
                  <ul className="mt-5 gap-2 flex flex-col flex-1">
                    {Array.from({ length: plan.featureCount }, (_, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-left text-sm">
                          {t(`${plan.key}.feature${idx + 1}`)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <hr className="w-full my-4" />

                  {/* CTA button with hover ring effect */}
                  <Link
                    href="#"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter",
                      "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:bg-primary hover:text-primary-foreground",
                      plan.isPopular
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-foreground"
                    )}
                  >
                    {t(`${plan.key}.cta`)}
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
