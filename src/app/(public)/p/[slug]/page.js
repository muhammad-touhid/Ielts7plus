// src/app/(public)/p/[slug]/page.js
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageRenderer from "./PageRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  return { title: page?.title || "Page" };
}

export default async function PublicPage({ params }) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });

  if (!page || page.status !== "published") notFound();

  return <PageRenderer data={page.data} />;
}
