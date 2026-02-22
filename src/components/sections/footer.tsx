"use client"

import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations("footer")

  return (
    <footer className="border-t border-border/50 py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <a href="#" className="text-lg font-bold tracking-tight">
            dify<span className="text-primary">.</span>
          </a>
          <p className="text-sm text-muted-foreground">
            {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  )
}
