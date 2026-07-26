// src/app/api/pages/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/pages/:id — load a page for the editor
export async function GET(req, { params }) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(page);
}

// PUT /api/pages/:id — body: { content, action, title? }
//   action: "draft"   -> saves into draftData only. Live published page
//                         (the `data` field) is untouched.
//   action: "publish" -> copies content into `data` (the live published
//                         field), clears draftData, sets status published.
export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const { content, action, title } = body;

  if (!content || !["draft", "publish"].includes(action)) {
    return NextResponse.json({ error: "content and a valid action are required" }, { status: 400 });
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
  const { id } = await params;
  await prisma.page.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
