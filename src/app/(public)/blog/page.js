"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Fetch categories + recent posts once on mount
  useEffect(() => {
    async function fetchMeta() {
      const res = await fetch("/api/blog/categories");
      const data = await res.json();
      setCategories(data.categories || []);
      setTotalPosts(data.total || 0);

      // Recent posts: fetch latest 5 published
      const recentRes = await fetch("/api/blog?published=true");
      const allPosts = await recentRes.json();
      setRecentPosts(allPosts.slice(0, 5));
    }
    fetchMeta();
  }, []);

  // Fetch filtered posts whenever category or search changes
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ published: "true" });
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (search) params.set("search", search);

    const res = await fetch(`/api/blog?${params.toString()}`);
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }, [selectedCategory, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setSearchInput("");
    setSearch("");
  };

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
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/80 bg-white/15 border border-white/20 px-5 py-2 rounded-full mb-5">
            Our Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            IELTS Tips & Insights
          </h1>
          <p className="text-blue-100 text-base md:text-lg leading-relaxed mt-3">
            Expert advice, study strategies, and success stories to help you
            achieve your target band score.
          </p>
        </div>
      </div>

      {/* Main layout: posts + sidebar */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Posts grid */}
          <div className="flex-2 min-w-0">
            {/* Active filter label */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-500">
                {loading ? (
                  "Loading..."
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-semibold text-slate-700">
                      {posts.length}
                    </span>{" "}
                    {posts.length === 1 ? "post" : "posts"}
                    {selectedCategory !== "All" && (
                      <>
                        {" "}
                        in{" "}
                        <span className="font-semibold text-blue-600">
                          {selectedCategory}
                        </span>
                      </>
                    )}
                    {search && (
                      <>
                        {" "}
                        for{" "}
                        <span className="font-semibold text-blue-600">
                          "{search}"
                        </span>
                      </>
                    )}
                  </>
                )}
              </p>
              {(selectedCategory !== "All" || search) && (
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchInput("");
                    setSearch("");
                  }}
                  className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  <i className="ti ti-x" /> Clear filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-slate-200" />
                    <div className="p-5 flex flex-col gap-3">
                      <div className="h-4 bg-slate-200 rounded w-1/3" />
                      <div className="h-5 bg-slate-200 rounded w-4/5" />
                      <div className="h-4 bg-slate-200 rounded w-full" />
                      <div className="h-4 bg-slate-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
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
                          <i className="ti ti-user text-blue-400" />{" "}
                          {post.author}
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
                <p className="font-bold text-slate-600 mb-1">No posts found</p>
                <p className="text-sm text-slate-400">
                  Try a different category or search term.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col flex-1 gap-6 lg:px-10 mt-11">
            {/* Search */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <i className="ti ti-search text-blue-500" /> Search
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput("");
                      setSearch("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <i className="ti ti-x text-sm" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <i className="ti ti-tag text-blue-500" /> Categories
              </h3>
              <ul className="flex flex-col gap-1">
                <li>
                  <button
                    onClick={() => handleCategoryClick("All")}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      selectedCategory === "All"
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>All Posts</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        selectedCategory === "All"
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {totalPosts}
                    </span>
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.name}>
                    <button
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedCategory === cat.name
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          selectedCategory === cat.name
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <i className="ti ti-clock text-blue-500" /> Recent Posts
              </h3>
              <ul className="flex flex-col gap-3">
                {recentPosts.length > 0 ? (
                  recentPosts.map((post) => (
                    <li key={post.id}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex gap-3 group"
                      >
                        {post.image ? (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <i className="ti ti-news text-blue-300 text-xl" />
                          </div>
                        )}
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                            {post.title}
                          </p>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <i className="ti ti-clock text-blue-300" />{" "}
                            {post.readTime}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No recent posts.</p>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
