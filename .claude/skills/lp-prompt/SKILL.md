---
name: lp-prompt
description: "Gerador interativo do PROMPT.MD — o brief do produto que alimenta todo o workflow de criação de landing pages SaaS. Usar quando: (1) iniciar um novo projeto de landing page, (2) o usuário pedir para criar/gerar o PROMPT.MD, (3) o usuário quiser configurar um novo produto no boilerplate, (4) antes de rodar o CLAUDE.md workflow. Triggers: PROMPT.MD, prompt, brief, novo produto, novo projeto, configurar produto, iniciar landing page."
---

# Gerador de PROMPT.MD

O PROMPT.MD é o arquivo de configuração do produto que alimenta todo o workflow do CLAUDE.md. Sem ele, as 6 fases não têm dados para trabalhar.

## Workflow Interativo

Coletar as informações em 4 rodadas de perguntas. Em cada rodada, fazer as perguntas de uma vez e aguardar respostas antes de prosseguir.

### Rodada 1 — Identidade do Produto

Perguntar:
- **Nome do produto** — nome oficial (ex: FlowDesk, Notion, Linear)
- **Tagline** — frase curta que resume o valor (ex: "Gestão inteligente para times remotos")
- **Público-alvo** — quem compra e quem usa (ex: "CTOs e tech leads em startups")
- **Diferencial** — o que torna único vs concorrência (ex: "IA que prioriza tasks automaticamente")

### Rodada 2 — Pricing

Perguntar:
- **Planos e preços** — nomes dos planos + preço mensal cada (ex: Starter R$59, Pro R$179, Enterprise sob consulta)
- **Moeda** — BRL, USD, EUR (default: BRL)
- **Tem trial grátis?** — se sim, quantos dias (default: 14 dias, sem cartão)

### Rodada 3 — Design

Perguntar:
- **Cor primária** — hex da cor principal da marca (ex: #6C3CE1)
- **Cor secundária** — hex da cor de destaque (ex: #10B981)
- Se o usuário não souber, sugerir: consultar `.claude/skills/lp-colors/references/color-theory.md`

### Rodada 4 — Conteúdo (Opcional)

Perguntar se o usuário quer fornecer agora ou deixar para a Fase 3 (lp-copy):
- **URL do vídeo demo** — YouTube embed URL (default: placeholder)
- **Thumbnail do hero** — path da imagem (default: `/images/hero-thumbnail.png`)
- **Fases do CLAUDE.md** — quais fases executar automaticamente (default: 0 a 4)

## Template de Saída

Gerar o arquivo `.claude/PROMPT.MD` com este formato exato:

```markdown
Leia o CLAUDE.md e siga o workflow completo para criar uma landing page do zero.

O produto é o **{nome}** — {tagline}.

Informações do produto:

- Nome: {nome}
- Tagline: "{tagline}"
- Público: {público-alvo}
- Diferencial: {diferencial}
- Preço {plano1}: {moeda} {preço1}/mês, {plano2}: {moeda} {preço2}/mês, {plano3}: {preçoOuCustom}
- Cor primária: {hexPrimária}
- Cor secundária: {hexSecundária}

Comece pela Fase 0 e siga todas as fases até a Fase 4 (SEO).
Em cada fase, leia a skill correspondente antes de agir.
No copy, preencha o conteúdo real para o {nome} (não deixe placeholders).
```

## Validação Pós-Geração

Após gerar o PROMPT.MD, verificar:
1. Todas as variáveis `{...}` foram substituídas — nenhum placeholder restou
2. Hex das cores é válido (formato `#XXXXXX`, 6 dígitos)
3. Pelo menos 2 planos de pricing definidos
4. Público-alvo é específico (não genérico como "empresas")
5. Diferencial é concreto (não vago como "melhor solução")

Se alguma validação falhar, pedir correção antes de salvar.

## Onde Salvar

Salvar em `.claude/PROMPT.MD` (dentro do diretório .claude do projeto).

## Exemplo Completo

Ver [references/example-flowdesk.md](references/example-flowdesk.md) para um PROMPT.MD preenchido com dados reais do produto FlowDesk.

## Conexão com o Workflow

O PROMPT.MD alimenta:
- **Fase 0** (Setup) — nome do produto para configs
- **Fase 1** (Cores) — cores primária e secundária para `generate-palette.py`
- **Fase 2** (Estrutura) — nome e tagline para personalizar componentes
- **Fase 3** (Copy) — todos os campos para preencher i18n JSONs
- **Fase 4** (SEO) — nome, tagline, descrição para metadata

Ver [references/field-mapping.md](references/field-mapping.md) para o mapeamento completo campo → chave i18n.
