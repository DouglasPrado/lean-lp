"use client"

import { AnimatedGroup } from "@/components/shared/animated-group"
import { AnnouncementBar } from "@/components/shared/announcement-bar"
import { HeroVideoDialog } from "@/components/shared/hero-video-dialog"
import { TextColor } from "@/components/shared/text-color"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import Link from "next/link"
import React from "react"

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

export function Hero() {
  const t = useTranslations("hero")

  return (
    <section className="relative overflow-hidden">
      {/* Decorative radial gradients */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 isolate z-[2] hidden opacity-50 contain-strict lg:block"
      >
        <div className="absolute top-0 left-0 h-[80rem] w-[35rem] -translate-y-[350px] -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(var(--primary)/0.08)_0,hsla(var(--primary)/0.02)_50%,transparent_80%)]" />
        <div className="absolute top-0 left-0 h-[80rem] w-56 [translate:5%_-50%] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(var(--primary)/0.06)_0,hsla(var(--primary)/0.02)_80%,transparent_100%)]" />
        <div className="absolute top-0 left-0 h-[80rem] w-56 -translate-y-[350px] -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(var(--primary)/0.04)_0,hsla(var(--primary)/0.02)_80%,transparent_100%)]" />
      </div>

      <div className="relative pt-24 md:pt-36">
        {/* Background fade overlay */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
        />

        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center sm:mx-auto">
            {/* Badge + Title + Subtitle */}
            <AnimatedGroup variants={transitionVariants}>
              {/* Announcement bar */}
              <AnnouncementBar
                cta={t("announcement.cta")}
                text={t("announcement.text")}
                href={t("announcement.link")}
                closeLabel={t("announcement.close")}
              />

              {/* Main headline — static line + animated gradient words */}
              <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-bold tracking-tight text-balance sm:text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                {t("title")}
                <br />
                <TextColor words={[t("titleWord1"), t("titleWord2"), t("titleWord3")]} />
              </h1>

              {/* Subtitle */}
              <p className="text-muted-foreground mx-auto mt-8 max-w-2xl text-lg text-balance">
                {t("subtitle")}
              </p>
            </AnimatedGroup>

            {/* CTA Buttons */}
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
              className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
            >
              <div className="bg-foreground/10 rounded-[14px] border p-0.5">
                <Button asChild size="lg" className="rounded-xl px-5 text-base">
                  <Link href="#">
                    <span className="text-nowrap">{t("cta.primary")}</span>
                  </Link>
                </Button>
              </div>
              <Button asChild size="lg" variant="ghost" className="h-10.5 rounded-xl px-5">
                <Link href="#">
                  <span className="text-nowrap">{t("cta.secondary")}</span>
                </Link>
              </Button>
            </AnimatedGroup>

            {/* Microcopy */}
            <p className="text-muted-foreground mt-4 text-sm">{t("cta.microcopy")}</p>
          </div>
        </div>

        {/* App screenshot mockup */}
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.75,
                },
              },
            },
            ...transitionVariants,
          }}
        >
          <div className="relative mt-8 overflow-hidden px-2 sm:mt-12 md:mt-20">
            <div
              aria-hidden
              className="to-background absolute inset-0 z-10 bg-gradient-to-b from-transparent from-35%"
            />
            <div className="ring-background bg-background relative mx-auto max-w-7xl overflow-hidden rounded-2xl border p-4 shadow-lg ring-1 inset-shadow-2xs shadow-zinc-950/15 dark:inset-shadow-white/20">
              <HeroVideoDialog
                animationStyle="from-center"
                videoSrc={t("video.src")}
                thumbnailSrc={t("video.thumbnail")}
                thumbnailAlt={t("video.thumbnailAlt")}
                className="rounded-xl"
              />
            </div>
          </div>
        </AnimatedGroup>
      </div>
    </section>
  )
}
