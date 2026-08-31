import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  const team = await prisma.admin.findMany({
    where: { showOnWebsite: true },
    orderBy: { createdAt: "asc" },
    take: limit,
    select: {
      id: true,
      name: true,
      publicTitle: true,
      bio: true,
      image: true,
      linkedinUrl: true,
      facebookUrl: true,
    },
  });

  return NextResponse.json(
    { team },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
