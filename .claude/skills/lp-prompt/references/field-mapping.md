# Mapeamento: PROMPT.MD → i18n Keys

Como cada campo do PROMPT.MD se traduz nas chaves dos JSONs de i18n (`pt-BR.json` / `en.json`).

## Campos Diretos

| Campo PROMPT.MD | Chaves i18n afetadas                                                                  |
| --------------- | ------------------------------------------------------------------------------------- |
| Nome            | `navbar.brand`, `footer.brand`, `metadata.siteName`, todas as menções a "ProductName" |
| Tagline         | `footer.tagline`, `metadata.og.title` (parcial)                                       |
| Público         | Informa o tom do copy em `hero.subtitle`, `benefits.*`, `features.*`                  |
| Diferencial     | Alimenta `hero.title`, `hero.titleWord1/2/3`, `features.feature1-5`                   |

## Campos de Pricing

| Campo PROMPT.MD | Chaves i18n                                                                             |
| --------------- | --------------------------------------------------------------------------------------- |
| Plano 1 nome    | `pricing.starter.name`                                                                  |
| Plano 1 preço   | `pricing.starter.monthlyPrice`, `pricing.starter.yearlyPrice` (calcular ~80% do mensal) |
| Plano 2 nome    | `pricing.pro.name`                                                                      |
| Plano 2 preço   | `pricing.pro.monthlyPrice`, `pricing.pro.yearlyPrice`                                   |
| Plano 3 nome    | `pricing.enterprise.name`                                                               |
| Plano 3 preço   | `pricing.enterprise.customPrice` (se "sob consulta")                                    |
| Moeda           | `pricing.currency` (BRL, USD, EUR)                                                      |
| Trial           | `hero.cta.microcopy`, `faq.q1.answer`                                                   |

## Campos de Design

| Campo PROMPT.MD | Uso                                                               |
| --------------- | ----------------------------------------------------------------- |
| Cor primária    | Input `--primary` do `generate-palette.py` → gera `globals.css`   |
| Cor secundária  | Input `--secondary` do `generate-palette.py` → gera `globals.css` |

## Campos Opcionais

| Campo PROMPT.MD | Chaves i18n            |
| --------------- | ---------------------- |
| URL vídeo demo  | `hero.video.src`       |
| Thumbnail hero  | `hero.video.thumbnail` |

## Chaves Derivadas (geradas na Fase 3 via lp-copy)

Estas chaves NÃO vêm diretamente do PROMPT.MD, mas são geradas pelo Claude na Fase 3 usando as informações do brief como contexto:

- `hero.badge` — novidade/versão
- `hero.titleWord1/2/3` — 3 verbos-chave do diferencial
- `benefits.item1-4.*` — benefícios derivados do diferencial + público
- `testimonials.item1-3.*` — depoimentos fictícios baseados no público
- `faq.q1-6.*` — perguntas derivadas do pricing + diferencial
- `socialProof.marquee1/2` — badges de credibilidade
- `finalCta.*` — CTA final baseado no benefício principal
- `metadata.*` — SEO metadata derivada do nome + tagline + diferencial
