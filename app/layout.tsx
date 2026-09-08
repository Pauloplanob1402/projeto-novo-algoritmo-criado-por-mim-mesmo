import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNSAY — Você não sabe tudo sobre você",
  description: "Responda. Compare. Descubra.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router root layout, aplica-se a todas as páginas */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,ital@9..144,340,1;9..144,440,0;9..144,600,0&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex items-center justify-center sm:py-8">{children}</body>
    </html>
  );
}
