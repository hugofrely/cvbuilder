export function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'CV Builder',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '10000',
      bestRating: '5',
      worstRating: '1',
    },
    description:
      'Créez votre CV professionnel en ligne gratuitement. Plus de 15 templates modernes, export PDF/Word/Docs. Sans inscription requise.',
    url: 'https://cvbuilder.com',
    creator: {
      '@type': 'Organization',
      name: 'CV Builder',
    },
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0',
    screenshot: 'https://cvbuilder.com/screenshot.png',
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CV Builder',
    url: 'https://cvbuilder.com',
    logo: 'https://cvbuilder.com/logo.png',
    description:
      'CV Builder aide les professionnels à créer des CV modernes et professionnels en quelques minutes.',
    sameAs: [
      'https://www.facebook.com/cvbuilder',
      'https://twitter.com/cvbuilder',
      'https://www.linkedin.com/company/cvbuilder',
    ],
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://cvbuilder.com',
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Est-ce que CV Builder est gratuit ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui, CV Builder propose un template gratuit sans inscription. Des templates premium supplémentaires sont disponibles à l\'achat.',
        },
      },
      {
        '@type': 'Question',
        name: 'Dois-je créer un compte pour utiliser CV Builder ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Non, vous pouvez commencer à créer votre CV immédiatement sans créer de compte. L\'inscription est optionnelle pour sauvegarder vos CV.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quels formats d\'export sont disponibles ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vous pouvez exporter votre CV en PDF, Google Docs, Microsoft Word (.docx) et OpenOffice (.odt).',
        },
      },
      {
        '@type': 'Question',
        name: 'Combien de temps faut-il pour créer un CV ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Avec CV Builder, vous pouvez créer un CV professionnel en moins de 5 minutes grâce à notre interface intuitive et nos templates modernes.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
