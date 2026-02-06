import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://leanerp.com.br"
  const locales = ["pt-BR", "en"]
  const lastModified = new Date()

  return locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: locale === "pt-BR" ? 1.0 : 0.8,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}`])),
    },
  }))
}
