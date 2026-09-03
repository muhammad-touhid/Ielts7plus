import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import PageRenderer from "../PageRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug: slugParts } = await params;
  const slug = slugParts.join("/");
  const page = await prisma.page.findUnique({ where: { slug } });

  if (!page) {
    return { title: "Page Not Found" };
  }

  const title = page.metaTitle || page.title;
  const description = page.metaDescription || undefined;
  const keywords = page.metaKeywords
    ? page.metaKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : undefined;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicPage({ params }) {
  const { slug: slugParts } = await params;
  const slug = slugParts.join("/");

  // "home" is reserved for the homepage. Redirect rather than
  // double-render the same content at both / and /home.
  if (slug === "home") {
    redirect("/");
  }

  // "site-header" / "site-footer" are chrome, not standalone pages —
  // they're rendered as part of the layout, never visited directly.
  if (slug === "site-header" || slug === "site-footer") {
    notFound();
  }

  const page = await prisma.page.findUnique({ where: { slug } });

  if (!page || page.status !== "published") notFound();

  return <PageRenderer data={page.data} />;
}
