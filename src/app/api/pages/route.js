// src/app/api/pages/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/pages — list all pages (for the admin pages list screen)
export async function GET() {
  const pages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(pages);
}

// POST /api/pages — create a new blank page, returns its id so the
// admin UI can redirect straight into the editor
export async function POST(req) {
  const body = await req.json();
  const { title, slug } = body;

  if (!title || !slug) {
    return NextResponse.json(
      { error: "title and slug are required" },
      { status: 400 },
    );
  }

  const existing = await prisma.page.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json(
      { error: "A page with this slug already exists" },
      { status: 409 },
    );
  }

  const page = await prisma.page.create({
    data: {
      title,
      slug,
      data: { content: [], root: { props: { title } } },
      status: "draft",
    },
  });

  return NextResponse.json(page);
}
