"use client";

import { useState } from "react";

const posts = [
  {
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80",
    category: "IELTS Tips",
    title: "10 Proven Strategies to Boost Your IELTS Reading Score",
    excerpt:
      "Struggling with the Reading module? These 10 time-tested techniques will help you tackle every passage type with speed and accuracy.",
    author: "Md. Rafiqul Islam",
    date: "June 5, 2025",
    readTime: "6 min read",
    popular: true,
  },
  {
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
    category: "Writing",
    title: "How to Write a Band 8 IELTS Task 2 Essay Step by Step",
    excerpt:
      "A complete breakdown of how to plan, structure, and write a high-scoring Task 2 essay — with a real example and examiner comments.",
    author: "Nadia Rahman",
    date: "June 10, 2025",
    readTime: "8 min read",
    popular: true,
  },
  {
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    category: "Speaking",
    title: "IELTS Speaking Part 2: How to Never Run Out of Things to Say",
    excerpt:
      "Cue card responses are easier than they look. Learn a simple framework that helps you speak fluently for the full two minutes every time.",
    author: "Tanvir Ahmed",
    date: "June 15, 2025",
    readTime: "5 min read",
    popular: false,
  },
  {
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80",
    category: "Listening",
    title: "Top 5 IELTS Listening Mistakes Students Make (And How to Fix Them)",
    excerpt:
      "Most listening errors come from a handful of predictable habits. Find out what they are and how to correct them before your exam.",
    author: "Md. Rafiqul Islam",
    date: "June 20, 2025",
    readTime: "5 min read",
    popular: true,
  },
  {
    image:
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&q=80",
    category: "Study Abroad",
    title: "IELTS Score Requirements for Top Universities in the UK and Canada",
    excerpt:
      "Planning to study abroad? Here is a comprehensive guide to the minimum IELTS band scores required by leading universities in 2025.",
    author: "Sabrina Hossain",
    date: "June 25, 2025",
    readTime: "7 min read",
    popular: false,
  },
  {
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=80",
    category: "Grammar",
    title: "The 7 Grammar Rules Every IELTS Candidate Must Know",
    excerpt:
      "Grammar mistakes can cost you precious band points across all four modules. Master these seven rules before you sit your exam.",
    author: "Nadia Rahman",
    date: "July 1, 2025",
    readTime: "6 min read",
    popular: false,
  },
  {
    image:
      "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&q=80",
    category: "IELTS Tips",
    title: "How to Prepare for IELTS in 30 Days: A Day-by-Day Study Plan",
    excerpt:
      "Short on time? This structured 30-day plan covers all four modules with daily tasks, mock tests, and revision sessions.",
    author: "Md. Rafiqul Islam",
    date: "July 5, 2025",
    readTime: "9 min read",
    popular: true,
  },
  {
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
    category: "Writing",
    title: "IELTS Task 1 Academic: Describing Graphs, Charts and Diagrams",
    excerpt:
      "Learn exactly how to open, organise, and conclude a Task 1 response — with sample sentences and vocabulary for every chart type.",
    author: "Nadia Rahman",
    date: "July 10, 2025",
    readTime: "7 min read",
    popular: false,
  },
];

const categories = [
  { label: "IELTS Tips", count: 3 },
  { label: "Writing", count: 2 },
  { label: "Speaking", count: 1 },
  { label: "Listening", count: 1 },
  { label: "Grammar", count: 1 },
  { label: "Study Abroad", count: 1 },
];

const popularPosts = posts.filter((p) => p.popular).slice(0, 4);

const ITEMS_PER_PAGE = 6;

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = posts.filter((p) => {
    const matchCategory =
      activeCategory === "All" || p.category === activeCategory;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] overflow-hidden py-24 px-5">
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
            IELTS Knowledge Hub
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            Blog & Resources
          </h1>
          <p className="text-blue-100 text-base md:text-lg leading-relaxed">
            Expert tips, study guides, and exam strategies written by our
            certified IELTS instructors to help you prepare smarter and score
            higher.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-5 py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Posts Grid */}
            {paginated.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {paginated.map((post, i) => (
                  <article
                    key={i}
                    className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        {post.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col gap-3 flex-1">
                      <h2 className="text-base font-extrabold text-slate-800 leading-snug hover:text-blue-600 transition-colors cursor-pointer">
                        {post.title}
                      </h2>
                      <p className="text-sm text-slate-500 leading-relaxed flex-1">
                        {post.excerpt}
                      </p>

                      <div className="w-full h-px bg-slate-100" />

                      {/* Meta */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <i className="ti ti-user text-blue-600 text-xs" />
                          </div>
                          <span className="text-xs text-slate-500 truncate">
                            {post.author}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <i className="ti ti-calendar text-slate-300" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <i className="ti ti-clock text-slate-300" />
                            {post.readTime}
                          </span>
                        </div>
                      </div>

                      <a
                        href="#"
                        className="mt-1 w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold py-3 rounded-xl
                          shadow-md shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200"
                      >
                        Read Article
                        <i className="ti ti-arrow-right text-sm" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl text-slate-300 mx-auto mb-4">
                  <i className="ti ti-article-off" />
                </div>
                <h3 className="text-base font-bold text-slate-700 mb-2">
                  No posts found
                </h3>
                <p className="text-sm text-slate-400">
                  Try a different keyword or category.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400
                    hover:border-blue-600 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <i className="ti ti-chevron-left text-base" />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full text-sm font-bold transition-all duration-200
                        ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                            : "border-2 border-slate-200 text-slate-500 hover:border-blue-600 hover:text-blue-600"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400
                    hover:border-blue-600 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <i className="ti ti-chevron-right text-base" />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex flex-col gap-6">
            {/* Search */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                <i className="ti ti-search text-blue-600" />
                Search Posts
              </h3>
              <div className="relative">
                <i className="ti ti-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-slate-50 text-slate-700 text-sm placeholder-slate-400 pl-10 pr-10 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                {search && (
                  <button
                    onClick={() => handleSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <i className="ti ti-x text-sm" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                <i className="ti ti-layout-grid text-blue-600" />
                Categories
              </h3>
              <ul className="flex flex-col gap-1">
                <li>
                  <button
                    onClick={() => handleCategory("All")}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                      ${
                        activeCategory === "All"
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                      }`}
                  >
                    <span>All Posts</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeCategory === "All" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
                    >
                      {posts.length}
                    </span>
                  </button>
                </li>
                {categories.map((cat, i) => (
                  <li key={i}>
                    <button
                      onClick={() => handleCategory(cat.label)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                        ${
                          activeCategory === cat.label
                            ? "bg-blue-600 text-white"
                            : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                        }`}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeCategory === cat.label ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Posts */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-sm font-extrabold text-slate-800 mb-5 flex items-center gap-2">
                <i className="ti ti-flame text-blue-600" />
                Popular Posts
              </h3>
              <ul className="flex flex-col gap-4">
                {popularPosts.map((post, i) => (
                  <li key={i}>
                    <a href="#" className="group flex gap-3 items-start">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                          {post.title}
                        </p>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <i className="ti ti-clock text-slate-300" />
                          {post.readTime}
                        </span>
                      </div>
                    </a>
                    {i < popularPosts.length - 1 && (
                      <div className="mt-4 h-px bg-slate-100" />
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sidebar CTA */}
            <div className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] rounded-2xl overflow-hidden p-6 text-center">
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4">
                  <i className="ti ti-rocket" />
                </div>
                <h4 className="text-sm font-extrabold text-white mb-2">
                  Ready to Start?
                </h4>
                <p className="text-xs text-blue-100 leading-relaxed mb-5">
                  Join thousands of students on their path to Band 7+.
                </p>
                <a
                  href="/courses"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-5 py-3 rounded-xl
                    shadow-lg shadow-blue-900/30 hover:bg-blue-700 transition-all duration-200 w-full justify-center"
                >
                  Explore Courses
                  <i className="ti ti-arrow-right text-xs" />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
