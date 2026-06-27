import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const enrollment = await prisma.enrollment.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await prisma.enrollment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
