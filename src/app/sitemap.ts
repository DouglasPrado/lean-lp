import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["pt-BR", "en"]
  const baseUrl = "https://dify.com.br"

  return locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1.0,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}`])
      ),
    },
  }))
}
