// src/app/(public)/[slug]/page.js
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import PageRenderer from "../PageRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  return { title: page?.title || "Page" };
}

export default async function PublicPage({ params }) {
  const { slug } = await params;

  // "home" is reserved for the homepage. Redirect rather than
  // double-render the same content at both / and /home (duplicate
  // content, confusing for SEO and for anyone sharing the link).
  if (slug === "home") {
    redirect("/");
  }

  const page = await prisma.page.findUnique({ where: { slug } });

  if (!page || page.status !== "published") notFound();

  return <PageRenderer data={page.data} />;
}
