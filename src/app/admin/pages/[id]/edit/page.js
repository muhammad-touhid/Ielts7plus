// src/app/admin/pages/[id]/edit/page.js
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PuckEditorClient from "./PuckEditorClient";

export const dynamic = "force-dynamic";

export default async function EditPage({ params }) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  return <PuckEditorClient page={page} />;
}
