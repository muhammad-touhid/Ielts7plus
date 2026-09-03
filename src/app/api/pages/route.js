import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { RESERVED_SLUGS } from "@/lib/pageBuilder/reservedSlugs";

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
  const session = await auth();

  const body = await req.json();
  const { title, slug } = body;

  if (!title || !slug) {
    return NextResponse.json(
      { error: "title and slug are required" },
      { status: 400 },
    );
  }

  const normalizedSlug = slug.toLowerCase().trim();

  if (RESERVED_SLUGS.includes(normalizedSlug)) {
    return NextResponse.json(
      {
        error: `"${normalizedSlug}" is reserved and can't be used as a page slug`,
      },
      { status: 409 },
    );
  }

  const existing = await prisma.page.findUnique({
    where: { slug: normalizedSlug },
  });
  if (existing) {
    return NextResponse.json(
      { error: "A page with this slug already exists" },
      { status: 409 },
    );
  }

  const page = await prisma.page.create({
    data: {
      title,
      slug: normalizedSlug,
      data: { content: [], root: { props: { title } } },
      status: "draft",
      createdById: session?.user?.id || null,
    },
  });

  return NextResponse.json(page);
}
