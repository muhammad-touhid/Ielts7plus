// src/app/api/public/courses/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/public/courses?limit=6
// Used by the Course Grid page-builder widget (both in Puck's editor
// preview and on the live published page — both render client-side in
// our current architecture, so this widget fetches via API rather than
// querying Prisma directly, same reasoning as SearchBar's client-side
// navigation).
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "6", 10) || 6, 24);

  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      slug: true,
      name: true,
      tagline: true,
      icon: true,
      coverImage: true,
      duration: true,
      level: true,
      price: true,
      badge: true,
    },
  });

  return NextResponse.json({ courses });
}
