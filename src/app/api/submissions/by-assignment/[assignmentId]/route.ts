import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Submission from "@/models/Submission";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ assignmentId: string }> }) {
  const session = await auth();
  if (!session || (session.user as any).role !== "instructor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { assignmentId } = await params;
  await connectDB();
  const submissions = await Submission.find({ assignment: assignmentId }).populate("student", "name email");
  return NextResponse.json(submissions);
}
