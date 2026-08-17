// src/app/api/public/batches/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "6", 10);

  const batches = await prisma.batch.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { course: { select: { name: true, slug: true } } },
  });

  return NextResponse.json(
    { batches },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
