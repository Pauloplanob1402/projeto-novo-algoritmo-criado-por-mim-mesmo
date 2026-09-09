import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "UNSAY — Você não sabe tudo sobre você",
    short_name: "UNSAY",
    description: "Responda. Compare. Descubra.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0812",
    theme_color: "#0a0812",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
