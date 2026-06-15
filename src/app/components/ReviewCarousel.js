"use client";

import { useEffect, useRef, useState } from "react";

const reviews = [
  {
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Nusrat Jahan",
    designation: "Undergraduate Student, BUET",
    rating: 5,
    review:
      "IELTS7+ completely changed how I approached the exam. The structured lessons and weekly mock tests helped me jump from Band 6 to Band 7.5 in just two months. Highly recommended!",
  },
  {
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Rafiul Hasan",
    designation: "Software Engineer, Dhaka",
    rating: 5,
    review:
      "I had struggled with Writing Task 2 for a long time. The instructor feedback here was incredibly detailed and actionable. I finally scored Band 7 in Writing — something I never thought possible.",
  },
  {
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Tania Akter",
    designation: "Medical Graduate, DMCH",
    rating: 5,
    review:
      "The Speaking module coaching was outstanding. My coach gave me real strategies for Part 2 and Part 3 that I could use immediately. Got Band 7.5 in Speaking on my first try!",
  },
  {
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "Imtiaz Ahmed",
    designation: "MBA Candidate, IBA",
    rating: 4,
    review:
      "Great course material and very knowledgeable instructors. The listening practice sessions were especially helpful. I achieved my target score of Band 7 within six weeks.",
  },
  {
    image: "https://randomuser.me/api/portraits/women/21.jpg",
    name: "Sabrina Sultana",
    designation: "HR Professional, Unilever BD",
    rating: 5,
    review:
      "I was preparing for Canada PR and needed Band 7 overall. IELTS7+ helped me plan my study schedule, focus on my weak areas, and walk into the exam with full confidence. Result: Band 7.5!",
  },
  {
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    name: "Farhan Kibria",
    designation: "Civil Engineer, Chittagong",
    rating: 4,
    review:
      "The practice tests are very close to the real exam format. I liked how every test came with detailed answer explanations. Solid platform for serious IELTS preparation.",
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <i
          key={s}
          className={`ti ${s <= rating ? "ti-star-filled text-amber-400" : "ti-star text-slate-300"} text-sm`}
        />
      ))}
    </div>
  );
}

export default function ReviewCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const total = reviews.length;
  const visible = 3;
  const maxIndex = total - visible;
  const intervalRef = useRef(null);

  const goTo = (index) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 300);
  };

  const prev = () => goTo(current === 0 ? maxIndex : current - 1);
  const next = () => goTo(current === maxIndex ? 0 : current + 1);

  // Auto-play
  useEffect(() => {
    intervalRef.current = setInterval(next, 4500);
    return () => clearInterval(intervalRef.current);
  }, [current]);

  const visibleCards = reviews.slice(current, current + visible);

  return (
    <section className="py-24 px-5 bg-slate-50 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-600 bg-sky-100 px-5 py-2 rounded-full mb-4">
              Student Stories
            </span>
            <h2 className="text-3xl font-bold text-gray-700">
              Real Results,{" "}
              <span className="relative inline-block text-blue-600">
                Real Students
                <span className="absolute bottom-1 left-0 w-full h-2 bg-sky-200 rounded-full -z-10" />
              </span>
            </h2>
            <p className="mt-4 text-slate-500 text-base leading-relaxed max-w-lg">
              Thousands of students have achieved their target band score with
              IELTS7+. Here's what some of them have to say about their journey.
            </p>
          </div>

          {/* Nav arrows */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-500
                hover:border-blue-600 hover:text-blue-600 hover:bg-sky-50 transition-all duration-200"
            >
              <i className="ti ti-chevron-left text-lg" />
            </button>
            <button
              onClick={next}
              className="w-11 h-11 rounded-full bg-blue-600 border-2 border-blue-600 flex items-center justify-center text-white
                hover:bg-blue-700 hover:border-blue-700 transition-all duration-200"
            >
              <i className="ti ti-chevron-right text-lg" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-300 ${
            animating ? "opacity-0" : "opacity-100"
          }`}
        >
          {visibleCards.map((review, i) => (
            <div
              key={`${current}-${i}`}
              className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Quote icon */}
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center mb-5">
                <i className="ti ti-quote text-blue-600 text-base" />
              </div>

              {/* Review text */}
              <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-6">
                "{review.review}"
              </p>

              {/* Divider */}
              <div className="w-full h-px bg-slate-100 mb-5" />

              {/* Bottom: avatar + info + rating */}
              <div className="flex items-center gap-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-sky-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {review.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {review.designation}
                  </p>
                </div>
                <div className="text-black">
                  <span className="text-yellow-500">★</span> {review.rating}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2.5 bg-blue-600"
                  : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
