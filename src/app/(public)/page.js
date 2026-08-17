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
  return { title: page?.title || "IELTS7+" };
}

export default async function Home() {
  const page = await prisma.page.findUnique({ where: { slug: HOME_SLUG } });

  if (!page || page.status !== "published") notFound();

  return <PageRenderer data={page.data} />;
}
