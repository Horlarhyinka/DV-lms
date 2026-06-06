import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";
import QuizAttempt from "@/models/QuizAttempt";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const userId = (session.user as any).id;
  const [submissions, attempts] = await Promise.all([
    Submission.find({ student: userId }).populate({ path: "assignment", populate: { path: "course", select: "title" } }),
    QuizAttempt.find({ student: userId }).populate({ path: "quiz", populate: { path: "course", select: "title" } }),
  ]);
  return NextResponse.json({ submissions, attempts });
}
