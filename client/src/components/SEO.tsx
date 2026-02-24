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
      "email": "contato@rres.com.br"
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
    "description": "Especialista em SASC, TEPS e construção de postos de combustível",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. das Américas, 4200, Bloco 8, Sala 106A",
      "addressLocality": "Rio de Janeiro",
      "addressRegion": "RJ",
      "postalCode": "22640-907",
      "addressCountry": "BR"
    },
    "telephone": "+55-21-99574-0273",
    "email": "contato@rres.com.br",
    "url": "https://rres.com.br",
    "priceRange": "$$"
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
    </>
  );
}
