"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState, { Icons } from "@/components/ui/EmptyState";

type Tab = "lessons" | "assignments" | "quizzes";

function dueDateColor(dateStr: string) {
  const due = new Date(dateStr);
  const now = new Date();
  const diffDays = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return "text-red-500";
  if (diffDays <= 3) return "text-amber-500";
  return "text-gray-400";
}

export default function InstructorCoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);

  const tab = (searchParams.get("tab") as Tab) ?? "lessons";

  function setTab(t: Tab) {
    router.replace(`?tab=${t}`);
  }

  async function load() {
    const res = await fetch(`/api/courses/${id}`);
    if (!res.ok) { router.push("/dashboard"); return; }
    setData(await res.json());
  }

  useEffect(() => { load(); }, [id]);

  if (!data) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-20" />
        ))}
      </div>
    );
  }

  const { course, lessons, assignments, quizzes } = data;
  const tabs: Tab[] = ["lessons", "assignments", "quizzes"];
  const counts: Record<Tab, number> = { lessons: lessons.length, assignments: assignments.length, quizzes: quizzes.length };

  return (
    <div>
      <PageHeader
        title={course.title}
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: course.title }]}
      />

      {/* Course info card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <p className="text-gray-600 text-sm">{course.description}</p>
        <div className="mt-3">
          <Badge variant="info">{course.enrolledStudents?.length || 0} students enrolled</Badge>
        </div>
      </div>

      {/* Underline tab bar */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium -mb-px border-b-2 transition-colors capitalize flex items-center gap-1.5 ${
              tab === t
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {t}
            <Badge variant="neutral">{counts[t]}</Badge>
          </button>
        ))}
      </div>

      {tab === "lessons" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">Lessons</h2>
            <Link href={`/courses/${id}/lessons/new`}>
              <Button variant="primary" size="sm">+ Add Lesson</Button>
            </Link>
          </div>
          {lessons.length === 0 ? (
            <EmptyState
              icon={Icons.DocumentText}
              title="No lessons yet"
              description="Add your first lesson to get started."
              action={<Link href={`/courses/${id}/lessons/new`}><Button variant="primary" size="sm">+ Add Lesson</Button></Link>}
            />
          ) : (
            <div className="space-y-3">
              {lessons.map((l: any, i: number) => (
                <div key={l._id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 hover:border-indigo-200 transition-colors">
                  <span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">{l.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">{l.content}</p>
                    {l.resourceUrl && (
                      <a href={l.resourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 mt-1">
                        Resource
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5 10 2m0 0H7m3 0v3M2 10h8" /></svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "assignments" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">Assignments</h2>
            <Link href={`/courses/${id}/assignments/new`}>
              <Button variant="primary" size="sm">+ Add Assignment</Button>
            </Link>
          </div>
          {assignments.length === 0 ? (
            <EmptyState
              icon={Icons.ClipboardList}
              title="No assignments yet"
              description="Create an assignment for students to complete."
              action={<Link href={`/courses/${id}/assignments/new`}><Button variant="primary" size="sm">+ Add Assignment</Button></Link>}
            />
          ) : (
            <div className="space-y-3">
              {assignments.map((a: any) => (
                <div key={a._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-200 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">{a.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{a.description}</p>
                      {a.dueDate && (
                        <p className={`text-xs mt-1 flex items-center gap-1 ${dueDateColor(a.dueDate)}`}>
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M4 1.75a.75.75 0 0 1 1.5 0V3h5V1.75a.75.75 0 0 1 1.5 0V3A2 2 0 0 1 14 5v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2V1.75ZM2.5 7v6a1.5 1.5 0 0 0 1.5 1.5h8A1.5 1.5 0 0 0 13.5 13V7h-11Z" clipRule="evenodd" /></svg>
                          Due: {new Date(a.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Link href={`/courses/${id}/submissions?assignmentId=${a._id}`}>
                      <Button variant="secondary" size="sm">
                        View Submissions
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5 10 2m0 0H7m3 0v3M2 10h8" /></svg>
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "quizzes" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">Quizzes</h2>
            <Link href={`/courses/${id}/quiz/new`}>
              <Button variant="primary" size="sm">+ Add Quiz</Button>
            </Link>
          </div>
          {quizzes.length === 0 ? (
            <EmptyState
              icon={Icons.QuestionMarkCircle}
              title="No quizzes yet"
              description="Create a quiz to test your students' understanding."
              action={<Link href={`/courses/${id}/quiz/new`}><Button variant="primary" size="sm">+ Add Quiz</Button></Link>}
            />
          ) : (
            <div className="space-y-3">
              {quizzes.map((q: any) => (
                <div key={q._id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-indigo-200 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{q.title}</p>
                  </div>
                  <Badge variant="info">{q.questions.length} questions</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
