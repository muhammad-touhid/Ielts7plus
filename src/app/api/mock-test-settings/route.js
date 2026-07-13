import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Prevent Next.js from caching this route's response — without this, a GET
// with no dynamic functions can be served from a stale cached snapshot,
// which looks exactly like "settings revert after refresh."
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Single fixed row acting as the global settings singleton.
const SETTINGS_ID = "global-settings";

// GET is intentionally public (no auth) — the student-facing mock test
// needs to read sectionLocked/audioLocked before rendering ListeningScreen.
export async function GET() {
  try {
    let settings = await prisma.mockTestSettings.findUnique({
      where: { id: SETTINGS_ID },
    });

    if (!settings) {
      settings = await prisma.mockTestSettings.create({
        data: { id: SETTINGS_ID },
      });
    }

    return NextResponse.json(settings);
  } catch (err) {
    console.error("GET /api/mock-test-settings error:", err);
    return NextResponse.json(
      { error: "Failed to load mock test settings." },
      { status: 500 },
    );
  }
}

// PUT is admin/teacher only.
export async function PUT(req) {
  try {
    const session = await auth();
    const role = session?.user?.role;

    if (!session?.user || !["admin", "teacher"].includes(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const data = {};
    for (const key of [
      "sectionLocked",
      "audioLocked",
      "autoPlayAudio",
      "autoAdvanceSection",
      "noPauseRewind",
      "previewTimeEnabled",
    ]) {
      if (typeof body[key] === "boolean") {
        data[key] = body[key];
      }
    }
    if (typeof body.previewSeconds === "number") {
      data.previewSeconds = Math.max(5, Math.min(120, body.previewSeconds));
    }
    for (const key of [
      "audioSection1",
      "audioSection2",
      "audioSection3",
      "audioSection4",
    ]) {
      if (typeof body[key] === "string") {
        data[key] = body[key] || null;
      }
    }

    const settings = await prisma.mockTestSettings.upsert({
      where: { id: SETTINGS_ID },
      update: data,
      create: {
        id: SETTINGS_ID,
        sectionLocked: body.sectionLocked ?? false,
        audioLocked: body.audioLocked ?? false,
        autoPlayAudio: body.autoPlayAudio ?? false,
        autoAdvanceSection: body.autoAdvanceSection ?? false,
        noPauseRewind: body.noPauseRewind ?? false,
        previewTimeEnabled: body.previewTimeEnabled ?? false,
        previewSeconds: body.previewSeconds ?? 30,
        audioSection1: body.audioSection1 || null,
        audioSection2: body.audioSection2 || null,
        audioSection3: body.audioSection3 || null,
        audioSection4: body.audioSection4 || null,
      },
    });

    return NextResponse.json(settings);
  } catch (err) {
    console.error("PUT /api/mock-test-settings error:", err);
    return NextResponse.json(
      { error: "Failed to update mock test settings." },
      { status: 500 },
    );
  }
}
