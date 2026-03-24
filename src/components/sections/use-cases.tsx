"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { MessageSquare, TrendingUp, Pencil, CalendarClock } from "lucide-react"
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid"
import { SectionHeader } from "@/components/shared/section-header"
import { siteConfig } from "@/config/site"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

const casesConfig = [
  {
    key: "case1",
    icon: <MessageSquare className="h-4 w-4 text-primary" />,
    tags: ["WhatsApp", "E-mail", "DM"],
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    key: "case2",
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
    tags: ["Qualificação", "Follow-up"],
    colSpan: 1,
  },
  {
    key: "case3",
    icon: <Pencil className="h-4 w-4 text-primary" />,
    tags: ["Brief", "Revisão", "Calendário"],
    colSpan: 2,
  },
  {
    key: "case4",
    icon: <CalendarClock className="h-4 w-4 text-primary" />,
    tags: ["Checklists", "Resumos"],
    colSpan: 1,
  },
]

export function UseCases() {
  const t = useTranslations("useCases")

  const items: BentoItem[] = casesConfig.map((c) => ({
    title: t(`${c.key}.title`),
    description: t(`${c.key}.description`),
    icon: c.icon,
    status: t(`${c.key}.status`),
    meta: t(`${c.key}.meta`),
    cta: t(`${c.key}.cta`),
    ctaHref: siteConfig.links.demo,
    tags: c.tags,
    colSpan: c.colSpan,
    hasPersistentHover: c.hasPersistentHover,
  }))

  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <BentoGrid items={items} />
        </motion.div>
      </div>
    </section>
  )
}
