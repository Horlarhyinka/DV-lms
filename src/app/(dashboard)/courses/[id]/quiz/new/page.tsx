"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

export default function NewQuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], correctIndex: 0 },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function addQuestion() {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctIndex: 0 }]);
  }

  function removeQuestion(qi: number) {
    setQuestions(questions.filter((_, i) => i !== qi));
  }

  function updateQuestion(i: number, field: keyof Question, value: any) {
    const updated = [...questions];
    (updated[i] as any)[field] = value;
    setQuestions(updated);
  }

  function updateOption(qi: number, oi: number, value: string) {
    const updated = [...questions];
    updated[qi].options[oi] = value;
    setQuestions(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: id, title, questions }),
    });
    setLoading(false);
    if (!res.ok) { const d = await res.json(); setError(d.error); return; }
    router.push(`/courses/${id}`);
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Add Quiz"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: `Course #${id}`, href: `/courses/${id}` },
          { label: "New Quiz" },
        ]}
      />

      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2 mb-5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" /></svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <Input
            label="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {questions.map((q, qi) => (
          <div key={qi} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-700">Question {qi + 1}</p>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qi)}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>

            <Input
              placeholder="Question text"
              value={q.question}
              onChange={(e) => updateQuestion(qi, "question", e.target.value)}
              required
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Options</span>
                <Badge variant="info">Mark the correct answer</Badge>
              </div>
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qi}`}
                    checked={q.correctIndex === oi}
                    onChange={() => updateQuestion(qi, "correctIndex", oi)}
                    className="accent-indigo-600 shrink-0"
                  />
                  <input
                    className={`flex-1 border rounded-lg px-3 py-1.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      q.correctIndex === oi ? "bg-green-50 border-green-300" : "border-gray-300"
                    }`}
                    placeholder={`Option ${oi + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(qi, oi, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={addQuestion}>+ Add Question</Button>
          <Button type="submit" variant="primary" loading={loading} loadingText="Saving…">Save Quiz</Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
