import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await prisma.eventRegistration.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
