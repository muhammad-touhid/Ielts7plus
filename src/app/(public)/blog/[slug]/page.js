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
      {post.image ? (
        <div className="h-64 sm:h-80 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-r from-[#354e98] to-[#4a71df]" />
      )}

      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors self-start"
        >
          <i className="ti ti-arrow-left text-base" />
          Back to Blog
        </Link>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-5">
          <span className="inline-block text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full self-start">
            {post.category}
          </span>

          <h1 className="text-2xl font-extrabold text-slate-800 leading-snug">
            {post.title}
          </h1>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <i className="ti ti-user text-blue-400" /> {post.author}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <i className="ti ti-clock text-blue-400" /> {post.readTime}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <i className="ti ti-calendar text-blue-400" />
              {new Date(post.createdAt).toLocaleDateString("en-BD", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="w-full h-px bg-slate-100" />

          {/* Render HTML content from Quill */}
          <div
            className="prose prose-slate max-w-none text-sm leading-relaxed overflow-hidden break-words"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </div>
  );
}
