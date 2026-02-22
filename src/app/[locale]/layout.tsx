import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { inter } from "@/lib/fonts"
import { siteConfig } from "@/config/site"
import { getSoftwareApplicationSchema, getOrganizationSchema } from "@/lib/schema"
import "@/app/globals.css"

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata" })

  return {
    title: {
      default: t("title"),
      template: `%s | ${siteConfig.name}`,
    },
    description: t("description"),
    keywords: t("keywords"),
    authors: [{ name: siteConfig.name }],
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
        },
      ],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [siteConfig.ogImage],
    },
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        "pt-BR": `${siteConfig.url}/pt-BR`,
        en: `${siteConfig.url}/en`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
      },
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as "pt-BR" | "en")) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSoftwareApplicationSchema(locale)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationSchema()),
          }}
        />
      </body>
    </html>
  )
}
