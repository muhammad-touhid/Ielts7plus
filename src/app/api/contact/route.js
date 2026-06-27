import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    const submission = await prisma.contactSubmission.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        subject: body.subject,
        message: body.message,
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 },
    );
  }
}
