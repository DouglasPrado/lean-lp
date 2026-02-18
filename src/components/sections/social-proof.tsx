"use client"

import { Sparkles } from "@/components/shared/sparkles"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"

const metricKeys = ["metric1", "metric2", "metric3", "metric4"] as const

export function SocialProof() {
  const t = useTranslations("socialProof")
  const { theme } = useTheme()

  return (
    <div className="w-full overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-16 w-full">
          <div className="text-foreground text-center text-3xl">
            <span className="text-primary dark:text-primary/80 font-bold">{t("subtitle")}</span>
            <br />
            <span className="font-bold">{t("title")}</span>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4">
            {metricKeys.map((key) => (
              <div key={key} className="text-center">
                <p className="text-primary text-4xl font-bold tracking-tight md:text-5xl">
                  {t(`${key}.value`)}
                </p>
                <p className="text-muted-foreground mt-2 text-sm font-medium uppercase tracking-wider">
                  {t(`${key}.label`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative -mt-32 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]">
        <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,hsl(var(--gradient-color)),transparent_70%)] before:opacity-40" />
        <div className="border-foreground/20 bg-background absolute top-1/2 -left-1/2 z-10 aspect-[1/0.7] w-[200%] rounded-[100%] border-t" />
        <Sparkles
          density={1200}
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
          color={
            theme === "dark" ? "hsl(var(--sparkles-color-dark))" : "hsl(var(--sparkles-color))"
          }
        />
      </div>
    </div>
  )
}
