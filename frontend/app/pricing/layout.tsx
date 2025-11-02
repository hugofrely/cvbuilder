import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tarifs - moncv.xyz | Créez votre CV professionnel',
  description: 'Découvrez nos formules tarifaires : Paiement par CV à 2,40€ ou formule Premium à 24€ pour un accès illimité. Choisissez la solution adaptée à vos besoins.',
  keywords: [
    'tarifs cv',
    'prix cv builder',
    'formule premium',
    'export cv pdf',
    'télécharger cv',
    'abonnement cv',
  ],
  openGraph: {
    title: 'Tarifs - moncv.xyz',
    description: 'Paiement par CV (2,40€) ou Premium (24€) pour un accès illimité',
    type: 'website',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
