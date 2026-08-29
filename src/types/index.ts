export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  userLocation?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  images?: string[];
  likesCount?: number;
  facebookProfileUrl?: string;
}

export interface ProductComment {
  id: string;
  userName: string;
  userAvatar?: string;
  date: string;
  text: string;
  rating?: number;
  replies?: {
    author: string;
    text: string;
    date: string;
  }[];
}

export interface Product {
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
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  tags: string[];
  sku: string;
  materials?: string[];
  dimensions?: string;
  reviews?: Review[];
  comments?: ProductComment[];
  createdAt: string;
}

export interface SubCollection {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName: string;
  itemCount: number;
  subCollections: SubCollection[];
  featured?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  selectedColor?: { name: string; hex: string };
  selectedSize?: string;
  category: string;
  sku: string;
  maxStock: number;
}

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  savedAddresses: UserAddress[];
  defaultPaymentMethod?: string;
  isGuest?: boolean;
  registeredDate?: string;
}

export interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  isDefault?: boolean;
}

export interface PaymentDetails {
  method: 'card' | 'apple_pay' | 'google_pay' | 'cod' | 'bkash' | 'paypal';
  cardLast4?: string;
  cardBrand?: string;
  transactionId?: string;
  isPaid: boolean;
}

export type OrderStatus = 'pending' | 'processing' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  date?: string;
  time?: string;
  completed: boolean;
  current: boolean;
  location?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  shippingAddress: UserAddress;
  deliveryOption: DeliveryOption;
  paymentDetails: PaymentDetails;
  status: OrderStatus;
  orderDate: string;
  estimatedDeliveryDate: string;
  trackingNumber: string;
  carrier: string;
  trackingSteps: TrackingStep[];
  isGuest: boolean;
  userId?: string;
  notes?: string;
  emailSentTo: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  badge?: string;
}

export interface FacebookReview {
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

export interface Coupon {
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

export interface StoreSettings {
  freeShippingThreshold: number;
  standardShippingRate: number;
  expressShippingRate: number;
  announcementText: string;
  showAnnouncement: boolean;
  promoCode: string;
  promoDiscountPercent: number;
  notificationEmail: string;
}

export type PageType = 
  | 'home' 
  | 'shop' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'wishlist' 
  | 'orders' 
  | 'order-detail' 
  | 'track-order' 
  | 'admin';

export interface FilterState {
  category: string;
  subCategory: string;
  minPrice: number;
  maxPrice: number;
  selectedColors: string[];
  selectedSizes: string[];
  inStockOnly: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  tag?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
