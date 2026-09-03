import mongoose, { Schema, Model } from 'mongoose';

export interface ISettings {
  key: string;
  freeShippingThreshold: number;
  standardShippingRate: number;
  expressShippingRate: number;
  announcementText: string;
  showAnnouncement: boolean;
  promoCode: string;
  promoDiscountPercent: number;
  notificationEmail: string;
  contactInfo?: {
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    zip: string;
    hours: string;
    whatsapp?: string;
    supportNote?: string;
  };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    pinterest?: string;
    linkedin?: string;
  };
  paymentSettings?: {
    allowOnlinePayment: boolean;
    allowCashOnDelivery: boolean;
    codInstructions?: string;
  };
  imagekitConfig?: {
    urlEndpoint: string;
    publicKey: string;
    privateKey?: string;
  };
}

const SettingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true, default: 'global' },
    freeShippingThreshold: { type: Number, default: 150 },
    standardShippingRate: { type: Number, default: 8 },
    expressShippingRate: { type: Number, default: 18 },
    announcementText: { type: String, default: 'Complimentary shipping on bespoke architectural orders over $150 · Code: LUMINA15' },
    showAnnouncement: { type: Boolean, default: true },
    promoCode: { type: String, default: 'LUMINA15' },
    promoDiscountPercent: { type: Number, default: 15 },
    notificationEmail: { type: String, default: 'concierge@lumina-studio.com' },
    contactInfo: {
      email: { type: String, default: 'concierge@lumina-studio.com' },
      phone: { type: String, default: '+1 (555) 234-5678' },
      address: { type: String, default: '142 Mercer Street, Soho' },
      city: { type: String, default: 'New York' },
      country: { type: String, default: 'United States' },
      zip: { type: String, default: '10012' },
      hours: { type: String, default: 'Mon - Fri: 9:00 AM - 6:00 PM EST' },
      whatsapp: { type: String, default: '+1 (555) 234-5678' },
      supportNote: { type: String, default: 'Dedicated architectural client service and bespoke consultation.' },
    },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com/lumina_archive' },
      facebook: { type: String, default: 'https://facebook.com/lumina.archive' },
      twitter: { type: String, default: 'https://x.com/lumina_archive' },
      youtube: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      pinterest: { type: String, default: 'https://pinterest.com/lumina_design' },
      linkedin: { type: String, default: '' },
    },
    paymentSettings: {
      allowOnlinePayment: { type: Boolean, default: true },
      allowCashOnDelivery: { type: Boolean, default: true },
      codInstructions: { type: String, default: 'Please have the exact amount ready upon delivery courier arrival.' },
    },
    imagekitConfig: {
      urlEndpoint: { type: String, default: '' },
      publicKey: { type: String, default: '' },
      privateKey: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const SettingsModel: Model<ISettings> = (mongoose.models.Settings as any) || mongoose.model<ISettings>('Settings', SettingsSchema);
