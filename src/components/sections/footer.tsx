"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"

export function Footer() {
  const t = useTranslations("footer")

  const links = {
    product: [
      { label: t("product.features"), href: "#features" },
      { label: t("product.pricing"), href: "#pricing" },
      { label: t("product.changelog"), href: "/changelog" },
      { label: t("product.docs"), href: "/docs" },
    ],
    company: [
      { label: t("company.about"), href: "/about" },
      { label: t("company.blog"), href: "/blog" },
      { label: t("company.careers"), href: "/careers" },
      { label: t("company.contact"), href: "/contact" },
    ],
    legal: [
      { label: t("legal.privacy"), href: "/privacy" },
      { label: t("legal.terms"), href: "/terms" },
      { label: t("legal.cookies"), href: "/cookies" },
    ],
  }

  return (
    <footer className="border-border/50 border-t py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-lg font-bold">{t("brand")}</p>
            <p className="text-muted-foreground mt-2 text-sm">{t("tagline")}</p>
          </div>

          {/* Product links */}
          <div>
            <p className="mb-4 text-sm font-semibold">{t("product.title")}</p>
            <nav className="flex flex-col gap-2">
              {links.product.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company links */}
          <div>
            <p className="mb-4 text-sm font-semibold">{t("company.title")}</p>
            <nav className="flex flex-col gap-2">
              {links.company.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal links */}
          <div>
            <p className="mb-4 text-sm font-semibold">{t("legal.title")}</p>
            <nav className="flex flex-col gap-2">
              {links.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-border/50 mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}
