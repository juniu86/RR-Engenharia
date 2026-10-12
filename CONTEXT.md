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

## 7. Banco de dados

O banco Supabase do Gerador de Propostas não existe mais (verificado em 12/10/2026). O site não usa banco: os formulários vão pelo Web3Forms (ver CLAUDE.md).

---

## 8. Deploy

Automático: cada merge na `main` publica `public_html/` na GoDaddy via GitHub Actions (FTPS, workflow `deploy-site.yml`). Não há build: o site é HTML/CSS/JS estático. O procedimento antigo (build local, ZIP e upload pelo cPanel) foi aposentado. Ver CLAUDE.md.

---

## 9. Branch de desenvolvimento

Ver o fluxo git no CLAUDE.md.
