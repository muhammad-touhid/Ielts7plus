import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(req, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { key, band, notes } = body;

    if (!key) {
      return NextResponse.json(
        { error: "Missing answer key" },
        { status: 400 },
      );
    }

    const submission = await prisma.mockTestSubmission.findUnique({
      where: { id },
    });
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    const existingMarks = submission.speakingMarks || {};
    const updatedMarks = {
      ...existingMarks,
      [key]: { band: band || "", notes: notes || "" },
    };

    const updated = await prisma.mockTestSubmission.update({
      where: { id },
      data: { speakingMarks: updatedMarks },
    });

    return NextResponse.json({ speakingMarks: updated.speakingMarks });
  } catch (error) {
    console.error("PUT /api/mock-tests/[id]/speaking-marks error:", error);
    return NextResponse.json({ error: "Failed to save mark" }, { status: 500 });
  }
}
