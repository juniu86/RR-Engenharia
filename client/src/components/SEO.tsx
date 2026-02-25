export function SEOHead() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RR Engenharia",
    "url": "https://rres.com.br",
    "logo": "https://rres.com.br/logo.png",
    "description": "Especialista em SASC, TEPS e construção de postos de combustível com certificação vigente até 2029",
    "sameAs": [
      "https://www.facebook.com/rr-engenharia",
      "https://www.linkedin.com/company/rr-engenharia"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "telephone": "+55-21-99574-0273",
      "email": "contato@rres.com.br",
      "areaServed": "BR",
      "availableLanguage": "Portuguese"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. das Américas, 4200, Bloco 8, Sala 106A",
      "addressLocality": "Rio de Janeiro",
      "addressRegion": "RJ",
      "postalCode": "22640-907",
      "addressCountry": "BR"
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "RR Engenharia",
    "image": "https://rres.com.br/logo.png",
    "description": "Especialista em SASC, TEPS e construção de postos de combustível no Rio de Janeiro",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. das Américas, 4200, Bloco 8, Sala 106A",
      "addressLocality": "Rio de Janeiro",
      "addressRegion": "RJ",
      "postalCode": "22640-907",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -22.9991,
      "longitude": -43.3620
    },
    "telephone": "+55-21-99574-0273",
    "email": "contato@rres.com.br",
    "url": "https://rres.com.br",
    "priceRange": "$$",
    "areaServed": {
      "@type": "State",
      "name": "Rio de Janeiro"
    }
  };

  const servicesSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "SASC - Sistema de Armazenamento Subterrâneo de Combustíveis",
      "description": "Instalação e retirada de Sistemas de Armazenamento Subterrâneo de Combustíveis com certificação CTBC vigente até 02/02/2029.",
      "provider": { "@type": "LocalBusiness", "name": "RR Engenharia" },
      "areaServed": { "@type": "State", "name": "Rio de Janeiro" },
      "serviceType": "Instalação e retirada de SASC"
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "TEPS - Ensaios de Estanqueidade",
      "description": "Testes certificados de integridade de sistemas subterrâneos com certificação CTBC vigente até 02/02/2029.",
      "provider": { "@type": "LocalBusiness", "name": "RR Engenharia" },
      "areaServed": { "@type": "State", "name": "Rio de Janeiro" },
      "serviceType": "Ensaios de estanqueidade"
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Construção e Reforma de Postos de Combustível",
      "description": "Construção, reforma e adequação de postos de abastecimento com governança de custo, prazo e segurança.",
      "provider": { "@type": "LocalBusiness", "name": "RR Engenharia" },
      "areaServed": { "@type": "State", "name": "Rio de Janeiro" },
      "serviceType": "Construção de postos de combustível"
    }
  ];

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      {servicesSchema.map((service, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(service)}
        </script>
      ))}
    </>
  );
}
