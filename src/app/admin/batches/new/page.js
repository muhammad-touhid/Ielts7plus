import Link from "next/link";
import prisma from "@/lib/prisma";
import BatchForm from "../BatchForm";

export default async function NewBatchPage() {
  const courses = await prisma.course.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/batches"
          className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
        >
          <i className="ti ti-arrow-left text-base" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Add New Batch
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Fill in the details to create a new batch.
          </p>
        </div>
      </div>

      <BatchForm courses={courses} />
    </div>
  );
}
