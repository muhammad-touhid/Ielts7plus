// src/lib/pageBuilder/widgets/EventDetail.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DropZone } from "@measured/puck";

// Same module-level caching pattern as CourseDetail — fetched once per
// editor session, not on every resolveFields call.
let cachedEventOptions = null;
let eventOptionsPromise = null;

async function getEventOptions() {
  if (cachedEventOptions) return cachedEventOptions;
  if (!eventOptionsPromise) {
    eventOptionsPromise = fetch("/api/public/events?limit=100")
      .then((r) => r.json())
      .then((json) => {
        const events = json.events || [];
        cachedEventOptions = events
          .filter((e) => e.slug)
          .map((e) => ({ label: e.title, value: e.slug }));
        return cachedEventOptions;
      })
      .catch(() => []);
  }
  return eventOptionsPromise;
}

const fields = {
  eventSlug: {
    type: "select",
    label: "Select Event",
    options: [{ label: "Loading events...", value: "" }],
  },
};

function EventDetailBody({ event }) {
  const details = [
    { icon: "ti ti-calendar", label: "Date", value: event.date },
    { icon: "ti ti-clock", label: "Time", value: event.time },
    { icon: "ti ti-map-pin", label: "Campus", value: event.campus },
  ];

  return (
    <div className="bg-slate-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-[#354e98] to-[#4a71df] overflow-hidden py-20 px-5">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-blue-200 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <i className="ti ti-chevron-right text-xs" />
            <Link href="/events" className="hover:text-white transition-colors">
              Events
            </Link>
            <i className="ti ti-chevron-right text-xs" />
            <span className="text-white font-medium">{event.title}</span>
          </div>

          {event.badge && (
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/80 bg-white/15 border border-white/20 px-5 py-2 rounded-full mb-5">
              {event.badge}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-7">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {details.map((d, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <i className={`${d.icon} text-white/70`} />
                <div className="text-left">
                  <p className="text-xs text-blue-100/70">{d.label}</p>
                  <p className="text-sm font-bold text-white">{d.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2:1 layout */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left — event details */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {event.image && (
              <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-5 border-b border-slate-100">
                {details.map((d, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <i className={`${d.icon} text-blue-500`} />
                    <div>
                      <p className="text-xs text-slate-400">{d.label}</p>
                      <p className="text-sm font-bold text-slate-700">
                        {d.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="text-slate-600 text-sm leading-relaxed prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: event.para }}
              />
            </div>
          </div>

          {/* Right — open drop zone for whatever Form widget you
              build for this event (registration form, RSVP, waitlist,
              etc). Not hardcoded — drop any Form widget instance here
              in the page builder, with whatever fields this specific
              event needs. */}
          <div className="w-full lg:w-1/3 sticky top-24">
            <DropZone zone="event-form" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const EventDetail = {
  label: "Event Detail Page",
  fields,
  defaultProps: {
    id: "eventdetail-default",
    eventSlug: "",
  },
  resolveFields: async (data) => {
    const options = await getEventOptions();
    fields.eventSlug.options =
      options.length > 0 ? options : [{ label: "No events found", value: "" }];
    return fields;
  },
  render: function EventDetailRender({ eventSlug }) {
    const [state, setState] = useState({ status: "idle", event: null });

    useEffect(() => {
      if (!eventSlug) {
        setState({ status: "empty", event: null });
        return;
      }
      let cancelled = false;
      setState((s) => ({ ...s, status: "loading" }));
      fetch(`/api/public/events/${eventSlug}`)
        .then((r) => r.json())
        .then((json) => {
          if (cancelled) return;
          if (!json.event) {
            setState({ status: "notfound", event: null });
          } else {
            setState({ status: "ready", event: json.event });
          }
        })
        .catch(() => {
          if (!cancelled) setState({ status: "error", event: null });
        });
      return () => {
        cancelled = true;
      };
    }, [eventSlug]);

    if (state.status === "empty") {
      return (
        <div className="text-center py-20 text-sm text-slate-400 bg-slate-50">
          Select an event above to preview its page.
        </div>
      );
    }
    if (state.status === "loading" || state.status === "idle") {
      return (
        <div className="text-center py-20 text-sm text-slate-400 bg-slate-50">
          Loading event...
        </div>
      );
    }
    if (state.status === "notfound") {
      return (
        <div className="text-center py-20 text-sm text-red-400 bg-slate-50">
          Event not found or unpublished.
        </div>
      );
    }
    if (state.status === "error") {
      return (
        <div className="text-center py-20 text-sm text-red-400 bg-slate-50">
          Couldn&apos;t load this event right now.
        </div>
      );
    }

    return <EventDetailBody event={state.event} />;
  },
};
