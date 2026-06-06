"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function NewLessonPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "", resourceUrl: "", order: 0 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: id, ...form }),
    });
    setLoading(false);
    if (!res.ok) { const d = await res.json(); setError(d.error); return; }
    router.push(`/courses/${id}`);
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Add Lesson"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: `Course #${id}`, href: `/courses/${id}` },
          { label: "New Lesson" },
        ]}
      />

      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2 mb-5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" /></svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <Input
          label="Lesson Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <Textarea
          label="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <Input
          label="Resource URL (optional)"
          type="url"
          placeholder="https://…"
          value={form.resourceUrl}
          onChange={(e) => setForm({ ...form, resourceUrl: e.target.value })}
        />
        <Input
          label="Display Order"
          type="number"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
          hint="Lower numbers appear first in the lesson list."
        />
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-2">
          <Button type="submit" variant="primary" loading={loading} loadingText="Saving…">
            Add Lesson
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
