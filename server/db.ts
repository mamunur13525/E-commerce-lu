import mongoose from 'mongoose';
import { ProductModel } from './models/Product.js';
import { CategoryModel } from './models/Category.js';
import { OrderModel } from './models/Order.js';
import { CouponModel } from './models/Coupon.js';
import { SettingsModel } from './models/Settings.js';
import { ReviewModel } from './models/Review.js';
import { DeliveryOptionModel } from './models/DeliveryOption.js';

export interface DBStatus {
  connected: boolean;
  usingFallback: boolean;
  uriConfigured: boolean;
  databaseName: string;
  error?: string | null;
  errorCode?: 'IP_NOT_WHITELISTED' | 'AUTH_FAILED' | 'TIMEOUT' | 'UNKNOWN' | null;
  atlasIpWhitelistNeeded?: boolean;
  recommendation?: string | null;
  lastAttemptAt?: string;
  counts: {
    products: number;
    categories: number;
    orders: number;
    coupons: number;
    reviews: number;
    deliveryOptions: number;
  };
}

// In-memory fallback if MongoDB URI is not yet provided or unreachable - strictly empty, no mock data
export const fallbackStore = {
  products: [] as any[],
  categories: [] as any[],
  orders: [] as any[],
  coupons: [] as any[],
  reviews: [] as any[],
  deliveryOptions: [
    {
      id: 'del-std',
      name: 'Standard Carbon-Neutral Delivery',
      description: 'Delivered in 100% recyclable, plastic-free packaging',
      price: 15,
      estimatedDays: '3-5 Business Days',
      isDefault: true,
    },
    {
      id: 'del-exp',
      name: 'Express Priority Courier',
      description: 'Direct priority dispatch with real-time tracking updates',
      price: 25,
      estimatedDays: '1-2 Business Days',
      isDefault: false,
    },
  ] as any[],
  settings: {
    key: 'global',
    freeShippingThreshold: 150,
    standardShippingRate: 8,
    expressShippingRate: 18,
    announcementText: 'Complimentary shipping on orders over $150 · Code: LUMINA15',
    showAnnouncement: true,
    promoCode: 'LUMINA15',
    promoDiscountPercent: 15,
    notificationEmail: 'mdshn1122@gmail.com',
    contactInfo: {
      email: 'mdshn1122@gmail.com',
      phone: '+1 (555) 234-5678',
      address: '142 Mercer Street, Soho',
      city: 'New York',
      country: 'United States',
      zip: '10012',
      hours: 'Monday - Friday: 9:00 AM - 6:00 PM EST',
      whatsapp: '+1 (555) 234-5678',
      supportNote: 'Direct concierge support and personalized sizing consultations.',
    },
    socialLinks: {
      instagram: 'https://instagram.com/lumina_archive',
      facebook: 'https://facebook.com/lumina.archive',
      twitter: 'https://x.com/lumina_archive',
      youtube: '',
      tiktok: '',
      pinterest: 'https://pinterest.com/lumina_design',
      linkedin: '',
    },
    paymentSettings: {
      allowOnlinePayment: true,
      allowCashOnDelivery: true,
      codInstructions: 'Please have the exact cash amount ready upon delivery.',
    },
    imagekitConfig: {
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
    },
  },
};

let isConnected = false;
let isInitialized = false;
let lastError: string | null = null;
let lastErrorCode: DBStatus['errorCode'] = null;
let lastAttemptTimestamp: string = new Date().toISOString();
let retryTimer: NodeJS.Timeout | null = null;

export async function connectToMongo(): Promise<boolean> {
  const mongoUri = process.env.MONGODB_URI;
  lastAttemptTimestamp = new Date().toISOString();

  if (!mongoUri || mongoUri.trim().length === 0 || mongoUri.includes('<username>')) {
    lastError = 'No valid MONGODB_URI configured.';
    lastErrorCode = null;
    isConnected = false;
    return false;
  }

  try {
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      lastError = null;
      lastErrorCode = null;
      return true;
    }

    // Attempt connecting with moderate timeout
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 6000,
    });

    isConnected = true;
    lastError = null;
    lastErrorCode = null;
    console.log('[Database] MongoDB connection established successfully via Mongoose.');

    // Ensure settings record exists if missing
    await ensureSettingsExist();
    return true;
  } catch (err: any) {
    const errorMsg = String(err?.message || err);
    lastError = errorMsg;
    isConnected = false;

    if (errorMsg.includes('whitelist') || errorMsg.includes('Could not connect to any servers') || errorMsg.includes('ECONNREFUSED')) {
      lastErrorCode = 'IP_NOT_WHITELISTED';
    } else if (errorMsg.includes('Authentication failed') || errorMsg.includes('auth error')) {
      lastErrorCode = 'AUTH_FAILED';
    } else if (errorMsg.includes('timed out') || errorMsg.includes('ETIMEDOUT')) {
      lastErrorCode = 'TIMEOUT';
    } else {
      lastErrorCode = 'UNKNOWN';
    }

    return false;
  }
}

export async function reconnectDatabase(): Promise<DBStatus> {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
    } catch {
      // ignore disconnect cleanup errors
    }
  }
  await connectToMongo();
  return getDBStatus();
}

export async function clearAllDatabaseData(): Promise<{ success: boolean; deleted: Record<string, number> }> {
  const counts: Record<string, number> = {
    products: 0,
    categories: 0,
    orders: 0,
    coupons: 0,
    reviews: 0,
    deliveryOptions: 0,
  };

  if (isConnected && mongoose.connection.readyState === 1) {
    const [p, c, o, cp, r, d] = await Promise.all([
      ProductModel.deleteMany({}),
      CategoryModel.deleteMany({}),
      OrderModel.deleteMany({}),
      CouponModel.deleteMany({}),
      ReviewModel.deleteMany({}),
      DeliveryOptionModel.deleteMany({}),
    ]);
    counts.products = p.deletedCount || 0;
    counts.categories = c.deletedCount || 0;
    counts.orders = o.deletedCount || 0;
    counts.coupons = cp.deletedCount || 0;
    counts.reviews = r.deletedCount || 0;
    counts.deliveryOptions = d.deletedCount || 0;
  }

  // Clear in-memory store as well
  fallbackStore.products = [];
  fallbackStore.categories = [];
  fallbackStore.orders = [];
  fallbackStore.coupons = [];
  fallbackStore.reviews = [];
  fallbackStore.deliveryOptions = [];

  return { success: true, deleted: counts };
}

export async function initDatabase(): Promise<DBStatus> {
  if (isInitialized) {
    return getDBStatus();
  }

  await connectToMongo();
  isInitialized = true;

  // Background retry every 30 seconds if configured but not yet connected
  if (!retryTimer && process.env.MONGODB_URI) {
    retryTimer = setInterval(async () => {
      if (!isConnected) {
        await connectToMongo();
      }
    }, 30000);
  }

  return getDBStatus();
}

async function ensureSettingsExist() {
  try {
    const settingsExists = await SettingsModel.findOne({ key: 'global' });
    if (!settingsExists) {
      await SettingsModel.create({
        key: 'global',
        freeShippingThreshold: 150,
        standardShippingRate: 8,
        expressShippingRate: 18,
        announcementText: 'Complimentary shipping on orders over $150 · Code: LUMINA15',
        showAnnouncement: true,
        promoCode: 'LUMINA15',
        promoDiscountPercent: 15,
        notificationEmail: 'mdshn1122@gmail.com',
      });
    }
  } catch {
    // Non-blocking
  }
}

export async function getDBStatus(): Promise<DBStatus> {
  const uriConfigured = !!(process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<username>'));

  if (isConnected && mongoose.connection.readyState === 1) {
    try {
      const [products, categories, orders, coupons, reviews, deliveryOptions] = await Promise.all([
        ProductModel.countDocuments(),
        CategoryModel.countDocuments(),
        OrderModel.countDocuments(),
        CouponModel.countDocuments(),
        ReviewModel.countDocuments(),
        DeliveryOptionModel.countDocuments(),
      ]);

      return {
        connected: true,
        usingFallback: false,
        uriConfigured: true,
        databaseName: mongoose.connection.db?.databaseName || 'lumina_ecommerce',
        error: null,
        errorCode: null,
        atlasIpWhitelistNeeded: false,
        lastAttemptAt: lastAttemptTimestamp,
        counts: { products, categories, orders, coupons, reviews, deliveryOptions },
      };
    } catch {
      // If error occurs reading counts, fall through to fallback counts
    }
  }

  let recommendation: string | null = null;
  if (lastErrorCode === 'IP_NOT_WHITELISTED') {
    recommendation = "In MongoDB Atlas, go to Network Access -> Add IP Address -> Choose 'Allow Access from Anywhere' (0.0.0.0/0) -> Save. Wait 30 seconds, then click Reconnect.";
  } else if (lastErrorCode === 'AUTH_FAILED') {
    recommendation = "Verify the database user credentials and password in your MONGODB_URI connection string.";
  } else if (!uriConfigured) {
    recommendation = "Set MONGODB_URI in Settings/Environment to connect your MongoDB Atlas cluster.";
  }

  return {
    connected: false,
    usingFallback: true,
    uriConfigured,
    databaseName: uriConfigured ? 'MongoDB Atlas (IP Whitelist Required)' : 'Local Memory Store',
    error: lastError,
    errorCode: lastErrorCode,
    atlasIpWhitelistNeeded: lastErrorCode === 'IP_NOT_WHITELISTED',
    recommendation,
    lastAttemptAt: lastAttemptTimestamp,
    counts: {
      products: fallbackStore.products.length,
      categories: fallbackStore.categories.length,
      orders: fallbackStore.orders.length,
      coupons: fallbackStore.coupons.length,
      reviews: fallbackStore.reviews.length,
      deliveryOptions: fallbackStore.deliveryOptions.length,
    },
  };
}

export function isMongoConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
