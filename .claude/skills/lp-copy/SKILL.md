Copy Landing Page

Criar copy para landing pages

Criar copy para landing page, criar copy para lp, criar copy para site, criar copy para saas

## copy, landing pages, lp, landingpages, saas

name: lp-copy
description: "Copywriting guide for SaaS landing pages focused on conversion. Use when writing headlines, subheadlines, CTAs, benefit descriptions, feature copy, testimonial frameworks, pricing copy, FAQ content, or any text content for SaaS landing pages. Triggers: copy, texto, headline, CTA, copywriting, landing page text, conversion copy."

---

# SaaS Landing Page Copywriting

## Core Principles

1. Lead with outcomes, not features ("Save 10h/week" > "Automated workflows")
2. Use the PAS framework: Problem → Agitate → Solution
3. Write at 6th-grade reading level — clear, direct, scannable
4. Every section needs ONE clear purpose and ONE CTA
5. Social proof adjacent to every conversion point

## Tone & Voice

- Confident but not arrogant
- Conversational but professional
- Specific over vague ("2,500+ teams" not "many companies")
- Active voice always ("Start free" not "A free trial can be started")

## Section Copy Frameworks

### Hero Section

- **Headline**: 4-8 words, outcome-focused, no jargon
  - Formula: `[Action verb] + [desired outcome] + [without pain point]`
  - Example: "Ship faster without breaking things"
- **Subheadline**: 10-20 words expanding the how
  - Formula: `[Product category] that [key benefit] so you can [outcome]`
- **CTA Primary**: 2-4 words, action verb + value ("Start free trial", "Get started free")
- **CTA Secondary**: Lower commitment ("See how it works", "Watch demo")

### Social Proof Bar

- Format: "[Number]+ [entity] [verb] [product]"
- Example: "Trusted by 2,500+ engineering teams worldwide"
- Use real numbers, real logos, always round down

### Benefits Section

- **Title**: 3-6 words, outcome-focused
- **Description**: 1-2 sentences, specific and quantified
- Pattern: `[What it does] → [Why it matters] → [Proof point]`
- Example:
  - Title: "Deploy with confidence"
  - Description: "Automated testing catches 99.2% of bugs before they hit production. Your team ships daily instead of weekly."

### Features Section

- Lead with the user story, not the tech
- Pattern: `[User role] can [action] [qualifier]`
- Each feature: title (4-6 words) + description (2 sentences) + visual
- Use power words: automate, instant, seamless, real-time

### Testimonials

- Framework: [Specific result] + [emotional benefit] + [recommendation]
- Always include: name, role, company, photo
- Best format: "We [specific metric improvement] since switching to [product]. [Emotional benefit]. [Would recommend statement]."
- Example: "We cut deploy time by 73% since switching to ShipFast. The team actually enjoys releases now. Absolute game-changer for any engineering team."

### Pricing Section

- **Headline**: Restate value proposition ("Simple pricing for every team")
- Plan names: descriptive, not clever (Starter, Pro, Enterprise)
- Highlight the recommended plan visually
- Feature list: start with most valued features
- CTA per plan: match commitment level
- Add "Most popular" or "Recommended" badge

### FAQ Section

- Address the top 5-7 objections as questions
- Must include: pricing/billing, security, migration, support, cancellation
- Answers: 2-3 sentences max, link to docs for details
- Tone: reassuring, transparent

### Final CTA Section

- Restate the #1 benefit as headline
- Add urgency or exclusivity when genuine
- Repeat primary CTA from hero
- Include micro-copy to reduce friction ("No credit card required", "Free for 14 days", "Cancel anytime")

## i18n Copy Rules

- Never translate literally — adapt culturally
- PT-BR: more warm and personal, use "você" consistently
- EN: more direct and concise
- Keep placeholders for dynamic values: `{count}`, `{planName}`
- Structure: `messages/{locale}.json` with keys per section

## Anti-Patterns

- No "Welcome to our website" — skip pleasantries
- No "Our solution leverages..." — skip corporate speak
- No "Click here" CTAs — always describe the action
- No exclamation marks in headlines
- No "We" as first word in hero — focus on "You"
- No superlatives without proof ("best", "fastest", "#1")

## Copy Checklist

Before finalizing any section copy:

1. Does it pass the "So what?" test?
2. Is there a clear single CTA?
3. Are numbers specific and verifiable?
4. Would a 12-year-old understand the headline?
5. Is it scannable (short paragraphs, bold key phrases)?
6. Does it work in both PT-BR and EN?

## Estrutura de Chaves i18n

O copy é escrito em `src/messages/{locale}.json`. Usar o template base em `.claude/templates/snippets/i18n-message-template.json` como ponto de partida.

### Mapa de Chaves por Seção

```
metadata.title              → Título da página (SEO)
metadata.description        → Meta description (SEO)
announcement.text           → Texto do banner
hero.badge                  → Badge acima do título
hero.title                  → Headline principal (H1 — ÚNICO)
hero.subtitle               → Subtítulo
hero.cta.primary            → Botão principal
hero.cta.secondary          → Botão secundário
hero.cta.microcopy          → Texto abaixo dos CTAs
socialProof.title            → "Usado por X+ equipes..."
benefits.title              → Título da seção (H2)
benefits.item1.title        → Título do benefício
benefits.item1.description  → Descrição do benefício
features.feature1.title     → Título da feature
features.feature1.description → Descrição da feature
testimonials.item1.quote    → Depoimento
pricing.starter.name        → Nome do plano
pricing.starter.price       → Preço
pricing.starter.feature1    → Feature do plano
faq.q1.question             → Pergunta
faq.q1.answer               → Resposta
finalCta.title              → Headline final (H2)
finalCta.cta.primary        → CTA principal
footer.brand                → Nome da marca
footer.copyright            → "© {year} ProductName..."
```

### Conexão com Outras Skills

- **Estrutura**: Os componentes em `lp-structure` usam `useTranslations('seção')` — as chaves acima são exatamente o que `t("campo")` espera
- **SEO**: As chaves `metadata.*` são usadas pelo `generateMetadata()` de `lp-seo`
- **i18n**: PT-BR é a língua fonte. EN deve ser adaptação cultural, não tradução literal
