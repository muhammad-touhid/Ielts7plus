import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  });
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero — same pattern as batch schedule */}
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

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/80 bg-white/15 border border-white/20 px-5 py-2 rounded-full mb-5">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-sm text-blue-200">
              <i className="ti ti-user" /> {post.author}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-blue-200">
              <i className="ti ti-clock" /> {post.readTime}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-blue-200">
              <i className="ti ti-calendar" />
              {new Date(post.createdAt).toLocaleDateString("en-BD", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors self-start"
        >
          <i className="ti ti-arrow-left text-base" />
          Back to Blog
        </Link>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Image inside content block */}
          {post.image && (
            <div className="h-64 sm:h-80 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-7 flex flex-col gap-5">
            <div className="w-full h-px bg-slate-100" />

            {/* Content */}
            <div
              className="prose prose-slate max-w-none text-sm leading-relaxed overflow-hidden break-words"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
