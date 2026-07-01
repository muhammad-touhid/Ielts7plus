import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ContactForm from "@/components/shared/ContactForm";

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  });
  if (!post) notFound();

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

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/80 bg-white/15 border border-white/20 px-5 py-2 rounded-full mb-5">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 flex-wrap mt-2">
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

      {/* 2:1 layout */}
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left — blog content (2 parts) */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors self-start"
            >
              <i className="ti ti-arrow-left text-base" />
              Back to Blog
            </Link>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Cover image — fixed 16:9 */}
              {post.image && (
                <div className="w-full aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-7 flex flex-col gap-5">
                {/* Meta row below image */}
                <div className="flex items-center flex-wrap gap-4 pb-5 border-b border-slate-100">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <i className="ti ti-user text-blue-400" /> {post.author}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <i className="ti ti-clock text-blue-400" /> {post.readTime}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <i className="ti ti-calendar text-blue-400" />
                    {new Date(post.createdAt).toLocaleDateString("en-BD", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="ml-auto inline-block text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div
                  className="prose prose-slate max-w-none text-sm leading-relaxed overflow-hidden break-words"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </div>
          </div>

          {/* Right — contact form (1 part) */}
          <div className="w-full lg:w-1/3 sticky top-24 mt-11">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
              <div className="mb-6">
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-4 py-1.5 rounded-full mb-3">
                  Get In Touch
                </span>
                <h3 className="text-lg font-extrabold text-slate-800">
                  Have a Question?
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  We'll get back to you within 24 hours.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
