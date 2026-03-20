# CONTEXT.md — RR Engenharia

> Atualizado em: 2026-03-20

---

## 1. O que foi construído

### Site institucional (`public_html/`)
Site estático da RR Engenharia hospedado via cPanel/FTP. Contém páginas de serviços (SASC, TEPS, Automação, Manutenção, Obras), blog com 3 posts e SEO completo (sitemap, robots, meta OG). Deploy automatizado via GitHub Actions + FTP para `public_html/`.

**Decisões principais:**
- Escolha por site estático (HTML/CSS/JS puro) para simplicidade de hospedagem e SEO
- Blog pré-renderizado (sem CMS) para evitar dependências externas
- Imagens e assets servidos diretamente do servidor

### App de relatórios (`relatorio/`) — subdomain `relatorio.rres.com.br`
SPA React + Vite + Tailwind com backend Supabase para gestão de Relatórios Diários de Obra (RDO). Deploy manual: build local → upload do `dist/` para `public_html/relatorio/`. Arquivo `relatorio-deploy.zip` na raiz facilita o download para envio via cPanel.

**Decisões principais:**
- Supabase como BaaS (auth, banco PostgreSQL, storage de arquivos)
- RLS desabilitada temporariamente em `obras` e `obra_users` por bug do `auth.uid()` retornando `null` (ver seção de issues)
- Acesso às obras filtrado na aplicação via `obra_users.user_id` (workaround para o bug de RLS)
- Separação completa do app principal (pasta `relatorio/` com seu próprio `package.json`)

---

## 2. Estado atual de cada módulo

### `public_html/` — Site institucional
| Arquivo/Pasta | Estado |
|---|---|
| `index.html` | Completo e em produção |
| `blog/` | 3 posts publicados |
| `css/style.css` | Completo |
| `js/main.js` | Completo |
| `sitemap.xml` | Atualizado |
| `.htaccess` | Configurado (redirects, cache) |

### `relatorio/` — App de RDO
| Módulo | Estado | Notas |
|---|---|---|
| Auth (Login/Logout) | Completo | Supabase Auth com `persistSession: true` |
| Dashboard de obras | Completo | Lista obras do usuário via `obra_users` |
| Criação de obra | Completo | Modal `AddObraModal`, insere em `obras` e `obra_users` |
| Edição de obra | Completo | `EditObra.tsx` |
| Visão geral da obra | Completo | `ProjectOverview.tsx` com stats e previews |
| Lista de relatórios | Completo | `ProjectReports.tsx` |
| Criação/edição de RDO | Completo | `ReportEdit.tsx` com todas as seções |
| Visualização de RDO | Completo | `ReportView.tsx` com impressão via `window.print()` |
| Galeria de fotos | Completo | `PhotosGallery.tsx` com upload para bucket `fotos` |
| Galeria de vídeos | Completo | `VideosGallery.tsx` com upload para bucket `videos` |
| Workflow de aprovação | Completo | Status: `preenchendo → enviado → aprovado` |
| Upload de anexos | Completo | Bucket `anexos` no Supabase Storage |

### `client/` — App React alternativo (NÃO em produção)
App React separado com shadcn/ui. Contém páginas institucionais. **Não é usado em produção** — o site estático em `public_html/` é o que está no ar.

---

## 3. Próximo passo planejado

1. **Corrigir RLS no Supabase** — Re-habilitar Row Level Security em `obras` e `obra_users` após investigar por que `auth.uid()` retorna `null`. Possível causa: JWT não está sendo enviado corretamente nas requests (verificar se `Authorization: Bearer <token>` está presente).

2. **Upload de vídeos direto** — Atualmente só salva URL externamente; adicionar upload para bucket `videos` similar às fotos.

3. **Notificações por e-mail** — Quando relatório é enviado para aprovação, notificar o responsável da obra via Supabase Edge Functions + Resend/SendGrid.

4. **Assinatura digital** — Campo de assinatura no RDO (canvas ou upload de imagem).

---

## 4. Questões em aberto e issues conhecidos

### BUG CRÍTICO — RLS desabilitada em `obras` e `obra_users`
- **Problema:** As políticas RLS em `obras` e `obra_users` estavam causando erros 403/500. A causa raiz suspeita é que `auth.uid()` retorna `null` mesmo com usuário autenticado, possivelmente porque o JWT não está sendo anexado nas requests.
- **Workaround atual:** RLS desabilitada nessas duas tabelas. O acesso é controlado pela aplicação (query filtra por `obra_users.user_id`).
- **Risco:** Usuários autenticados podem tecnicamente acessar dados de outras obras via API direta ao Supabase.
- **Para resolver:** Verificar no Supabase Dashboard → Logs → API se as requests chegam com o header `Authorization`. Se `auth.uid()` retornar `null`, pode ser necessário usar `SECURITY DEFINER` nas funções helper ou verificar se o `anonKey` vs `serviceRoleKey` está correto no cliente.

### Deploy manual do app de relatórios
- Não há CI/CD para `relatorio/`. O deploy é feito localmente com `npm run build` e upload do `dist/` via cPanel.
- O arquivo `relatorio-deploy.zip` na raiz serve como artefato de entrega.

### `getObraStats` em `supabase.ts` tem query incorreta
- `supabase.from('ocorrencias').select('id', { count: 'exact' }).eq('relatorio_id.obra_id', obraId)` — esse filtro encadeado não funciona no Supabase JS. A função `getObraStats` não é usada diretamente (o Dashboard faz suas próprias queries), mas precisa ser corrigida se vier a ser usada.

### Variável de ambiente em produção
- O `.env` real com as credenciais do Supabase não está no git (correto). O build de produção está embutido no `dist/` atual.
- Para rebuild: copiar `.env.example` para `.env` e preencher com os valores do Supabase Dashboard.

---

## 5. Estrutura de arquivos e dependências chave

```
RR-Engenharia/
├── public_html/               # Site estático em produção (cPanel)
│   ├── index.html             # Página principal
│   ├── blog/                  # Posts do blog
│   ├── relatorio/             # Build do app RDO (dist/)
│   │   ├── index.html
│   │   └── assets/
│   ├── assets/                # Logos e imagens institucionais
│   ├── css/style.css
│   ├── js/main.js
│   └── .htaccess
│
├── relatorio/                 # App React — RDO Manager
│   ├── src/
│   │   ├── App.tsx            # Roteamento (wouter): /login, /obras, /obras/:id/*
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx    # Supabase Auth provider
│   │   ├── lib/
│   │   │   ├── supabase.ts        # Cliente Supabase + funções CRUD
│   │   │   └── utils.ts           # formatDate, calcPrazo, weather labels
│   │   ├── types/index.ts         # Tipos TypeScript (Obra, Relatorio, etc.)
│   │   ├── components/
│   │   │   ├── AddObraModal.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectSidebar.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   └── pages/
│   │       ├── Login.tsx
│   │       ├── Dashboard.tsx      # Lista de obras do usuário
│   │       ├── ProjectLayout.tsx  # Shell com sidebar para /obras/:id/*
│   │       ├── ProjectOverview.tsx
│   │       ├── ProjectReports.tsx
│   │       ├── ReportEdit.tsx     # Formulário completo de RDO
│   │       ├── ReportView.tsx     # Visualização + impressão do RDO
│   │       ├── EditObra.tsx
│   │       ├── PhotosGallery.tsx
│   │       └── VideosGallery.tsx
│   ├── supabase-schema.sql    # Schema completo do banco + RLS + Storage
│   ├── .env.example
│   ├── vite.config.ts
│   └── package.json           # React 18, Vite, Tailwind, Supabase JS, Wouter, Sonner
│
├── relatorio-deploy.zip       # Último build para deploy manual
├── client/                    # App React alternativo (NÃO em produção)
├── DEPLOYMENT_PROTOCOL_FINAL.md
└── CONTEXT.md                 # Este arquivo
```

### Dependências chave do `relatorio/`

| Pacote | Função |
|---|---|
| `@supabase/supabase-js` | BaaS: auth, banco, storage |
| `wouter` | Roteamento leve (SPA) |
| `sonner` | Toasts de feedback |
| `tailwindcss` | Estilização utilitária |
| `lucide-react` | Ícones |
| `vite` | Build tool |

### Banco de dados (Supabase PostgreSQL)

Tabelas principais e suas relações:
```
auth.users
  └── user_profiles (1:1)
  └── obra_users (N:M com obras)
       └── obras
            ├── relatorios
            │    ├── mao_de_obra
            │    ├── equipamentos
            │    ├── atividades
            │    ├── ocorrencias
            │    ├── checklist
            │    ├── comentarios
            │    ├── fotos (ref)
            │    ├── videos (ref)
            │    └── anexos
            ├── fotos
            ├── videos
            └── comentarios (ref)
```

Storage buckets: `fotos`, `videos`, `anexos`, `logos` (todos públicos, autenticação exigida para write).
