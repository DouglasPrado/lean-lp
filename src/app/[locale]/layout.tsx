import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { ThemeProvider } from "next-themes"
import { routing } from "@/i18n/routing"
import { calSans, inter } from "@/lib/fonts"
import {
  generateSoftwareApplicationSchema,
  generateFAQSchema,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/schema"
import "../globals.css"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata" })

  return {
    title: { default: t("title"), template: `%s | ${t("siteName")}` },
    description: t("description"),
    openGraph: {
      title: t("og.title"),
      description: t("og.description"),
      url: t("og.url"),
      siteName: t("siteName"),
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: t("og.imageAlt") }],
      locale: locale,
      type: "website",
    },
    alternates: {
      canonical: t("canonical"),
      languages: { "pt-BR": "/pt-BR", en: "/en" },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) notFound()

  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: "faq" })

  const faqs = Array.from({ length: 6 }, (_, i) => ({
    question: t(`q${i + 1}.question`),
    answer: t(`q${i + 1}.answer`),
  }))

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${calSans.variable} ${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateSoftwareApplicationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateFAQSchema(faqs)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebsiteSchema()),
          }}
        />
      </body>
    </html>
  )
}
