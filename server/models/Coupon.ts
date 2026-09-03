import mongoose, { Schema, Model } from 'mongoose';

export interface ICoupon {
  id: string;
  code: string;
  discountPercent: number;
  minSpend: number;
  expiryDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  description?: string;
}

const CouponSchema = new Schema<ICoupon>(
  {
    id: { type: String, required: true, unique: true, index: true },
    code: { type: String, required: true, unique: true, uppercase: true, index: true },
    discountPercent: { type: Number, required: true },
    minSpend: { type: Number, default: 0 },
    expiryDate: { type: String, required: true },
    usageLimit: { type: Number, default: 500 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export const CouponModel: Model<ICoupon> = (mongoose.models.Coupon as any) || mongoose.model<ICoupon>('Coupon', CouponSchema);
