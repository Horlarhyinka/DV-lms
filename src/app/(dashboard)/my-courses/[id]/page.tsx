"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState, { Icons } from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";

type Tab = "lessons" | "assignments" | "quizzes";

export default function StudentCoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [quizId: string]: number[] }>({});
  const [results, setResults] = useState<{ [quizId: string]: any }>({});
  const [submitted, setSubmitted] = useState<{ [key: string]: boolean }>({});
  const [quizSubmitting, setQuizSubmitting] = useState<string | null>(null);

  const tab = (searchParams.get("tab") as Tab) ?? "lessons";
  function setTab(t: Tab) { router.replace(`?tab=${t}`); }

  useEffect(() => {
    fetch(`/api/courses/${id}`).then((r) => r.json()).then(setData);
  }, [id]);

  async function submitAssignment(assignmentId: string) {
    const url = fileUrl[assignmentId];
    if (!url) return;
    setSubmitting(assignmentId);
    await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId, fileUrl: url }),
    });
    setSubmitting(null);
    setSubmitted({ ...submitted, [assignmentId]: true });
  }

  async function submitQuiz(quizId: string, total: number) {
    setQuizSubmitting(quizId);
    const answers = quizAnswers[quizId] || [];
    const res = await fetch(`/api/quizzes/${quizId}/attempt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    const result = await res.json();
    setResults({ ...results, [quizId]: result });
    setQuizSubmitting(null);
  }

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
        subtitle={course.description}
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: course.title }]}
      />

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
        <div className="space-y-4">
          {lessons.length === 0 ? (
            <EmptyState icon={Icons.DocumentText} title="No lessons yet" description="The instructor hasn't added any lessons yet." />
          ) : lessons.map((l: any, i: number) => (
            <div key={l._id} className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="font-semibold text-gray-900 mb-2">{i + 1}. {l.title}</p>
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{l.content}</p>
              {l.resourceUrl && (
                <a
                  href={l.resourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-indigo-600 font-medium hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg transition-colors mt-3"
                >
                  Open Resource
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5 10 2m0 0H7m3 0v3M2 10h8" /></svg>
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "assignments" && (
        <div className="space-y-4">
          {assignments.length === 0 ? (
            <EmptyState icon={Icons.ClipboardList} title="No assignments yet" description="The instructor hasn't added any assignments yet." />
          ) : assignments.map((a: any) => (
            <div key={a._id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{a.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{a.description}</p>
                  {a.dueDate && <p className="text-xs text-gray-400 mt-1">Due: {new Date(a.dueDate).toLocaleDateString()}</p>}
                </div>
                <Badge variant={submitted[a._id] ? "success" : "warning"}>
                  {submitted[a._id] ? "Submitted" : "Pending"}
                </Badge>
              </div>
              {submitted[a._id] ? (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
                  Submitted successfully
                </div>
              ) : (
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      type="url"
                      label="Submission URL"
                      placeholder="https://drive.google.com/… or GitHub link"
                      value={fileUrl[a._id] || ""}
                      onChange={(e) => setFileUrl({ ...fileUrl, [a._id]: e.target.value })}
                    />
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => submitAssignment(a._id)}
                    loading={submitting === a._id}
                    loadingText="Submitting…"
                    className="mb-0.5"
                  >
                    Submit
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "quizzes" && (
        <div className="space-y-6">
          {quizzes.length === 0 ? (
            <EmptyState icon={Icons.QuestionMarkCircle} title="No quizzes yet" description="The instructor hasn't added any quizzes yet." />
          ) : quizzes.map((q: any) => (
            <div key={q._id} className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="font-semibold text-gray-900 mb-4">{q.title}</p>
              {results[q._id] ? (
                (() => {
                  const { score, total } = results[q._id];
                  const pct = Math.round((score / total) * 100);
                  return (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-center">
                      <p className="text-3xl font-bold text-indigo-600">{score} / {total}</p>
                      <p className="text-sm text-gray-600 mt-1">Quiz complete</p>
                      <div className="mt-2">
                        <Badge variant={pct >= 70 ? "success" : "warning"}>{pct}%</Badge>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="space-y-4">
                  {q.questions.map((question: any, qi: number) => (
                    <div key={qi}>
                      <p className="text-sm font-medium text-gray-700 mb-2">{qi + 1}. {question.question}</p>
                      <div className="space-y-1">
                        {question.options.map((opt: string, oi: number) => {
                          const selected = (quizAnswers[q._id] || [])[qi] === oi;
                          return (
                            <label
                              key={oi}
                              className={`flex items-center gap-2 text-sm cursor-pointer rounded-lg px-3 py-2 transition-colors ${
                                selected ? "bg-indigo-50 text-indigo-800 font-medium" : "text-gray-600 hover:bg-indigo-50"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`${q._id}-${qi}`}
                                className="accent-indigo-600"
                                onChange={() => {
                                  const ans = [...(quizAnswers[q._id] || Array(q.questions.length).fill(-1))];
                                  ans[qi] = oi;
                                  setQuizAnswers({ ...quizAnswers, [q._id]: ans });
                                }}
                              />
                              {opt}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="primary"
                    onClick={() => submitQuiz(q._id, q.questions.length)}
                    loading={quizSubmitting === q._id}
                    loadingText="Submitting…"
                  >
                    Submit Quiz
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
