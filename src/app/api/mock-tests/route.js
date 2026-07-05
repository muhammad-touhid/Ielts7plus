import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    const submission = await prisma.mockTestSubmission.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        targetBand: body.targetBand || null,
        testType: body.testType || "academic",
        completedModules: body.completedModules,
        answers: body.answers,
        status: "pending",
        resultSent: false,
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Mock test submission error:", error);
    return NextResponse.json(
      { error: "Failed to save submission", details: error.message },
      { status: 500 },
    );
  }
}
