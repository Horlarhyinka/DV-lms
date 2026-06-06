import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAssignment extends Document {
  course: Types.ObjectId;
  title: string;
  description: string;
  dueDate?: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Assignment || mongoose.model<IAssignment>("Assignment", AssignmentSchema);
