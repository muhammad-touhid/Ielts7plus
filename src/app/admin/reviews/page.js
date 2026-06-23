import prisma from "@/lib/prisma";
import Link from "next/link";
import DeleteReviewButton from "./DeleteReviewButton";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Reviews</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage student testimonials.
          </p>
        </div>
        <Link
          href="/admin/reviews/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
        >
          <i className="ti ti-plus text-base" />
          Add New Review
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4"
            >
              {/* Quote icon */}
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                <i className="ti ti-quote text-blue-600 text-base" />
              </div>

              {/* Review text */}
              <p className="text-sm text-slate-500 leading-relaxed flex-1 line-clamp-3">
                "{review.review}"
              </p>

              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <i
                    key={s}
                    className={`ti ${s <= review.rating ? "ti-star-filled text-amber-400" : "ti-star text-slate-200"} text-sm`}
                  />
                ))}
              </div>

              <div className="w-full h-px bg-slate-100" />

              {/* Author */}
              <div className="flex items-center gap-3">
                {review.image ? (
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-50 flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <i className="ti ti-user text-base" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {review.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {review.designation}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${review.published ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
                >
                  {review.published ? "Published" : "Draft"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/reviews/${review.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                >
                  <i className="ti ti-edit text-sm" />
                  Edit
                </Link>
                <DeleteReviewButton id={review.id} name={review.name} />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-16 bg-white rounded-2xl border border-slate-100">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-2xl text-slate-300 mx-auto mb-4">
              <i className="ti ti-star" />
            </div>
            <p className="text-sm font-bold text-slate-600 mb-1">
              No reviews yet
            </p>
            <p className="text-xs text-slate-400 mb-5">
              Add your first student testimonial.
            </p>
            <Link
              href="/admin/reviews/new"
              className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-5 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200"
            >
              <i className="ti ti-plus" />
              Add New Review
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
