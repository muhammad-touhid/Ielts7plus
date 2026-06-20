import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { label: "IELTS", href: "/courses/ielts-preparation" },
  { label: "IELTS Preparation", href: "/courses/ielts-preparation" },
  { label: "IELTS Score Calculator", href: "/courses" },
  { label: "Course Fees", href: "/course-fee" },
  { label: "Batch Schedule", href: "/batch-schedule" },
  { label: "Success Stories", href: "/success-stories" },
];

const resourceLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Events", href: "/events" },
  { label: "Podcast", href: "#" },
  { label: "FAQs", href: "/faq" },
  { label: "Community", href: "#" },
  { label: "Support", href: "/contact" },
];

const socialLinks = [
  { icon: "ti-brand-facebook", href: "https://www.facebook.com/ielts7plus" },
  { icon: "ti-brand-instagram", href: "https://www.instagram.com/ielts.7plus" },
  { icon: "ti-brand-youtube", href: "https://youtube.com" },
  { icon: "ti-brand-linkedin", href: "https://linkedin.com" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#111827" }} className="pt-20 font-sans">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Column 1 — Logo, Text, Social */}
          <div>
            <Link href="/">
              <Image
                src="/images/IELTS7.jpeg"
                alt="IELTS7+ Logo"
                width={110}
                height={0}
                style={{ width: "auto", height: "auto", marginBottom: "16px" }}
                className="rounded-xl"
              />
            </Link>
            <p className="mb-5 leading-relaxed text-gray-400 font-medium">
              Your trusted partner for achieving IELTS band 7 and above.
              Expert-led courses, real practice tests, and personalized
              feedback.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.icon}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 text-gray-400 hover:border-[#f87171] hover:text-[#f87171] transition-colors"
                >
                  <i className={`ti ${s.icon} text-base `} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="mb-4 text-xl font-medium text-white ">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-1.5 text-gray-300 hover:text-[#f87171] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Resources */}
          <div>
            <h3 className="mb-4 text-xl font-medium text-white">Resources</h3>
            <ul className="flex flex-col gap-2.5">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-1.5 text-gray-300 hover:text-[#f87171] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact + Newsletter */}
          <div>
            <h3 className="mb-4 text-xl font-medium text-white">Contact Us</h3>
            <div className="mb-3 flex items-center gap-3">
              <i
                className="ti ti-mail text-xl text-[#f87171]"
                aria-hidden="true"
              />
              <span className=" text-gray-300">
                <a href="mailto:info@ielts7plus.co.uk">info@ielts7plus.co.uk</a>
              </span>
            </div>
            <div className="mb-3 flex items-center gap-3">
              <i
                className="ti ti-phone text-xl text-[#f87171]"
                aria-hidden="true"
              />
              <span className=" text-gray-300">
                <a href="call:+8801711153678">+8801711153678</a>
              </span>
            </div>
            <div className="mb-6 flex items-center gap-3">
              <i
                className="ti ti-map-pin text-xl text-[#f87171]"
                aria-hidden="true"
              />
              <span className=" text-gray-300">Dhaka, Bangladesh</span>
            </div>

            {/* Newsletter */}
            <p className="mb-2 text-xs text-gray-500">
              Subscribe to our newsletter
            </p>
            <div className="flex overflow-hidden rounded-lg border border-gray-700">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 min-w-0 bg-gray-800 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500"
              />
              <button className="bg-[#ef4444] shrink-0 px-4 py-2 text-sm font-medium text-white hover:bg-[#f87171] transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-800 py-6 md:flex-row">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} IELTS7+. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
