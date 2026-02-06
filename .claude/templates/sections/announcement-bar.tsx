"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export function AnnouncementBar() {
  const t = useTranslations("announcement")

  return (
    <div className="bg-primary text-primary-foreground text-sm py-2 text-center">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4" />
        <span>{t("text")}</span>
        <Link href={t("link")} className="underline font-medium">
          {t("cta")}
        </Link>
      </div>
    </div>
  )
}
