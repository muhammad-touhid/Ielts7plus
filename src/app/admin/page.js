import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  // Fetch stats
  const [
    totalCourses,
    totalBatches,
    totalReviews,
    totalEnrollments,
    totalMockTests,
    totalContacts,
    totalEvents,
    totalBlogPosts,
    recentEnrollments,
    recentMockTests,
    recentContacts,
  ] = await Promise.all([
    prisma.course.count(),
    prisma.batch.count(),
    prisma.review.count(),
    prisma.enrollment.count(),
    prisma.mockTestSubmission.count(),
    prisma.contactSubmission.count(),
    prisma.event.count(),
    prisma.blogPost.count(),
    prisma.enrollment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { batch: true },
    }),
    prisma.mockTestSubmission.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactSubmission.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const stats = [
    {
      label: "Total Courses",
      value: totalCourses,
      icon: "ti ti-books",
      href: "/admin/courses",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Batches",
      value: totalBatches,
      icon: "ti ti-calendar-event",
      href: "/admin/batches",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Enrollments",
      value: totalEnrollments,
      icon: "ti ti-users",
      href: "/admin/enrollments",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Mock Tests",
      value: totalMockTests,
      icon: "ti ti-clipboard-text",
      href: "/admin/mock-tests",
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Reviews",
      value: totalReviews,
      icon: "ti ti-star",
      href: "/admin/reviews",
      color: "bg-rose-50 text-rose-600",
    },
    {
      label: "Contact Messages",
      value: totalContacts,
      icon: "ti ti-mail",
      href: "/admin/contacts",
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Events",
      value: totalEvents,
      icon: "ti ti-calendar",
      href: "/admin/events",
      color: "bg-sky-50 text-sky-600",
    },
    {
      label: "Blog Posts",
      value: totalBlogPosts,
      icon: "ti ti-news",
      href: "/admin/blog",
      color: "bg-orange-50 text-orange-600",
    },
  ];

  const quickLinks = [
    { label: "Add New Course", href: "/admin/courses/new", icon: "ti ti-plus" },
    { label: "Add New Batch", href: "/admin/batches/new", icon: "ti ti-plus" },
    { label: "Add New Event", href: "/admin/events/new", icon: "ti ti-plus" },
    { label: "Add New Blog Post", href: "/admin/blog/new", icon: "ti ti-plus" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Welcome back, {session.user.name} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Here is what is happening with IELTS7+ today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-100 px-4 py-2 rounded-xl">
          <i className="ti ti-clock text-blue-500" />
          {new Date().toLocaleDateString("en-BD", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Link
            key={i}
            href={s.href}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${s.color}`}
            >
              <i className={s.icon} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-800">
                {s.value}
              </p>
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-sm font-extrabold text-slate-700 mb-4 flex items-center gap-2">
          <i className="ti ti-zap text-blue-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map((q, i) => (
            <Link
              key={i}
              href={q.href}
              className="flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-4 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200"
            >
              <i className={`${q.icon} text-sm`} />
              {q.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enrollments */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
              <i className="ti ti-users text-blue-600" />
              Recent Enrollments
            </h2>
            <Link
              href="/admin/enrollments"
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              View all
            </Link>
          </div>
          {recentEnrollments.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {recentEnrollments.map((e, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                    <i className="ti ti-user text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">
                      {e.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {e.batch?.name ?? "—"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${e.status === "confirmed" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}
                  >
                    {e.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">
              No enrollments yet.
            </p>
          )}
        </div>

        {/* Recent Mock Tests */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
              <i className="ti ti-clipboard-text text-blue-600" />
              Recent Mock Tests
            </h2>
            <Link
              href="/admin/mock-tests"
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              View all
            </Link>
          </div>
          {recentMockTests.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {recentMockTests.map((m, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                    <i className="ti ti-user text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">
                      {m.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{m.email}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${m.resultSent ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
                  >
                    {m.resultSent ? "Sent" : "Pending"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">
              No mock test submissions yet.
            </p>
          )}
        </div>

        {/* Recent Contact Messages */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-extrabold text-slate-700 flex items-center gap-2">
              <i className="ti ti-mail text-blue-600" />
              Recent Messages
            </h2>
            <Link
              href="/admin/contacts"
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              View all
            </Link>
          </div>
          {recentContacts.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {recentContacts.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-violet-600 flex-shrink-0 mt-0.5">
                    <i className="ti ti-mail text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">
                      {c.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {c.subject}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">
              No messages yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
