import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReel extends Document {
  title: string;
  videoUrl: string;
  videoKey: string;
  thumbnailUrl: string;
  thumbnailKey: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reelSchema = new Schema<IReel>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    videoUrl: { type: String, required: true },
    videoKey: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    thumbnailKey: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

reelSchema.index({ isActive: 1, order: 1 });
reelSchema.index({ createdAt: -1 });

const Reel: Model<IReel> =
  mongoose.models.Reel || mongoose.model<IReel>('Reel', reelSchema);

export default Reel;
