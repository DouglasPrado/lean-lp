---
name: lp-seo
description: "SEO optimization guide for SaaS landing pages. Use when setting up metadata, structured data, Open Graph tags, page speed optimization, semantic HTML, sitemap configuration, or any search engine optimization task for landing pages. Triggers: SEO, meta tags, Open Graph, structured data, sitemap, schema markup, page speed, Core Web Vitals, metadata."
---

# SaaS Landing Page SEO

## Metadata Setup

### Next.js App Router Metadata

```tsx
// app/[locale]/layout.tsx
import { Metadata } from "next"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale
  const t = await getTranslations({ locale, namespace: "metadata" })

  return {
    title: {
      default: t("title"), // "ProductName — Tagline"
      template: `%s | ${t("siteName")}`,
    },
    description: t("description"), // 150-160 chars, include primary keyword
    keywords: t("keywords"),
    authors: [{ name: t("siteName") }],
    openGraph: {
      title: t("og.title"),
      description: t("og.description"),
      url: t("og.url"),
      siteName: t("siteName"),
      images: [
        {
          url: "/og-image.png", // 1200x630px
          width: 1200,
          height: 630,
          alt: t("og.imageAlt"),
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("og.title"),
      description: t("og.description"),
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: t("canonical"),
      languages: {
        "pt-BR": "/pt-BR",
        en: "/en",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}
```

## Semantic HTML Structure

```html
<body>
  <header>           <!-- Navbar -->
    <nav>...</nav>
  </header>
  <main>
    <section>         <!-- Hero: h1 (only ONE per page) -->
    <section>         <!-- Social Proof -->
    <section>         <!-- Benefits: h2 -->
    <section>         <!-- Features: h2 -->
    <section>         <!-- Testimonials: h2 -->
    <section>         <!-- Pricing: h2 -->
    <section>         <!-- FAQ: h2 (use dl/dt/dd or details/summary) -->
    <section>         <!-- Final CTA: h2 -->
  </main>
  <footer>            <!-- Footer: nav for links -->
</footer>
</body>
```

### Heading Hierarchy

- `h1`: ONE per page — hero headline only
- `h2`: Section titles (Benefits, Features, Pricing, FAQ, etc.)
- `h3`: Sub-items (feature names, plan names, FAQ questions)
- Never skip levels (no h1 → h3)

## Structured Data (JSON-LD)

For complete JSON-LD schema templates (SoftwareApplication, FAQPage, Organization, BreadcrumbList), see [references/schema-markup.md](references/schema-markup.md).

Add schemas in layout.tsx:

```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
```

## Core Web Vitals Optimization

### LCP (Largest Contentful Paint) < 2.5s

- Preload hero image/font in `<head>`
- Use `next/image` with `priority` for hero
- Inline critical CSS
- Avoid layout shifts in hero

### FID/INP (Interaction) < 200ms

- Defer non-critical JS
- Use `dynamic(() => import(...))` for below-fold sections
- Minimize third-party scripts

### CLS (Cumulative Layout Shift) < 0.1

- Set explicit `width`/`height` on all images
- Reserve space for dynamic content
- Avoid injecting content above fold after load
- Use `font-display: swap` with size-adjust

## Image Optimization

```tsx
// Always use next/image
import Image from "next/image"

;<Image
  src="/hero-screenshot.webp"
  alt="Descriptive alt text with keywords" // SEO: include keywords naturally
  width={1200}
  height={800}
  priority // Only for above-fold images
  quality={85}
  placeholder="blur"
  blurDataURL="..."
/>
```

- Format: WebP (fallback PNG)
- Hero images: max 200KB
- Logos: SVG preferred
- Alt text: descriptive, keyword-rich, natural

## i18n SEO

### hreflang Tags (auto via next-intl + metadata alternates)

```html
<link rel="alternate" hreflang="pt-BR" href="https://example.com/pt-BR" />
<link rel="alternate" hreflang="en" href="https://example.com/en" />
<link rel="alternate" hreflang="x-default" href="https://example.com" />
```

### Per-Locale SEO

- Each locale has unique title + description
- Canonical URLs include locale prefix
- Sitemap includes all locale variants
- OG images can be locale-specific

## Sitemap & Robots

```tsx
// app/sitemap.ts
export default function sitemap() {
  const locales = ["pt-BR", "en"]
  const baseUrl = "https://example.com"

  return locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}`])),
    },
  }))
}

// app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://example.com/sitemap.xml",
  }
}
```

## SEO Checklist

Before launch:

1. H1 is unique, keyword-rich, present on page
2. Meta title ≤ 60 chars, meta description 150-160 chars
3. OG image is 1200x630, renders correctly on social
4. All images have descriptive alt text
5. Heading hierarchy is correct (h1 → h2 → h3)
6. JSON-LD schemas validate (Google Rich Results Test)
7. hreflang tags are correct for all locales
8. Sitemap.xml is accessible and submitted
9. Robots.txt allows indexing
10. Core Web Vitals pass (PageSpeed Insights)
11. No broken links (internal or external)
12. Canonical URLs are set
13. 404 page exists and is styled

## Conexão com Outras Skills

- **Estrutura**: Seguir a heading hierarchy ao criar componentes em `lp-structure`. Hero usa `<h1>`, todas outras seções usam `<h2>`, sub-items usam `<h3>`
- **Copy**: As chaves `metadata.*` no template i18n (`.claude/templates/snippets/i18n-message-template.json`) são usadas pelo `generateMetadata()` acima. Ao escrever copy via `lp-copy`, preencher `metadata.title` (≤60 chars) e `metadata.description` (150-160 chars)
- **Cores**: O `globals.css` gerado por `lp-colors` define as CSS variables que os componentes usam. Gerar cores ANTES de configurar SEO/metadata
