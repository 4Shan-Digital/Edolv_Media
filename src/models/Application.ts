import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IApplication extends Document {
  jobId: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  coverLetter?: string;
  resumeUrl: string;
  resumeKey?: string;
  portfolioUrl?: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interview' | 'rejected' | 'hired';
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    coverLetter: { type: String, trim: true, maxlength: 5000 },
    resumeUrl: { type: String, required: true },
    resumeKey: { type: String },
    portfolioUrl: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'shortlisted', 'interview', 'rejected', 'hired'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ jobId: 1, status: 1 });
applicationSchema.index({ email: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });

const Application: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>('Application', applicationSchema);

export default Application;
