import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/common/ThemeRegistry";
import { StructuredData } from "./structured-data";
import { AuthProvider } from "@/context/AuthContext";
import LayoutContent from "./LayoutContent";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import GoogleTagManager from "@/components/analytics/GoogleTagManager";
import Contentsquare from "@/components/analytics/Contentsquare";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Créer un CV Gratuit en Ligne | CV Professionnel en 5 Minutes - uncvpro.fr",
  description: "Créer CV gratuit en ligne : 15+ modèles professionnels, sans inscription. Faire un CV moderne et le télécharger en PDF gratuitement. CV professionnel pour étudiants et professionnels.",
  keywords: [
    // Mots-clés prioritaires Google Ads
    "créer cv",
    "créer cv en ligne",
    "cv gratuit",
    "cv professionnel",
    "faire un cv",
    // Mots-clés secondaires
    "créer un cv",
    "créer cv gratuit",
    "faire cv en ligne",
    "cv en ligne gratuit",
    "créateur de cv",
    "modèle cv gratuit",
    "template cv",
    "cv pdf gratuit",
    "générateur cv",
    "cv moderne",
    "faire cv gratuit",
    "créer cv professionnel",
    "cv étudiant",
  ],
  authors: [{ name: "uncvpro.fr" }],
  creator: "uncvpro.fr",
  publisher: "uncvpro.fr",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://uncvpro.fr",
    title: "Créer un CV Gratuit en Ligne | CV Professionnel - uncvpro.fr",
    description: "Créer CV gratuit en ligne : 15+ modèles professionnels, sans inscription. Faire un CV moderne et le télécharger en PDF gratuitement.",
    siteName: "uncvpro.fr",
  },
  twitter: {
    card: "summary_large_image",
    title: "Créer un CV Gratuit en Ligne | CV Professionnel - uncvpro.fr",
    description: "Créer CV gratuit en ligne : 15+ modèles professionnels, sans inscription. Faire un CV moderne en PDF gratuitement.",
  },
  verification: {
    google: "google-site-verification-code", // À remplacer par votre code
  },
  alternates: {
    canonical: "https://uncvpro.fr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <StructuredData />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <GoogleTagManager GTM_ID={process.env.NEXT_PUBLIC_GTM_ID} />
        )}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        {process.env.NEXT_PUBLIC_CONTENTSQUARE_ID && (
          <Contentsquare CONTENTSQUARE_ID={process.env.NEXT_PUBLIC_CONTENTSQUARE_ID} />
        )}
        <AuthProvider>
          <ThemeRegistry>
            <LayoutContent>{children}</LayoutContent>
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
