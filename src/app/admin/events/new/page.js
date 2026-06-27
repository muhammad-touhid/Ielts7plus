import EventForm from "../EventForm";

export default function NewEventPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">
          Add New Event
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Fill in the details below.
        </p>
      </div>
      <EventForm />
    </div>
  );
}
