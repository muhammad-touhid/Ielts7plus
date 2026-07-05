import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const testType = searchParams.get("testType");

    // If testType param provided (public mock test), filter by it
    if (testType) {
      const questions = await prisma.mockTestQuestion.findMany({
        where: {
          published: true,
          OR: [{ testType: testType }, { testType: "both" }],
        },
        orderBy: [{ module: "asc" }, { order: "asc" }],
      });
      return NextResponse.json(questions);
    }

    // No filter — admin list, return all
    const questions = await prisma.mockTestQuestion.findMany({
      orderBy: [{ module: "asc" }, { order: "asc" }],
    });
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const question = await prisma.mockTestQuestion.create({
      data: {
        module: body.module,
        type: body.type,
        order: parseInt(body.order) || 0,
        content: body.content,
        testType: body.testType || "both",
        published: body.published ?? false,
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 },
    );
  }
}
