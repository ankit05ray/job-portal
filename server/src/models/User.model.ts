import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'jobseeker' | 'recruiter';
  company?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ['jobseeker', 'recruiter'], default: 'jobseeker' },
    company:  { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);