import mongoose from 'mongoose';

export interface ITeamMember {
  _id?: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  order: number;
  social?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const TeamMemberSchema = new mongoose.Schema<ITeamMember>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    order: {
      type: Number,
      default: 0,
    },
    social: {
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      instagram: { type: String, trim: true },
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

// Index for sorting
TeamMemberSchema.index({ order: 1, createdAt: -1 });

const TeamMember = mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);

export default TeamMember;
