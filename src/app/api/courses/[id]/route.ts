import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import Assignment from "@/models/Assignment";
import Quiz from "@/models/Quiz";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const course = await Course.findById(id).populate("instructor", "name email");
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const [lessons, assignments, quizzes] = await Promise.all([
    Lesson.find({ course: id }).sort({ order: 1 }),
    Assignment.find({ course: id }),
    Quiz.find({ course: id }),
  ]);
  return NextResponse.json({ course, lessons, assignments, quizzes });
}
