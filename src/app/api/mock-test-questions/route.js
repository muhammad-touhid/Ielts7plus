import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const testType = searchParams.get("testType") || "academic";

    // Fetch questions that match the testType or are shared ("both")
    const questions = await prisma.mockTestQuestion.findMany({
      where: {
        published: true,
        OR: [{ testType: testType }, { testType: "both" }],
      },
      orderBy: [{ module: "asc" }, { order: "asc" }],
    });

    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
