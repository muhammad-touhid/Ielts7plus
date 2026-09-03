const SITE_URL =
  process.env.SITE_URL || process.env.AUTH_URL || "https://ielts7plus.co.uk";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/api"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
