# RR Engenharia — rres.com.br

Site estático (HTML/CSS/JS puro) em `public_html/`, deploy automático GoDaddy via GitHub Actions (FTPS) a cada merge na `main`. Sem framework, sem build. JS único em `js/main.js`, CSS único em `css/style.css` — ambos versionados por query string (`?v=AAAAMMDD`) que DEVE ser atualizada em todas as páginas a cada mudança.

## Restrições permanentes (inegociáveis)

1. **INMETRO — wording jurídico**: a RR é "empresa certificada no âmbito do INMETRO" (Certificados de Conformidade CTBC-SASC-001-2025 e CTBC-TEPS-001-2025, emitidos pela CTBC, ABNT NBR ISO/IEC 17020, **válidos até 02/02/2029**). NUNCA usar "acreditada" ou "Organismo Acreditado". Isso vale para texto, meta tags, schema/JSON-LD e anúncios. Os certificados NÃO são publicados no site (quem quiser, que peça).
2. **Marcio Franco não pode aparecer em nenhuma foto publicada.**
3. **Marca Guanabara**: uso AUTORIZADO pelo Reginaldo em 19/08/2026 (nome e logo no site). Em mídia paga, manter anonimização ("uma grande rede varejista do Rio") salvo nova orientação. Demais clientes: não citar sem autorização registrada aqui.
4. **Sem promessas novas**: nenhum prazo, número ou garantia que não exista hoje no site ou não tenha sido aprovado pelo Reginaldo ("estamos seguros destes números" cobre os indicadores atuais da home).
5. **Conteúdo normativo só com fonte primária**: artigos e páginas citam normas (ABNT, ANP, CONAMA, leis) — TODA referência de vigência deve ser verificada em fonte primária ANTES de publicar. Nunca escrever norma de memória. RANP 41/2013 foi revogada pela RANP 948/2023 (verificado 19/08/2026).
6. **WhatsApp oficial**: (21) 99779-5500 / wa.me/5521997795500 — em links, texto e schema.
7. **Data de fundação**: a RR Engenharia e Soluções Ltda iniciou atividade em **23/06/2022** (CNPJ 46.887.631/0001-75, consulta pública). `foundingDate` = 2022 e rodapé "© 2022–2026". "2009" e "+15 anos" referem-se SEMPRE à experiência da EQUIPE ("nossa equipe atua desde 2009"), nunca à empresa. Decisão do Reginaldo em 23/09/2026.
8. **Dados da empresa iguais em todo lugar** (site, schema, Google Meu Negócio, LinkedIn, diretórios, cadastros de feiras): razão social **RR Engenharia e Soluções Ltda**; endereço canônico **Av. das Américas, 4200, Bloco 8, Sala 106A, Barra da Tijuca, Rio de Janeiro, RJ, 22640-907** (confirmado pelo Reginaldo em 23/09/2026). Atenção: em 23/09/2026 a consulta pública do CNPJ ainda mostrava Bloco 1, Sala 305, cadastro desatualizado que deve ser corrigido na Receita. As respostas de IA cruzam o site com fontes externas; divergência custa credibilidade.

## Forma de trabalhar (aprendida com a auditoria de 19/08/2026)

- **Verificar comportamento, não presença.** `curl` + grep prova deploy, não prova experiência. Toda entrega que toca UI exige: render mobile 390×844 (Playwright/Chromium local), teste de URL quebrada (404 real), fluxo de formulário, teclado (foco visível). O caso-exemplo: ErrorDocument configurado + arquivo existente ≠ página 404 funcionando.
- **Interpretar restrições pelo RISCO, não pelo canal.** "Não citar cliente em anúncio" significa "não expor a marca sem autorização em lugar nenhum", não "só no Ads".
- **Simplificação de MVP = dívida registrada.** Toda simplificação consciente entra na seção "Dívidas técnicas" abaixo, com gatilho de revisão ("revisitar quando X").
- **Todo release tem um passo de defesa**: LGPD/consentimento, acessibilidade, headers, dados estruturados e alegações públicas são escopo de TODA entrega, não projetos separados.
- **Fluxo git**: branch de trabalho `claude/great-maxwell-5qhfcu` → PR → squash-merge na main (via MCP GitHub) → rebase da branch sobre origin/main ANTES do próximo trabalho (senão o PR seguinte conflita) → verificação em produção com cache-bust `?cb=$(date +%s%N)`.
- **Entrega em lote, em horas** (decisão do Reginaldo em 23/09/2026): mudanças aprovadas sobem juntas e no mesmo dia, sem fatiar em semanas. O registro do que mudou fica no PR (lista objetiva de alterações por página), para permitir leitura posterior dos resultados.
- **Escrita para busca e respostas de IA**: nos títulos de conteúdo (H2), usar a pergunta que o cliente faz; a primeira frase abaixo responde direto. Títulos de chamada para ação e de FAQ seguem livres. Schema é para resultado rico, não atalho para IA.
- **Intenção de busca**: priorizar quem está pronto para contratar ("empresa de", "instalação de", "construção de") e não quem pesquisa para fazer sozinho ("como instalar", "manual", "kit"). Não criar conteúdo para o público "faça você mesmo".
- **URL sem extensão no GoDaddy = arquivo + rewrite, nunca diretório.** Diretório real faz o host responder o 301 do mod_dir antes da regra de rewrite (verificado em produção em 25/08). Padrão comprovado: `pagina.html` + `RewriteRule ^pagina/?$ /pagina.html [L]` (casos /privacidade e /expopostos).

## Medição

- GA4 `G-8CL979Z1T5` (propriedade "RR Engenharia" 536099118 — a antiga "www.rres.com.br" 526439786 é órfã, não usar). Eventos: click_whatsapp, click_phone, click_email, form_submit (tentativa), generate_lead (confirmado — só dispara em /obrigado com token de envio consumível), scroll_75. Parâmetros: page_path, service_origin, cta_location, form_id.
- Consent Mode v2: default DENIED para analytics/ads até escolha no banner; LinkedIn Insight Tag (ID 10522105) só carrega após consentimento.
- Web3Forms access_key `73961e2b-c424-417e-b196-3625f60363f2` (pública por design), campos ocultos `origem`/`servico` por página, redirect /obrigado.html.
- Google Ads 940-937-6278: conversões importadas do GA4 (click_whatsapp e generate_lead = principais; form_submit = secundária).
- **Pipeline automático de dados do Ads (desde 25/08/2026)**: script "AUTO RR Export Semanal" no Google Ads (Ferramentas → Scripts, roda segunda entre 07h e 08h) grava últimos 7 dias nas abas Campanhas/Palavras/Termos/Meta da planilha "AUTO RR — Dados Google Ads (semanal)" (ID `1jTNV0uHFlN9Q-2f9K2LeSv1uVn03nT769vHo41tzB3M`, dona reginaldo.carmojr@gmail.com, contato@ editora). O checkpoint semanal é gerado a partir da planilha (leitura via Drive). Os 3 relatórios agendados do Editor (AUTO Campanhas/Palavras/Termos RR, segunda 08h para contato@) chegam como LINK que exige login — servem só de backup manual, não de fonte automatizável. Primeiro dado inédito do pipeline: conversões por palavra-chave.

## Dívidas técnicas registradas (revisar a cada ciclo)

| Dívida | Risco | Gatilho de revisão |
|---|---|---|
| Deploy direto em produção, sem staging/rollback | Regressão atinge as ~40 páginas | Quando houver 2+ editores ou releases semanais |
| Web3Forms plano FREE (verificado 19/08/2026): restrição de domínio é recurso Pro (indisponível), sem DPA formal (docs dizem "GDPR-compliant, sem declaração legal"), dados processados em US-East, logs apagados a cada 2 meses, envios não armazenados. Advanced Spam Filter ativo, 1/250 envios-mês | Spam / perda silenciosa de leads / transferência internacional | Se spam ou envios estranhos crescerem, avaliar plano Pro (traz restrição de domínio + captcha + webhooks) |
| Header/footer duplicados em ~40 HTMLs (sem template) | Mudança global = script em massa | Se o site passar de ~50 páginas, avaliar SSG |
| `/proposta/` NEUTRALIZADA em 19/08/2026 (.htaccess interno → 404; api.php inerte). Arquivos físicos ainda no servidor (deploy excluía a pasta) | Resíduo inofensivo | Apagar a pasta no gerenciador de arquivos do GoDaddy quando houver acesso |
| Política de privacidade: seção de cookies adicionada em 19/08/2026 SEM revisão jurídica | Conformidade LGPD | Validar com advogado |
| Canal de compliance é mailto interno (copy corrigida para "interno e confidencial") | Promessa institucional | Contratar canal terceirizado |
| Jornada EN incompleta (política só em PT, sem case/RFP) | Due diligence estrangeira | Quando prospecção internacional ativar |
| CSP em Report-Only | Sem enforcement | Após 2 semanas sem violações legítimas, migrar para enforce |
| Campanha ExpoPostos 2026 (8-10/09, stand M65): landing `/expopostos` (arquivo expopostos.html + rewrite, form origem=expopostos) . Strip da home REMOVIDA em 17/09. RR Engine FORA do site por decisão do Reginaldo em 25/08 | Conteúdo datado | Decidir destino da landing pós-feira (histórico ou remoção + 301) |
| `servicos/instalacao-carregadores-eletricos.html` continua no repositório, mas redireciona (301) para /eletromobilidade e não recebe as atualizações | Confusão em edições futuras | Apagar o arquivo quando confirmado que nenhum link externo depende dele |

## Contexto comercial

**Motores comerciais (decisão do Reginaldo em 23/09/2026): SASC (construção, reforma e tanques de postos) e Instalação de carregadores elétricos (/eletromobilidade).** Priorizar esses dois em mídia, conteúdo, links internos e escolha de "página que paga". TEPS segue no portfólio, mas não é o foco estratégico. Leads chegam ~75% mobile e majoritariamente por WhatsApp. Campanhas Google Ads: TEPS Brasil, SASC Brasil, Predial/Laudos RJ+SP (grupos Manutenção/Laudos/Autovistoria/Hidráulica-Elétrica) e Instalação Carregadores Elétricos RJ (desde set/2026). Checkpoints quinzenais com exports de CSV do Ads + contagem de etiquetas do WhatsApp. Expansão São Paulo: página /sao-paulo/ no ar (origem=sao-paulo); SP já é a cidade nº 1 em usuários do site.

## Aprendizados de canal (não repetir erros)

- **LinkedIn Lead Gen frio: NUNCA MAIS.** Campanha ago/2026: US$ 450, 56k impressões, CTR 0,77% (bom), 435 "cliques" (~99% eram interações no feed — só 5 sessões chegaram ao site), 0 leads. LinkedIn na RR = ABM manual (lista de 28 empresas engajadas entregue em 19/08) + orgânico semanal + retargeting futuro quando o público do Insight Tag amadurecer. Google Ads = captura de demanda, onde vai todo real de mídia.
- **Linha de base do GA4 recomeça em 20/08/2026** (Consent Mode implantado em 19/08): o GA4 pós-banner mede só a fração que aceita cookies (~30-60% típico). NUNCA comparar GA4 pré vs pós-19/08. Demanda/mídia se leem no Google Ads e GSC (imunes ao banner); comportamento no GA4 (amostra consentida). Proxy da taxa de aceite: sessões google/cpc no GA4 ÷ cliques no Ads no mesmo período.
