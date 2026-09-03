import mongoose, { Schema, Model } from 'mongoose';

export interface IOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: any[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  shippingAddress: any;
  deliveryOption: any;
  paymentDetails: any;
  status: string;
  orderDate: string;
  estimatedDeliveryDate: string;
  trackingNumber: string;
  carrier: string;
  trackingSteps: any[];
  isGuest: boolean;
  userId?: string;
  notes?: string;
  emailSentTo: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    id: { type: String, required: true, unique: true, index: true },
    orderNumber: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, index: true },
    customerPhone: { type: String, default: '' },
    items: [{ type: Schema.Types.Mixed }],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    total: { type: Number, required: true },
    shippingAddress: { type: Schema.Types.Mixed, required: false, default: {} },
    deliveryOption: { type: Schema.Types.Mixed, required: false, default: () => ({ id: 'del-std', name: 'Standard Delivery', price: 15, estimatedDays: '3-5 Business Days', isDefault: true }) },
    paymentDetails: { type: Schema.Types.Mixed, required: false, default: {} },
    status: {
      type: String,
      enum: ['pending', 'processing', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'confirmed',
    },
    orderDate: { type: String, default: () => new Date().toISOString() },
    estimatedDeliveryDate: { type: String },
    trackingNumber: { type: String, required: true },
    carrier: { type: String, default: 'Carbon-Neutral Express' },
    trackingSteps: [{ type: Schema.Types.Mixed }],
    isGuest: { type: Boolean, default: false },
    userId: { type: String },
    notes: { type: String },
    emailSentTo: { type: String },
  },
  { timestamps: true }
);

export const OrderModel: Model<IOrder> = (mongoose.models.Order as any) || mongoose.model<IOrder>('Order', OrderSchema);
