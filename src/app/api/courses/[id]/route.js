import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const courseData = {
      slug: body.slug,
      name: body.name,
      tagline: body.tagline,
      description: body.description,
      icon: body.icon,
      coverImage: body.coverImage || null,
      price: body.price,
      salePrice: body.salePrice || null,
      duration: body.duration,
      batchSize: body.batchSize,
      classes: body.classes,
      level: body.level,
      badge: body.badge || null,
      features: body.features,
      highlights: body.highlights,
      whatYouWillLearn: body.whatYouWillLearn,
      published: body.published ?? false,
    };

    const slugChanged =
      body.slug && existing.slug && body.slug !== existing.slug;
    const ops = [prisma.course.update({ where: { id }, data: courseData })];

    if (slugChanged) {
      const oldPageSlug = `courses/${existing.slug}`;
      const newPageSlug = `courses/${body.slug}`;

      const linkedPage = await prisma.page.findUnique({
        where: { slug: oldPageSlug },
      });

      if (linkedPage) {
        const clash = await prisma.page.findUnique({
          where: { slug: newPageSlug },
        });
        if (clash && clash.id !== linkedPage.id) {
          return NextResponse.json(
            { error: "A page with this slug already exists" },
            { status: 409 },
          );
        }
        ops.push(
          prisma.page.update({
            where: { id: linkedPage.id },
            data: { slug: newPageSlug },
          }),
        );
      }
    }

    const [course] = await prisma.$transaction(ops);

    if (slugChanged) {
      revalidatePath("/courses");
      revalidatePath(`/courses/${existing.slug}`);
      revalidatePath(`/courses/${body.slug}`);
    }

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
