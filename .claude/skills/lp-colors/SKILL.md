---
name: lp-colors
description: "Color palette generator and design system guide for SaaS landing pages using shadcn/ui + Tailwind CSS. Use when creating color palettes, generating CSS variables, setting up themes (light/dark), configuring tailwind.config.ts, choosing brand colors, or any color/theming task. Includes a Python script that generates complete globals.css + tailwind.config.ts from two hex colors. Triggers: colors, palette, theme, dark mode, CSS variables, brand colors, tailwind config, design system, primary color, secondary color."
---

# SaaS Landing Page Color System

## Quick Start

Generate a complete color system from primary + secondary hex colors:

```bash
python .claude/skills/lp-colors/scripts/generate-palette.py \
  --primary "#6366f1" \
  --secondary "#ec4899" \
  --output ./src/app \
  --mode all \
  --preset soft \
  --radius 0.75
```

This outputs: `globals.css` (com CSS variables + keyframes para Tailwind v4) + `palette-preview.html`

> **Tailwind v4**: O globals.css gerado já contém tudo que o Tailwind v4 precisa via `@theme inline`. Não é necessário `tailwind.config.ts` — use `--mode all` (default) que gera apenas globals.css + preview.

## Script Options

| Flag          | Values                          | Default  | Description                                      |
| ------------- | ------------------------------- | -------- | ------------------------------------------------ |
| `--primary`   | hex color                       | required | Primary brand color                              |
| `--secondary` | hex color                       | required | Secondary brand color                            |
| `--output`    | path                            | `.`      | Output directory                                 |
| `--preset`    | minimal, soft, bold, dark-first | soft     | Style preset                                     |
| `--radius`    | float (rem)                     | 0.5      | Border radius base                               |
| `--mode`      | globals, tailwind, both, all    | all      | What files to generate (all = globals + preview) |
| `--preview`   | flag                            | false    | Also generate HTML preview                       |

### Presets

- **minimal**: Clean white backgrounds, low saturation muted colors. Corporate SaaS.
- **soft**: Warm tinted backgrounds, medium saturation. Consumer-friendly.
- **bold**: Saturated muted colors, visible tinting. Startups, disruptive brands.
- **dark-first**: Optimized for dark mode as primary. Dev tools, premium products.

## Workflow

1. **Choose colors**: Pick primary + secondary hex values (see references/color-theory.md for guidance)
2. **Run script**: `python .claude/skills/lp-colors/scripts/generate-palette.py --primary "#HEX" --secondary "#HEX" --output ./src/app --mode all`
3. **Preview**: Abrir `palette-preview.html` para o usuário validar visualmente
4. **Copy**: O `globals.css` já é gerado diretamente em `src/app/` — substituir o existente
5. **Adjust**: Fine-tune HSL values específicos em globals.css se necessário
6. **Cleanup**: Deletar `palette-preview.html` após validação

## What Gets Generated

### globals.css (Tailwind v4 — arquivo único, sem config JS)

- `@import "tailwindcss"` + `@custom-variant dark`
- `@theme inline {}` com `--color-*` mappings + `--radius`
- `:root {}` com todas as HSL variables do light theme
- `.dark {}` com todas as HSL variables do dark theme
- `@theme {}` com animations (fade-up, fade-in, scale-in)
- `@keyframes` para cada animação
- `@layer base` com estilos de `body` e `border`

### tailwind.config.ts (LEGACY — apenas para Tailwind v3)

- Disponível via `--mode tailwind` mas NÃO recomendado para Next.js 16
- O globals.css gerado pelo mode `all` já contém tudo necessário

### Generated Color Slots

| Slot          | Light                     | Dark             | Usage                 |
| ------------- | ------------------------- | ---------------- | --------------------- |
| `primary`     | Brand at L:35-55          | Brand at L:55-70 | CTAs, active states   |
| `secondary`   | Low-sat, L:92             | Low-sat, L:15    | Secondary buttons     |
| `accent`      | Derived from P+S midpoint | Same, dark       | Hover, highlights     |
| `muted`       | Low-sat, L:~95            | Low-sat, L:15    | Backgrounds, disabled |
| `destructive` | Red H:0                   | Red H:0          | Errors, delete        |
| `border`      | Low-sat, L:~88-90         | Low-sat, L:15    | Borders, dividers     |
| `card`        | Near white                | Near black       | Card surfaces         |
| `chart-1..5`  | 5 distinct colors         | Same, lighter    | Recharts, charts      |
| `sidebar-*`   | Full set                  | Full set         | Dashboard sidebar     |

Each slot also generates a `-foreground` variant with appropriate contrast.

## Color Selection Tips

- Run script with `--mode all` to get the preview HTML
- Primary lightness 35-55% works best for button contrast
- Use analogous colors (adjacent hues) for harmony, complementary (opposite) for energy
- For color pairing ideas by SaaS category, see [references/color-theory.md](references/color-theory.md)

## Manual Adjustments

After generating, common tweaks in `globals.css`:

- **More vibrant muted**: Increase saturation in `--muted` (e.g., 20.9% → 30%)
- **Softer borders**: Increase lightness in `--border` (e.g., 88% → 92%)
- **Warmer dark mode**: Add slight hue shift to dark `--background`
- **Better contrast**: Adjust `--primary` lightness down for light, up for dark

## Conexão com Outras Skills

- **Estrutura**: Os templates de seções em `lp-structure` e `.claude/templates/sections/` usam classes como `bg-primary`, `text-muted-foreground`, `border-border/50` — essas classes dependem das CSS variables geradas por este script. Gerar cores ANTES de criar componentes
- **Copy/i18n**: As cores não afetam o copy, mas o preset escolhido (minimal/soft/bold) deve ser coerente com o tom de voz definido em `lp-copy`
- **SEO**: O `globals.css` gerado inclui `@layer base` com estilos de `body` que afetam o rendering da página
- **Fase no Workflow**: Esta skill é usada na **Fase 1** do CLAUDE.md — antes de estrutura, copy e SEO

## Integração com o Projeto

O script gera arquivos que vão diretamente no projeto:

- `globals.css` → substituir `src/app/globals.css`
- `tailwind.config.ts` → Só usar se projeto não estiver com Tailwind v4 puro. Next.js 16 com Tailwind v4 usa CSS-only config via `@theme` no globals.css (que o script já gera)
- `palette-preview.html` → abrir para o usuário validar, depois pode ser deletado
