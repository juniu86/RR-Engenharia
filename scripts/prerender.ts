/**
 * Post-build SSG: generate per-route static HTML files with unique SEO metadata
 * so that Googlebot can index /sasc, /teps, /obras, /manutencao, /automacao,
 * /blog and each /blog/:slug with proper <title>, <meta>, canonical and
 * JSON-LD schemas — without relying on client-side JavaScript execution.
 *
 * Runs after `vite build`. Reads `dist/public/index.html` as template.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ALL_ROUTES,
  BLOG_POST_META,
  BLOG_POST_SLUGS,
  DEFAULT_OG_IMAGE,
  FAQ_SASC,
  FAQ_TEPS,
  SITE_NAME,
  SITE_URL,
  getRouteSEO,
  type BlogSlug,
  type FAQItem,
} from "../client/src/lib/seo-config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const DIST_DIR = path.join(PROJECT_ROOT, "dist", "public");
const TEMPLATE_PATH = path.join(DIST_DIR, "index.html");
const PUBLIC_HTACCESS = path.join(PROJECT_ROOT, "client", "public", ".htaccess");

function readTemplate(): string {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Template not found: ${TEMPLATE_PATH}. Run 'vite build' first.`);
  }
  return fs.readFileSync(TEMPLATE_PATH, "utf-8");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function setTag(html: string, pattern: RegExp, replacement: string): string {
  return html.replace(pattern, replacement);
}

function renderFAQSection(title: string, items: FAQItem[]): string {
  const questions = items
    .map(
      (q) => `
        <section>
          <h3>${escapeHtml(q.question)}</h3>
          <p>${escapeHtml(q.answer)}</p>
        </section>`,
    )
    .join("");
  return `
    <section aria-label="Perguntas Frequentes">
      <h2>${escapeHtml(title)}</h2>
      ${questions}
    </section>`;
}

function bakedContent(route: string): string {
  if (route === "/sasc") {
    return `
      <main>
        <nav aria-label="Breadcrumb"><a href="/">Início</a> › <a href="/#servicos">Serviços</a> › SASC</nav>
        <h1>SASC — Sistema de Armazenamento Subterrâneo de Combustíveis</h1>
        <p>Instalação, inspeção e certificação INMETRO de SASC conforme ABNT NBR 13786 e Portaria INMETRO 457/2008. RR Engenharia acreditada como Organismo de Inspeção até 02/02/2029, atendendo todo o Brasil a partir do Rio de Janeiro.</p>
        <h2>O que é SASC?</h2>
        <p><strong>SASC</strong> é a sigla para <strong>Sistema de Armazenamento Subterrâneo de Combustíveis</strong> — o conjunto de tanques, tubulações, dispositivos de monitoramento e sistemas de contenção instalados no subsolo de postos de combustível. Todo SASC em operação no Brasil está sujeito à fiscalização da ANP e à certificação pelo INMETRO.</p>
        <p>A instalação, inspeção periódica e retirada de um SASC só podem ser executadas por empresas acreditadas pelo INMETRO como Organismo de Inspeção, em conformidade com ABNT NBR 13786 e Portaria INMETRO 457/2008.</p>
        <h2>Normas Aplicáveis ao SASC</h2>
        <ul>
          <li>ABNT NBR 13786 — Tanques de aço carbono para armazenamento de combustível</li>
          <li>ABNT NBR 13784 — Seleção de métodos para detecção de vazamento</li>
          <li>ABNT NBR 14725 — Ficha de Informação de Segurança (FISPQ)</li>
          <li>Portaria INMETRO 457/2008 — Inspeção de SASC</li>
          <li>Resolução ANP 41/2013 — Postos revendedores</li>
          <li>NR-20 — Segurança com Inflamáveis e Combustíveis</li>
        </ul>
        ${renderFAQSection("Perguntas Frequentes sobre SASC", FAQ_SASC)}
        <nav aria-label="Links relacionados">
          <h2>Conteúdos relacionados</h2>
          <ul>
            <li><a href="/teps">TEPS — Teste de Estanqueidade de Postos e Sistemas</a></li>
            <li><a href="/obras">Obras em Postos de Combustível</a></li>
            <li><a href="/blog/o-que-e-sasc">Guia completo: O que é SASC</a></li>
            <li><a href="/manutencao">Manutenção Preventiva</a></li>
          </ul>
        </nav>
      </main>`;
  }
  if (route === "/teps") {
    return `
      <main>
        <nav aria-label="Breadcrumb"><a href="/">Início</a> › <a href="/#servicos">Serviços</a> › TEPS</nav>
        <h1>TEPS — Teste de Estanqueidade de Postos e Sistemas</h1>
        <p>Ensaio INMETRO obrigatório para detectar vazamentos em SASC (Sistema de Armazenamento Subterrâneo de Combustíveis). Laudo com validade nacional conforme ABNT NBR 13784 e Portaria INMETRO 457/2008.</p>
        <h2>O que é TEPS?</h2>
        <p><strong>TEPS</strong> é a sigla para <strong>Teste de Estanqueidade de Postos e Sistemas</strong> — um ensaio técnico obrigatório que verifica a integridade de tanques e tubulações do SASC, detectando vazamentos com sensibilidade de até 0,1 litro por hora.</p>
        <p>Todo SASC em operação deve ser submetido a TEPS periodicamente — tipicamente a cada 3 anos, ou após qualquer intervenção. A RR Engenharia, acreditada pelo INMETRO até 02/02/2029, emite laudos TEPS reconhecidos por ANP, INEA, CETESB, FEAM e seguradoras.</p>
        <h2>Metodologias de Ensaio TEPS</h2>
        <ul>
          <li>Teste Volumétrico — detecta vazamentos de até 0,1 L/h</li>
          <li>Teste de Pressão Positiva — identifica pontos de vazamento em tubulações</li>
          <li>Teste de Vácuo — detecta fugas em juntas e soldas</li>
          <li>Teste com Traçador — localização precisa de vazamentos subterrâneos</li>
        </ul>
        <h2>Normas Aplicáveis ao TEPS</h2>
        <ul>
          <li>ABNT NBR 13784 — Seleção de métodos para detecção de vazamento em SASC</li>
          <li>ABNT NBR 13785 — Ensaio de estanqueidade em tubulações</li>
          <li>Portaria INMETRO 457/2008</li>
          <li>Resolução ANP 41/2013</li>
        </ul>
        ${renderFAQSection("Perguntas Frequentes sobre TEPS", FAQ_TEPS)}
        <nav aria-label="Links relacionados">
          <h2>Conteúdos relacionados</h2>
          <ul>
            <li><a href="/sasc">SASC — Sistema de Armazenamento Subterrâneo</a></li>
            <li><a href="/blog/teps-ensaios-estanqueidade">Artigo: TEPS Ensaios Obrigatórios</a></li>
            <li><a href="/manutencao">Manutenção Preventiva</a></li>
            <li><a href="/obras">Obras em Postos</a></li>
          </ul>
        </nav>
      </main>`;
  }
  if (route === "/obras") {
    return `
      <main>
        <nav aria-label="Breadcrumb"><a href="/">Início</a> › Obras</nav>
        <h1>Obras & Infraestrutura Crítica em Postos de Combustível</h1>
        <p>Construção e reforma de postos de combustível com conformidade ABNT, NR-20 e legislação ambiental. RR Engenharia entrega obras de infraestrutura crítica no prazo e dentro do orçamento.</p>
        <h2>Fases de Execução</h2>
        <ol>
          <li>Planejamento Executivo com BDI</li>
          <li>Projeto Técnico ABNT</li>
          <li>Mobilização e licenças ambientais</li>
          <li>Execução com acompanhamento diário</li>
          <li>Testes de estanqueidade e comissionamento</li>
          <li>Entrega com dossiê completo</li>
        </ol>
      </main>`;
  }
  if (route === "/manutencao") {
    return `
      <main>
        <nav aria-label="Breadcrumb"><a href="/">Início</a> › Manutenção</nav>
        <h1>Manutenção Preventiva & Facilities para Postos de Combustível</h1>
        <p>Plano de Manutenção Preventiva (PCM) com SLA para postos de combustível e instalações críticas. Redução de até 40% em custos de emergência. RR Engenharia acreditada INMETRO.</p>
      </main>`;
  }
  if (route === "/automacao") {
    return `
      <main>
        <nav aria-label="Breadcrumb"><a href="/">Início</a> › Automação</nav>
        <h1>RR Engine — Automação de Propostas em Engenharia com IA</h1>
        <p>Plataforma de automação de propostas em engenharia com IA generativa. Reduz tempo de orçamento de 7 dias para 24 horas em projetos SASC, TEPS e obras.</p>
      </main>`;
  }
  if (route === "/blog") {
    const list = BLOG_POST_SLUGS.map((slug) => {
      const m = BLOG_POST_META[slug];
      return `<li><a href="/blog/${slug}"><strong>${escapeHtml(m.title)}</strong></a> — ${escapeHtml(m.description)}</li>`;
    }).join("");
    return `
      <main>
        <nav aria-label="Breadcrumb"><a href="/">Início</a> › Blog</nav>
        <h1>Blog Técnico — SASC, TEPS, Normas ABNT e INMETRO</h1>
        <p>Artigos técnicos sobre SASC (Sistema de Armazenamento Subterrâneo de Combustíveis), TEPS (Teste de Estanqueidade), normas ABNT/INMETRO, NR-20 e conformidade regulatória.</p>
        <ul>${list}</ul>
      </main>`;
  }
  if (route.startsWith("/blog/")) {
    const slug = route.replace(/^\/blog\//, "") as BlogSlug;
    const m = BLOG_POST_META[slug];
    if (!m) return "";
    return `
      <main>
        <nav aria-label="Breadcrumb"><a href="/">Início</a> › <a href="/blog">Blog</a> › ${escapeHtml(m.category)}</nav>
        <article>
          <header>
            <h1>${escapeHtml(m.title)}</h1>
            <p><time datetime="${m.date}">${m.date}</time> — ${escapeHtml(m.category)} — RR Engenharia</p>
          </header>
          <p>${escapeHtml(m.description)}</p>
          <p><a href="/${m.category === "SASC" ? "sasc" : m.category === "TEPS" ? "teps" : m.category === "Obras" ? "obras" : m.category === "Manutenção" ? "manutencao" : "automacao"}">Saiba mais sobre ${escapeHtml(m.category)} →</a></p>
        </article>
      </main>`;
  }
  return "";
}

function faqJsonLd(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

function serviceJsonLd(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    areaServed: { "@type": "Country", name: "Brasil" },
  };
}

function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

function articleJsonLd(slug: BlogSlug) {
  const m = BLOG_POST_META[slug];
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: m.title,
    description: m.description,
    datePublished: m.date,
    dateModified: m.date,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/logo.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${slug}` },
    articleSection: m.category,
  };
}

function extraSchemasFor(route: string): object[] {
  if (route === "/sasc") {
    return [
      faqJsonLd(FAQ_SASC),
      serviceJsonLd(
        "SASC — Sistema de Armazenamento Subterrâneo de Combustíveis",
        "Instalação, inspeção e certificação INMETRO de SASC conforme ABNT NBR 13786 e Portaria INMETRO 457/2008.",
        `${SITE_URL}/sasc`,
      ),
      breadcrumbJsonLd([
        { name: "Início", url: `${SITE_URL}/` },
        { name: "Serviços", url: `${SITE_URL}/#servicos` },
        { name: "SASC", url: `${SITE_URL}/sasc` },
      ]),
    ];
  }
  if (route === "/teps") {
    return [
      faqJsonLd(FAQ_TEPS),
      serviceJsonLd(
        "TEPS — Teste de Estanqueidade de Postos e Sistemas",
        "Ensaio INMETRO de estanqueidade em SASC. Detecção de vazamentos com laudo de validade nacional.",
        `${SITE_URL}/teps`,
      ),
      breadcrumbJsonLd([
        { name: "Início", url: `${SITE_URL}/` },
        { name: "Serviços", url: `${SITE_URL}/#servicos` },
        { name: "TEPS", url: `${SITE_URL}/teps` },
      ]),
    ];
  }
  if (route === "/obras") {
    return [
      serviceJsonLd(
        "Obras e Infraestrutura Crítica",
        "Construção de postos de combustível e obras de infraestrutura crítica com conformidade ABNT/NR-20.",
        `${SITE_URL}/obras`,
      ),
      breadcrumbJsonLd([
        { name: "Início", url: `${SITE_URL}/` },
        { name: "Obras", url: `${SITE_URL}/obras` },
      ]),
    ];
  }
  if (route === "/manutencao") {
    return [
      serviceJsonLd(
        "Manutenção Preventiva com SLA",
        "Plano de Manutenção Preventiva (PCM) com SLA para postos e instalações críticas.",
        `${SITE_URL}/manutencao`,
      ),
      breadcrumbJsonLd([
        { name: "Início", url: `${SITE_URL}/` },
        { name: "Manutenção", url: `${SITE_URL}/manutencao` },
      ]),
    ];
  }
  if (route === "/automacao") {
    return [
      serviceJsonLd(
        "RR Engine — Automação de Propostas",
        "Plataforma de automação de propostas em engenharia com IA generativa.",
        `${SITE_URL}/automacao`,
      ),
      breadcrumbJsonLd([
        { name: "Início", url: `${SITE_URL}/` },
        { name: "Automação", url: `${SITE_URL}/automacao` },
      ]),
    ];
  }
  if (route === "/blog") {
    return [
      breadcrumbJsonLd([
        { name: "Início", url: `${SITE_URL}/` },
        { name: "Blog", url: `${SITE_URL}/blog` },
      ]),
    ];
  }
  if (route.startsWith("/blog/")) {
    const slug = route.replace(/^\/blog\//, "") as BlogSlug;
    if (!BLOG_POST_META[slug]) return [];
    return [
      articleJsonLd(slug),
      breadcrumbJsonLd([
        { name: "Início", url: `${SITE_URL}/` },
        { name: "Blog", url: `${SITE_URL}/blog` },
        { name: BLOG_POST_META[slug].title, url: `${SITE_URL}/blog/${slug}` },
      ]),
    ];
  }
  return [];
}

function renderHtml(route: string, template: string): string {
  const seo = getRouteSEO(route);
  const ogImage = seo.ogImage ?? DEFAULT_OG_IMAGE;
  const ogType = seo.ogType ?? "website";

  let html = template;

  html = setTag(
    html,
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(seo.title)}</title>`,
  );

  // Standard meta
  html = setTag(
    html,
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
  );
  if (seo.keywords) {
    html = setTag(
      html,
      /<meta name="keywords"[^>]*>/,
      `<meta name="keywords" content="${escapeHtml(seo.keywords)}" />`,
    );
  }

  // Open Graph
  html = setTag(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeHtml(seo.title)}" />`);
  html = setTag(
    html,
    /<meta property="og:description"[^>]*>/,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
  );
  html = setTag(html, /<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${ogType}" />`);
  html = setTag(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${seo.canonical}" />`);
  html = setTag(html, /<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${ogImage}" />`);

  // Twitter
  html = setTag(
    html,
    /<meta name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
  );
  html = setTag(
    html,
    /<meta name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
  );
  html = setTag(html, /<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${ogImage}" />`);

  // Canonical
  html = setTag(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${seo.canonical}" />`);

  // Extra schemas before </head>
  const extras = extraSchemasFor(route)
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join("\n    ");
  if (extras) {
    html = html.replace("</head>", `    ${extras}\n  </head>`);
  }

  // Pre-baked content inside #root (SPA will replace on mount)
  const content = bakedContent(route);
  if (content) {
    html = html.replace('<div id="root"></div>', `<div id="root">${content}</div>`);
  }

  return html;
}

function writeRoute(route: string, template: string) {
  const html = renderHtml(route, template);
  const outDir = route === "/" ? DIST_DIR : path.join(DIST_DIR, route);
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "index.html");
  fs.writeFileSync(outFile, html, "utf-8");
  console.log(`  ✓ ${outFile.replace(PROJECT_ROOT + "/", "")}`);
}

function generateSitemap() {
  const today = new Date().toISOString().split("T")[0];
  const urls = ALL_ROUTES.map((route) => {
    const loc = `${SITE_URL}${route === "/" ? "/" : route}`;
    let priority = "0.7";
    let changefreq = "monthly";
    if (route === "/") {
      priority = "1.0";
      changefreq = "weekly";
    } else if (["/sasc", "/teps"].includes(route)) {
      priority = "0.9";
      changefreq = "monthly";
    } else if (["/obras", "/manutencao", "/automacao"].includes(route)) {
      priority = "0.8";
      changefreq = "monthly";
    } else if (route === "/blog") {
      priority = "0.8";
      changefreq = "weekly";
    }
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  fs.writeFileSync(path.join(DIST_DIR, "sitemap.xml"), xml, "utf-8");
  console.log(`  ✓ dist/public/sitemap.xml (${ALL_ROUTES.length} URLs)`);
}

function copyHtaccess() {
  if (fs.existsSync(PUBLIC_HTACCESS)) {
    fs.copyFileSync(PUBLIC_HTACCESS, path.join(DIST_DIR, ".htaccess"));
    console.log("  ✓ dist/public/.htaccess");
  }
}

function main() {
  console.log("→ Prerendering static HTML for SEO…");
  const template = readTemplate();
  for (const route of ALL_ROUTES) {
    if (route === "/") continue; // index.html already exists from vite build
    writeRoute(route, template);
  }
  // Rewrite root index.html with route-specific meta for "/"
  const rootHtml = renderHtml("/", template);
  fs.writeFileSync(TEMPLATE_PATH, rootHtml, "utf-8");
  console.log(`  ✓ dist/public/index.html (root)`);

  generateSitemap();
  copyHtaccess();
  console.log("✓ Prerender complete.");
}

main();
