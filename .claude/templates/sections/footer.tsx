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
    <footer className="border-t border-border/50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-lg font-bold">{t("brand")}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("tagline")}
            </p>
          </div>

          {/* Product links */}
          <div>
            <p className="text-sm font-semibold mb-4">{t("product.title")}</p>
            <nav className="flex flex-col gap-2">
              {links.product.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company links */}
          <div>
            <p className="text-sm font-semibold mb-4">{t("company.title")}</p>
            <nav className="flex flex-col gap-2">
              {links.company.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal links */}
          <div>
            <p className="text-sm font-semibold mb-4">{t("legal.title")}</p>
            <nav className="flex flex-col gap-2">
              {links.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}
