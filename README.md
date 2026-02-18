# Dify Agent

[![Tests](https://github.com/DouglasPrado/dify-agent/workflows/Tests/badge.svg)](https://github.com/DouglasPrado/dify-agent/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/DouglasPrado/dify-agent/branch/main/graph/badge.svg)](https://codecov.io/gh/DouglasPrado/dify-agent)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.x-brightgreen.svg)](https://nodejs.org/)
[![pnpm Version](https://img.shields.io/badge/pnpm-10.22.0-blue.svg)](https://pnpm.io/)

Orquestrador de agentes definidas em YAML, agora baseado em LangGraph para execução paralela ou sequencial, com geração de artefatos, knowledge base vetorial e conexões dinâmicas para tools/MCP.

## Índice

- [Funcionalidades Principais](#funcionalidades-principais)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Setup](#instalação-e-setup)
- [Ferramentas Disponíveis](#ferramentas-disponíveis)
  - [Busca e Web](#busca-e-web)
  - [Knowledge Base](#knowledge-base)
  - [Banco de Dados](#banco-de-dados)
  - [Arquivos e Documentos](#arquivos-e-documentos)
  - [Geração de Artefatos](#geração-de-artefatos)
  - [Git e Version Control](#git-e-version-control)
- [Estrutura de um Agente YAML](#estrutura-de-um-agente-yaml)
- [Exemplos de Workflows Completos](#exemplos-de-workflows-completos)
- [Knowledge Base](#knowledge-base-1)
- [Execução e Gerenciamento de Estado](#execução-e-gerenciamento-de-estado)
- [Human-in-the-Loop (HITL)](#human-in-the-loop-hitl)
- [Validação Automática](#validação-automática)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Configuração de Ambiente](#configuração-de-ambiente)
- [Casos de Uso Avançados](#casos-de-uso-avançados)
- [Troubleshooting](#troubleshooting)
- [Checklist de Criação de Agente](#checklist-de-criação-de-agente)
- [Contribuindo](#contribuindo)
- [Roadmap](#roadmap)

## Funcionalidades Principais

- ✅ **Orquestração em LangGraph**: Paralelismo automático quando os todos não têm dependências e checkpointing opcional em PostgreSQL
- ✅ **17 Ferramentas Integradas + Conexões Dinâmicas**: Web, Git, DB, artefatos e MCP com sintaxe `tool@connection`
- ✅ **Knowledge Base Vetorial**: Busca semântica com PostgreSQL + pgvector
- ✅ **Human-in-the-Loop (HITL)**: Gates de aprovação humana em tarefas críticas
- ✅ **Estado Persistente**: Execução resumível a partir do último ponto (state.json + checkpoints)
- ✅ **Memória Contextual**: Histórico completo quando cabe em tokens; senão, resumo preservando entidades e repassado ao chat/workflows
- ✅ **Validação Automática**: LLM valida outputs contra critérios definidos (com retry limitado)
- ✅ **Retry com Feedback**: Tentativas automáticas com contexto de falhas
- ✅ **Multi-LLM e Seleção Adaptativa**: Suporte OpenAI/Anthropic e override por tarefa

## Pré-requisitos

- **Node.js 18+** e **pnpm**
- **Variáveis obrigatórias**: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` (opcional)
- **Para buscas web**: `TAVILY_API_KEY`
- **Para knowledge base**: `DATABASE_URL` (PostgreSQL + pgvector) e migrations aplicadas
- **Para PRs no Bitbucket**: `BITBUCKET_USERNAME`, `BITBUCKET_APP_PASSWORD`
- **Para PRs no GitHub**: `gh` CLI instalado

## Instalação e Setup

```bash
# 1. Clone e instalação
git clone <seu-repo>
cd dify-agent
pnpm install

# 2. Configurar .env
cp .env.example .env
# Editar .env com suas chaves API

# 3. Setup banco de dados (obrigatório)
createdb dify_agent
psql dify_agent -c "CREATE EXTENSION vector;"
pnpm prisma generate
pnpm prisma migrate dev

# 4. Migrar workflows existentes para o banco (se houver pasta agents/)
# Primeiro, obtenha o userId de um usuário no banco:
psql dify_agent -c "SELECT id FROM users LIMIT 1;"
# Depois, execute a migração:
tsx scripts/migrate-workflows-to-db.ts --userId=<seu-user-id>

# 5. (Opcional) Indexar knowledge base
pnpm sync-knowledge MVPBuilder

# 6. Executar workflow via chat
pnpm chat:ui
# Ou via CLI:
pnpm main-chat --userId=<seu-user-id>
```

**Nota**: A partir da versão atual, os workflows são gerenciados no banco de dados PostgreSQL, não mais em arquivos YAML na pasta `agents/`. Veja a seção [Gerenciamento de Workflows](#gerenciamento-de-workflows) para mais detalhes.

## Chat UI (Next.js)

Interface web simples para o chat do `main-chat.ts`, com streaming SSE e resolucao de imports via workspace root.

```bash
pnpm -C apps/chat-ui install
pnpm chat:ui
```

Abra `http://localhost:3000`. A UI reutiliza o `.env` da raiz (OpenAI, DATABASE_URL, etc.).
O painel de mensagens tem altura fixa com rolagem interna para manter o campo de resposta estático.
A thread ocupa 100% da altura da viewport com conteudo centralizado em `max-width: 56rem`.
O composer fica absoluto no rodape do painel para manter o historico visivel.
Para definir o usuario, passe `?userId=seu-id` na URL.

## Ferramentas Disponíveis

O sistema oferece 16 ferramentas integradas, registradas em `src/tools/registry.ts`. Todas suportam aliases para flexibilidade.

### Busca e Web

#### `internet_search` / `tavily`

Busca na web via Tavily API.

**Parâmetros**:

- `query` (string, obrigatório): Consulta de busca
- `maxResults` (number, default=5): Máximo de resultados
- `topic` (enum: "general"|"news"|"finance", default="general"): Categoria
- `includeRawContent` (boolean, default=false): Incluir conteúdo bruto

**Exemplo**:

```yaml
tools: ["internetSearch"]
task: "Pesquisar tendências de IA em 2025"
```

#### `web_crawl`

Extrai conteúdo completo de uma URL específica.

**Parâmetros**:

- `url` (string, obrigatório): URL para extrair conteúdo

**Casos de uso**: Análise de competidores, scraping de documentação

#### `fetch_page`

Requisição HTTP GET com controle de tamanho e headers.

**Parâmetros**:

- `url` (string, obrigatório): URL para buscar
- `maxLength` (number, default=1200): Tamanho máximo do body
- `includeHeaders` (boolean, default=false): Retornar headers

**Casos de uso**: Verificação de status, download de conteúdo

#### `http_request`

Cliente HTTP genérico com timeout, retry e validação anti-SSRF.

**Parâmetros**:

- `url` (string, obrigatório): URL completa
- `method` (enum): GET/POST/PUT/DELETE/PATCH/HEAD/OPTIONS
- `headers` (object): Headers customizados
- `body` (string, opcional): Payload
- `timeout` (number, default=30000)
- `maxRetries` (number, default=3)
- `followRedirects` (boolean, default=true)

**Segurança**: valida URL e revalida redirects antes de seguir.

### Knowledge Base

#### `knowledge_search`

Busca semântica em base vetorial (PostgreSQL + pgvector).

**Parâmetros**:

- `query` (string, obrigatório): Pergunta ou tópico
- `agentName` (string, obrigatório): Nome da estratégia (ex: "MVPBuilder")
- `limit` (number, default=5): Máximo de resultados
- `similarityThreshold` (number, default=0.7): Threshold de similaridade (0-1)

**Retorna**: Resultados com texto, fonte, similaridade e metadata

**Fluxo**: Query → Embedding → Cosine similarity → Top K results

**Exemplo**:

```yaml
tools: ["knowledgeSearch"]
task: "Buscar padrões de arquitetura no knowledge base"
```

### Banco de Dados

#### `postgres_query`

Executa queries SQL diretamente no PostgreSQL.

**Parâmetros**:

- `query` (string, obrigatório): SQL query
- `params` (array, opcional): Parâmetros para query parametrizada

**Retorna**: rows, rowCount, fields

⚠️ **Aviso**: Validar queries em produção para evitar SQL injection

### Arquivos e Documentos

#### `documents_search`

Lê arquivo local e busca texto específico.

**Parâmetros**:

- `filePath` (string, obrigatório): Caminho do arquivo
- `query` (string, opcional): Texto para localizar
- `maxLength` (number, default=800): Tamanho máximo da resposta

**Segurança**: leitura restrita a allowlist (por padrão `agents/` e `docs/`).

**Casos de uso**: Extrair trechos de documentação e outputs de workflows

### Geração de Artefatos

Ferramentas de artefato ficam em `src/tools/artifacts` (path resolver seguro + árvore de markdown). Todas usam `runDir` e salvam em `artefacts/`.

#### `save_markdown_tree` / `render_markdown`

Cria/atualiza uma árvore de markdown (`*.tree.json`) e gera o `.md` final com deduplicação opcional.

**Parâmetros**:

- `operation` ("create" | "update" | "append" | "insert")
- `content` (string): Markdown bruto a aplicar
- `path` (string[], opcional): Caminho de headings para atualizar
- `position` (para insert): "before" | "after" | "replace"
- `outputName` (string, opcional): Nome do tree/markdown
- `enableDeduplication` (boolean, default=true)
- `runDir` (string, obrigatório)

**Retorna**: `treePath` ou `markdownPath` + estatísticas do documento (headings, listas, linhas etc.)

#### `generate_csv` / `csv`

Cria CSV de objetos ou texto raw.

**Parâmetros**:

- `rows` (array de objetos, opcional): Linhas do CSV
- `raw` (string, opcional): CSV raw como texto
- `delimiter` (string, default=","): Delimitador
- `outputName` (string, opcional): Nome do arquivo
- `runDir` (string, obrigatório): Diretório base

**Modo append**: Adiciona linhas preservando header existente

**Casos de uso**: Export de dados, matrizes comparativas, tabelas

#### `generate_json` / `json`

Cria ou faz merge de JSON com deep merge.

**Parâmetros**:

- `data` (any, obrigatório): Objeto ou valor a serializar
- `pretty` (boolean, default=true): Pretty-print com 2 espaços
- `outputName` (string, opcional): Nome do arquivo
- `runDir` (string, obrigatório): Diretório base

**Merge**: Objetos mesclados recursivamente, arrays concatenados

**Casos de uso**: Configurações, dados estruturados, APIs

#### `generate_yaml` / `yaml` / `yml`

Cria ou faz merge de YAML (.yml/.yaml) com deep merge.

**Parâmetros**:

- `data` (any, obrigatório): Objeto ou valor a serializar
- `indent` (number, default=2): Espaços de indentação
- `outputName` (string, opcional): Nome do arquivo
- `runDir` (string, obrigatório): Diretório base

**Merge**: Mesclagem profunda + concatenação de arrays

#### `generate_html`

Gera HTML simples ou a partir de Markdown.

**Parâmetros**:

- `content` (string): HTML ou Markdown
- `title` (string, default="Documento")
- `markdownMode` (boolean, default=false)
- `customStyles` / `scripts` / `meta` (opcionais)
- `outputName` / `runDir`

#### `generate_pdf`

Converte Markdown/HTML em PDF usando `wkhtmltopdf` ou `chromium`.

**Parâmetros**:

- `content` (string)
- `markdownMode` (boolean, default=false)
- `includeTableOfContents` (boolean, default=false)
- `margins`, `pageSize`, `orientation`, `customStyles`
- `outputName` / `runDir`

#### `generate_png`

Gera imagens via OpenAI Images (gpt-image-\*).

**Parâmetros**:

- `prompt` (string)
- `size` ("256x256" | "512x512" | "1024x1024")
- `outputName` / `runDir`

**Retorna**: `path`, `size`, metadata de geração

**Merge**: Objetos mesclados recursivamente, arrays concatenados e reuso de artefatos existentes em `artefacts/` quando o nome coincide

**Casos de uso**: Manifests YAML (root.yml), configs de serviços, templates de orquestração

#### `generate_png` / `png`

Gera imagem via DALL-E da OpenAI.

**Parâmetros**:

- `prompt` (string, obrigatório): Descrição da imagem
- `outputName` (string, opcional): Nome do arquivo
- `runDir` (string, obrigatório): Diretório base
- `size` (string, default="1024x1024"): Tamanho da imagem

**Requer**: `OPENAI_API_KEY`

**Casos de uso**: Diagramas, mockups, ilustrações

### Git e Version Control

#### `git_status` / `status`

Verifica status do repositório Git.

**Parâmetros**:

- `short` (boolean, default=true): Formato curto (--short)
- `workingDir` (string, opcional): Diretório de trabalho

**Retorna**: stdout, stderr, code, summary

#### `git_commit` / `commit`

Stage e cria commit.

**Parâmetros**:

- `message` (string, obrigatório): Mensagem do commit
- `files` (array de strings, opcional): Arquivos para add (default: todos)
- `options` (objeto, opcional):
  - `amend` (boolean): Amend do commit anterior
  - `allowEmpty` (boolean): Permitir commit vazio
- `workingDir` (string, opcional): Diretório de trabalho

**Casos de uso**: Automação de commits em workflows

#### `git_pull` / `pull`

Atualiza branch do remote.

**Parâmetros**:

- `remote` (string, default="origin"): Remote de origem
- `branch` (string, opcional): Branch (default: atual)
- `rebase` (boolean, default=false): Usar rebase
- `workingDir` (string, opcional): Diretório de trabalho

**Casos de uso**: Sincronizar antes de criar PR

#### `git_push` / `push`

Envia commits para remote.

**Parâmetros**:

- `remote` (string, default="origin"): Remote de destino
- `branch` (string, opcional): Branch (default: atual)
- `force` (boolean, default=false): Force push
- `allowForce` (boolean, default=false): Confirmação de force (segurança)
- `setUpstream` (boolean, default=false): Set upstream (-u)
- `workingDir` (string, opcional): Diretório de trabalho

⚠️ **Segurança**: `allowForce` obrigatório para force push

#### `create_pull_request` / `pr`

Cria Pull Request no GitHub (gh CLI) ou Bitbucket (API).

**Parâmetros**:

- `title` (string, obrigatório): Título do PR
- `body` (string, opcional): Descrição do PR
- `base` (string, default="main"): Branch base
- `head` (string, opcional): Branch source (default: atual)
- `draft` (boolean, default=false): Criar como draft
- `labels` (array de strings, opcional): Labels
- `reviewers` (array de strings, opcional): Reviewers
- `remote` (string, default="origin"): Remote
- `workingDir` (string, opcional): Diretório de trabalho
- `platform` (enum: "github"|"bitbucket", opcional): Forçar plataforma

**Retorna**: URL do PR criado

**Detecção automática**: Identifica plataforma pelo remote URL

## Estrutura de um Agente YAML

### Schema Completo

```yaml
root:
  strategy: string # Nome do agente (obrigatório)
  context?: string # Contexto compartilhado (opcional)
  processes: # Lista de processos (obrigatório)
    - name: string # Nome do processo (obrigatório)
      description?: string # Descrição opcional
      input?: string # Instruções de input
      output?: string[] # Outputs esperados
      validation?: string # Critério de validação
      artefacts?: string[] # Templates esperados
      todos: # Lista de tarefas (obrigatório, >= 1)
        - name: string # Nome da tarefa (obrigatório)
          task?: string # Descrição da tarefa
          method?: string # Como executar
          tools?: string[] # Ferramentas permitidas
          validation?: string # Critério de validação
          retryLimit?: number # Tentativas (default: 0)
          artefacts?: string[] # Artefatos a gerar
          requiresApproval?: boolean # Gate HITL
          model?: string # Modelo LLM específico
```

### Seleção de Modelo

- **Default**: `gpt-4o-mini`
- **Override por todo**: `model: "gpt-4o-mini"`
- **Configuração**: `src/config/models.ts`
- **Parâmetros**: temperature (0.7), timeout (120s), maxTokens (16000), recursionLimit (5)

### Templates de Artefatos

**Localização**: `agents/<Strategy>/_data/<ordem>-<Processo>/`

**Exemplo de estrutura**:

```
agents/MVPBuilder/_data/
├── 01-ColetarContexto/
│   └── contexto-projeto.md
├── 02-DefinirFuncionalidades/
│   └── funcionalidades.md
└── 03-DefinirArquitetura/
    └── arquitetura.md
```

## Exemplos de Workflows Completos

### MVPBuilder - Estruturação de MVP

**Objetivo**: Documentar completamente um MVP para desenvolvimento

**Processos** (7):

1. ColetarContexto → contexto-projeto.md
2. DefinirFuncionalidades → funcionalidades.md (método MoSCoW)
3. DefinirArquitetura → arquitetura.md (stack técnico)
4. EspecificarUI → especificacoes-ui.md (design system)
5. CriarTickets → issues.md (GitHub issues)
6. EstruturarBackend → estrutura-backend.md
7. EstruturarFrontend → estrutura-frontend.md

**Execução**:

```bash
pnpm dev agents/MVPBuilder/root.yml --input "App de gestão de tarefas para equipes remotas"
```

**Saídas**: `agents/MVPBuilder/_runs/<timestamp>/artefacts/` com 7 documentos

**Ferramentas usadas**: knowledgeSearch, internetSearch, webCrawl, generateMarkdown

### PRCreator - Automação de Pull Requests

**Objetivo**: Criar commits e PRs de forma segura

**Processos** (4):

1. PreFlight → Verificar status do repositório
2. CommitarMudancas → Stage e commit validado
3. MesclarBase → Merge da branch base (opcional rebase)
4. PublicarPR → Push e criação de PR

**Execução**:

```bash
pnpm dev agents/PRCreator/root.yml --input "Atualizar README com melhorias" --auto
```

**Ferramentas usadas**: gitStatus, gitCommit, gitPull, gitPush, createPullRequest

**Sem artefatos**: Workflow de comandos Git puros

### SaaSReverseEngineering - Análise de Competidores

**Objetivo**: Análise profunda de plataforma SaaS concorrente

**Processos** (6):

1. ColetarContexto → Objetivos e análise de mercado
2. MapearPlataforma → 10-15 URLs chave
3. ExtrairInformacoes → Scraping estruturado
4. AnalisarPlataforma → 4 documentos de análise
5. IdentificarOportunidades → SWOT + matriz de oportunidades
6. GerarHipoteses → 5-10 hipóteses com top 3-5 priorizadas

**Execução**:

```bash
pnpm dev agents/SaaSReverseEngineering/root.yml --input "https://notion.so - analisar pricing"
```

**Artefatos** (12+): contexto, mapeamento, dados brutos, análises, SWOT, oportunidades, hipóteses

**Ferramentas usadas**: internetSearch, webCrawl, knowledgeSearch, generateMarkdown, generateCsv

### Naming - Naming Estratégico

**Objetivo**: Processo criativo para naming de produto/empresa

**Processos** (7): Briefing, matriz de inspiração, word bank, filtros, testes, decisão

**Ferramentas**: internetSearch, knowledgeSearch, generateMarkdown

## Knowledge Base

### Estrutura

- **Localização**: `agents/<Strategy>/knowledge/`
- **Formatos**: Markdown, texto
- **Indexação**: Embeddings via OpenAI (text-embedding-3-small, 1536 dim)
- **Storage**: PostgreSQL + pgvector

### Configuração do Banco

```bash
# 1. Criar banco com pgvector
createdb dify_agent
psql dify_agent -c "CREATE EXTENSION vector;"

# 2. Aplicar migrations
pnpm prisma:migrate

# 3. Indexar knowledge
pnpm sync-knowledge MVPBuilder
# ou atalho
pnpm sync-knowledge:zeroum
```

### Schema do Banco

```sql
-- Documentos
knowledge_documents (id, agent_name, file_name, file_path, file_type, content, metadata, created_at)

-- Embeddings com chunks
knowledge_embeddings (id, document_id, chunk_index, chunk_text, embedding vector(1536), metadata, created_at)
```

### Busca Semântica

- **Threshold primário**: 0.7 (similaridade mínima)
- **Fallback**: 0.65 (se nenhum resultado em 0.7)
- **Query variants**: Até 3 variações por query (se `ENABLE_LLM_QUERY_VARIANTS=true`)
- **Métrica**: Cosine distance
- **Logs**: Todas as queries salvas em `state.json` → `knowledge.queries`

### Integração Automática

- Toda tarefa ganha `knowledgeSearch` automaticamente
- Busca executada antes de cada todo
- Resultados inseridos no contexto do subagent
- Graceful degradation: se falhar, workflow continua sem contexto

## Otimização da Knowledge Base

### Visão Geral

Análise completa do sistema de knowledge base identificou **14 problemas críticos** que impactam performance e qualidade de busca. O plano de otimização está dividido em 4 sprints priorizados, com foco inicial em **qualidade de busca** antes de otimizações de performance.

**Insight chave**: Buscas rápidas com resultados irrelevantes são piores que buscas lentas com resultados relevantes.

### Problemas Críticos Identificados

#### Performance e Infraestrutura (5 problemas)

1. **Índice Vetorial Removido (CRÍTICO)**

   - Arquivo: [prisma/migrations/20251118172206_add_git_tools/migration.sql](prisma/migrations/20251118172206_add_git_tools/migration.sql)
   - Problema: Índice `knowledge_embeddings_vector_idx` foi removido sem ser recriado
   - Impacto: Todas buscas fazem full table scan (100-1000x mais lento)

2. **Problema N+1 de Inserts (ALTO)**

   - Arquivo: [src/shared/process-knowledge.ts:186-206](src/shared/process-knowledge.ts#L186-L206)
   - Problema: Loop dentro de loop com 50 INSERTs individuais
   - Impacto: 50x mais round-trips ao banco

3. **Sem Batching de Embeddings (ALTO)**

   - Arquivo: [src/shared/process-knowledge.ts:134](src/shared/process-knowledge.ts#L134)
   - Problema: Envia TODOS chunks de uma vez para OpenAI
   - Impacto: Rate limiting com documentos grandes, sem retry

4. **Processamento Sequential (ALTO)**

   - Arquivo: [src/shared/process-knowledge.ts](src/shared/process-knowledge.ts)
   - Problema: Processa 1 documento por vez
   - Impacto: Não aproveita paralelismo de I/O

5. **Sem Retry Logic (ALTO)**
   - Problema: Falhas transientes abortam sync inteiro
   - Impacto: Baixa confiabilidade

#### Qualidade de Busca e Prompts (5 problemas)

6. **Query Automática Fraca (CRÍTICO)**

   - Arquivo: [src/agents/orchestrator.ts:732-737](src/agents/orchestrator.ts#L732-L737)
   - Problema: `buildKnowledgeQuery()` ignora 80% do contexto
   - Ignora: userInput, processDescription, artefato, outputs esperados
   - Exemplo: "Criar documentação" → não sabe que é para API REST Python

7. **Contexto Duplicado no Prompt (MÉDIO)**

   - Arquivo: [src/agents/orchestrator.ts:999,1022](src/agents/orchestrator.ts#L999)
   - Problema: `knowledgeContext` aparece DUAS vezes
   - Impacto: Desperdício de 100-200 tokens por todo

8. **Habilitação Incorreta de KB (CRÍTICO)**

   - Arquivo: [src/agents/orchestrator.ts:130-168](src/agents/orchestrator.ts#L130-L168)
   - Problema: `knowledgeAvailable=true` mesmo com índice vazio
   - Impacto: Modelo tenta usar tool inexistente

9. **Dupla Consulta Desnecessária (ALTO)**

   - Arquivos: [orchestrator.ts:247-279](src/agents/orchestrator.ts#L247-L279), [subagent-factory.ts:49-50](src/agents/subagent-factory.ts#L49-L50)
   - Problema: Pré-busca automática + system prompt força consulta manual
   - Impacto: 2x custo de busca, logs incompletos

10. **Sem Hierarquia de Tools (MÉDIO)**
    - Arquivo: [src/agents/orchestrator.ts:1004-1009](src/agents/orchestrator.ts#L1004-L1009)
    - Problema: Web search compete com KB em vez de complementar
    - Deveria: KB → docs locais → web → artefatos

#### Indexação e Metadata (3 problemas)

11. **Thresholds Estreitos (MÉDIO)**

    - Constantes: `KNOWLEDGE_LIMIT=3`, thresholds fixos 0.7/0.65
    - Problema: Contexto insuficiente, redundância

12. **Chunking Genérico (MÉDIO)**

    - Arquivo: [src/shared/process-knowledge.ts:60-113](src/shared/process-knowledge.ts#L60-L113)
    - Problema: 1000 chars fixo, ignora estrutura Markdown
    - Metadata pobre: apenas `{ext, size}`

13. **Metadata Não Derivada (MÉDIO)**
    - Problema: Arquivos não mapeados para processos
    - Exemplo: `02-definir-arquitetura.md` não gera `{process: "DefinirArquitetura"}`

#### Outros (2 problemas)

14. **Cálculo Redundante de Similaridade (MÉDIO)**

    - Arquivo: [src/tools/knowledge.ts](src/tools/knowledge.ts)
    - Problema: Calcula `1 - (embedding <=> vector)` duas vezes

15. **Sem Cache de Embeddings (MÉDIO)**
    - Problema: Re-embeds chunks idênticos em syncs subsequentes
    - Impacto: Desperdiça tokens da API

### Roadmap de Implementação

#### Sprint 0: Qualidade de Busca (CRÍTICO - 2-3 dias)

**Prioridade máxima**: Corrigir prompts e queries antes de otimizar performance.

**Tarefas**:

1. Refatorar `buildKnowledgeQuery()` com contexto rico (userInput, processo, artefato, outputs)
2. Consolidar `knowledgeContext` no prompt (remover duplicação)
3. Verificar `hasIndex` antes de habilitar KB
4. Remover instrução "sempre consulte knowledgeSearch" + adicionar logging
5. Estabelecer hierarquia clara: KB → Docs → Web → Artifacts

**Teste de validação**:

```bash
pnpm dev agents/MVPBuilder/root.yml --input "API REST em Python" | grep "Knowledge"
```

**Impacto esperado**:

- Relevância de queries: 5-10x melhor
- Tokens economizados: 100-200 por todo
- Consultas duplicadas: 2x → <0.2x
- Precision@3: +20-30pp
- Recall: +15-25pp

#### Sprint 1: Performance Base (CRÍTICO - 1 semana)

**Tarefas**:

1. Criar migration para recriar índice HNSW
   ```sql
   CREATE INDEX knowledge_embeddings_vector_idx
   ON knowledge_embeddings
   USING hnsw (embedding vector_cosine_ops)
   WITH (m = 16, ef_construction = 64);
   ```
2. Refatorar `insertIntoDatabase()` para bulk inserts
3. Adicionar helper `retry.ts` com exponential backoff
4. Implementar batching de embeddings (batchSize=512)
5. Testar: `pnpm sync-knowledge ZeroUm`

**Impacto esperado**:

- Sync: 5-10x mais rápido
- Search: 100-1000x mais rápido (com índice)
- Confiabilidade: 99%+ (com retry)

#### Sprint 2: Performance + Metadata (ALTO - 1 semana)

**Tarefas**:

1. Paralelizar processamento de documentos (concurrency=3)
2. Otimizar query SQL (calcular similaridade uma vez)
3. Criar índice GIN em metadata
4. Extrair metadata rica: `{process, section, type}`
5. Comparar tempos antes/depois

**Impacto esperado**:

- Throughput: 3-5x mais documentos
- Busca filtrada: 10-100x mais rápida

#### Sprint 3: Qualidade Avançada (MÉDIO - 1 semana)

**Tarefas**:

1. Implementar cache de embeddings (SHA-256 hash)
2. Aumentar `KNOWLEDGE_LIMIT` para 5-8
3. Deduplicação por documento
4. Thresholds dinâmicos por agente
5. Métricas precision/recall

**Impacto esperado**:

- Custos API: 40-60% menores
- Contexto: 5-8 chunks vs 3
- Cache hit rate: 60%+

#### Sprint 4: Busca Adaptativa (OPCIONAL)

**Abordagem**: Implementar 3 técnicas e deixar tool decidir automaticamente qual usar.

**Técnicas**:

1. **Chunking Semântico** (sempre ativo)

   - MarkdownTextSplitter respeitando headers, code blocks, listas
   - Custo: praticamente zero, benefício: alto

2. **Hybrid Search** (ativa para queries técnicas)

   - Combina BM25 (30%) + Vector (70%)
   - Ativa quando detecta: siglas, versões, IDs técnicos
   - Exemplos: "HNSW", "pgvector", "CVE-2023-1234"

3. **Reranking** (ativa para queries longas/complexas)
   - Cross-encoder para reordenar top-K
   - Ativa para queries >= 8 palavras + termos técnicos

**Função de decisão automática**:

```typescript
function analyzeQuery(query: string): SearchStrategy {
  const hasKeywords = /\b[A-Z]{2,}|\d+\.\d+\.\d+|CVE-|pg[a-z]+|HNSW/i.test(
    query
  );
  const wordCount = query.split(/\s+/).length;

  return {
    useSemanticChunking: true, // Sempre
    useHybridSearch: hasKeywords, // Se técnico
    useReranking: wordCount >= 8 && hasKeywords, // Se complexo
  };
}
```

**Benefícios**:

- Custo otimizado: 70% queries usam apenas semantic
- Precisão máxima para queries técnicas/complexas
- Latência variável: 50ms (simples) → 250ms (complexo)
- Sem configuração manual

### Métricas de Sucesso

| Métrica                 | Antes    | Depois    | Melhoria  |
| ----------------------- | -------- | --------- | --------- |
| Relevância de queries   | ~30%     | 70-80%    | +140%     |
| Tempo de sync           | X min    | X/5 min   | 5x        |
| Tempo de busca          | Y ms     | <10ms     | 100-1000x |
| Consultas KB duplicadas | 2x       | <0.2x     | -90%      |
| Tokens desperdiçados    | 200/todo | 0/todo    | 100%      |
| Precision@3             | ~50%     | 80%+      | +30pp     |
| Recall                  | ~50%     | 70%+      | +20pp     |
| Cache hit rate          | 0%       | 60%+      | 60%       |
| Custos API              | $X       | $0.4-0.6X | 40-60%    |
| Confiabilidade          | ~90%     | 99%+      | +9pp      |

### Comandos Úteis

```bash
# Sincronizar knowledge base
pnpm sync-knowledge MVPBuilder

# Verificar status do índice
psql $DATABASE_URL -c "SELECT indexname, indexdef FROM pg_indexes WHERE tablename='knowledge_embeddings';"

# Ver métricas de busca
cat agents/.orchestrator/state.json | jq '.knowledge'

# Benchmark de performance
pnpm ts-node src/scripts/benchmark-knowledge.ts

# Avaliar qualidade (precision/recall)
pnpm ts-node src/scripts/evaluate-search-quality.ts
```

### Próximos Passos

1. Implementar Sprint 0 (2-3 dias) - Maior ROI imediato
2. Validar métricas antes/depois
3. Sprint 1 (performance base)
4. Sprint 2 (performance + metadata)
5. Sprint 3 (qualidade avançada)
6. Sprint 4 (opcional conforme necessidade)

**Justificativa da ordem**: Query ruim com busca rápida retorna resultados irrelevantes. Query boa com busca lenta ainda entrega valor.

## Execução e Gerenciamento de Estado

### CLI Completo

```bash
# Execução básica
pnpm dev [path/to/root.yml] [--flags] [input text]

# Flags disponíveis
--reset, -r              # Limpar estado, começar do zero
--auto, -a               # Skip human approvals (HITL)
--state-dir <path>       # Diretório customizado para state.json
--config, -c <path>      # Caminho do YAML (se não posicional)
--input, -i <text>       # Input do usuário (alternativa a posicional)

# Exemplos
pnpm dev agents/MVPBuilder/root.yml --input "meu projeto" --auto
pnpm dev --config agents/PRCreator/root.yml --reset
pnpm dev agents/Naming/root.yml --state-dir ./custom-state "Nome para startup"
```

### Validação

```bash
pnpm validate-agent agents/MVPBuilder/root.yml
```

**O que valida**:

- Schema YAML (Zod)
- Ferramentas existem no registry
- Templates em `_data/` existem
- Estrutura de processos/todos válida

### Estado Persistente

**Localização**: `agents/.orchestrator/state.json` (ou via `--state-dir`)

**Estrutura**:

```json
{
  "strategy": "MVPBuilder",
  "runId": "uuid",
  "runDir": "agents/MVPBuilder/_runs/timestamp",
  "currentProcess": "DefinirFuncionalidades",
  "currentTodo": "Priorizar funcionalidades",
  "results": [
    {
      "process": "ColetarContexto",
      "todo": "Descrever problema",
      "status": "done",
      "attempts": 1,
      "outputPath": "agents/.../artefacts/contexto-projeto.md",
      "validationNotes": "APROVADO"
    }
  ],
  "artefacts": ["contexto-projeto.md"],
  "knowledge": { "hits": 5, "misses": 2 },
  "createdAt": "2025-11-26T...",
  "updatedAt": "2025-11-26T..."
}
```

### Execução Resumível

- Se `state.json` existe e `strategy` bate → continua de onde parou
- Se `strategy` diferente ou `--reset` → novo run
- Estado salvo após cada todo completado
- Em caso de erro, pode retomar executando o mesmo comando

### Saídas

```
agents/<Strategy>/_runs/<timestamp>/
├── artefacts/
│   ├── <processo>/
│   │   └── artefato-declarado.md
│   └── <processo>__<todo>__attempt-N.md  # outputs sem artefato
```

## Human-in-the-Loop (HITL)

### Ativação

```yaml
todos:
  - name: "Tarefa crítica"
    requiresApproval: true
    retryLimit: 2
```

### Fluxo

1. Todo executa normalmente
2. Output apresentado ao usuário
3. Prompt: "Approve this output? (yes/no/feedback)"
4. Se "yes" → próximo todo
5. Se "no" ou "feedback" → retry com feedback

### Modo Não-Interativo

- Se `--auto` ou não TTY → aprovação automática
- Útil para CI/CD

## Validação Automática

### Como Funciona

- Após cada todo, LLM valida output contra `validation` criteria
- Formato de resposta:

```json
{"status": "APROVADO"}
// ou
{"status": "REPROVADO", "motivo": "descrição"}
```

### Tipos de Validação

- **Processo**: `validation` no nível do processo
- **Todo**: `validation` no nível da tarefa
- **Critérios**: Podem incluir checklist, formato, conteúdo obrigatório

### Retry com Feedback

- Se validação falha → `retryLimit` controla quantas tentativas
- Feedback do validador inserido no contexto da próxima tentativa
- Após esgotar tentativas → workflow para ou continua

## Arquitetura do Sistema

### Componentes Principais

```
src/
├── main.ts                     # CLI entry point (resolve path e dispara LangGraph)
├── chat/
│   ├── chat-agent.ts           # Orquestra fluxo do chat
│   └── nodes/                  # Nodes do chat (classify-intent traduz input e preserva input original para workflows)
├── agents/
│   ├── orchestrator.ts         # Orquestração em LangGraph (paralelo + checkpointing)
│   ├── graph-compiler.ts       # Compila processos/todos em grafo
│   └── subagent-factory.ts     # Cria subagents e aplica seleção de modelos
├── graph/
│   ├── state.ts                # State channels (Map/Set) para LangGraph
│   ├── nodes/                  # Nodes de todo/validação
│   └── checkpointer/           # Checkpointer PostgreSQL + adaptadores
├── tools/
│   ├── registry.ts             # Registro central + aliases
│   ├── workflow-connection-resolver.ts # Sintaxe tool@connection (MCP/DB)
│   └── artifacts, tavily, git, postgres, youtube, http...
├── shared/
│   ├── yaml-loader.ts          # Validação de schema do YAML
│   ├── types.ts                # Tipos centrais
│   └── state.ts                # Estado compatível com modo legado
└── lib/                        # logger, metrics, MCP client, prompt translator/engineer (entity extraction context)
```

### Fluxo de Execução

1. `main.ts` → parse de args, valida env, resolve `root.yml`
2. `workflow-loader.ts` → carrega/valida YAML + tools registradas
3. `orchestrator.ts` → cria `GraphWorkflowState` e compila cada process em grafo
4. `todo-node` → monta prompt, aplica engenharia no user input, resolve `tool@connection`, executa tools + validação
5. Checkpointing opcional (PostgreSQL) + state.json em `_runs/<id>/`
6. Outputs e artefatos escritos em `agents/<Strategy>/_runs/<timestamp>/`

### Dependências Principais

- **LangChain/LangGraph**: compilação e execução do grafo
- **OpenAI/Anthropic SDKs**: LLM providers
- **Zod**: Schema validation
- **Prisma + pgvector**: PostgreSQL e embeddings
- **js-yaml**: Parsing de YAML

## Configuração de Ambiente

### Variáveis Obrigatórias

```bash
# LLM APIs
OPENAI_API_KEY=sk-...          # OpenAI (gpt-4o-mini, embeddings, DALL-E, traducoes/engenharia de prompt LLM-only)
ANTHROPIC_API_KEY=sk-ant-...   # Anthropic Claude (opcional)
```

### Variáveis Opcionais (por ferramenta)

```bash
# Web Search (internet_search, web_crawl)
TAVILY_API_KEY=tvly-...

# Knowledge Base (knowledge_search)
DATABASE_URL=postgresql://user:pass@localhost:5432/dify_agent
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSIONS=1536
ENABLE_LLM_QUERY_VARIANTS=true

# Git/PR (create_pull_request para Bitbucket)
BITBUCKET_USERNAME=username
BITBUCKET_APP_PASSWORD=app_password
```

## Casos de Uso Avançados

### MVP Completo com Knowledge Base

```bash
# 1. Popular knowledge com docs de arquitetura
mkdir -p agents/MVPBuilder/knowledge
cp docs/architecture/* agents/MVPBuilder/knowledge/

# 2. Indexar
pnpm sync-knowledge MVPBuilder

# 3. Executar com contexto enriquecido
pnpm dev agents/MVPBuilder/root.yml --input "SaaS de agendamento médico"
```

**Resultado**: Todos os todos terão acesso a padrões de arquitetura via semantic search

### CI/CD com PRCreator

```yaml
# .github/workflows/auto-pr.yml
name: Auto PR
on: [push]
jobs:
  create-pr:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: |
          pnpm dev agents/PRCreator/root.yml \
            --input "Automated changes from CI" \
            --auto
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Database-Driven Workflow

```yaml
# Exemplo de todo que busca dados do DB
- name: "Analisar métricas de usuários"
  tools: ["postgresQuery", "generateCsv"]
  task: |
    Execute query SQL para obter top 100 usuários por engajamento
    Gere CSV com: user_id, email, engagement_score, last_active
  validation: "CSV gerado com 100 linhas e 4 colunas"
```

## Troubleshooting

### Problemas Comuns

**"Tool X not found in registry"**

- Verificar nome da ferramenta em `src/tools/registry.ts`
- Usar alias correto (ex: `internet_search` ou `internetSearch`)
- Rodar `pnpm validate-agent` para detectar

**"Knowledge search failed"**

- Verificar `DATABASE_URL` em `.env`
- Confirmar extensão pgvector: `psql -c "SELECT * FROM pg_extension WHERE extname='vector';"`
- Re-indexar: `pnpm sync-knowledge <Strategy>`

**"Validation always fails"**

- Revisar critério de validação (muito restritivo?)
- Aumentar `retryLimit`
- Verificar logs do validador em `state.json`

**"State not resuming"**

- Confirmar que `strategy` no YAML bate com `state.json`
- Limpar e reiniciar: `pnpm dev ... --reset`
- Verificar `--state-dir` se customizado

**"HITL approval not working"**

- Confirmar modo interativo (TTY)
- Usar `--auto` para skip em CI/CD
- Verificar `requiresApproval: true` no todo

**"Artifact not generated"**

- Verificar template existe em `_data/<Processo>/`
- Conferir nome do artefato em `artefacts: []`
- Verificar logs em `state.json` → `results[].outputPath`

### Debug Tips

```bash
# Inspecionar state
cat agents/.orchestrator/state.json | jq '.results[] | {todo, status, outputPath}'

# Ver knowledge queries
cat agents/.orchestrator/state.json | jq '.knowledge.queries'

# Verificar outputs
ls -la agents/MVPBuilder/_runs/*/artefacts/
```

## Checklist de Criação de Agente

### Planejamento

- [ ] Definir objetivo do agente
- [ ] Listar processos necessários (ordem sequencial)
- [ ] Para cada processo, listar todos (tarefas)
- [ ] Identificar ferramentas necessárias
- [ ] Definir artefatos esperados

### Estrutura de Arquivos

- [ ] Criar `agents/<Strategy>/root.yml`
- [ ] Criar `agents/<Strategy>/_data/<ordem>-<Processo>/` para cada processo
- [ ] Adicionar templates de artefatos em `_data/`
- [ ] (Opcional) Criar `agents/<Strategy>/knowledge/` e popular com docs

### Configuração do YAML

- [ ] Definir `root.strategy` (nome único)
- [ ] Escrever `root.context` (contexto compartilhado)
- [ ] Para cada processo:
  - [ ] `name` (obrigatório)
  - [ ] `description`, `input`, `output`, `validation` (opcionais)
  - [ ] `artefacts` (se esperado)
- [ ] Para cada todo:
  - [ ] `name` (obrigatório)
  - [ ] `task` e `method` (instruções)
  - [ ] `tools` (array de ferramentas do registry)
  - [ ] `validation` (critério de validação)
  - [ ] `retryLimit` (padrão 0, aumentar se necessário)
  - [ ] `artefacts` (se gera arquivos)
  - [ ] `requiresApproval` (se requer HITL)
  - [ ] `model` (se requer modelo específico)

### Preparação de Knowledge (opcional)

- [ ] Popular `agents/<Strategy>/knowledge/` com docs relevantes
- [ ] Configurar `DATABASE_URL` em `.env`
- [ ] Rodar `pnpm prisma:migrate` (primeira vez)
- [ ] Executar `pnpm sync-knowledge <Strategy>`

### Validação e Testes

- [ ] Rodar `pnpm validate-agent agents/<Strategy>/root.yml`
- [ ] Corrigir erros de schema/tools/templates
- [ ] Executar teste seco: `pnpm dev agents/<Strategy>/root.yml --input "teste"`
- [ ] Verificar outputs em `_runs/<timestamp>/artefacts/`
- [ ] Revisar `state.json` para erros/validações

### Refinamento

- [ ] Ajustar critérios de validação se muitos falsos negativos
- [ ] Adicionar `retryLimit` em todos críticos
- [ ] Inserir `requiresApproval` em decisões importantes
- [ ] Otimizar contexto e prompts dos todos
- [ ] Documentar uso específico em comentários do YAML

## Contribuindo

### Adicionar Nova Ferramenta

1. Criar arquivo em `src/tools/<nome>.ts`
2. Implementar com LangChain `tool()` e Zod schema
3. Registrar em `src/tools/registry.ts`:

```typescript
import { minhaFerramenta } from './minha-ferramenta';

const toolRegistry = {
  ...
  minhaFerramenta,
};

const aliasMap = {
  ...
  'minha_ferramenta': 'minhaFerramenta',
};
```

4. Adicionar testes em `src/__tests__/tools.test.ts`
5. Documentar no README (seção Ferramentas Disponíveis)

### Adicionar Novo Agente

1. Criar `agents/<NovoAgente>/root.yml`
2. Popular `_data/` com templates
3. (Opcional) Popular `knowledge/`
4. Validar e testar
5. Adicionar exemplo no README

## Roadmap

- **Fase 1 — Hardening do core**: alinhar docs com LangGraph, garantir smoke-tests (`pnpm dev agents/MVPBuilder/root.yml --input "teste"`), métricas/custos salvos por run, validação automática consistente.
- **Fase 2 — Connection Manager pronto para uso**: finalizar/adaptar adapters (postgres/whatsapp), testar sintaxe `tool@connection` fim a fim, garantir GraphQL/CRUD + criptografia documentados.
- **Fase 3 — UI mínima**: dashboard de runs com SSE de logs, lista/execução de agentes, visualização de artefatos; editor visual fica como incremento seguinte.
- **Melhorias contínuas**: cache de knowledge queries, biblioteca de agentes, export de workflows, métricas detalhadas por todo/model/tool.

---

**CLIs úteis**:

- `pnpm dev <path/to/root.yml>`: executa o workflow
- `pnpm validate-agent <path/to/root.yml>`: valida sintaxe e schema
- `pnpm sync-knowledge [Strategy]`: indexa knowledge base
- `pnpm test`: roda a suíte de testes
- `pnpm build` + `pnpm start`: build para produção
- `pnpm prisma:generate | prisma:migrate | prisma:studio`: utilitários do banco

Quero passar todos os prompts que estão no codigo para uma pasta chamada prompts onde terão arquivos MD com os nomes fixos para poder fazer ajustes facilitados

Quero criar contexto de conexões

Quero criar um chat para criar contexto onde o chat irá fazer muitas perguntas para ajudar construir uma base de conhecimento para workflow.
