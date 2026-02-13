import mongoose from 'mongoose';

export interface IAboutVideo {
  _id?: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const AboutVideoSchema = new mongoose.Schema<IAboutVideo>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Thumbnail URL is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Only allow one active about video at a time
AboutVideoSchema.pre('save', async function () {
  if (this.isActive) {
    await mongoose.model('AboutVideo').updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
});

const AboutVideo = mongoose.models.AboutVideo || mongoose.model<IAboutVideo>('AboutVideo', AboutVideoSchema);

export default AboutVideo;
