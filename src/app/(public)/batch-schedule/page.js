import prisma from "@/lib/prisma";
import BatchList from "./BatchList";

export default async function UpcomingBatches() {
  const batches = await prisma.batch.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: {
          enrollments: { where: { status: "confirmed" } },
        },
      },
    },
  });

  return <BatchList batches={batches} />;
}
