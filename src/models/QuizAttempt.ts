import mongoose, { Schema, Document, Types } from "mongoose";

export interface IQuizAttempt extends Document {
  quiz: Types.ObjectId;
  student: Types.ObjectId;
  answers: number[];
  score: number;
  total: number;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    answers: [{ type: Number }],
    score: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.QuizAttempt || mongoose.model<IQuizAttempt>("QuizAttempt", QuizAttemptSchema);
