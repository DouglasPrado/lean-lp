---
name: lp-structure
description: "Architecture and component structure guide for SaaS landing pages built with Next.js + shadcn/ui + Tailwind + Framer Motion. Use when creating sections, laying out components, structuring page architecture, implementing responsive design, setting up animations, or organizing the component hierarchy. Triggers: section, layout, component, structure, architecture, responsive, animation, grid, bento."
---

# SaaS Landing Page Structure

## Architecture Overview

Every section follows this pattern:

```tsx
// components/sections/section-name.tsx
"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export function SectionName() {
  const t = useTranslations("sectionName")

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          {/* Section content */}
        </motion.div>
      </div>
    </section>
  )
}
```

## Page Composition

```tsx
// app/[locale]/page.tsx
import { AnnouncementBar } from "@/components/sections/announcement-bar"
import { Navbar } from "@/components/sections/navbar"
import { Hero } from "@/components/sections/hero"
import { SocialProof } from "@/components/sections/social-proof"
import { Benefits } from "@/components/sections/benefits"
import { Features } from "@/components/sections/features"
import { Testimonials } from "@/components/sections/testimonials"
import { Pricing } from "@/components/sections/pricing"
import { Faq } from "@/components/sections/faq"
import { FinalCta } from "@/components/sections/final-cta"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Benefits />
        <Features />
        <Testimonials />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
```

## Framer-Style Design System

### Spacing Scale
- Between sections: `py-20 md:py-32`
- Section header to content: `mb-12 md:mb-16`
- Card padding: `p-6 md:p-8`
- Grid gap: `gap-6 md:gap-8`

### Typography Scale (Hero → Body)
```
Hero headline:    text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight
Section headline: text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight
Section subtitle: text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto
Card title:       text-xl md:text-2xl font-semibold
Body:             text-base text-muted-foreground
Small/caption:    text-sm text-muted-foreground
```

### Animation Variants
```ts
// lib/animations.ts
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}
```

### Glassmorphism Card
```
bg-background/50 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg
```

### Gradient Patterns
```
Hero BG:      bg-gradient-to-b from-background via-background to-muted/30
CTA BG:       bg-gradient-to-r from-primary/10 via-primary/5 to-background
Text Accent:  bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent
```

## Responsive Breakpoints Strategy

- Mobile-first always
- Key breakpoints: `sm:640px`, `md:768px`, `lg:1024px`
- Grid: 1 col → 2 col (md) → 3-4 col (lg)
- Hero: stack on mobile, side-by-side on lg
- Navbar: hamburger on mobile, full on md
- Pricing: horizontal scroll on mobile or stack

## Component Patterns

For detailed component implementation patterns (Bento Grid, Pricing Cards, Testimonial Carousel, etc.), see [references/component-patterns.md](references/component-patterns.md).

## i18n Structure

```tsx
// middleware.ts — next-intl routing
import createMiddleware from "next-intl/middleware"

export default createMiddleware({
  locales: ["pt-BR", "en"],
  defaultLocale: "pt-BR"
})

// Each section component:
const t = useTranslations("hero")
// Access: t("title"), t("subtitle"), t("cta.primary")
```

## Performance Checklist

1. Use `next/image` for all images with proper sizing
2. Lazy load below-fold sections with `dynamic(() => import(...))`
3. Preload hero fonts in layout
4. Use `viewport={{ once: true }}` on all Framer Motion animations
5. Keep LCP element (hero image/text) above fold without layout shift

## Integração com Outras Skills e Templates

### Templates Prontos
Copiar templates de seções de `.claude/templates/sections/` para `src/components/sections/`.
Copiar snippets de `.claude/templates/snippets/` para `src/components/shared/`.
Cada seção importa snippets de `@/components/shared/` — NÃO duplicar código manualmente.

Templates disponíveis:
- `announcement-bar.tsx`, `navbar.tsx`, `hero.tsx`, `social-proof.tsx`
- `benefits.tsx`, `features.tsx`, `testimonials.tsx`, `pricing.tsx`
- `faq.tsx`, `final-cta.tsx`, `footer.tsx`

Snippets compartilhados (importar de `@/components/shared/`):
- `SectionHeader` — h2 + subtitle com animação (usar em TODAS as seções)
- `AnimatedSection` — wrapper com Framer Motion whileInView
- `AnimatedGroup` — animação stagger de grupo com presets (fade, slide, blur, zoom, flip, bounce, etc). Usado no Hero para as animações estilo Tailark
- `GlowingEffect` — efeito de borda brilhante que segue o cursor. Usado no Features (bento grid). Requer `motion` (npm). Props: `spread`, `glow`, `proximity`, `inactiveZone`, `borderWidth`, `disabled`
- `InfiniteSlider` — carrossel infinito de logos/itens. Usado no Social Proof. Requer `react-use-measure`. Props: `gap`, `speed`, `speedOnHover`, `reverse`, `direction`
- `TextColor` — texto com gradiente animado que cicla entre 3 palavras (efeito neon cycling). Usado no Hero title. Props: `words` (tupla de 3 strings), `className`. Gradientes customizáveis via `gradientPairs` no componente. Injeta keyframes CSS automaticamente
- `GlassCard` — card com glassmorphism padrão
- `CtaButtonPair` — par de botões primary + outline (props: `primaryText`, `secondaryText`, `className`)
- `BadgePill` — badge/pill para tags e labels (variants: default, primary, outline)
- `GradientText` — texto com gradiente animado
- `LanguageSwitcher` — switcher de idioma next-intl (usar no Navbar)

### Conexão com Outras Skills
- **Cores**: Antes de criar componentes, gerar a paleta via `lp-colors`. Os componentes usam CSS variables (`bg-primary`, `text-muted-foreground`, etc.)
- **Copy**: As seções usam `useTranslations()` do next-intl. O conteúdo vem de `lp-copy` + template i18n em `.claude/templates/snippets/i18n-message-template.json`
- **SEO**: Seguir heading hierarchy de `lp-seo` (h1 apenas no hero, h2 por seção)
