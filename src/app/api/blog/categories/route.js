import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { category: true },
    });

    // Count posts per category
    const countMap = {};
    for (const post of posts) {
      const cat = post.category || "Uncategorized";
      countMap[cat] = (countMap[cat] || 0) + 1;
    }

    const categories = Object.entries(countMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const total = posts.length;

    return NextResponse.json({ categories, total });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
