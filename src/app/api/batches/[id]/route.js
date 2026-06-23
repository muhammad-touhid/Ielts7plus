import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: { course: { select: { name: true } } },
    });
    if (!batch)
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    return NextResponse.json(batch);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch batch" },
      { status: 500 },
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    const batch = await prisma.batch.update({
      where: { id },
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

    return NextResponse.json(batch);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update batch" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await prisma.batch.delete({ where: { id } });
    return NextResponse.json({ message: "Batch deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete batch" },
      { status: 500 },
    );
  }
}
