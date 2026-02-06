"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export function AnnouncementBar() {
  const t = useTranslations("announcement")

  return (
    <div className="bg-primary text-primary-foreground py-2 text-center text-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4">
        <Sparkles className="h-4 w-4" />
        <span>{t("text")}</span>
        <Link href={t("link")} className="font-medium underline">
          {t("cta")}
        </Link>
      </div>
    </div>
  )
}
