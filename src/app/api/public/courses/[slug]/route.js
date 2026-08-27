import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req, { params }) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug, published: true },
  });

  if (!course) {
    return NextResponse.json(
      { course: null, batches: [] },
      { status: 404, headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }

  const batches = await prisma.batch.findMany({
    where: { courseId: course.id, published: true },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          enrollments: { where: { status: "confirmed" } },
        },
      },
    },
  });

  return NextResponse.json(
    { course, batches },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
