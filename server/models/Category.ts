import mongoose, { Schema, Model } from 'mongoose';

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName: string;
  itemCount: number;
  subCollections: {
    id: string;
    name: string;
    slug: string;
    itemCount: number;
    image?: string;
  }[];
  featured?: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    description: { type: String, default: '' },
    image: { type: String, required: true },
    iconName: { type: String, default: 'Tag' },
    itemCount: { type: Number, default: 0 },
    subCollections: [
      {
        id: String,
        name: String,
        slug: String,
        itemCount: Number,
        image: String,
      },
    ],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CategoryModel: Model<ICategory> = (mongoose.models.Category as any) || mongoose.model<ICategory>('Category', CategorySchema);
