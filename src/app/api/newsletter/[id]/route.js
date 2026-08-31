import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ADMIN_ROLES = ["admin", "teacher", "moderator"];

export async function DELETE(request, { params }) {
  const session = await auth();

  if (!session?.user || !ADMIN_ROLES.includes(session.user.role)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 },
    );
  }

  const { id } = await params;

  try {
    await prisma.newsletterSubscriber.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete subscriber error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete subscriber." },
      { status: 500 },
    );
  }
}
