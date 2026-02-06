#!/usr/bin/env bash
# =============================================================================
# Landing Page SaaS — Setup Automático
# Copia TODOS os configs, templates e cria a estrutura do projeto
# Uso: bash .claude/scripts/setup-project.sh [diretório-do-projeto]
# =============================================================================

set -euo pipefail

PROJECT_DIR="${1:-.}"
CLAUDE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATES_DIR="$CLAUDE_DIR/templates"
CONFIGS_DIR="$TEMPLATES_DIR/configs"
SECTIONS_DIR="$TEMPLATES_DIR/sections"
SNIPPETS_DIR="$TEMPLATES_DIR/snippets"

echo ""
echo "🚀 Setup Landing Page SaaS Boilerplate"
echo "   Projeto: $PROJECT_DIR"
echo "   Templates: $TEMPLATES_DIR"
echo ""

# =============================================================================
# 1. ESTRUTURA DE PASTAS
# =============================================================================
echo "📁 Criando estrutura de pastas..."

mkdir -p "$PROJECT_DIR/src/components/sections"
mkdir -p "$PROJECT_DIR/src/components/shared"
mkdir -p "$PROJECT_DIR/src/components/ui"
mkdir -p "$PROJECT_DIR/src/lib"
mkdir -p "$PROJECT_DIR/src/config"
mkdir -p "$PROJECT_DIR/src/messages"
mkdir -p "$PROJECT_DIR/src/__tests__"
mkdir -p "$PROJECT_DIR/src/hooks"
mkdir -p "$PROJECT_DIR/src/types"
mkdir -p "$PROJECT_DIR/e2e"
mkdir -p "$PROJECT_DIR/.husky"
mkdir -p "$PROJECT_DIR/.storybook"
mkdir -p "$PROJECT_DIR/.github/workflows"

echo "   ✅ Estrutura de pastas criada"

# =============================================================================
# 2. CONFIGS DE DEVOPS (raiz do projeto)
# =============================================================================
echo ""
echo "⚙️  Copiando configs de DevOps..."

# Configs raiz
cp "$CONFIGS_DIR/.prettierrc" "$PROJECT_DIR/.prettierrc"
echo "   ✅ .prettierrc"

cp "$CONFIGS_DIR/.lintstagedrc.js" "$PROJECT_DIR/.lintstagedrc.js"
echo "   ✅ .lintstagedrc.js"

cp "$CONFIGS_DIR/commitlint.config.js" "$PROJECT_DIR/commitlint.config.js"
echo "   ✅ commitlint.config.js"

cp "$CONFIGS_DIR/.releaserc.json" "$PROJECT_DIR/.releaserc.json"
echo "   ✅ .releaserc.json"

cp "$CONFIGS_DIR/vitest.config.ts" "$PROJECT_DIR/vitest.config.ts"
echo "   ✅ vitest.config.ts"

cp "$CONFIGS_DIR/playwright.config.ts" "$PROJECT_DIR/playwright.config.ts"
echo "   ✅ playwright.config.ts"

cp "$CONFIGS_DIR/crowdin.yml" "$PROJECT_DIR/crowdin.yml"
echo "   ✅ crowdin.yml"

# next.config.ts (com plugin next-intl)
cp "$CONFIGS_DIR/next.config.ts" "$PROJECT_DIR/next.config.ts"
echo "   ✅ next.config.ts (next-intl plugin)"

# Storybook
cp "$CONFIGS_DIR/.storybook/main.ts" "$PROJECT_DIR/.storybook/main.ts"
cp "$CONFIGS_DIR/.storybook/preview.ts" "$PROJECT_DIR/.storybook/preview.ts"
echo "   ✅ .storybook/main.ts + preview.ts"

# Husky hooks
cp "$CONFIGS_DIR/husky/pre-commit" "$PROJECT_DIR/.husky/pre-commit"
cp "$CONFIGS_DIR/husky/commit-msg" "$PROJECT_DIR/.husky/commit-msg"
chmod +x "$PROJECT_DIR/.husky/pre-commit" "$PROJECT_DIR/.husky/commit-msg"
echo "   ✅ .husky/pre-commit + commit-msg"

# CI/CD
cp "$CONFIGS_DIR/ci-release.yml" "$PROJECT_DIR/.github/workflows/ci-release.yml"
echo "   ✅ .github/workflows/ci-release.yml"

# =============================================================================
# 3. PACKAGE.JSON (merge scripts + config)
# =============================================================================
echo ""
echo "📦 Configurando package.json..."

if [ -f "$PROJECT_DIR/package.json" ]; then
  # Merge scripts e config do template no package.json existente
  TEMP_FILE=$(mktemp)
  python3 -c "
import json, sys

with open('$PROJECT_DIR/package.json') as f:
    pkg = json.load(f)
with open('$CONFIGS_DIR/package.json') as f:
    template = json.load(f)

# Merge scripts
if 'scripts' not in pkg:
    pkg['scripts'] = {}
for key, val in template['scripts'].items():
    if key not in pkg['scripts']:
        pkg['scripts'][key] = val

# Add config and release
pkg['config'] = template.get('config', {})
pkg['release'] = template.get('release', {})

with open('$TEMP_FILE', 'w') as f:
    json.dump(pkg, f, indent=2, ensure_ascii=False)
    f.write('\n')
" 2>/dev/null && mv "$TEMP_FILE" "$PROJECT_DIR/package.json"
  echo "   ✅ package.json (scripts + config merged)"
else
  cp "$CONFIGS_DIR/package.json" "$PROJECT_DIR/package.json"
  echo "   ✅ package.json (criado do template)"
fi

# =============================================================================
# 4. COMPONENTES SHARED (snippets)
# =============================================================================
echo ""
echo "🧩 Copiando componentes shared (snippets)..."

for file in "$SNIPPETS_DIR"/*.tsx; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    cp "$file" "$PROJECT_DIR/src/components/shared/$filename"
    echo "   ✅ shared/$filename"
  fi
done

# Hooks (use-*.ts → src/hooks/)
for file in "$SNIPPETS_DIR"/use-*.ts; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    cp "$file" "$PROJECT_DIR/src/hooks/$filename"
    echo "   ✅ hooks/$filename"
  fi
done

# =============================================================================
# 5. SEÇÕES (section templates)
# =============================================================================
echo ""
echo "📄 Copiando templates de seções..."

for file in "$SECTIONS_DIR"/*.tsx; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    cp "$file" "$PROJECT_DIR/src/components/sections/$filename"
    echo "   ✅ sections/$filename"
  fi
done

# =============================================================================
# 6. i18n MESSAGES
# =============================================================================
echo ""
echo "🌐 Configurando i18n..."

# pt-BR (source)
if [ -f "$SNIPPETS_DIR/i18n-message-template.json" ]; then
  cp "$SNIPPETS_DIR/i18n-message-template.json" "$PROJECT_DIR/src/messages/pt-BR.json"
  echo "   ✅ messages/pt-BR.json"
fi

# en (tradução)
if [ -f "$SNIPPETS_DIR/i18n-message-en.json" ]; then
  cp "$SNIPPETS_DIR/i18n-message-en.json" "$PROJECT_DIR/src/messages/en.json"
  echo "   ✅ messages/en.json"
fi

# =============================================================================
# 7. LIB (animations + utils)
# =============================================================================
echo ""
echo "📚 Criando lib files..."

# animations.ts
cat > "$PROJECT_DIR/src/lib/animations.ts" << 'ANIMATIONS_EOF'
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

export const staggerSlow = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}
ANIMATIONS_EOF
echo "   ✅ lib/animations.ts"

# utils.ts (se não existir)
if [ ! -f "$PROJECT_DIR/src/lib/utils.ts" ]; then
  cat > "$PROJECT_DIR/src/lib/utils.ts" << 'UTILS_EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
UTILS_EOF
  echo "   ✅ lib/utils.ts"
fi

# =============================================================================
# 8. PROXY (next-intl — Next.js 16+ usa proxy em vez de middleware)
# =============================================================================
echo ""
echo "🔀 Criando proxy next-intl (Next.js 16+)..."

if [ ! -f "$PROJECT_DIR/src/proxy.ts" ]; then
  cat > "$PROJECT_DIR/src/proxy.ts" << 'MIDDLEWARE_EOF'
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
MIDDLEWARE_EOF
  echo "   ✅ proxy.ts"
fi

# i18n routing config
mkdir -p "$PROJECT_DIR/src/i18n"
if [ ! -f "$PROJECT_DIR/src/i18n/routing.ts" ]; then
  cat > "$PROJECT_DIR/src/i18n/routing.ts" << 'ROUTING_EOF'
import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["pt-BR", "en"],
  defaultLocale: "pt-BR",
})
ROUTING_EOF
  echo "   ✅ i18n/routing.ts"
fi

if [ ! -f "$PROJECT_DIR/src/i18n/request.ts" ]; then
  cat > "$PROJECT_DIR/src/i18n/request.ts" << 'REQUEST_EOF'
import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
REQUEST_EOF
  echo "   ✅ i18n/request.ts"
fi

# =============================================================================
# 9. PAGE + LAYOUT
# =============================================================================
echo ""
echo "📐 Criando page.tsx e layout.tsx..."

mkdir -p "$PROJECT_DIR/src/app/[locale]"

if [ ! -f "$PROJECT_DIR/src/app/[locale]/page.tsx" ]; then
  cat > "$PROJECT_DIR/src/app/[locale]/page.tsx" << 'PAGE_EOF'
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
PAGE_EOF
  echo "   ✅ app/[locale]/page.tsx"
fi

if [ ! -f "$PROJECT_DIR/src/app/[locale]/layout.tsx" ]; then
  cat > "$PROJECT_DIR/src/app/[locale]/layout.tsx" << 'LAYOUT_EOF'
import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { Inter } from "next/font/google"
import "../globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

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
  if (!routing.locales.includes(locale as any)) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
LAYOUT_EOF
  echo "   ✅ app/[locale]/layout.tsx"
fi

# =============================================================================
# RESUMO
# =============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup completo!"
echo ""
echo "Próximos passos:"
echo "  1. Instalar dependências: npm install"
echo "  2. Gerar paleta de cores (Fase 1 do CLAUDE.md):"
echo "     python .claude/skills/lp-colors/scripts/generate-palette.py \\"
echo "       --primary \"#HEX\" --secondary \"#HEX\" --output ./src/app --mode all"
echo "  3. Iniciar shadcn/ui: npx shadcn@latest init"
echo "  4. Adicionar componentes shadcn necessários:"
echo "     npx shadcn@latest add button badge accordion"
echo "  5. Personalizar o copy em src/messages/pt-BR.json"
echo ""
echo "⚠️  VALIDAÇÃO OBRIGATÓRIA (não pular!):"
echo "  6. npm run build          # Deve passar SEM erros"
echo "  7. npm run dev            # Verificar no browser"
echo "  Se houver erros no build, corrija antes de prosseguir."
echo "  Consulte 'Validação Final' no lp-structure/SKILL.md para troubleshooting."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
