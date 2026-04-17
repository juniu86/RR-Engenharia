export const SITE_URL = "https://rres.com.br";
export const SITE_NAME = "RR Engenharia";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/og-image.jpg`;

export type RouteSEO = {
  title: string;
  description: string;
  keywords?: string;
  canonical: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
};

export type FAQItem = { question: string; answer: string };

export const FAQ_SASC: FAQItem[] = [
  {
    question: "O que é SASC (Sistema de Armazenamento Subterrâneo de Combustíveis)?",
    answer:
      "SASC é a sigla para Sistema de Armazenamento Subterrâneo de Combustíveis — o conjunto de tanques, tubulações e dispositivos de monitoramento instalados no subsolo de postos de combustível. A instalação, inspeção e retirada de um SASC só podem ser executadas por empresas acreditadas pelo INMETRO, conforme a ABNT NBR 13786 e a Portaria INMETRO 457/2008.",
  },
  {
    question: "Qual a diferença entre SASC e TEPS?",
    answer:
      "SASC refere-se ao sistema físico (tanques subterrâneos, tubulações, dispositivos de contenção) instalado em postos de combustível, regulado pela ANP e INMETRO. TEPS (Teste de Estanqueidade de Postos e Sistemas) é o ensaio técnico que verifica se esse sistema não possui vazamentos. Todo SASC em operação precisa de TEPS periódico.",
  },
  {
    question: "A RR Engenharia tem certificação INMETRO para SASC?",
    answer:
      "Sim. A RR Engenharia é Organismo de Inspeção Acreditado pelo INMETRO para SASC e TEPS, com acreditação vigente até 2029. Nossos laudos têm validade legal perante a ANP, órgãos ambientais estaduais (INEA, CETESB) e seguradoras.",
  },
  {
    question: "Qual a periodicidade da inspeção SASC?",
    answer:
      "A inspeção de SASC é obrigatória no comissionamento inicial (instalação de novo posto), periodicamente (tipicamente a cada 3 anos, podendo variar conforme resolução estadual), e após qualquer intervenção ou suspeita de vazamento. A RR Engenharia orienta o cronograma ideal conforme o histórico do posto.",
  },
  {
    question: "Quanto custa uma inspeção SASC?",
    answer:
      "O valor depende do porte da instalação, do número de tanques e dos ensaios exigidos. Uma inspeção SASC completa para posto de médio porte no Rio de Janeiro costuma variar entre R$ 15.000 e R$ 30.000. Solicite um orçamento personalizado informando seu CNPJ e localização.",
  },
  {
    question: "Quais normas regulam o SASC no Brasil?",
    answer:
      "As principais normas aplicáveis ao SASC são: ABNT NBR 13786 (tanques de aço carbono), ABNT NBR 13784 (ensaios de estanqueidade), ABNT NBR 14725 (FISPQ), Portaria INMETRO 457/2008, Resolução ANP 41/2013 e NR-20 (segurança com inflamáveis). A conformidade é fiscalizada pela ANP e por órgãos ambientais estaduais.",
  },
];

export const FAQ_TEPS: FAQItem[] = [
  {
    question: "O que é TEPS (Teste de Estanqueidade de Postos e Sistemas)?",
    answer:
      "TEPS é o Teste de Estanqueidade de Postos e Sistemas — um ensaio técnico que verifica a integridade de tanques e tubulações de SASC, detectando vazamentos com sensibilidade de até 0,1 L/h. É executado por organismo acreditado pelo INMETRO e sua aprovação é condição para operação regular de postos de combustível.",
  },
  {
    question: "Quando o TEPS é obrigatório?",
    answer:
      "O TEPS é obrigatório em três situações: (1) antes do comissionamento de um novo SASC; (2) periodicamente, tipicamente a cada 3 anos; (3) sempre que houver intervenção, reparo ou suspeita de vazamento. Operar sem TEPS válido sujeita o estabelecimento a autuações da ANP e do órgão ambiental estadual.",
  },
  {
    question: "Quais os métodos de TEPS aceitos pelo INMETRO?",
    answer:
      "Os métodos aceitos incluem: teste volumétrico (variação de volume em condições controladas), teste de pressão positiva, teste de vácuo e teste com traçador químico. A escolha do método depende do tipo de tanque, do produto armazenado e da geometria do sistema. A RR Engenharia aplica a metodologia mais sensível para cada caso.",
  },
  {
    question: "Qual a diferença entre TEPS e inspeção SASC?",
    answer:
      "Inspeção SASC é a avaliação completa do sistema (documental, visual, funcional). TEPS é especificamente o ensaio de estanqueidade — uma das etapas da inspeção SASC. Toda inspeção SASC completa inclui TEPS, mas um TEPS isolado pode ser solicitado após reparo ou para renovação de licença.",
  },
  {
    question: "Quanto tempo dura um TEPS e afeta a operação do posto?",
    answer:
      "Um TEPS em posto de médio porte é concluído em 24 a 48 horas. Planejamos o ensaio para minimizar impacto operacional — em muitos casos é possível manter parte das bombas em funcionamento. Entregamos o laudo INMETRO em até 10 dias úteis após o ensaio.",
  },
  {
    question: "O laudo TEPS tem validade nacional?",
    answer:
      "Sim. O laudo TEPS emitido por organismo acreditado pelo INMETRO tem validade nacional e é reconhecido por ANP, IBAMA, órgãos ambientais estaduais (INEA, CETESB, FEAM) e seguradoras. A RR Engenharia executa TEPS em todo o Brasil, com escritório no Rio de Janeiro.",
  },
];

export const BLOG_POST_SLUGS = [
  "o-que-e-sasc",
  "teps-ensaios-estanqueidade",
  "obras-postos-combustivel",
  "manutencao-preventiva-sla",
  "rr-engine-automacao-propostas",
] as const;

export type BlogSlug = (typeof BLOG_POST_SLUGS)[number];

export const BLOG_POST_META: Record<BlogSlug, { title: string; description: string; date: string; category: string }> = {
  "o-que-e-sasc": {
    title: "O que é SASC e por que sua conformidade é obrigatória",
    description:
      "SASC (Sistema de Armazenamento Subterrâneo de Combustíveis): entenda normas ABNT/INMETRO, certificação vigente até 2029 e como a RR Engenharia conduz a conformidade.",
    date: "2026-02-24",
    category: "SASC",
  },
  "teps-ensaios-estanqueidade": {
    title: "TEPS: Ensaios de Estanqueidade Obrigatórios em Postos de Combustível",
    description:
      "TEPS (Teste de Estanqueidade de Postos e Sistemas): metodologias aceitas pelo INMETRO, periodicidade obrigatória e como a RR Engenharia garante conformidade.",
    date: "2026-02-23",
    category: "TEPS",
  },
  "obras-postos-combustivel": {
    title: "Obras em Postos de Combustível: Planejamento Executivo",
    description:
      "Fases de execução, conformidade regulatória ABNT/NR-20 e como evitar atrasos em obras de postos de combustível e infraestrutura crítica.",
    date: "2026-02-22",
    category: "Obras",
  },
  "manutencao-preventiva-sla": {
    title: "Manutenção Preventiva: Reduzindo Custos Operacionais com PCM e SLA",
    description:
      "Como implementar Plano de Manutenção Preventiva (PCM) com SLA e reduzir custos de emergência em até 40% em postos e instalações críticas.",
    date: "2026-02-21",
    category: "Manutenção",
  },
  "rr-engine-automacao-propostas": {
    title: "RR Engine: Automação de Propostas em Engenharia com IA",
    description:
      "Como IA generativa e templates inteligentes reduzem o tempo de proposta em engenharia de 7 dias para 24 horas com qualidade técnica consistente.",
    date: "2026-02-20",
    category: "Automação",
  },
};

export const ROUTE_SEO: Record<string, RouteSEO> = {
  "/": {
    title: "RR Engenharia | SASC, TEPS e Postos de Combustível Certificados INMETRO",
    description:
      "RR Engenharia — especialista em SASC (Sistema de Armazenamento Subterrâneo de Combustíveis), TEPS (Teste de Estanqueidade) e construção de postos. Certificação INMETRO vigente até 2029.",
    keywords:
      "SASC, TEPS, Sistema de Armazenamento Subterrâneo de Combustíveis, Teste de Estanqueidade, postos de combustível, engenharia civil, INMETRO, ANP, ABNT NBR 13786, Rio de Janeiro",
    canonical: `${SITE_URL}/`,
  },
  "/sasc": {
    title: "SASC | Sistema de Armazenamento Subterrâneo de Combustíveis (Certificação INMETRO) — RR Engenharia",
    description:
      "SASC (Sistema de Armazenamento Subterrâneo de Combustíveis): instalação, inspeção e certificação INMETRO conforme ABNT NBR 13786. RR Engenharia acreditada até 2029.",
    keywords:
      "SASC, Sistema de Armazenamento Subterrâneo de Combustíveis, SASC INMETRO, inspeção SASC, tanque subterrâneo, ABNT NBR 13786, Portaria INMETRO 457, posto de combustível",
    canonical: `${SITE_URL}/sasc`,
  },
  "/teps": {
    title: "TEPS | Teste de Estanqueidade de Postos e Sistemas (Ensaio INMETRO) — RR Engenharia",
    description:
      "TEPS (Teste de Estanqueidade de Postos e Sistemas): ensaio INMETRO obrigatório para detectar vazamentos em SASC. Laudo com validade nacional. RR Engenharia acreditada até 2029.",
    keywords:
      "TEPS, Teste de Estanqueidade, ensaio de estanqueidade, inspeção TEPS, vazamento tanque combustível, INMETRO, ABNT NBR 13784, NBR 13785, posto de combustível",
    canonical: `${SITE_URL}/teps`,
  },
  "/obras": {
    title: "Obras & Infraestrutura Crítica em Postos de Combustível — RR Engenharia",
    description:
      "Obras em postos de combustível e infraestrutura crítica: planejamento executivo, conformidade ABNT/NR-20 e entrega no prazo. RR Engenharia — Rio de Janeiro, atende todo o Brasil.",
    keywords:
      "obras postos de combustível, construção de posto, engenharia civil, infraestrutura crítica, NR-20, concretagem, terraplanagem, Rio de Janeiro",
    canonical: `${SITE_URL}/obras`,
  },
  "/manutencao": {
    title: "Manutenção Preventiva & Facilities para Postos de Combustível — RR Engenharia",
    description:
      "Manutenção preventiva (PCM) com SLA para postos de combustível e instalações críticas. Redução de 40% em custos de emergência. RR Engenharia, acreditada INMETRO.",
    keywords:
      "manutenção preventiva, PCM, SLA manutenção, facilities, posto de combustível, bomba de combustível, manutenção SASC",
    canonical: `${SITE_URL}/manutencao`,
  },
  "/automacao": {
    title: "RR Engine | Automação de Propostas em Engenharia com IA — RR Engenharia",
    description:
      "RR Engine: plataforma de automação de propostas em engenharia com IA generativa. Reduz tempo de orçamento de 7 dias para 24 horas em projetos SASC, TEPS e obras.",
    keywords:
      "automação engenharia, IA engenharia, proposta SASC, orçamento automatizado, BDI, SINAPI, RR Engine",
    canonical: `${SITE_URL}/automacao`,
  },
  "/blog": {
    title: "Blog Técnico | SASC, TEPS, Normas ABNT e Conformidade INMETRO — RR Engenharia",
    description:
      "Artigos técnicos sobre SASC, TEPS, normas ABNT/INMETRO, NR-20 e conformidade regulatória em postos de combustível. Blog da RR Engenharia.",
    keywords: "blog SASC, blog TEPS, normas ABNT, INMETRO, conformidade regulatória, NR-20",
    canonical: `${SITE_URL}/blog`,
  },
};

export function getRouteSEO(path: string): RouteSEO {
  if (path.startsWith("/blog/")) {
    const slug = path.replace(/^\/blog\//, "").replace(/\/$/, "") as BlogSlug;
    const meta = BLOG_POST_META[slug];
    if (meta) {
      return {
        title: `${meta.title} | RR Engenharia`,
        description: meta.description,
        canonical: `${SITE_URL}/blog/${slug}`,
        ogType: "article",
      };
    }
  }
  return ROUTE_SEO[path] ?? ROUTE_SEO["/"];
}

export const ALL_ROUTES: string[] = [
  "/",
  "/sasc",
  "/teps",
  "/obras",
  "/manutencao",
  "/automacao",
  "/blog",
  ...BLOG_POST_SLUGS.map((slug) => `/blog/${slug}`),
];
