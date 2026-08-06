// src/app/api/public/site-theme/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULTS = {
  primary: "#2563eb",
  secondary: "#f59e0b",
  text: "#111827",
  background: "#ffffff",
};

export async function GET() {
  const row = await prisma.siteTheme.findUnique({ where: { id: 1 } });
  return NextResponse.json({ colors: row?.colors || DEFAULTS });
}
