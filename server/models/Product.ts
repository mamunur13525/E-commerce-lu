import mongoose, { Schema, Model } from 'mongoose';

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  detailedDescription?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  subCategory: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  stockQuantity: number;
  enableSizes?: boolean;
  sizes?: string[];
  enableColors?: boolean;
  colors?: { name: string; hex: string }[];
  productStatus?: 'in_stock' | 'out_of_stock' | 'pre_order' | 'draft';
  unit?: string;
  allowOnlinePayment?: boolean;
  allowCod?: boolean;
  tags: string[];
  sku: string;
  materials?: string[];
  dimensions?: string;
  reviews?: any[];
  comments?: any[];
  createdAt: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    description: { type: String, required: true },
    detailedDescription: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number, default: 5 },
    reviewCount: { type: Number, default: 0 },
    images: [{ type: String }],
    category: { type: String, required: true, index: true },
    subCategory: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 10 },
    enableSizes: { type: Boolean, default: false },
    sizes: [{ type: String }],
    enableColors: { type: Boolean, default: false },
    colors: [
      {
        name: { type: String },
        hex: { type: String },
      },
    ],
    productStatus: { type: String, enum: ['in_stock', 'out_of_stock', 'pre_order', 'draft'], default: 'in_stock' },
    unit: { type: String, default: 'pcs' },
    allowOnlinePayment: { type: Boolean, default: true },
    allowCod: { type: Boolean, default: true },
    tags: [{ type: String }],
    sku: { type: String, required: true },
    materials: [{ type: String }],
    dimensions: { type: String },
    reviews: [
      {
        id: String,
        userName: String,
        userAvatar: String,
        userLocation: String,
        rating: Number,
        date: String,
        comment: String,
        verifiedPurchase: Boolean,
        likesCount: Number,
      },
    ],
    comments: [
      {
        id: String,
        userName: String,
        date: String,
        text: String,
        rating: Number,
      },
    ],
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const ProductModel: Model<IProduct> = (mongoose.models.Product as any) || mongoose.model<IProduct>('Product', ProductSchema);
