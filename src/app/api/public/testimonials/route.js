// src/app/api/public/testimonials/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "6", 10);

  const testimonials = await prisma.review.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json(
    { testimonials },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
