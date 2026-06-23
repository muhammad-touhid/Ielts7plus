import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET single course
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course)
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 },
    );
  }
}

// PUT update course
export async function PUT(req, { params }) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    const course = await prisma.course.update({
      where: { id },
      data: {
        slug: body.slug,
        name: body.name,
        tagline: body.tagline,
        description: body.description,
        icon: body.icon,
        price: body.price,
        duration: body.duration,
        batchSize: body.batchSize,
        classes: body.classes,
        level: body.level,
        badge: body.badge || null,
        features: body.features,
        highlights: body.highlights,
        whatYouWillLearn: body.whatYouWillLearn,
        published: body.published ?? false,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 },
    );
  }
}

// DELETE course
export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 },
    );
  }
}
