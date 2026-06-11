"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  {
    label: "Courses",
    dropdown: [
      {
        label: "Batch Schedule",
        desc: "",
        href: "/courses/batch",
      },
      {
        label: "Course Fees",
        desc: "",
        href: "/courses/Course",
      },
      {
        label: "IELTS",
        desc: "",
        href: "/courses/ielts",
      },
      {
        label: "Spoken English",
        desc: "",
        href: "/courses/spokenEnglish",
      },
      {
        label: "Advance Writing",
        desc: "",
        href: "/courses/writing",
      },
      {
        label: "Grammar & Writing",
        desc: "",
        href: "/courses/grammar",
      },
    ],
  },
  {
    label: "Instructor",
    dropdown: [
      {
        label: "Success Stories",
        desc: "",
        href: "/resources/materials",
      },
      {
        label: "Guides",
        desc: "",
        href: "/resources/videos",
      },
      {
        label: "FAQ",
        desc: "",
        href: "/resources/videos",
      },
      {
        label: "Mock Test",
        desc: "",
        href: "/resources/videos",
      },
      {
        label: "IELTS Calculator",
        desc: "",
        href: "/resources/videos",
      },
      {
        label: "IELTS Result",
        desc: "",
        href: "/resources/videos",
      },
    ],
  },
  { label: "About Us", href: "/about" },
  { label: "Events", href: "/Event" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileSub, setOpenMobileSub] = useState(null);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const toggleMobileSub = (label) => {
    setOpenMobileSub(openMobileSub === label ? null : label);
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-900">
          <Image
            src="/images/IELTS7.jpeg"
            alt="logo"
            width={110}
            height={0}
            style={{ width: "110px", height: "auto" }}
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
                <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                  {item.label}
                  <svg
                    className={`h-4 w-4 transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
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
                  <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                    {item.dropdown.map((drop, i) => (
                      <div key={drop.label}>
                        {i === item.dropdown.length - 1 && i > 0 && (
                          <div className="my-1 border-t border-gray-100" />
                        )}
                        <Link
                          href={drop.href}
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                            <span className="text-xs text-blue-600 font-bold">
                              {drop.label[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
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
                className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-3">
          <button className="hidden rounded-lg sky-blue-cus px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 md:block">
            Get Started
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg border border-gray-200 p-2 text-gray-600 md:hidden"
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
                  className="flex w-full items-center justify-between border-b border-gray-100 py-3 text-sm text-gray-600"
                >
                  {item.label}
                  <svg
                    className={`h-4 w-4 transition-transform ${openMobileSub === item.label ? "rotate-180" : ""}`}
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
                        className="block py-2 text-sm text-gray-500 hover:text-gray-900"
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
                className="block border-b border-gray-100 py-3 text-sm text-gray-600"
              >
                {item.label}
              </Link>
            ),
          )}
          <button className="mt-4 w-full rounded-lg sky-blue-cus py-2.5 text-sm font-medium text-white">
            Get Started
          </button>
        </div>
      )}
    </header>
  );
}
