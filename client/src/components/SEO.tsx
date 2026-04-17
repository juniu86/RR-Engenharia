import { useEffect } from "react";
import { useLocation } from "wouter";
import {
  DEFAULT_OG_IMAGE,
  FAQ_SASC,
  FAQ_TEPS,
  SITE_NAME,
  SITE_URL,
  BLOG_POST_META,
  getRouteSEO,
  type BlogSlug,
} from "@/lib/seo-config";

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/assets/logo.svg`,
  description: "Engenharia de infraestrutura crítica com foco em SASC, TEPS e postos de combustível",
  sameAs: ["https://www.linkedin.com/company/rr-engenharia"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    telephone: "+55-21-99574-0273",
    email: "contato@rres.com.br",
    availableLanguage: "Portuguese",
  },
};

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_NAME,
  image: `${SITE_URL}/assets/logo.svg`,
  description:
    "Especialista em SASC (Sistema de Armazenamento Subterrâneo de Combustíveis), TEPS e construção de postos de combustível com certificação INMETRO vigente até 2029.",
  url: SITE_URL,
  telephone: "+55-21-99574-0273",
  email: "contato@rres.com.br",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. das Américas, 4200, Bloco 8, Sala 106A",
    addressLocality: "Rio de Janeiro",
    addressRegion: "RJ",
    postalCode: "22640-907",
    addressCountry: "BR",
  },
  geo: { "@type": "GeoCoordinates", latitude: "-23.0226", longitude: "-43.1925" },
  sameAs: ["https://www.linkedin.com/company/rr-engenharia"],
  foundingDate: "2009",
  areaServed: "BR",
  priceRange: "$$",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Serviços de Engenharia",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "SASC — Sistema de Armazenamento Subterrâneo de Combustíveis" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "TEPS — Teste de Estanqueidade de Postos e Sistemas" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Construção de Postos de Combustível" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Manutenção Preventiva com SLA" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "RR Engine — Automação de Propostas" } },
    ],
  },
};

function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

function serviceSchema(name: string, description: string, serviceType: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    url,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    areaServed: { "@type": "Country", name: "Brasil" },
  };
}

function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function articleSchema(slug: BlogSlug) {
  const meta = BLOG_POST_META[slug];
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/logo.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${slug}` },
    articleSection: meta.category,
  };
}

function getRouteSchemas(path: string) {
  const schemas: object[] = [ORGANIZATION_SCHEMA, LOCAL_BUSINESS_SCHEMA];
  if (path === "/sasc") {
    schemas.push(faqSchema(FAQ_SASC));
    schemas.push(
      serviceSchema(
        "SASC — Sistema de Armazenamento Subterrâneo de Combustíveis",
        "Instalação, inspeção e certificação INMETRO de SASC conforme ABNT NBR 13786 e Portaria INMETRO 457/2008.",
        "Instalação e certificação de tanques subterrâneos",
        `${SITE_URL}/sasc`,
      ),
    );
    schemas.push(
      breadcrumbSchema([
        { name: "Início", url: `${SITE_URL}/` },
        { name: "Serviços", url: `${SITE_URL}/#servicos` },
        { name: "SASC", url: `${SITE_URL}/sasc` },
      ]),
    );
  } else if (path === "/teps") {
    schemas.push(faqSchema(FAQ_TEPS));
    schemas.push(
      serviceSchema(
        "TEPS — Teste de Estanqueidade de Postos e Sistemas",
        "Ensaio INMETRO de estanqueidade em SASC. Detecção de vazamentos com laudo de validade nacional.",
        "Ensaio de estanqueidade",
        `${SITE_URL}/teps`,
      ),
    );
    schemas.push(
      breadcrumbSchema([
        { name: "Início", url: `${SITE_URL}/` },
        { name: "Serviços", url: `${SITE_URL}/#servicos` },
        { name: "TEPS", url: `${SITE_URL}/teps` },
      ]),
    );
  } else if (path === "/obras") {
    schemas.push(
      serviceSchema(
        "Obras e Infraestrutura Crítica",
        "Construção de postos de combustível e obras de infraestrutura crítica com conformidade ABNT/NR-20.",
        "Engenharia civil",
        `${SITE_URL}/obras`,
      ),
    );
    schemas.push(
      breadcrumbSchema([
        { name: "Início", url: `${SITE_URL}/` },
        { name: "Obras", url: `${SITE_URL}/obras` },
      ]),
    );
  } else if (path === "/manutencao") {
    schemas.push(
      serviceSchema(
        "Manutenção Preventiva com SLA",
        "Plano de Manutenção Preventiva (PCM) com SLA para postos de combustível e instalações críticas.",
        "Manutenção industrial",
        `${SITE_URL}/manutencao`,
      ),
    );
    schemas.push(
      breadcrumbSchema([
        { name: "Início", url: `${SITE_URL}/` },
        { name: "Manutenção", url: `${SITE_URL}/manutencao` },
      ]),
    );
  } else if (path === "/automacao") {
    schemas.push(
      serviceSchema(
        "RR Engine — Automação de Propostas",
        "Plataforma de automação de propostas em engenharia com IA generativa e integração com bases SINAPI/PINI.",
        "Software de engenharia",
        `${SITE_URL}/automacao`,
      ),
    );
    schemas.push(
      breadcrumbSchema([
        { name: "Início", url: `${SITE_URL}/` },
        { name: "Automação", url: `${SITE_URL}/automacao` },
      ]),
    );
  } else if (path.startsWith("/blog/")) {
    const slug = path.replace(/^\/blog\//, "").replace(/\/$/, "") as BlogSlug;
    if (BLOG_POST_META[slug]) {
      schemas.push(articleSchema(slug));
      schemas.push(
        breadcrumbSchema([
          { name: "Início", url: `${SITE_URL}/` },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: BLOG_POST_META[slug].title, url: `${SITE_URL}/blog/${slug}` },
        ]),
      );
    }
  } else if (path === "/blog") {
    schemas.push(
      breadcrumbSchema([
        { name: "Início", url: `${SITE_URL}/` },
        { name: "Blog", url: `${SITE_URL}/blog` },
      ]),
    );
  }
  return schemas;
}

const MANAGED_META_ATTR = "data-seo-managed";

function setMeta(selector: string, attr: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, key, name] = /\[([^=]+)="([^"]+)"\]/.exec(selector) ?? [];
    if (key && name) el.setAttribute(key, name);
    el.setAttribute(MANAGED_META_ATTR, "true");
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.setAttribute(MANAGED_META_ATTR, "true");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function clearManagedSchemas() {
  document.head
    .querySelectorAll(`script[type="application/ld+json"][${MANAGED_META_ATTR}]`)
    .forEach((el) => el.remove());
}

function injectSchemas(schemas: object[]) {
  clearManagedSchemas();
  for (const schema of schemas) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute(MANAGED_META_ATTR, "true");
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}

export function SEOHead() {
  const [location] = useLocation();

  useEffect(() => {
    const path = location || "/";
    const seo = getRouteSEO(path);

    document.title = seo.title;
    setMeta('meta[name="description"]', "content", seo.description);
    if (seo.keywords) setMeta('meta[name="keywords"]', "content", seo.keywords);

    const ogImage = seo.ogImage ?? DEFAULT_OG_IMAGE;
    const ogType = seo.ogType ?? "website";
    setMeta('meta[property="og:title"]', "content", seo.title);
    setMeta('meta[property="og:description"]', "content", seo.description);
    setMeta('meta[property="og:type"]', "content", ogType);
    setMeta('meta[property="og:url"]', "content", seo.canonical);
    setMeta('meta[property="og:image"]', "content", ogImage);
    setMeta('meta[property="og:site_name"]', "content", SITE_NAME);
    setMeta('meta[property="og:locale"]', "content", "pt_BR");

    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", seo.title);
    setMeta('meta[name="twitter:description"]', "content", seo.description);
    setMeta('meta[name="twitter:image"]', "content", ogImage);

    setLink("canonical", seo.canonical);

    injectSchemas(getRouteSchemas(path));
  }, [location]);

  return null;
}
