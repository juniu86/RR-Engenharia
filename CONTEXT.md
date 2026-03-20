# CONTEXT.md — RR Engenharia

> Última atualização: 2026-03-20

---

## 1. O que foi construído

### Site Principal (`/client`)
Site institucional React/Vite com múltiplas páginas de serviço:

- **Home** — Cards de serviços, logos de clientes, diferenciais, formulário de contato (Formspree)
- **Obras** — Infraestrutura e construção
- **SASC** — Sistemas de armazenamento subterrâneo (certificado INMETRO até 2029)
- **TEPS** — Teste de estanqueidade
- **Manutenção** — Facilities e manutenção predial
- **Automação** — RR Engine (destaque: proposta em 24h vs 7 dias, 70% mais rápido)
- **Blog** — Listagem + post individual (2 posts de exemplo: SASC e TEPS)

### Gerador de Propostas (`/client-proposta`)
SPA separada, protegida por senha, com backend Supabase.

**Decisões-chave tomadas:**
- Migração de SQLite/PHP para **Supabase** (PostgreSQL na nuvem) — sem dependência de servidor PHP
- Dois modos de escopo: **linha a linha** (com preços unitários) ou **texto livre** (valor global)
- Numeração automática inteligente: remove sufixos jurídicos (LTDA, S/A, ME, EPP, preposições) e gera ex: `PETRO-2026-001`
- Sistema de **revisões** (REV01, REV02…) com proposta filha vinculada à proposta-pai via `parent_id`
- **Senha de acesso:** `rr2024`

**Funcionalidades implementadas:**
| Funcionalidade | Status |
|---|---|
| Login por senha | ✅ Feito |
| Criar / editar / excluir propostas | ✅ Feito |
| Numeração automática (abreviação cliente + ano + sequência) | ✅ Feito |
| Escopo linha a linha com preços | ✅ Feito |
| Escopo texto livre com valor global | ✅ Feito |
| Revisões com histórico | ✅ Feito |
| Documento formatado para impressão/PDF | ✅ Feito |
| Autosave em localStorage (rascunho) | ✅ Feito |
| Sincronização Supabase | ✅ Feito |
| **Pipeline de status + KPIs (Fase 1.1)** | ✅ Feito |

**Pipeline de Status (Fase 1.1):**
- Status: `rascunho` → `enviada` → `em_negociacao` → `ganha` / `perdida` / `cancelada`
- Campo `motivo_perda` quando status = perdida
- KPIs na tela de lista: total de propostas, valor total, taxa de conversão, alertas de vencimento

---

## 2. Estado atual de cada módulo

### `client/` — Site institucional
- **Estado:** Estável, em produção no GoDaddy
- **Pendências:** Nenhuma crítica; tema escuro existe no ThemeContext mas não está exposto na UI

### `client-proposta/` — Gerador de propostas
- **Estado:** Funcional, Fase 1.1 concluída e testada
- **Arquivos principais:**
  - `App.tsx` — Estado global, roteamento entre views
  - `api.ts` — Todas as chamadas ao Supabase
  - `supabase.ts` — Cliente Supabase configurado
  - `LoginPage.tsx` — Tela de login
  - `FormPage.tsx` — Formulário de criação/edição
  - `ProposalList.tsx` — Lista + KPIs + pipeline
  - `ProposalDocument.tsx` — Documento para impressão

### `supabase/migrations/`
- `002_add_status.sql` — Adiciona `status` e `motivo_perda` à tabela `proposals`
- **Obs:** A migration precisa ser aplicada manualmente no painel Supabase (ainda não há CLI configurada)

### `server/`
- Express.js simples para servir arquivos estáticos em produção

### `public_html/`
- Build de produção — atualizado manualmente via upload no cPanel GoDaddy

---

## 3. Próxima etapa planejada

### Fase 1.2 — Dashboard com funil visual
- Gráfico de funil: quantidade de propostas por status
- Gráfico de barras: valor total por mês
- Filtros por período e por status
- Usar `recharts` (já instalado)

### Roadmap completo
| Fase | Descrição |
|---|---|
| **1.2** | Dashboard com funil visual e gráfico mensal |
| **2** | Cadastro de clientes independente das propostas |
| **3** | Follow-up — data de retorno e log de interações por proposta |
| **4** | Dashboard gerencial completo |
| **5** | Ordem de Serviço pós-aprovação |

---

## 4. Questões em aberto e problemas conhecidos

### Questões em aberto
- [ ] **Autenticação real:** Senha hardcoded `rr2024` em `LoginPage.tsx`. Considerar Supabase Auth ou variável de ambiente
- [ ] **Migration CLI:** Migrations Supabase aplicadas manualmente. Avaliar `supabase` CLI para automação
- [ ] **Deploy automático:** Processo de build + upload para GoDaddy ainda é manual (ZIP via cPanel). Avaliar CI/CD
- [ ] **Tema escuro:** `ThemeContext` existe mas o toggle não está na UI do site principal
- [ ] **Variáveis de ambiente:** URL e key do Supabase estão hardcoded em `supabase.ts` (risco menor pois é chave pública, mas vale mover para `.env`)

### Problemas conhecidos
- Não há paginação na lista de propostas — pode ficar lento com volume alto
- O campo de busca/filtro na lista de propostas ainda não existe
- Impressão PDF depende do `@media print` CSS do browser (não há geração server-side)

---

## 5. Estrutura de arquivos

```
RR-Engenharia/
├── client/                        # Site institucional
│   └── src/
│       ├── App.tsx                # Router principal (wouter)
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── Blog.tsx / BlogPost.tsx
│       │   ├── Obras.tsx / SASC.tsx / TEPS.tsx
│       │   ├── Manutencao.tsx / Automacao.tsx
│       │   └── NotFound.tsx
│       ├── components/
│       │   ├── Map.tsx / SEO.tsx
│       │   └── ui/               # 55+ componentes shadcn/ui
│       ├── contexts/
│       │   └── ThemeContext.tsx
│       └── hooks/
│           ├── useMobile.tsx
│           └── useComposition.ts
│
├── client-proposta/               # Gerador de propostas
│   └── src/
│       ├── App.tsx                # Estado global + navegação
│       ├── api.ts                 # CRUD Supabase
│       ├── supabase.ts            # Config Supabase
│       ├── LoginPage.tsx
│       ├── FormPage.tsx           # Criação/edição de proposta
│       ├── ProposalList.tsx       # Lista + KPIs + pipeline
│       └── ProposalDocument.tsx   # Documento imprimível
│
├── supabase/
│   └── migrations/
│       └── 002_add_status.sql
│
├── server/
│   └── index.ts                   # Express estático
│
├── public_html/                   # Build de produção (GoDaddy)
│   ├── index.html
│   ├── proposta/                  # Build do client-proposta
│   └── assets/ css/ js/ blog/
│
├── DEPLOYMENT_PROTOCOL_FINAL.md   # Guia de deploy GoDaddy
├── CONTEXT.md                     # Este arquivo
├── package.json
├── vite.config.ts                 # Config site principal
├── vite.config.proposta.ts        # Config proposta
└── pnpm-lock.yaml
```

---

## 6. Dependências principais

| Categoria | Pacote | Versão |
|---|---|---|
| Framework | React | 19.2.1 |
| Build | Vite | 7.1.7 |
| CSS | Tailwind CSS | 4.1.14 |
| Componentes | shadcn/ui (Radix UI) | — |
| Roteamento | wouter | 3.3.5 |
| Forms | react-hook-form | 7.64.0 |
| Validação | zod | 4.1.12 |
| Banco de dados | Supabase (PostgreSQL) | — |
| Gráficos | recharts | 2.15.2 |
| Animações | framer-motion | 12.23.22 |
| Toasts | sonner | 2.0.7 |
| HTTP | axios | 1.12.0 |
| Linguagem | TypeScript | 5.6.3 |
| Gerenciador de pacotes | pnpm | — |

---

## 7. Banco de dados Supabase

**URL:** `https://sowoslejxuesltgmpruh.supabase.co`

### Tabela `proposals`
| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | PK |
| `numero` | TEXT | Ex: `PETRO-2026-001` |
| `cliente_nome` | TEXT | Razão social |
| `total` | NUMERIC | Valor total |
| `data` | JSONB | Todos os dados da proposta |
| `show_line_prices` | BOOLEAN | Modo linha a linha |
| `status` | TEXT | rascunho / enviada / em_negociacao / ganha / perdida / cancelada |
| `motivo_perda` | TEXT | Preenchido quando perdida |
| `revisao` | INTEGER | Número da revisão |
| `parent_id` | UUID | FK para proposta original (revisões) |
| `created_at` | TIMESTAMP | — |
| `updated_at` | TIMESTAMP | — |

### Tabela `seq_counters`
| Coluna | Tipo | Descrição |
|---|---|---|
| `year` | INTEGER | Ano |
| `value` | INTEGER | Sequência atual |

### Função RPC
- `consume_seq(p_year)` — Incrementa e retorna próximo número da sequência (atômico)

---

## 8. Deploy

**Ambiente:** GoDaddy cPanel (hospedagem compartilhada)
**Método:** Build local → ZIP → upload e extração via File Manager

```bash
# Build site principal
pnpm build

# Build proposta
pnpm build:proposta

# Resultado em public_html/ — fazer upload manual para GoDaddy
```

Ver `DEPLOYMENT_PROTOCOL_FINAL.md` para o passo a passo completo.

---

## 9. Branch de desenvolvimento

**Branch ativo:** `claude/build-proposal-page-BiswJ`

Último commit: `Fase 1.1 – Pipeline de propostas com status e KPIs`
