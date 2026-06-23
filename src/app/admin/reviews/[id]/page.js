import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReviewForm from "../ReviewForm";

export default async function EditReviewPage({ params }) {
  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/reviews"
          className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
        >
          <i className="ti ti-arrow-left text-base" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Edit Review
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">{review.name}</p>
        </div>
      </div>
      <ReviewForm review={review} />
    </div>
  );
}
