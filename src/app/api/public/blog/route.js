// src/app/api/public/blog/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/public/blog?limit=6
// Used by the Blog Grid/Carousel page-builder widget (both in Puck's
// editor preview and on the live published page — both render
// client-side in our current architecture, so this widget fetches via
// API rather than querying Prisma directly, same reasoning as
// SearchBar's client-side navigation and the Course Grid widget).
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(
    parseInt(searchParams.get("limit") || "6", 10) || 6,
    24,
  );

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      image: true,
      author: true,
      readTime: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ posts });
}
