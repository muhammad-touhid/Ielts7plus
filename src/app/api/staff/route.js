import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";

async function checkAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const staff = await prisma.admin.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        bio: true,
        publicTitle: true,
        linkedinUrl: true,
        facebookUrl: true,
        showOnWebsite: true,
        createdAt: true,
      },
    });
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }

    const validRoles = ["admin", "teacher", "moderator"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "A staff member with this email already exists." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const staff = await prisma.admin.create({
      data: { name, email, password: hashedPassword, role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        bio: true,
        publicTitle: true,
        linkedinUrl: true,
        facebookUrl: true,
        showOnWebsite: true,
        createdAt: true,
      },
    });

    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
