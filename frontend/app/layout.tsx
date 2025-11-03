import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/common/ThemeRegistry";
import { StructuredData } from "./structured-data";
import { AuthProvider } from "@/context/AuthContext";
import LayoutContent from "./LayoutContent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "uncvpro.fr - Créez votre CV professionnel en 5 minutes | Gratuit et Sans Inscription",
  description: "Créez votre CV professionnel en ligne gratuitement. Plus de 15 templates modernes, export PDF/Word/Docs. Sans inscription requise. Interface intuitive et prévisualisation en temps réel. Démarquez-vous avec un CV professionnel.",
  keywords: [
    "cv en ligne",
    "créateur de cv",
    "cv gratuit",
    "template cv",
    "modèle cv professionnel",
    "cv pdf",
    "faire un cv",
    "cv builder",
    "générateur cv",
    "cv moderne",
    "curriculum vitae",
  ],
  authors: [{ name: "uncvpro.fr" }],
  creator: "uncvpro.fr",
  publisher: "uncvpro.fr",
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
    title: "uncvpro.fr - Créez votre CV professionnel en 5 minutes",
    description: "Créez votre CV professionnel en ligne gratuitement. Plus de 15 templates modernes, export PDF/Word/Docs. Sans inscription requise.",
    siteName: "uncvpro.fr",
  },
  twitter: {
    card: "summary_large_image",
    title: "uncvpro.fr - Créez votre CV professionnel en 5 minutes",
    description: "Créez votre CV professionnel en ligne gratuitement. Plus de 15 templates modernes, export PDF/Word/Docs.",
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
        <AuthProvider>
          <ThemeRegistry>
            <LayoutContent>{children}</LayoutContent>
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
