// src/app/api/public/events/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "6", 10);

  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      para: true,
      image: true,
      badge: true,
      date: true,
      time: true,
      campus: true,
    },
  });

  return NextResponse.json(
    { events },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
