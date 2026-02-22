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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function SectionName() {
  const t = useTranslations("sectionName")

  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
import { Navbar } from "@/components/sections/navbar"
import { Hero } from "@/components/sections/hero"
import { SocialProof } from "@/components/sections/social-proof"
import { HeroBackground } from "@/components/shared/hero-background"
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
      <Navbar />
      <main>
        <HeroBackground>
          <Hero />
          <SocialProof />
        </HeroBackground>
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
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
// proxy.ts — next-intl routing (Next.js 16+ usa proxy em vez de middleware)
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

// next.config.ts — OBRIGATÓRIO para next-intl funcionar
import createNextIntlPlugin from "next-intl/plugin"
const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)

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

## Guia de Criação de Componentes

### Padrão Canônico de Seção

Toda seção DEVE seguir este padrão:

1. `"use client"` — obrigatório para Framer Motion
2. `useTranslations("sectionName")` — i18n via next-intl
3. `motion.div` com `whileInView` + `viewport={{ once: true, margin: "-100px" }}`
4. Wrapper: `<section className="py-20 md:py-32">`
5. Container: `<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">`

**TypeScript**: Framer Motion transitions precisam de `as const` para satisfazer tipos estritos:

```tsx
transition: { duration: 0.5, ease: "easeOut" as const }
transition: { type: "spring" as const, stiffness: 300 }
```

### Padrões de Componentes Shared

Criar em `src/components/shared/` conforme necessidade do projeto. Padrões comuns:

| Padrão | Propósito | CSS/Uso |
|--------|-----------|---------|
| **SectionHeader** | h2 + subtitle com animação | Usar em TODAS as seções. `fadeUp` variant |
| **AnimatedSection** | Wrapper com whileInView | `motion.div` com stagger children |
| **GlassCard** | Card glassmorphism | `bg-background/50 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg` |
| **GlowingEffect** | Borda brilhante cursor-following | Requer `motion` (npm) |
| **CtaButtonPair** | Botões primary + outline | Usa shadcn/ui `Button` |
| **BadgePill** | Badge/pill para tags | Usa shadcn/ui `Badge` |
| **GradientText** | Texto com gradiente | `bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent` |
| **LanguageSwitcher** | Toggle de idioma | next-intl + shadcn/ui `DropdownMenu` |
| **InfiniteSlider** | Carrossel infinito | Requer `react-use-measure` |

Cada componente shared deve ser autocontido, aceitar `className` para flexibilidade, e usar `cn()` para composição de classes.

### Seções Recomendadas

Estrutura típica de uma landing page SaaS (adaptar conforme o projeto):

1. **Navbar** — navegação sticky com mobile menu
2. **Hero** — headline h1, CTAs, imagem/vídeo do produto
3. **Social Proof** — logos, métricas, ou badges de confiança
4. **Benefits** — 3-4 benefícios principais com ícones
5. **Features** — features detalhadas (bento grid, cards)
6. **Testimonials** — depoimentos com nome, cargo, foto
7. **Pricing** — planos com toggle mensal/anual
8. **FAQ** — accordion com top 5-7 objeções
9. **Final CTA** — headline final + botão de conversão
10. **Footer** — links, marca, copyright

Cada projeto decide quais seções incluir e a ordem.

### shadcn/ui (instalar conforme necessidade)

```bash
npx shadcn@latest add button badge accordion switch label dropdown-menu
```

### Dependências npm opcionais

Instalar conforme os componentes que o projeto precisar:

- `motion` — efeitos avançados (glow, progressive blur)
- `react-use-measure` — medição de elementos (carrosséis)
- `@tsparticles/react` + `@tsparticles/slim` — efeitos de partículas
- `@motionone/utils` — utilitários de animação (marquee)
- `next-themes` — detecção de dark/light mode
- `canvas-confetti` — efeitos de celebração
- `@number-flow/react` — animação numérica

### Conexão com Outras Skills

- **Cores**: Antes de criar componentes, gerar a paleta via `lp-colors`. Os componentes usam CSS variables (`bg-primary`, `text-muted-foreground`, etc.)
- **Copy**: As seções usam `useTranslations()` do next-intl. Criar `src/messages/pt-BR.json` e `en.json` com chaves por seção seguindo o mapa de chaves em `lp-copy`
- **SEO**: Seguir heading hierarchy de `lp-seo` (h1 apenas no hero, h2 por seção)

## Validação Final (OBRIGATÓRIO)

Após criar os componentes do projeto, **SEMPRE** executar os seguintes passos de validação:

### 1. Instalar dependências

```bash
cd $PROJECT_DIR && npm install
```

Se houver erros de dependência, corrigir antes de continuar.

### 2. Build do projeto

```bash
npm run build
```

Verificar se o build completa sem erros. Erros comuns:

- **"Module not found"** → arquivo não criado ou import path incorreto. Verificar que todos os componentes estão em `src/components/shared/` e seções em `src/components/sections/`
- **"Cannot find module 'next-intl'"** → dependência não instalada. Rodar `npm install next-intl`
- **"Couldn't find next-intl config"** → falta `createNextIntlPlugin` no `next.config.ts`. Verificar se o arquivo `next.config.ts` foi copiado do template
- **TypeScript errors** → verificar tipos e props dos componentes. Rodar `npx tsc --noEmit` para listar todos os erros
- **"Cannot find module '@/components/shared/...'"** → componente não criado. Verificar que o arquivo existe em `src/components/shared/`
- **CSS/Tailwind errors** → verificar se `globals.css` foi gerado pelo `generate-palette.py` e está importado no layout

### 3. Executar o projeto em dev

```bash
npm run dev
```

Aguardar o servidor iniciar e verificar:

- Sem erros no terminal (warnings são aceitáveis)
- Página carrega em `http://localhost:3000`
- Sem erros de hydration no console do browser (SSR/CSR mismatch)

### 4. Checklist de validação

Ao executar o projeto, verificar que:

- [ ] Todas as seções criadas renderizam corretamente
- [ ] Textos i18n aparecem corretamente (não mostram chaves como `hero.title`)
- [ ] Cores da paleta estão aplicadas (primary, secondary, background, foreground)
- [ ] Dark mode funciona (se `next-themes` configurado)
- [ ] Animações Framer Motion executam ao scroll
- [ ] Responsivo funciona (mobile → desktop)

### 5. Correção de erros

Se encontrar erros:

1. **Ler a mensagem de erro completa** antes de tentar corrigir
2. **Corrigir um erro por vez** e re-executar o build
3. **Não ignorar warnings** de TypeScript — podem indicar problemas futuros
4. **Verificar o terminal E o browser console** — erros podem aparecer em ambos
5. Após corrigir, rodar `npm run build` novamente para confirmar que a correção não introduziu novos erros

### Fluxo resumido

```bash
# Após setup completo:
cd $PROJECT_DIR
npm install                          # 1. Dependências
npm run build                        # 2. Build (deve passar sem erros)
npm run dev                          # 3. Dev server (verificar visual)
# Se tudo OK → projeto pronto para desenvolvimento
```

> **IMPORTANTE**: Não considere o setup completo até que `npm run build` passe sem erros. Se houver erros, corrija-os antes de informar ao usuário que o projeto está pronto.
