"use client"

import { useTranslations } from "next-intl"
import { MarqueeAnimation } from "@/components/shared/marquee-effect"

export function SocialProof() {
  const t = useTranslations("socialProof")

  return (
    <section className="py-8 md:py-12 overflow-hidden">
      {/* Gradient divider top */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="flex flex-col gap-4 py-8">
        {/* First marquee — trust phrases, left direction */}
        <MarqueeAnimation
          direction="left"
          baseVelocity={-3}
          className="text-foreground/10 text-6xl md:text-8xl lg:text-9xl tracking-tighter"
        >
          {t("marquee1")}
        </MarqueeAnimation>

        {/* Second marquee — features/keywords, right direction */}
        <MarqueeAnimation
          direction="right"
          baseVelocity={-3}
          className="text-primary/15 text-6xl md:text-8xl lg:text-9xl tracking-tighter"
        >
          {t("marquee2")}
        </MarqueeAnimation>
      </div>

      {/* Gradient divider bottom */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}
