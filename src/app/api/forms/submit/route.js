import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const { data, pageSlug, pageTitle, formLabel } = body || {};

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid submission data." },
        { status: 400 },
      );
    }

    const submission = await prisma.formSubmission.create({
      data: {
        data,
        pageSlug: pageSlug || null,
        pageTitle: pageTitle || null,
        formLabel: formLabel || null,
      },
    });

    return NextResponse.json({ success: true, id: submission.id });
  } catch (err) {
    console.error("Form submission error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
