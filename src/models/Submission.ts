import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISubmission extends Document {
  assignment: Types.ObjectId;
  student: Types.ObjectId;
  fileUrl: string;
  grade?: number;
  feedback?: string;
  submittedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    assignment: { type: Schema.Types.ObjectId, ref: "Assignment", required: true },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fileUrl: { type: String, required: true },
    grade: { type: Number, min: 0, max: 100 },
    feedback: { type: String },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Submission || mongoose.model<ISubmission>("Submission", SubmissionSchema);
