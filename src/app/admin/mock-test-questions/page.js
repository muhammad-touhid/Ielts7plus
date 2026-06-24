import prisma from "@/lib/prisma";
import AdminMockTestQuestionsClient from "./AdminMockTestQuestionsClient";

export default async function AdminMockTestQuestionsPage() {
  const questions = await prisma.mockTestQuestion.findMany({
    orderBy: [{ module: "asc" }, { order: "asc" }],
  });

  return <AdminMockTestQuestionsClient questions={questions} />;
}
