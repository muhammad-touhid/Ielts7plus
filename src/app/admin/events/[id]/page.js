import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EventForm from "../EventForm";

export default async function EditEventPage({ params }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <a
          href="/admin/events"
          className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
        >
          <i className="ti ti-arrow-left text-base" />
        </a>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Edit Event</h1>
          <p className="text-slate-400 text-sm mt-0.5">{event.title}</p>
        </div>
      </div>
      <EventForm event={event} />
    </div>
  );
}
