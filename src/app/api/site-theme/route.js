// src/app/api/site-theme/route.js
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PUT(req) {
  const session = await auth();
  if (
    !session ||
    !["admin", "teacher", "moderator"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { colors, fonts } = await req.json();
  const row = await prisma.siteTheme.upsert({
    where: { id: 1 },
    create: { id: 1, colors, fonts },
    update: { colors, fonts },
  });
  return NextResponse.json(row);
}
