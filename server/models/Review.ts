import mongoose, { Schema, Model } from 'mongoose';

export interface IFacebookReview {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorLocation: string;
  rating: number;
  timeAgo: string;
  content: string;
  productMentioned: string;
  productImage?: string;
  likes: number;
  comments: number;
  shares: number;
  verifiedPurchase: boolean;
  photos?: string[];
}

const ReviewSchema = new Schema<IFacebookReview>(
  {
    id: { type: String, required: true, unique: true, index: true },
    authorName: { type: String, required: true },
    authorAvatar: { type: String, required: true },
    authorLocation: { type: String, default: '' },
    rating: { type: Number, default: 5 },
    timeAgo: { type: String, default: 'Just now' },
    content: { type: String, required: true },
    productMentioned: { type: String, required: true },
    productImage: { type: String },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    verifiedPurchase: { type: Boolean, default: true },
    photos: [{ type: String }],
  },
  { timestamps: true }
);

export const ReviewModel: Model<IFacebookReview> = (mongoose.models.Review as any) || mongoose.model<IFacebookReview>('Review', ReviewSchema);
