import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILesson extends Document {
  course: Types.ObjectId;
  title: string;
  content: string;
  resourceUrl?: string;
  order: number;
}

const LessonSchema = new Schema<ILesson>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    resourceUrl: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", LessonSchema);
