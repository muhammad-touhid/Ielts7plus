import Link from "next/link";
import Image from "next/image";

const tags = [
  "Writing Task 2",
  "Speaking Band 7",
  "Listening Tips",
  "Reading Strategies",
  "Mock Tests",
];

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center">
      {/* Background Image */}
      <Image
        src="/images/hero-bg.jpg"
        alt="Hero background"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/80" />

      {/* Content */}
      <div className="relative z-10 mx-auto container  px-6">
        <div className="max-w-2xl">
          {/* Badge */}

          <div className="inline-block text-xs font-bold tracking-widest uppercase text-white/80 bg-white/15 border border-white/20 px-5 py-2 rounded-full mb-5">
            ★ #1 IELTS Preparation Platform
          </div>

          {/* Heading */}
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Get admitted into prestigious universities with a 7+ IELTS score
          </h1>

          {/* Paragraph */}
          <p className="mb-8 text-blue-100 text-base md:text-lg leading-relaxed">
            Receive expert tutoring for an excellent IELTS score through
            personalized mentorship.
          </p>

          {/* Search Field */}
          <div className="mb-5 flex max-w-lg items-center rounded-xl bg-white px-4 py-2">
            <svg
              className="mr-3 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search courses, topics, practice tests..."
              className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Search
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${tag}`}
                className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm text-white/85 hover:bg-white/20 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
