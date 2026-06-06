"use client";
import { useEffect, useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import EmptyState, { Icons } from "@/components/ui/EmptyState";

export default function GradesPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/grades").then((r) => r.json()).then(setData);
  }, []);

  if (!data) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-16" />
        ))}
      </div>
    );
  }

  const { submissions, attempts } = data;

  const gradedSubmissions = submissions.filter((s: any) => s.grade != null);
  const assignmentAvg = gradedSubmissions.length
    ? Math.round(gradedSubmissions.reduce((sum: number, s: any) => sum + s.grade, 0) / gradedSubmissions.length)
    : null;
  const quizAvg = attempts.length
    ? Math.round(attempts.reduce((sum: number, a: any) => sum + (a.score / a.total) * 100, 0) / attempts.length)
    : null;

  return (
    <div>
      <PageHeader title="My Grades" />

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-indigo-600">{assignmentAvg != null ? `${assignmentAvg}%` : "—"}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">Assignment Average</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-indigo-600">{quizAvg != null ? `${quizAvg}%` : "—"}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">Quiz Average</p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="border-l-4 border-indigo-500 pl-3 text-lg font-semibold text-gray-800 mb-4">Assignments</h2>
        {submissions.length === 0 ? (
          <EmptyState icon={Icons.ClipboardList} title="No assignments submitted yet" description="Your graded assignments will appear here." />
        ) : (
          <div className="space-y-3">
            {submissions.map((s: any) => (
              <div key={s._id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between hover:border-gray-300 transition-colors">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{s.assignment?.title}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-gray-400"><path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.5v-9Z" /><path fillRule="evenodd" d="M5 6.5A.5.5 0 0 1 5.5 6h5a.5.5 0 0 1 0 1h-5A.5.5 0 0 1 5 6.5Zm0 2A.5.5 0 0 1 5.5 8h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 5 8.5Z" clipRule="evenodd" /></svg>
                    {s.assignment?.course?.title}
                  </p>
                  {s.feedback && (
                    <p className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600 border-l-2 border-gray-300 italic mt-2">
                      {s.feedback}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0 ml-4">
                  {s.grade != null ? (
                    <div>
                      <p className="text-2xl font-bold text-indigo-600">{s.grade}</p>
                      <p className="text-xs text-gray-400">/100</p>
                    </div>
                  ) : (
                    <Badge variant="warning">Pending</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="border-l-4 border-indigo-500 pl-3 text-lg font-semibold text-gray-800 mb-4">Quizzes</h2>
        {attempts.length === 0 ? (
          <EmptyState icon={Icons.ChartBar} title="No quiz attempts yet" description="Your quiz scores will appear here after you complete a quiz." />
        ) : (
          <div className="space-y-3">
            {attempts.map((a: any) => {
              const pct = Math.round((a.score / a.total) * 100);
              return (
                <div key={a._id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between hover:border-gray-300 transition-colors">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900">{a.quiz?.title}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-gray-400"><path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.5v-9Z" /><path fillRule="evenodd" d="M5 6.5A.5.5 0 0 1 5.5 6h5a.5.5 0 0 1 0 1h-5A.5.5 0 0 1 5 6.5Zm0 2A.5.5 0 0 1 5.5 8h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 5 8.5Z" clipRule="evenodd" /></svg>
                      {a.quiz?.course?.title}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-4 flex flex-col items-end gap-1">
                    <p className="text-2xl font-bold text-indigo-600">{a.score}<span className="text-sm text-gray-400 font-normal">/{a.total}</span></p>
                    <Badge variant={pct >= 70 ? "success" : "warning"}>{pct}%</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
