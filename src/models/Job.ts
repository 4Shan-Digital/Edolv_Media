import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJob extends Document {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  isActive: boolean;
  isUrgent: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    department: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    location: { type: String, required: true, trim: true, maxlength: 200 },
    type: {
      type: String,
      required: true,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    requirements: [{ type: String, required: true, trim: true }],
    responsibilities: [{ type: String, required: true, trim: true }],
    isActive: { type: Boolean, default: true },
    isUrgent: { type: Boolean, default: false },
    priority: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ department: 1, isActive: 1 });
jobSchema.index({ isActive: 1, isUrgent: -1, priority: -1, createdAt: -1 });

// In development, always re-register to pick up schema changes without a full restart
if (process.env.NODE_ENV === 'development' && mongoose.models.Job) {
  delete (mongoose.models as Record<string, unknown>).Job;
}

const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema);

export default Job;
