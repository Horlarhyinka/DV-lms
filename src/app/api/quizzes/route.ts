import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Quiz from "@/models/Quiz";
import Course from "@/models/Course";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "instructor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { courseId, title, questions } = await req.json();
  await connectDB();
  const course = await Course.findById(courseId);
  if (!course || course.instructor.toString() !== (session.user as any).id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const quiz = await Quiz.create({ course: courseId, title, questions });
  return NextResponse.json(quiz, { status: 201 });
}
