import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import CourseForm from "../CourseForm";

export default async function EditCoursePage({ params }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });

  if (!course) notFound();

  // Convert JSON fields to plain objects for the form
  const courseData = {
    ...course,
    highlights: course.highlights,
    whatYouWillLearn: course.whatYouWillLearn,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/courses"
          className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
        >
          <i className="ti ti-arrow-left text-base" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Edit Course
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">{course.name}</p>
        </div>
      </div>

      <CourseForm course={courseData} />
    </div>
  );
}
