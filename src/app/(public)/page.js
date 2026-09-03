// src/app/(public)/page.js
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageRenderer from "./PageRenderer";

export const dynamic = "force-dynamic";

// "home" is reserved (see reservedSlugs.js) — this is the ONLY Page row
// that ever renders at "/".
const HOME_SLUG = "home";

export async function generateMetadata() {
  const page = await prisma.page.findUnique({ where: { slug: HOME_SLUG } });

  if (!page) {
    return { title: "IELTS7+" };
  }

  const title = page.metaTitle || page.title || "IELTS7+";
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

export default async function Home() {
  const page = await prisma.page.findUnique({ where: { slug: HOME_SLUG } });

  if (!page || page.status !== "published") notFound();

  return <PageRenderer data={page.data} />;
}
