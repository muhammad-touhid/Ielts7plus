import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    const enrollment = await prisma.enrollment.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        batchId: body.batchId,
        paymentMethod: body.paymentMethod || null,
        transactionId: body.transactionId || null,
        status: "pending",
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const enrollments = await prisma.enrollment.findMany({
      orderBy: { createdAt: "desc" },
      include: { batch: { select: { name: true } } },
    });
    return NextResponse.json(enrollments);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
