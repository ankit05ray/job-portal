import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number;
  skills: string[];
  postedBy: mongoose.Types.ObjectId;
  isActive: boolean;
}

const JobSchema = new Schema<IJob>(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    company:     { type: String, required: true },
    location:    { type: String },
    salary:      { type: Number },
    skills:      [{ type: String }],
    postedBy:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IJob>('Job', JobSchema);