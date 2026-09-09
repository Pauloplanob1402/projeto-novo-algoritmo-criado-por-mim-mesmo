import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // páginas de compartilhamento são conteúdo efêmero/pessoal, não
      // precisam ser indexadas uma a uma
      disallow: "/q/",
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/sitemap.xml`,
  };
}
