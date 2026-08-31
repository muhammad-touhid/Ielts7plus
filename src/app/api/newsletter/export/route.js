import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ADMIN_ROLES = ["admin", "teacher", "moderator"];

function escapeCsvValue(value) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const session = await auth();

  if (!session?.user || !ADMIN_ROLES.includes(session.user.role)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 },
    );
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  const header = "Email,Subscribed At\n";
  const rows = subscribers
    .map(
      (s) =>
        `${escapeCsvValue(s.email)},${escapeCsvValue(
          new Date(s.createdAt).toISOString(),
        )}`,
    )
    .join("\n");

  return new NextResponse(header + rows, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="newsletter-subscribers-${Date.now()}.csv"`,
    },
  });
}
