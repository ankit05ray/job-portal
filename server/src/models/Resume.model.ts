import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  fileUrl: string;
  fileName: string;
  skills: string[];
  summary: string;
  experience: {
    company: string;
    role: string;
    years: number;
  }[];
}

const ResumeSchema = new Schema<IResume>(
  {
    userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fileUrl:  { type: String, required: true },
    fileName: { type: String },
    skills:   [{ type: String }],
    summary:  { type: String },
    experience: [
      {
        company: { type: String },
        role:    { type: String },
        years:   { type: Number },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IResume>('Resume', ResumeSchema);