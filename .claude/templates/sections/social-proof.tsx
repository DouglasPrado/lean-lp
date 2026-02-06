"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { InfiniteSlider } from "@/components/shared/infinite-slider"

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

// Replace with actual customer logo data
const logos = [
  { src: "/logos/logo-1.svg", alt: "Company 1" },
  { src: "/logos/logo-2.svg", alt: "Company 2" },
  { src: "/logos/logo-3.svg", alt: "Company 3" },
  { src: "/logos/logo-4.svg", alt: "Company 4" },
  { src: "/logos/logo-5.svg", alt: "Company 5" },
  { src: "/logos/logo-6.svg", alt: "Company 6" },
  { src: "/logos/logo-7.svg", alt: "Company 7" },
  { src: "/logos/logo-8.svg", alt: "Company 8" },
]

export function SocialProof() {
  const t = useTranslations("socialProof")

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeIn}
      className="bg-background py-16 md:py-24"
    >
      <div className="relative mx-auto max-w-3xl px-6">
        {/* Title */}
        <h2 className="mb-5 text-center font-medium text-foreground text-xl tracking-tight md:text-3xl">
          <span className="text-muted-foreground">{t("title")}</span>
        </h2>

        {/* Top divider */}
        <div className="mx-auto my-5 h-px max-w-sm bg-border [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />

        {/* Infinite sliding logos */}
        <div
          className={cn(
            "overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black,transparent)]"
          )}
        >
          <InfiniteSlider gap={42} reverse speed={80} speedOnHover={25}>
            {logos.map((logo) => (
              <img
                key={`logo-${logo.alt}`}
                alt={logo.alt}
                className="pointer-events-none h-4 select-none md:h-5 dark:brightness-0 dark:invert"
                loading="lazy"
                src={logo.src}
                height="auto"
                width="auto"
              />
            ))}
          </InfiniteSlider>
        </div>

        {/* Bottom divider */}
        <div className="mt-5 h-px bg-border [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
      </div>
    </motion.section>
  )
}
