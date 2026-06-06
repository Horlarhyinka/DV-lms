import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Lesson from "@/models/Lesson";
import Course from "@/models/Course";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "instructor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { courseId, title, content, resourceUrl, order } = await req.json();
  await connectDB();
  const course = await Course.findById(courseId);
  if (!course || course.instructor.toString() !== (session.user as any).id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const lesson = await Lesson.create({ course: courseId, title, content, resourceUrl, order: order || 0 });
  return NextResponse.json(lesson, { status: 201 });
}
