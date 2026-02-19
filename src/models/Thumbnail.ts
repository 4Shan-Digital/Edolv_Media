import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IThumbnail extends Document {
  title: string;
  category: string;
  imageUrl: string;
  imageKey: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const thumbnailSchema = new Schema<IThumbnail>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    category: { type: String, required: true, trim: true, maxlength: 100 },
    imageUrl: { type: String, required: true },
    imageKey: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

thumbnailSchema.index({ category: 1, isActive: 1 });
thumbnailSchema.index({ order: 1 });
thumbnailSchema.index({ createdAt: -1 });

const Thumbnail: Model<IThumbnail> =
  mongoose.models.Thumbnail || mongoose.model<IThumbnail>('Thumbnail', thumbnailSchema);

export default Thumbnail;
