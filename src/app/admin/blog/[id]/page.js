import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import BlogForm from "../BlogForm";

export default async function EditBlogPage({ params }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <a
          href="/admin/blog"
          className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
        >
          <i className="ti ti-arrow-left text-base" />
        </a>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Edit Post</h1>
          <p className="text-slate-400 text-sm mt-0.5">{post.title}</p>
        </div>
      </div>
      <BlogForm post={post} />
    </div>
  );
}
