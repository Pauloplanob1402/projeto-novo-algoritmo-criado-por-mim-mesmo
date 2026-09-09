"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Erro global no UNSAY:", error);
  }, [error]);

  // Este boundary substitui o <html>/<body> inteiro quando o próprio
  // layout raiz falha — por isso não reaproveita fontes/tokens do resto
  // do app, e fica intencionalmente simples.
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "16px",
          background: "#0a0812",
          color: "#f4f1fc",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <p style={{ fontSize: "20px", margin: 0 }}>Algo não saiu como esperado.</p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: "linear-gradient(120deg, #8B6BFF, #C767E8, #F0529C)",
            color: "#0a0812",
            fontWeight: 700,
            border: "none",
            borderRadius: "999px",
            padding: "14px 28px",
            cursor: "pointer",
          }}
        >
          Tentar de novo
        </button>
      </body>
    </html>
  );
}
