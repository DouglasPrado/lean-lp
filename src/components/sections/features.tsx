"use client"

import { useTranslations } from "next-intl"
import { Box, Lock, Sparkles, Zap, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { GlowingEffect } from "@/components/shared/glowing-effect"
import { SectionHeader } from "@/components/shared/section-header"
import { AnimatedSection } from "@/components/shared/animated-section"

interface GridItemProps {
  area: string
  icon: React.ReactNode
  title: string
  description: string
}

function GridItem({ area, icon, title, description }: GridItemProps) {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="border-border relative h-full rounded-[1.25rem] border-[0.75px] p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="bg-background relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] p-6 shadow-sm md:p-6 dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="border-border bg-muted w-fit rounded-lg border-[0.75px] p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="text-foreground pt-0.5 text-xl leading-[1.375rem] font-semibold tracking-[-0.04em] text-balance md:text-2xl md:leading-[1.875rem]">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem]">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

// Map feature keys to icons — customize per project
const featureIcons = [
  <Zap key="zap" className="h-4 w-4" />,
  <Box key="box" className="h-4 w-4" />,
  <Lock key="lock" className="h-4 w-4" />,
  <Sparkles key="sparkles" className="h-4 w-4" />,
  <Search key="search" className="h-4 w-4" />,
]

export function Features() {
  const t = useTranslations("features")

  const features = [
    { key: "feature1", area: "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]" },
    { key: "feature2", area: "md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]" },
    { key: "feature3", area: "md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]" },
    { key: "feature4", area: "md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]" },
    { key: "feature5", area: "md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]" },
  ]

  return (
    <AnimatedSection id="features" className="bg-muted/30 py-20 md:py-32">
      <SectionHeader title={t("title")} subtitle={t("subtitle")} />

      <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
        {features.map((feature, index) => (
          <GridItem
            key={feature.key}
            area={feature.area}
            icon={featureIcons[index]}
            title={t(`${feature.key}.title`)}
            description={t(`${feature.key}.description`)}
          />
        ))}
      </ul>
    </AnimatedSection>
  )
}
