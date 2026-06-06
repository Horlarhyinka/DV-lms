"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState, { Icons } from "@/components/ui/EmptyState";

export default function CoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/courses").then((r) => r.json()).then(setCourses);
  }, []);

  async function enroll(courseId: string) {
    setEnrolling(courseId);
    await fetch("/api/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    const updated = await fetch("/api/courses").then((r) => r.json());
    setCourses(updated);
    setEnrolling(null);
  }

  const userId = (session?.user as any)?.id;
  const role = (session?.user as any)?.role;

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Course Catalog" subtitle="Browse all available courses" />

      <input
        type="search"
        placeholder="Search courses…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full sm:max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-6"
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Icons.AcademicCap}
          title={filter ? "No courses match your search" : "No courses available yet"}
          description={filter ? "Try a different search term." : "Courses will appear here once instructors create them."}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course) => {
            const enrolled = course.enrolledStudents?.includes(userId);
            const isOwner = course.instructor?._id === userId || course.instructor === userId;
            return (
              <div
                key={course._id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2 hover:ring-2 hover:ring-indigo-200 transition-all duration-150"
              >
                <h3 className="font-semibold text-gray-900 min-h-[2.5rem] line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-500 flex-1 line-clamp-2">{course.description}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gray-400" aria-hidden="true"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                  {course.instructor?.name ?? "Unknown Instructor"}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="neutral">{course.enrolledStudents?.length ?? 0} enrolled</Badge>
                  <div>
                    {isOwner ? (
                      <Link href={`/courses/${course._id}`}>
                        <Button variant="secondary" size="sm">
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true"><path fillRule="evenodd" d="M7.429 1.525a6.593 6.593 0 0 1 1.142 0c.237.026.425.211.445.448l.01.127a1.558 1.558 0 0 0 2.039 1.31l.123-.045c.222-.082.47-.023.634.153a6.703 6.703 0 0 1 .571.98c.098.21.044.458-.13.608l-.097.081a1.56 1.56 0 0 0 0 2.41l.097.08c.174.15.228.399.13.609a6.7 6.7 0 0 1-.572.979c-.163.176-.411.235-.633.153l-.123-.045a1.558 1.558 0 0 0-2.039 1.31l-.01.127a.513.513 0 0 1-.445.448 6.593 6.593 0 0 1-1.142 0 .513.513 0 0 1-.445-.448l-.01-.127a1.557 1.557 0 0 0-2.038-1.31l-.124.045c-.222.082-.47.023-.634-.153a6.7 6.7 0 0 1-.57-.98c-.099-.21-.044-.457.129-.607l.097-.081a1.56 1.56 0 0 0 0-2.41l-.097-.08c-.173-.15-.228-.399-.13-.609a6.703 6.703 0 0 1 .572-.979c.163-.176.412-.235.634-.153l.123.045a1.558 1.558 0 0 0 2.039-1.31l.01-.127a.513.513 0 0 1 .445-.448ZM8 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" clipRule="evenodd" /></svg>
                          Manage
                        </Button>
                      </Link>
                    ) : enrolled ? (
                      <Link href={`/my-courses/${course._id}`}>
                        <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true"><path d="M3 3.732a1.5 1.5 0 0 1 2.305-1.265l6.706 4.267a1.5 1.5 0 0 1 0 2.531l-6.706 4.268A1.5 1.5 0 0 1 3 12.267V3.732Z" /></svg>
                          Continue
                        </Button>
                      </Link>
                    ) : role === "student" ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => enroll(course._id)}
                        loading={enrolling === course._id}
                        loadingText="Enrolling…"
                      >
                        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true"><path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" /></svg>
                        Enroll
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
