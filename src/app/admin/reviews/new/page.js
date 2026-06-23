import Link from "next/link";
import ReviewForm from "../ReviewForm";

export default function NewReviewPage() {
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
            Add New Review
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Add a student testimonial.
          </p>
        </div>
      </div>
      <ReviewForm />
    </div>
  );
}
