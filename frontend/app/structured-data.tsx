export function StructuredData() {
  // Utilisation de @graph pour combiner plusieurs schémas en un seul
  // Cela évite les problèmes de doublons détectés par Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://uncvpro.fr/#webapp',
        name: 'uncvpro.fr',
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
        url: 'https://uncvpro.fr',
        creator: {
          '@id': 'https://uncvpro.fr/#organization',
        },
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        softwareVersion: '1.0',
        screenshot: 'https://uncvpro.fr/screenshot.png',
      },
      {
        '@type': 'Organization',
        '@id': 'https://uncvpro.fr/#organization',
        name: 'uncvpro.fr',
        url: 'https://uncvpro.fr',
        logo: 'https://uncvpro.fr/logo.png',
        description:
          'uncvpro.fr aide les professionnels à créer des CV modernes et professionnels en quelques minutes.',
        sameAs: [
          'https://www.facebook.com/uncvpro.fr',
          'https://twitter.com/uncvpro.fr',
          'https://www.linkedin.com/company/uncvpro.fr',
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://uncvpro.fr/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Accueil',
            item: 'https://uncvpro.fr',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://uncvpro.fr/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Est-ce que uncvpro.fr est gratuit ?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Oui, uncvpro.fr propose un template gratuit sans inscription. Des templates premium supplémentaires sont disponibles à l\'achat.',
            },
          },
          {
            '@type': 'Question',
            name: 'Dois-je créer un compte pour utiliser uncvpro.fr ?',
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
              text: 'Avec uncvpro.fr, vous pouvez créer un CV professionnel en moins de 5 minutes grâce à notre interface intuitive et nos templates modernes.',
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
