import type { NextConfig } from "next";

// Headers de segurança padrão de produção. Deliberadamente sem uma
// Content-Security-Policy estrita aqui: o app depende de domínios externos
// (Google Fonts, Supabase, o redirect do login com Google) e uma CSP mal
// calibrada quebraria login/fontes sem eu poder testar contra um projeto
// Supabase real. Ver README (Segurança) para como endurecer isso depois,
// com o domínio de produção em mãos.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
