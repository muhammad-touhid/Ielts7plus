"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const navItems = [
  {
    label: "Courses",
    dropdown: [
      { label: "All Courses", desc: "", href: "/courses" },
      { label: "Batch Schedule", desc: "", href: "/batch-schedule" },
      { label: "IELTS", desc: "", href: "/courses/ielts-preparation" },
      { label: "Spoken English", desc: "", href: "/courses/spoken-english" },
      { label: "Advance Writing", desc: "", href: "/courses/advanced-writing" },
      {
        label: "Grammar & Writing",
        desc: "",
        href: "/courses/grammar-writing",
      },
    ],
  },
  {
    label: "Instructor",
    dropdown: [
      {
        label: "Success Stories",
        desc: "",
        href: "/success-stories",
      },
      { label: "Guides", desc: "", href: "/guides" },
      { label: "FAQ", desc: "", href: "/faq" },
      { label: "Mock Test", desc: "", href: "/mock-test" },
      { label: "IELTS Calculator", desc: "", href: "/calculator" },
      { label: "IELTS Result", desc: "", href: "/result" },
    ],
  },
  { label: "About Us", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileSub, setOpenMobileSub] = useState(null);

  // ✅ Scroll listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileSub = (label) => {
    setOpenMobileSub(openMobileSub === label ? null : label);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white border-b border-gray-200"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 container items-center justify-between px-6">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/images/IELTS7.jpeg"
            alt="logo"
            width={80}
            height={0}
            style={{ width: "auto", height: "auto" }}
            className="rounded-xl"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) =>
            item.dropdown ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`flex items-center gap-1 rounded-lg px-3 py-2 text-m transition-colors ${
                    scrolled
                      ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.label}
                  <svg
                    className={`h-4 w-4 transition-transform ${
                      openDropdown === item.label ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {openDropdown === item.label && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                    {item.dropdown.map((drop, i) => (
                      <div key={drop.label}>
                        <Link
                          href={drop.href}
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
                        >
                          <div>
                            <p className="text-m font-medium text-gray-900">
                              {drop.label}
                            </p>
                            <p className="text-xs text-gray-500">{drop.desc}</p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-m transition-colors ${
                  scrolled
                    ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-3">
          <button className="hidden rounded-lg bg-blue-600 hover:bg-blue-700 cursor-pointer px-4 py-2 text-m font-medium text-white hover:bg-blue-700 md:block">
            Get Started
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`rounded-lg border p-2 md:hidden ${
              scrolled
                ? "border-gray-200 text-gray-600"
                : "border-white/30 text-white"
            }`}
          >
            {mobileOpen ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-6 pb-4 md:hidden">
          {navItems.map((item) =>
            item.dropdown ? (
              <div key={item.label}>
                <button
                  onClick={() => toggleMobileSub(item.label)}
                  className="flex w-full items-center justify-between border-b border-gray-100 py-3 text-m text-gray-600"
                >
                  {item.label}
                  <svg
                    className={`h-4 w-4 transition-transform ${
                      openMobileSub === item.label ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openMobileSub === item.label && (
                  <div className="pl-3 pb-2">
                    {item.dropdown.map((drop) => (
                      <Link
                        key={drop.label}
                        href={drop.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2 text-m text-gray-500 hover:text-gray-900"
                      >
                        {drop.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block border-b border-gray-100 py-3 text-m text-gray-600"
              >
                {item.label}
              </Link>
            ),
          )}
          <button className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 text-m font-medium text-white">
            Get Started
          </button>
        </div>
      )}
    </header>
  );
}
