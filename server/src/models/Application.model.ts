import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  status: 'applied' | 'reviewing' | 'accepted' | 'rejected';
  matchScore: number;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId:    { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
    status:   {
      type: String,
      enum: ['applied', 'reviewing', 'accepted', 'rejected'],
      default: 'applied',
    },
    matchScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Prevent a user from applying to the same job twice
ApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);