// src/lib/pageBuilder/carousel/CarouselShell.jsx
"use client";

import { useState, useRef, useEffect } from "react";

const VISIBLE_CLASSES = {
  1: "w-full",
  2: "w-full md:w-[calc((100%-24px)/2)]",
  3: "w-full md:w-[calc((100%-48px)/3)]",
  4: "w-full md:w-[calc((100%-72px)/4)]",
};

export default function CarouselShell({
  items,
  renderCard,
  getKey,
  visible = 3,
  eyebrow,
  heading,
  subheading,
  seeAllHref,
  seeAllText,
  autoSlide = false,
  autoSlideSpeed = 4,
  pauseOnHover = true,
  scrollMode = false,
  activeSlide,
}) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(autoSlide);
  const [hovering, setHovering] = useState(false);
  const trackRef = useRef(null);
  const total = items.length;
  const pages = Math.max(1, total - visible + 1);
  const hasHeaderText = eyebrow || heading || subheading || seeAllHref;

  const goTo = (index) => {
    const clamped = ((index % pages) + pages) % pages;
    setCurrent(clamped);
    if (!trackRef.current) return;
    if (scrollMode) {
      const child = trackRef.current.children[clamped];
      child?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    } else if (trackRef.current.children[0]) {
      const cardWidth = trackRef.current.children[0].offsetWidth + 24;
      trackRef.current.style.transform = `translateX(-${clamped * cardWidth}px)`;
    }
  };

  useEffect(() => {
    if (!playing || pages <= 1) return;
    if (pauseOnHover && hovering) return;
    const id = setInterval(
      () => goTo(current + 1),
      Math.max(1, autoSlideSpeed) * 1000,
    );
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, hovering, current, pages, autoSlideSpeed, pauseOnHover]);

  // Wheel scroll needs a direct DOM listener (not React's onWheel prop)
  // since React's onWheel is passive by default — preventDefault() inside
  // it is silently ignored, so converting vertical wheel motion into
  // horizontal scroll only works when attached this way.
  useEffect(() => {
    if (!scrollMode || !trackRef.current) return;
    const el = trackRef.current;
    function onWheel(e) {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [scrollMode]);

  // Driven by the "Active Slide" field in Puck's sidebar (outside the
  // canvas overlay, so it's reliably clickable in the editor even when
  // on-canvas arrow clicks get intercepted by Puck's selection layer).
  useEffect(() => {
    if (activeSlide === undefined) return;
    goTo(activeSlide);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlide]);

  if (total === 0) {
    return (
      <div className="text-center py-10 text-sm text-slate-400">
        Nothing to show yet.
      </div>
    );
  }

  const widthClass = VISIBLE_CLASSES[visible] || VISIBLE_CLASSES[3];

  const controls = (
    <div className="flex items-center gap-2 flex-shrink-0">
      {autoSlide && (
        <button
          onClick={() => setPlaying((p) => !p)}
          className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all"
          style={{
            borderColor: "var(--carousel-controller-color, #2563eb)",
            color: "var(--carousel-controller-color, #2563eb)",
          }}
          title={playing ? "Pause auto-slide" : "Play auto-slide"}
        >
          <i
            className={`ti ${playing ? "ti-player-pause" : "ti-player-play"} text-base`}
          />
        </button>
      )}
      <div className="flex gap-2">
        <button
          onClick={() => goTo(current - 1)}
          className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all"
          style={{
            borderColor: "var(--carousel-controller-color, #2563eb)",
            color: "var(--carousel-controller-color, #2563eb)",
          }}
        >
          <i className="ti ti-chevron-left text-base" />
        </button>
        <button
          onClick={() => goTo(current + 1)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all"
          style={{ background: "var(--carousel-controller-color, #2563eb)" }}
        >
          <i className="ti ti-chevron-right text-base" />
        </button>
      </div>
      {seeAllHref && (
        <a
          href={seeAllHref}
          className="hidden sm:inline-flex items-center gap-2 font-bold border-2 px-5 py-2 rounded-xl transition-all"
          style={{
            color: "var(--carousel-seeall-color, #2563eb)",
            borderColor: "var(--carousel-seeall-color, #2563eb)",
            fontSize: "var(--carousel-seeall-size, 0.875rem)",
          }}
        >
          {seeAllText || "See All"}
          <i className="ti ti-arrow-right text-sm" />
        </a>
      )}
    </div>
  );

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {hasHeaderText ? (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="min-w-0">
            {eyebrow && (
              <span
                className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-3"
                style={{
                  background: "var(--carousel-eyebrow-bg, #e0f2fe)",
                  color: "var(--carousel-eyebrow-color, #2563eb)",
                  fontSize: "var(--carousel-eyebrow-size, 0.75rem)",
                }}
              >
                {eyebrow}
              </span>
            )}
            {heading && (
              <h2
                className="font-bold"
                style={{
                  color: "var(--carousel-heading-color, #1e293b)",
                  fontSize: "var(--carousel-heading-size, 1.875rem)",
                }}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p
                className="mt-2 max-w-md break-words"
                style={{
                  color: "var(--carousel-subheading-color, #64748b)",
                  fontSize: "var(--carousel-subheading-size, 0.875rem)",
                }}
              >
                {subheading}
              </p>
            )}
          </div>
          {controls}
        </div>
      ) : (
        <div className="flex justify-end mb-6">{controls}</div>
      )}

      {scrollMode ? (
        <>
          <style>{`
            .pb-carousel-noscrollbar {
              scrollbar-width: none; /* Firefox */
              -ms-overflow-style: none; /* old Edge/IE */
            }
            .pb-carousel-noscrollbar::-webkit-scrollbar {
              display: none; /* Chrome, Safari, new Edge */
            }
          `}</style>
          <div
            ref={trackRef}
            className="pb-carousel-noscrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
            onPointerDownCapture={(e) => e.stopPropagation()}
          >
            {items.map((item, i) => (
              <div
                key={getKey(item, i)}
                className={`${widthClass} shrink-0 snap-start`}
              >
                {renderCard(item)}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-6 transition-transform duration-300 ease-in-out"
          >
            {items.map((item, i) => (
              <div key={getKey(item, i)} className={`${widthClass} shrink-0`}>
                {renderCard(item)}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center gap-2">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={
              i === current
                ? {
                    width: "24px",
                    height: "8px",
                    background: "var(--carousel-controller-color, #2563eb)",
                  }
                : { width: "8px", height: "8px", background: "#cbd5e1" }
            }
          />
        ))}
      </div>
    </div>
  );
}
