import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IThumbnailCategory extends Document {
  name: string;
  slug: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const thumbnailCategorySchema = new Schema<IThumbnailCategory>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100, unique: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

thumbnailCategorySchema.index({ isActive: 1, order: 1 });
thumbnailCategorySchema.index({ slug: 1 }, { unique: true });

const ThumbnailCategory: Model<IThumbnailCategory> =
  mongoose.models.ThumbnailCategory || mongoose.model<IThumbnailCategory>('ThumbnailCategory', thumbnailCategorySchema);

export default ThumbnailCategory;
