import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req, { params }) {
  const { slug } = await params;

  const event = await prisma.event.findFirst({
    where: { slug, published: true },
  });

  return NextResponse.json(
    { event: event || null },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
