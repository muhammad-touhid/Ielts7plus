import BlogForm from "../BlogForm";

export default function NewBlogPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Add New Post</h1>
        <p className="text-slate-400 text-sm mt-1">
          Write and publish a new blog post.
        </p>
      </div>
      <BlogForm />
    </div>
  );
}
