import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: Types.ObjectId;
  enrolledStudents: Types.ObjectId[];
  createdAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    enrolledStudents: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
