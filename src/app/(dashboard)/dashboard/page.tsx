"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState, { Icons } from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/courses").then((r) => r.json()).then((data) => {
      const userId = (session.user as any).id;
      const role = (session.user as any).role;
      if (role === "instructor") {
        setCourses(data.filter((c: any) => c.instructor._id === userId || c.instructor === userId));
      } else {
        setCourses(data.filter((c: any) => c.enrolledStudents?.includes(userId)));
      }
    });
  }, [session]);

  if (status === "loading") {
    return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  }

  const role = (session?.user as any)?.role;
  const totalStudents = role === "instructor"
    ? courses.reduce((sum, c) => sum + (c.enrolledStudents?.length ?? 0), 0)
    : 0;

  return (
    <div>
      <PageHeader
        title={`Welcome, ${session?.user?.name}`}
        action={
          role === "instructor" ? (
            <Link href="/courses/new">
              <Button variant="primary" size="sm">+ New Course</Button>
            </Link>
          ) : undefined
        }
      />

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-indigo-600">{courses.length}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">
            {role === "instructor" ? "Courses Created" : "Enrolled Courses"}
          </p>
        </div>
        {role === "instructor" && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-2xl font-bold text-indigo-600">{totalStudents}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">Total Students</p>
          </div>
        )}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-2">
          <Badge variant="info">{role}</Badge>
          <p className="text-xs text-gray-500 capitalize">Your role</p>
        </div>
      </div>

      <h2 className="border-l-4 border-indigo-500 pl-3 text-lg font-semibold text-gray-800 mb-4">
        {role === "instructor" ? "Your Courses" : "Enrolled Courses"}
      </h2>

      {courses.length === 0 ? (
        <EmptyState
          icon={Icons.BookOpen}
          title={role === "instructor" ? "No courses yet" : "Not enrolled in any courses"}
          description={role === "instructor" ? "Create your first course to get started." : "Browse the catalog and enroll in a course."}
          action={
            role === "student" ? (
              <Link href="/courses">
                <Button variant="secondary" size="sm">Browse Courses</Button>
              </Link>
            ) : (
              <Link href="/courses/new">
                <Button variant="primary" size="sm">Create Course</Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Link
              key={course._id}
              href={role === "instructor" ? `/courses/${course._id}` : `/my-courses/${course._id}`}
              className="group bg-white rounded-xl border border-gray-200 p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
            >
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
              {role === "instructor" && (
                <div className="mt-3">
                  <Badge variant="neutral">{course.enrolledStudents?.length || 0} students</Badge>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
