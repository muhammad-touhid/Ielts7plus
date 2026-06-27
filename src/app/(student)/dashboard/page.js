import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user.role === "admin") redirect("/admin");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      enrollments: {
        orderBy: { createdAt: "desc" },
        include: {
          batch: { select: { name: true, startDate: true, time: true } },
        },
      },
    },
  });

  const mockResults = await prisma.mockTestSubmission.findMany({
    where: { email: session.user.email },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardClient
      user={user}
      enrollments={user?.enrollments || []}
      mockResults={mockResults}
    />
  );
}
