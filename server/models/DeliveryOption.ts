import mongoose, { Schema, Model } from 'mongoose';

export interface IDeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  isDefault?: boolean;
}

const DeliveryOptionSchema = new Schema<IDeliveryOption>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    estimatedDays: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const DeliveryOptionModel: Model<IDeliveryOption> =
  (mongoose.models.DeliveryOption as any) ||
  mongoose.model<IDeliveryOption>('DeliveryOption', DeliveryOptionSchema);
