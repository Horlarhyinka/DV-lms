"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EmptyState, { Icons } from "@/components/ui/EmptyState";

export default function SubmissionsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const assignmentId = searchParams.get("assignmentId");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [grading, setGrading] = useState<{ [key: string]: { grade: string; feedback: string } }>({});
  const [saving, setSaving] = useState<string | null>(null);

  async function load() {
    if (!assignmentId) return;
    const res = await fetch(`/api/submissions/by-assignment/${assignmentId}`);
    setSubmissions(await res.json());
  }

  useEffect(() => { load(); }, [assignmentId]);

  async function saveGrade(subId: string) {
    setSaving(subId);
    await fetch(`/api/submissions/${subId}/grade`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade: Number(grading[subId]?.grade), feedback: grading[subId]?.feedback }),
    });
    setSaving(null);
    await load();
  }

  const pending = submissions.filter((s) => s.grade == null);
  const graded = submissions.filter((s) => s.grade != null);

  return (
    <div>
      <PageHeader
        title="Submissions"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Back to Course", href: "javascript:history.back()" }]}
        action={
          <Button variant="ghost" size="sm" onClick={() => router.back()}>← Back to Course</Button>
        }
      />

      {submissions.length === 0 ? (
        <EmptyState
          icon={Icons.Inbox}
          title="No submissions yet"
          description="Students haven't submitted this assignment yet."
        />
      ) : (
        <div className="space-y-8">
          {pending.length > 0 && (
            <section>
              <h2 className="border-l-4 border-amber-400 pl-3 text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                Pending
                <Badge variant="warning">{pending.length}</Badge>
              </h2>
              <div className="space-y-4">
                {pending.map((sub) => <SubmissionCard key={sub._id} sub={sub} grading={grading} setGrading={setGrading} saving={saving} saveGrade={saveGrade} />)}
              </div>
            </section>
          )}
          {graded.length > 0 && (
            <section>
              <h2 className="border-l-4 border-green-500 pl-3 text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                Graded
                <Badge variant="success">{graded.length}</Badge>
              </h2>
              <div className="space-y-4">
                {graded.map((sub) => <SubmissionCard key={sub._id} sub={sub} grading={grading} setGrading={setGrading} saving={saving} saveGrade={saveGrade} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function SubmissionCard({ sub, grading, setGrading, saving, saveGrade }: any) {
  const initials = sub.student?.name?.charAt(0).toUpperCase() ?? "?";
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start gap-3 mb-3">
        <span className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center shrink-0">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="font-medium text-gray-900">{sub.student?.name}</p>
          <p className="text-sm text-gray-500">{sub.student?.email}</p>
        </div>
      </div>

      <a
        href={sub.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-indigo-600 font-medium hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg transition-colors mb-3"
      >
        View Submission
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5 10 2m0 0H7m3 0v3M2 10h8" /></svg>
      </a>

      {sub.grade != null && (
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="success">{sub.grade}/100</Badge>
          {sub.feedback && <span className="text-sm text-gray-500 italic">{sub.feedback}</span>}
        </div>
      )}

      <div className="flex gap-2 items-end">
        <div className="w-28">
          <Input
            type="number"
            placeholder="0–100"
            min={0}
            max={100}
            label="Grade"
            value={grading[sub._id]?.grade || ""}
            onChange={(e: any) => setGrading({ ...grading, [sub._id]: { ...grading[sub._id], grade: e.target.value } })}
          />
        </div>
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Feedback for student"
            label="Feedback"
            value={grading[sub._id]?.feedback || ""}
            onChange={(e: any) => setGrading({ ...grading, [sub._id]: { ...grading[sub._id], feedback: e.target.value } })}
          />
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => saveGrade(sub._id)}
          loading={saving === sub._id}
          loadingText="Saving…"
          className="mb-0.5"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
