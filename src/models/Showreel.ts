import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IShowreel extends Document {
  title: string;
  description?: string;
  duration: string;
  year: string;
  thumbnailUrl: string;
  thumbnailKey: string;
  videoUrl: string;
  videoKey: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const showreelSchema = new Schema<IShowreel>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 1000 },
    duration: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    thumbnailUrl: { type: String, required: true },
    thumbnailKey: { type: String, required: true },
    videoUrl: { type: String, required: true },
    videoKey: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Showreel: Model<IShowreel> =
  mongoose.models.Showreel || mongoose.model<IShowreel>('Showreel', showreelSchema);

export default Showreel;
