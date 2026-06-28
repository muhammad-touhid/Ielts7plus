import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] overflow-hidden py-24 px-5">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/80 bg-white/15 border border-white/20 px-5 py-2 rounded-full mb-5">
              Our Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              IELTS Tips & Insights
            </h1>
            <p className="text-blue-100 text-base md:text-lg leading-relaxed">
              Expert advice, study strategies, and success stories to help you
              achieve your target band score.
            </p>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group"
              >
                {post.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col gap-3">
                  <span className="inline-block text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full self-start">
                    {post.category}
                  </span>
                  <h2 className="font-extrabold text-slate-800 text-lg leading-snug group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <i className="ti ti-user text-blue-400" /> {post.author}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <i className="ti ti-clock text-blue-400" />{" "}
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl text-slate-300 mx-auto mb-4">
              <i className="ti ti-news" />
            </div>
            <p className="font-bold text-slate-600 mb-1">No posts yet</p>
            <p className="text-sm text-slate-400">
              Check back soon for new articles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
