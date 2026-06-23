import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review)
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch review" },
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

    const review = await prisma.review.update({
      where: { id },
      data: {
        name: body.name,
        designation: body.designation,
        image: body.image || null,
        rating: parseInt(body.rating),
        review: body.review,
        published: body.published ?? false,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update review" },
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
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 },
    );
  }
}
