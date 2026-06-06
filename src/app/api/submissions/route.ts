import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { assignmentId, fileUrl } = await req.json();
  if (!assignmentId || !fileUrl) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  await connectDB();
  const existing = await Submission.findOne({ assignment: assignmentId, student: (session.user as any).id });
  if (existing) return NextResponse.json({ error: "Already submitted" }, { status: 409 });
  const submission = await Submission.create({
    assignment: assignmentId,
    student: (session.user as any).id,
    fileUrl,
  });
  return NextResponse.json(submission, { status: 201 });
}
