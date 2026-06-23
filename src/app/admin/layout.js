"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  {
    label: "Dashboard",
    icon: "ti ti-layout-dashboard",
    href: "/admin",
    exact: true,
  },
  {
    label: "Courses",
    icon: "ti ti-books",
    href: "/admin/courses",
  },
  {
    label: "Batches",
    icon: "ti ti-calendar-event",
    href: "/admin/batches",
  },
  {
    label: "Mock Tests",
    icon: "ti ti-clipboard-text",
    href: "/admin/mock-tests",
  },
  {
    label: "Mock Test Questions",
    icon: "ti ti-help-circle",
    href: "/admin/mock-test-questions",
  },
  {
    label: "Enrollments",
    icon: "ti ti-users",
    href: "/admin/enrollments",
  },
  {
    label: "Reviews",
    icon: "ti ti-star",
    href: "/admin/reviews",
  },
  {
    label: "Events",
    icon: "ti ti-calendar",
    href: "/admin/events",
  },
  {
    label: "Blog Posts",
    icon: "ti ti-news",
    href: "/admin/blog",
  },
  {
    label: "Contact Submissions",
    icon: "ti ti-mail",
    href: "/admin/contacts",
  },
];

function NavItem({ item, onClick }) {
  const pathname = usePathname();
  const isActive = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
        ${
          isActive
            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        }`}
    >
      <i className={`${item.icon} text-lg flex-shrink-0`} />
      {item.label}
    </Link>
  );
}

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100 fixed top-0 left-0 h-full z-30">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-100">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="ti ti-certificate text-white text-lg" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-800 leading-none">
                IELTS7+
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-slate-100 flex flex-col gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all duration-200"
          >
            <i className="ti ti-external-link text-lg" />
            View Website
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-all duration-200 w-full text-left"
          >
            <i className="ti ti-logout text-lg" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-100 z-50 flex flex-col transition-transform duration-300 lg:hidden
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="ti ti-certificate text-white text-lg" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-800 leading-none">
                IELTS7+
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Admin Panel</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
          >
            <i className="ti ti-x text-base" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              onClick={() => setSidebarOpen(false)}
            />
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-100 flex flex-col gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 transition-all duration-200"
          >
            <i className="ti ti-external-link text-lg" />
            View Website
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-all duration-200 w-full text-left"
          >
            <i className="ti ti-logout text-lg" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all"
            >
              <i className="ti ti-menu-2 text-lg" />
            </button>
            <div>
              <h1 className="text-sm font-extrabold text-slate-800">
                Admin Panel
              </h1>
              <p className="text-xs text-slate-400">
                IELTS7+ Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <i className="ti ti-external-link text-sm" />
              View Site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="flex items-center gap-2 bg-rose-50 text-rose-500 text-xs font-bold px-4 py-2 rounded-xl hover:bg-rose-100 transition-all duration-200"
            >
              <i className="ti ti-logout text-sm" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
