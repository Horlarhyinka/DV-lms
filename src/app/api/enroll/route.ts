import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { courseId } = await req.json();
  await connectDB();
  const course = await Course.findById(courseId);
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  const userId = (session.user as any).id;
  if (course.enrolledStudents.includes(userId)) {
    return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
  }
  course.enrolledStudents.push(userId);
  await course.save();
  return NextResponse.json({ message: "Enrolled" });
}
