# RR Engenharia — rres.com.br

Site estático (HTML/CSS/JS puro) em `public_html/`, deploy automático GoDaddy via GitHub Actions (FTPS) a cada merge na `main`. Sem framework, sem build. JS único em `js/main.js`, CSS único em `css/style.css` — ambos versionados por query string (`?v=AAAAMMDD`) que DEVE ser atualizada em todas as páginas a cada mudança.

## Restrições permanentes (inegociáveis)

1. **INMETRO — wording jurídico**: a RR é "empresa certificada no âmbito do INMETRO" (Certificados de Conformidade CTBC-SASC-001-2025 e CTBC-TEPS-001-2025, emitidos pela CTBC, ABNT NBR ISO/IEC 17020, **válidos até 02/02/2029**). NUNCA usar "acreditada" ou "Organismo Acreditado". Isso vale para texto, meta tags, schema/JSON-LD e anúncios. Os certificados NÃO são publicados no site (quem quiser, que peça).
2. **Marcio Franco não pode aparecer em nenhuma foto publicada.**
3. **Marca Guanabara**: uso AUTORIZADO pelo Reginaldo em 19/08/2026 (nome e logo no site). Em mídia paga, manter anonimização ("uma grande rede varejista do Rio") salvo nova orientação. Demais clientes: não citar sem autorização registrada aqui.
4. **Sem promessas novas**: nenhum prazo, número ou garantia que não exista hoje no site ou não tenha sido aprovado pelo Reginaldo ("estamos seguros destes números" cobre os indicadores atuais da home).
5. **Conteúdo normativo só com fonte primária**: artigos e páginas citam normas (ABNT, ANP, CONAMA, leis) — TODA referência de vigência deve ser verificada em fonte primária ANTES de publicar. Nunca escrever norma de memória. RANP 41/2013 foi revogada pela RANP 948/2023 (verificado 19/08/2026).
6. **WhatsApp oficial**: (21) 99779-5500 / wa.me/5521997795500 — em links, texto e schema.

## Forma de trabalhar (aprendida com a auditoria de 19/08/2026)

- **Verificar comportamento, não presença.** `curl` + grep prova deploy, não prova experiência. Toda entrega que toca UI exige: render mobile 390×844 (Playwright/Chromium local), teste de URL quebrada (404 real), fluxo de formulário, teclado (foco visível). O caso-exemplo: ErrorDocument configurado + arquivo existente ≠ página 404 funcionando.
- **Interpretar restrições pelo RISCO, não pelo canal.** "Não citar cliente em anúncio" significa "não expor a marca sem autorização em lugar nenhum", não "só no Ads".
- **Simplificação de MVP = dívida registrada.** Toda simplificação consciente entra na seção "Dívidas técnicas" abaixo, com gatilho de revisão ("revisitar quando X").
- **Todo release tem um passo de defesa**: LGPD/consentimento, acessibilidade, headers, dados estruturados e alegações públicas são escopo de TODA entrega, não projetos separados.
- **Fluxo git**: branch de trabalho `claude/great-maxwell-5qhfcu` → PR → squash-merge na main (via MCP GitHub) → rebase da branch sobre origin/main ANTES do próximo trabalho (senão o PR seguinte conflita) → verificação em produção com cache-bust `?cb=$(date +%s%N)`.

## Medição

- GA4 `G-8CL979Z1T5` (propriedade "RR Engenharia" 536099118 — a antiga "www.rres.com.br" 526439786 é órfã, não usar). Eventos: click_whatsapp, click_phone, click_email, form_submit (tentativa), generate_lead (confirmado — só dispara em /obrigado com token de envio consumível), scroll_75. Parâmetros: page_path, service_origin, cta_location, form_id.
- Consent Mode v2: default DENIED para analytics/ads até escolha no banner; LinkedIn Insight Tag (ID 10522105) só carrega após consentimento.
- Web3Forms access_key `73961e2b-c424-417e-b196-3625f60363f2` (pública por design), campos ocultos `origem`/`servico` por página, redirect /obrigado.html.
- Google Ads 940-937-6278: conversões importadas do GA4 (click_whatsapp e generate_lead = principais; form_submit = secundária).

## Dívidas técnicas registradas (revisar a cada ciclo)

| Dívida | Risco | Gatilho de revisão |
|---|---|---|
| Deploy direto em produção, sem staging/rollback | Regressão atinge as ~40 páginas | Quando houver 2+ editores ou releases semanais |
| Web3Forms como ponto único de falha, só honeypot | Perda silenciosa de leads / spam | Confirmar no painel: restrição de domínio, alertas, DPA |
| Header/footer duplicados em ~40 HTMLs (sem template) | Mudança global = script em massa | Se o site passar de ~50 páginas, avaliar SSG |
| `/proposta/` público e quebrado (JS 404) | Superfície interna exposta | Decisão do Reginaldo: remover, consertar ou autenticar |
| Política de privacidade: seção de cookies adicionada em 19/08/2026 SEM revisão jurídica | Conformidade LGPD | Validar com advogado |
| Canal de compliance é mailto interno (copy corrigida para "interno e confidencial") | Promessa institucional | Contratar canal terceirizado |
| Jornada EN incompleta (política só em PT, sem case/RFP) | Due diligence estrangeira | Quando prospecção internacional ativar |
| CSP em Report-Only | Sem enforcement | Após 2 semanas sem violações legítimas, migrar para enforce |

## Contexto comercial

Leads chegam ~75% mobile e majoritariamente por WhatsApp. Campanhas: Google Ads (TEPS Brasil R$30/dia, SASC Brasil R$20, Predial/Laudos RJ+SP R$20 com grupos Manutenção/Laudos/Autovistoria/Hidráulica-Elétrica) + LinkedIn Lead Gen. Checkpoints quinzenais com exports de CSV do Ads + contagem de etiquetas do WhatsApp. Expansão São Paulo em planejamento (escritório físico).
