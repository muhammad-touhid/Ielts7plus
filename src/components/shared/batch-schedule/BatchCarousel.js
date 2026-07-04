import prisma from "@/lib/prisma";
import BatchCarouselClient from "./BatchCarouselClient";

export default async function BatchCarousel() {
  const batches = await prisma.batch.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { course: { select: { name: true, slug: true } } },
  });

  if (batches.length === 0) return null;

  return <BatchCarouselClient batches={batches} />;
}
