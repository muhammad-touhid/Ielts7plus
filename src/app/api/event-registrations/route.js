import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { eventId, name, email, phone, message } = body;

    if (!eventId || !name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, phone, and event are required." },
        { status: 400 },
      );
    }

    const registration = await prisma.eventRegistration.create({
      data: { eventId, name, email, phone, message: message || null },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    const registrations = await prisma.eventRegistration.findMany({
      where: eventId ? { eventId } : undefined,
      include: { event: { select: { title: true, date: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(registrations);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
