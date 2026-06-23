import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const batches = await prisma.batch.findMany({
      orderBy: { createdAt: "desc" },
      include: { course: { select: { name: true } } },
    });
    return NextResponse.json(batches);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch batches" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const batch = await prisma.batch.create({
      data: {
        name: body.name,
        courseId: body.courseId || null,
        module: body.module,
        time: body.time,
        schedule: body.schedule,
        startDate: body.startDate,
        seats: parseInt(body.seats),
        duration: body.duration,
        badge: body.badge || null,
        published: body.published ?? false,
      },
    });

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create batch" },
      { status: 500 },
    );
  }
}
