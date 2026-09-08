import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNSAY — Você não sabe tudo sobre você",
  description: "Responda. Compare. Descubra.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover", // respeita a área do notch/home indicator no iOS
  themeColor: "#0a0812",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          Pesos estáticos exatos (não a fonte variável completa) — só o que
          a interface realmente usa, ver auditoria no README (Performance).
        */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router root layout, aplica-se a todas as páginas */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,300;1,600&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex items-center justify-center sm:py-8">{children}</body>
    </html>
  );
}
