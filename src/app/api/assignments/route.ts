import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";
import Course from "@/models/Course";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "instructor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { courseId, title, description, dueDate } = await req.json();
  await connectDB();
  const course = await Course.findById(courseId);
  if (!course || course.instructor.toString() !== (session.user as any).id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const assignment = await Assignment.create({ course: courseId, title, description, dueDate });
  return NextResponse.json(assignment, { status: 201 });
}
