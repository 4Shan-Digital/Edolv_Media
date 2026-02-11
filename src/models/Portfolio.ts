import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPortfolio extends Document {
  title: string;
  category: string;
  description: string;
  client: string;
  duration: string;
  year: string;
  thumbnailUrl: string;
  thumbnailKey: string;
  videoUrl: string;
  videoKey: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const portfolioSchema = new Schema<IPortfolio>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    client: { type: String, required: true, trim: true, maxlength: 200 },
    duration: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    thumbnailUrl: { type: String, required: true },
    thumbnailKey: { type: String, required: true },
    videoUrl: { type: String, required: true },
    videoKey: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
portfolioSchema.index({ category: 1, isActive: 1 });
portfolioSchema.index({ order: 1 });
portfolioSchema.index({ createdAt: -1 });

const Portfolio: Model<IPortfolio> =
  mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', portfolioSchema);

export default Portfolio;
