# CONTEXT.md — RR Engenharia

> Última atualização: 2026-03-20
>
> Documento histórico de março/2026. A fonte de verdade sobre o site é o CLAUDE.md.

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

### Gerador de Propostas — REMOVIDO em 12/10/2026
Ferramenta descontinuada (decisão do Reginaldo). Subdomínio proposta.rres.com.br e projeto da Vercel apagados; o projeto Supabase de backend já não existia (DNS sem resposta em 12/10/2026). Código removido do repositório (client-proposta/, vite.config.proposta.ts, supabase/, zips); continua no histórico do git.

### `client/` — Site institucional
- **Estado:** Estável, em produção no GoDaddy
- **Pendências:** Nenhuma crítica; tema escuro existe no ThemeContext mas não está exposto na UI

### `server/`
- Express.js simples para servir arquivos estáticos em produção

### `public_html/`
- Build de produção — atualizado manualmente via upload no cPanel GoDaddy

---

## 3. Próxima etapa planejada

O roadmap que estava aqui era do Gerador de Propostas, descontinuado em 12/10/2026. As decisões e pendências atuais do site estão no CLAUDE.md.

---

## 4. Questões em aberto e problemas conhecidos

### Questões em aberto
- [ ] **Deploy automático:** Processo de build + upload para GoDaddy ainda é manual (ZIP via cPanel). Avaliar CI/CD
- [ ] **Tema escuro:** `ThemeContext` existe mas o toggle não está na UI do site principal

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
├── server/
│   └── index.ts                   # Express estático
│
├── public_html/                   # Build de produção (GoDaddy)
│   ├── index.html
│   ├── proposta/                  # Resíduo neutralizado (404), ver dívidas no CLAUDE.md
│   └── assets/ css/ js/ blog/
│
├── DEPLOYMENT_PROTOCOL_FINAL.md   # Guia de deploy GoDaddy
├── CONTEXT.md                     # Este arquivo
├── package.json
├── vite.config.ts                 # Config site principal
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
