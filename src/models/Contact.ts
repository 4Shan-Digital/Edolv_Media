import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, maxlength: 20 },
    service: {
      type: String,
      required: true,
      enum: [
        'Video Editing',
        'Motion Graphics',
        'Color Grading',
        'Sound Design',
        'VFX',
        'Social Media Content',
        'Corporate Videos',
        'YouTube Production',
        'Other',
      ],
    },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

contactSchema.index({ isRead: 1, createdAt: -1 });

const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>('Contact', contactSchema);

export default Contact;
