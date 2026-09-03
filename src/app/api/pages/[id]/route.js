import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  RESERVED_SLUGS,
  PROTECTED_SLUGS,
} from "@/lib/pageBuilder/reservedSlugs";

export const dynamic = "force-dynamic";

// GET /api/pages/:id — load a page for the editor
export async function GET(req, { params }) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(page);
}

// PUT /api/pages/:id
//
// 1. METADATA-ONLY: body is { title?, slug?, metaTitle?,
//    metaDescription?, metaKeywords? }, no content/action. Blocks
//    changing slug AWAY from a protected slug (home, site-header,
//    site-footer) — title/SEO fields can still change freely.
// 2. CONTENT SAVE: body is { content, action, title? } — unchanged.
export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const {
    content,
    action,
    title,
    slug,
    metaTitle,
    metaDescription,
    metaKeywords,
  } = body;

  // --- Metadata-only path (rename and/or SEO fields) ---------------
  if (content === undefined && action === undefined) {
    const hasSeoUpdate =
      metaTitle !== undefined ||
      metaDescription !== undefined ||
      metaKeywords !== undefined;

    if (!title && !slug && !hasSeoUpdate) {
      return NextResponse.json(
        {
          error:
            "Provide title/slug to rename, SEO fields to update metadata, or content+action to save page data",
        },
        { status: 400 },
      );
    }

    const existingPage = await prisma.page.findUnique({ where: { id } });
    if (!existingPage) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const updateData = {};
    if (title) updateData.title = title;

    if (slug) {
      const normalizedSlug = slug.toLowerCase().trim();

      if (
        PROTECTED_SLUGS.includes(existingPage.slug) &&
        normalizedSlug !== existingPage.slug
      ) {
        return NextResponse.json(
          {
            error: `"${existingPage.slug}" is a protected page slug and can't be changed — the site depends on it by exact name. Rename the title instead.`,
          },
          { status: 409 },
        );
      }

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
      if (existing && existing.id !== id) {
        return NextResponse.json(
          { error: "A page with this slug already exists" },
          { status: 409 },
        );
      }

      updateData.slug = normalizedSlug;
    }

    // Empty string means "clear it" (falls back to page.title at
    // render time), so these are stored as null rather than "".
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle || null;
    if (metaDescription !== undefined)
      updateData.metaDescription = metaDescription || null;
    if (metaKeywords !== undefined)
      updateData.metaKeywords = metaKeywords || null;

    const page = await prisma.page.update({ where: { id }, data: updateData });
    return NextResponse.json(page);
  }

  // --- Content save path (draft/publish) — unchanged behavior ------
  if (!content || !["draft", "publish"].includes(action)) {
    return NextResponse.json(
      { error: "content and a valid action are required" },
      { status: 400 },
    );
  }

  const updateData =
    action === "publish"
      ? { data: content, draftData: null, status: "published" }
      : { draftData: content };

  const page = await prisma.page.update({
    where: { id },
    data: {
      ...updateData,
      ...(title && { title }),
    },
  });

  return NextResponse.json(page);
}

// DELETE /api/pages/:id
export async function DELETE(req, { params }) {
  const session = await auth();
  if (
    !session ||
    !["admin", "teacher", "moderator"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const existingPage = await prisma.page.findUnique({ where: { id } });
  if (!existingPage) {
    return NextResponse.json(
      { error: "Page not found or already deleted" },
      { status: 404 },
    );
  }

  if (PROTECTED_SLUGS.includes(existingPage.slug)) {
    return NextResponse.json(
      {
        error: `"${existingPage.slug}" is a protected page and can't be deleted — the site depends on it (homepage or site header/footer).`,
      },
      { status: 409 },
    );
  }

  try {
    await prisma.page.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Page not found or already deleted" },
      { status: 404 },
    );
  }
}
