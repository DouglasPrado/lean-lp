# Landing Page SaaS Boilerplate

Boilerplate para landing pages SaaS com estética tipo Framer.
Stack: Next.js 16+ (App Router) + shadcn/ui + Tailwind v4 + Framer Motion.
Multi-idioma (next-intl + Crowdin). Foco em conversão.

---

## Workflow de Construção

Ao criar uma nova landing page do zero, seguir estas fases EM ORDEM.
Cada fase referencia skills, templates e configs específicos.

### Fase 0 — Setup do Projeto

1. Criar projeto Next.js: `npx create-next-app@latest`
2. **Rodar o script de setup automático** que copia TUDO (configs, templates, snippets, i18n, page/layout):
   ```bash
   bash .claude/scripts/setup-project.sh .
   ```
   O script cria toda a estrutura de pastas e copia:
   - Configs DevOps → raiz (`.prettierrc`, `.lintstagedrc.js`, `commitlint.config.js`, `.releaserc.json`, `vitest.config.ts`, `playwright.config.ts`, `crowdin.yml`)
   - Storybook → `.storybook/` (`main.ts`, `preview.ts`)
   - Husky hooks → `.husky/` (`pre-commit`, `commit-msg`)
   - CI/CD → `.github/workflows/` (`ci-release.yml`)
   - Snippets → `src/components/shared/` (todos os `.tsx`)
   - Seções → `src/components/sections/` (todos os `.tsx`)
   - i18n → `src/messages/` (`pt-BR.json` + `en.json`)
   - Lib → `src/lib/` (`animations.ts`, `utils.ts`)
   - i18n config → `src/i18n/` (`routing.ts`, `request.ts`)
   - Middleware → `src/middleware.ts`
   - Page + Layout → `src/app/[locale]/` (`page.tsx`, `layout.tsx`)
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
>
> **Nota**: O `setup-project.sh` (Fase 0) já copiou os snippets, seções, animations.ts, utils.ts, page.tsx e layout.tsx. Esta fase é para **personalizar e ajustar**.

1. Verificar que a estrutura foi criada pelo setup:
   - `src/components/shared/` → 10 snippets (section-header, animated-section, animated-group, infinite-slider, glass-card, glowing-effect, cta-button-pair, badge-pill, gradient-text, language-switcher)
   - `src/components/sections/` → 11 seções (announcement-bar, navbar, hero, social-proof, benefits, features, testimonials, pricing, faq, final-cta, footer)
   - `src/lib/animations.ts` → variants Framer Motion (fadeUp, fadeIn, scaleIn, staggerContainer, staggerSlow)
   - `src/app/[locale]/page.tsx` → composição das seções
   - `src/app/[locale]/layout.tsx` → metadata + i18n provider
2. Criar configs específicos do produto:
   - `src/config/site.ts` → metadata e branding
   - `src/config/pricing.ts` → dados de pricing
3. Personalizar componentes conforme necessidade do projeto (adicionar/remover seções, ajustar grid, etc.)
4. Adicionar componentes shadcn/ui adicionais se necessário: `npx shadcn@latest add [componente]`

### Fase 3 — Conteúdo e Copy

> **Skill**: Ler `.claude/skills/lp-copy/SKILL.md` ANTES de escrever qualquer texto
>
> **Nota**: O `setup-project.sh` (Fase 0) já copiou `pt-BR.json` e `en.json` para `src/messages/`. Esta fase é para **preencher o conteúdo real**.

1. Abrir `src/messages/pt-BR.json` — já contém a estrutura completa de chaves por seção
2. Preencher o copy seguindo os frameworks de lp-copy:
   - Hero: fórmula `[Action verb] + [desired outcome] + [without pain point]`
   - Benefits: padrão `[What it does] → [Why it matters] → [Proof point]`
   - Pricing: nomes descritivos (Starter, Pro, Enterprise)
   - FAQ: top 5-7 objeções como perguntas
3. Substituir todos os "ProductName" pelo nome real do produto
4. Abrir `src/messages/en.json` — já existe com tradução cultural, ajustar com o conteúdo real do produto
5. As chaves seguem o padrão: `seção.campo` (ex: `hero.title`, `pricing.pro.feature1`, `faq.q1.question`)

### Fase 4 — SEO e Metadata

> **Skill**: Ler `.claude/skills/lp-seo/SKILL.md` ANTES de configurar

1. Configurar metadata em `app/[locale]/layout.tsx` seguindo o template de lp-seo
2. As chaves de metadata já estão no template i18n: `metadata.title`, `metadata.description`, `metadata.og.*`
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
│       ├── configs/           # DevOps configs para copiar na Fase 0
│       ├── sections/          # Templates TSX das 11 seções
│       └── snippets/          # Componentes shared + i18n template
├── .github/workflows/         # CI/CD (copiar de configs/)
├── .husky/                    # Git hooks (copiar de configs/)
├── .storybook/                # Storybook config (copiar de configs/)
├── e2e/                       # Playwright E2E tests
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx     # Metadata + i18n provider
│   │   │   └── page.tsx       # Composição das seções
│   │   ├── globals.css        # Gerado por lp-colors (Fase 1)
│   │   ├── sitemap.ts         # lp-seo (Fase 4)
│   │   └── robots.ts          # lp-seo (Fase 4)
│   ├── components/
│   │   ├── sections/          # Copiados de templates/sections/ (Fase 2)
│   │   ├── shared/            # Copiados de templates/snippets/ (Fase 2)
│   │   └── ui/                # shadcn/ui (via npx shadcn@latest add)
│   ├── lib/
│   │   ├── utils.ts           # cn() do shadcn
│   │   ├── fonts.ts           # Config de fontes
│   │   ├── animations.ts      # Framer Motion variants (Fase 2)
│   │   └── schema.ts          # JSON-LD helpers (Fase 4)
│   ├── messages/
│   │   ├── pt-BR.json         # Copiado de i18n-message-template.json (Fase 3)
│   │   └── en.json            # Tradução cultural (Fase 3)
│   ├── config/
│   │   ├── site.ts            # Metadata, links, branding
│   │   └── pricing.ts         # Dados de pricing
│   ├── __tests__/             # Vitest unit tests
│   └── types/
│       └── index.ts
├── crowdin.yml                # Copiado de configs/ (Fase 0)
├── .releaserc.json            # Copiado de configs/ (Fase 0)
├── commitlint.config.js       # Copiado de configs/ (Fase 0)
├── vitest.config.ts           # Copiado de configs/ (Fase 0)
├── playwright.config.ts       # Copiado de configs/ (Fase 0)
└── .prettierrc                # Copiado de configs/ (Fase 0)
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
