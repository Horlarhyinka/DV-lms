import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Quiz from "@/models/Quiz";
import QuizAttempt from "@/models/QuizAttempt";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { answers } = await req.json();
  await connectDB();
  const quiz = await Quiz.findById(id);
  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const existing = await QuizAttempt.findOne({ quiz: id, student: (session.user as any).id });
  if (existing) return NextResponse.json({ error: "Already attempted" }, { status: 409 });
  const score = quiz.questions.reduce((acc: number, q: any, i: number) => {
    return acc + (answers[i] === q.correctIndex ? 1 : 0);
  }, 0);
  const attempt = await QuizAttempt.create({
    quiz: id,
    student: (session.user as any).id,
    answers,
    score,
    total: quiz.questions.length,
  });
  return NextResponse.json(attempt, { status: 201 });
}
