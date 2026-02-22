# Landing Page SaaS Boilerplate

Boilerplate para landing pages SaaS com estética tipo Framer.
Stack: Next.js 16+ (App Router) + shadcn/ui + Tailwind v4 + Framer Motion.
Multi-idioma (next-intl + Crowdin). Foco em conversão.

---

## Workflow de Construção

Ao criar uma nova landing page do zero, seguir estas fases EM ORDEM.
Cada fase referencia skills e configs específicos.

### Fase 0 — Setup do Projeto

1. Criar projeto Next.js: `npx create-next-app@latest`
2. **Rodar o script de setup automático** que cria a estrutura de pastas e copia configs DevOps:
   ```bash
   bash .claude/scripts/setup-project.sh .
   ```
   O script cria:
   - Configs DevOps → raiz (`.prettierrc`, `.lintstagedrc.js`, `commitlint.config.js`, `.releaserc.json`, `vitest.config.ts`, `playwright.config.ts`, `crowdin.yml`)
   - Storybook → `.storybook/` (`main.ts`, `preview.ts`)
   - Husky hooks → `.husky/` (`pre-commit`, `commit-msg`)
   - CI/CD → `.github/workflows/` (`ci-release.yml`)
   - Lib → `src/lib/` (`animations.ts`, `utils.ts`)
   - i18n config → `src/i18n/` (`routing.ts`, `request.ts`)
   - Proxy → `src/proxy.ts`
   - package.json → merge de scripts e config no existente
3. Instalar dependências (ver seção "Dependências" abaixo)
4. Iniciar shadcn/ui: `npx shadcn@latest init`
5. Adicionar componentes shadcn necessários: `npx shadcn@latest add button badge accordion`

### Fase 1 — Design System (Cores + Tokens)

> **Skill**: Ler `.claude/skills/lp-colors/SKILL.md` ANTES de começar

1. Pedir ao usuário: cor primária + cor secundária (hex)
2. Rodar o script de geração de paleta:
   ```bash
   python .claude/skills/lp-colors/scripts/generate-palette.py \
     --primary "#HEX" --secondary "#HEX" \
     --output ./src/app --mode all --preset soft --radius 0.75
   ```
3. O script gera: `globals.css` (CSS variables light+dark) + `palette-preview.html`
4. Abrir preview para o usuário validar as cores
5. Se precisar de ajuda para escolher cores, consultar `.claude/skills/lp-colors/references/color-theory.md`

### Fase 2 — Estrutura de Componentes

> **Skill**: Ler `.claude/skills/lp-structure/SKILL.md` ANTES de começar

1. Criar os componentes do zero seguindo o padrão canônico de `lp-structure`:
   - Criar seções em `src/components/sections/` (`"use client"` + `useTranslations` + `motion.div whileInView`)
   - Criar componentes shared em `src/components/shared/` conforme necessidade (SectionHeader, AnimatedSection, GlassCard, etc.)
   - Criar `src/app/[locale]/page.tsx` com a composição das seções
   - Criar `src/app/[locale]/layout.tsx` com metadata + i18n provider
2. Criar configs específicos do produto:
   - `src/config/site.ts` → metadata e branding
   - `src/config/pricing.ts` → dados de pricing
3. Personalizar componentes conforme necessidade do projeto (adicionar/remover seções, ajustar grid, etc.)
4. Adicionar componentes shadcn/ui adicionais se necessário: `npx shadcn@latest add [componente]`

### Fase 3 — Conteúdo e Copy

> **Skill**: Ler `.claude/skills/lp-copy/SKILL.md` ANTES de escrever qualquer texto

1. Criar `src/messages/pt-BR.json` com a estrutura de chaves por seção (ver mapa de chaves em `lp-copy`)
2. Preencher o copy seguindo os frameworks de lp-copy:
   - Hero: fórmula `[Action verb] + [desired outcome] + [without pain point]`
   - Benefits: padrão `[What it does] → [Why it matters] → [Proof point]`
   - Pricing: nomes descritivos (Starter, Pro, Enterprise)
   - FAQ: top 5-7 objeções como perguntas
3. Substituir todos os "ProductName" pelo nome real do produto
4. Criar `src/messages/en.json` com adaptação cultural do PT-BR (nunca tradução literal)
5. As chaves seguem o padrão: `seção.campo` (ex: `hero.title`, `pricing.pro.feature1`, `faq.q1.question`)

### Fase 4 — SEO e Metadata

> **Skill**: Ler `.claude/skills/lp-seo/SKILL.md` ANTES de configurar

1. Configurar metadata em `app/[locale]/layout.tsx` seguindo o template de lp-seo
2. Incluir chaves `metadata.*` nos arquivos i18n: `metadata.title`, `metadata.description`, `metadata.og.*`
3. Criar `app/sitemap.ts` e `app/robots.ts` seguindo os exemplos de lp-seo
4. Adicionar JSON-LD schemas (ver `lp-seo/references/schema-markup.md`):
   - SoftwareApplication (obrigatório)
   - FAQPage (se tiver FAQ)
   - Organization (recomendado)
5. Garantir heading hierarchy: h1 ÚNICO no hero, h2 por seção, h3 para sub-items
6. Criar OG image 1200x630px

### Fase 5 — i18n e Crowdin

1. Verificar que `src/messages/pt-BR.json` está completo (fonte primária)
2. Verificar que `src/messages/en.json` existe e cobre todas as chaves
3. Configurar `crowdin.yml` na raiz (já copiado dos configs na Fase 0)
4. Configurar middleware next-intl em `middleware.ts`
5. Testar language switcher no navbar

### Fase 6 — QA e Release

> **Comandos**: Usar `/checklist` para QA e `/release` para deploy

1. Rodar `/checklist` — cobre copy, design, responsive, funcionalidade, performance, cross-browser
2. Rodar `/release` — cobre code quality, testes, i18n, SEO, visual QA, semantic release

---

## Estrutura de Diretórios

```
├── .claude/
│   ├── commands/              # /release e /checklist
│   ├── skills/                # lp-colors, lp-copy, lp-structure, lp-seo
│   └── templates/
│       └── configs/           # DevOps configs para copiar na Fase 0
├── .github/workflows/         # CI/CD (Fase 0)
├── .husky/                    # Git hooks (Fase 0)
├── .storybook/                # Storybook config (Fase 0)
├── e2e/                       # Playwright E2E tests
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx     # Metadata + i18n provider (Fase 2)
│   │   │   └── page.tsx       # Composição das seções (Fase 2)
│   │   ├── globals.css        # Gerado por lp-colors (Fase 1)
│   │   ├── sitemap.ts         # lp-seo (Fase 4)
│   │   └── robots.ts          # lp-seo (Fase 4)
│   ├── components/
│   │   ├── sections/          # Criados por projeto seguindo lp-structure (Fase 2)
│   │   ├── shared/            # Criados conforme necessidade (Fase 2)
│   │   └── ui/                # shadcn/ui (via npx shadcn@latest add)
│   ├── lib/
│   │   ├── utils.ts           # cn() do shadcn (Fase 0)
│   │   ├── fonts.ts           # Config de fontes
│   │   ├── animations.ts      # Framer Motion variants (Fase 0)
│   │   └── schema.ts          # JSON-LD helpers (Fase 4)
│   ├── messages/
│   │   ├── pt-BR.json         # Fonte primária (Fase 3, via lp-copy)
│   │   └── en.json            # Adaptação cultural (Fase 3)
│   ├── config/
│   │   ├── site.ts            # Metadata, links, branding
│   │   └── pricing.ts         # Dados de pricing
│   ├── __tests__/             # Vitest unit tests
│   └── types/
│       └── index.ts
├── crowdin.yml                # Fase 0
├── .releaserc.json            # Fase 0
├── commitlint.config.js       # Fase 0
├── vitest.config.ts           # Fase 0
├── playwright.config.ts       # Fase 0
└── .prettierrc                # Fase 0
```

## Skills — Quando Usar Cada Uma

| Skill            | Fase | Ler quando...                                               |
| ---------------- | ---- | ----------------------------------------------------------- |
| **lp-colors**    | 1    | Definir paleta de cores, gerar globals.css, escolher preset |
| **lp-structure** | 2    | Criar componentes, definir layout, animações, grid          |
| **lp-copy**      | 3    | Escrever qualquer texto: headlines, CTAs, benefits, FAQ     |
| **lp-seo**       | 4    | Configurar metadata, schemas, sitemap, OG tags              |

## Dependências

```bash
# Core
npm install next@latest react@latest react-dom@latest

# UI
npm install framer-motion motion react-use-measure next-intl
npx shadcn@latest init

# DevOps
npm install -D eslint prettier eslint-config-next prettier-plugin-tailwindcss
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional @commitlint/cz-commitlint commitizen
npm install -D semantic-release @semantic-release/commit-analyzer @semantic-release/release-notes-generator @semantic-release/changelog @semantic-release/npm @semantic-release/git @semantic-release/github conventional-changelog-conventionalcommits

# Testes
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
npm install -D @storybook/nextjs @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-a11y

# Tailwind
npm install -D tailwindcss-animate
```

## Scripts npm

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --max-warnings 0",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "storybook": "storybook dev -p 6006",
    "storybook:build": "storybook build",
    "commit": "cz",
    "prepare": "husky"
  }
}
```

## Convenções

- Commits: Conventional Commits via Commitizen (`npm run commit`)
- Branches: `feature/nome`, `fix/nome`
- Nomes de arquivo: kebab-case
- Componentes: PascalCase
- Mensagens i18n: camelCase aninhado por seção (`hero.cta.primary`)
- Testes: `*.test.ts(x)` para Vitest, `*.spec.ts` para Playwright
- Stories: `*.stories.tsx` para Storybook
