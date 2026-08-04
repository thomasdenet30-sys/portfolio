import type { Metadata, Viewport } from "next";
import { Instrument_Serif } from "next/font/google";
import { teacher } from "@/data/projects";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

/* Une seule police téléchargée, et c'est celle qui porte l'identité.
   Le sans-serif d'interface passe par la pile système (SF Pro sur Apple,
   Segoe UI sur Windows) : ~50 Ko de moins à charger, une requête critique en
   moins en concurrence avec la serif — et le rendu reste exactement celui
   qu'on cherchait. La serif, elle, est auto-hébergée par next/font : aucune
   requête vers Google au runtime, donc rien à consentir non plus. */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-instrument-serif",
});

const title = `${teacher.name} — ${teacher.roles.join(", ")}`;
const description =
  "Poussez la porte de la salle de cours d'Alexandre Thomas : chaque projet y est assis comme un ancien élève devenu une réussite.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: `%s — ${teacher.name}`,
  },
  description,
  applicationName: "Salle de cours",
  authors: [{ name: teacher.name }],
  creator: teacher.name,
  keywords: [
    "Alexandre Thomas",
    "enseignant",
    "entrepreneur",
    "créateur d'applications",
    "portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    title,
    description,
    siteName: "Salle de cours — Alexandre Thomas",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#100a06",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${instrumentSerif.variable} antialiased`}>
      <body>
        {/* Capteur de clic precoce.
            La porte est dessinee par le HTML et le CSS, donc visible bien avant
            que le JavaScript arrive : sur une connexion lente, plusieurs
            secondes. Tout clic pendant ce temps etait perdu sans trace — la
            porte semblait simplement ne pas s'ouvrir. Ce script inline, execute
            des l'analyse du document, note l'intention ; l'application la
            rejoue des qu'elle prend la main. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{window.__seuilClic=0;" +
              "function h(e){var t=e.target;if(t&&t.closest&&t.closest('[data-seuil]')){" +
              "window.__seuilClic=1;document.documentElement.setAttribute('data-seuil-attente','');}}" +
              "document.addEventListener('click',h,{capture:true});" +
              "window.__seuilStop=function(){document.removeEventListener('click',h,{capture:true});" +
              "document.documentElement.removeAttribute('data-seuil-attente');};" +
              "}catch(e){}})()",
          }}
        />
        {children}
      </body>
    </html>
  );
}
