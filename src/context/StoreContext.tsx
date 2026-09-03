import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Category, 
  CartItem, 
  Order, 
  HeroSlide, 
  StoreSettings, 
  UserProfile, 
  PageType, 
  FilterState, 
  ToastMessage,
  DeliveryOption,
  Coupon,
  FacebookReview
} from '../types';
import { generateId } from '../lib/utils';

const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'user-1',
  name: 'Store Customer',
  email: 'customer@lumina.design',
  phone: '+1 (555) 000-0000',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  isGuest: false,
  registeredDate: new Date().toISOString().split('T')[0],
  savedAddresses: [],
};

const DEFAULT_STORE_SETTINGS: StoreSettings = {
  freeShippingThreshold: 150,
  standardShippingRate: 15,
  expressShippingRate: 25,
  announcementText: 'Complimentary worldwide carbon-neutral delivery on orders over $150',
  showAnnouncement: true,
  promoCode: '',
  promoDiscountPercent: 0,
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
    supportNote: 'Direct concierge support and bespoke architectural inquiries.',
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
    codInstructions: 'Please have the exact cash amount ready upon delivery arrival.',
  },
  imagekitConfig: {
    urlEndpoint: '',
    publicKey: '',
    privateKey: '',
  },
};

const DEFAULT_DELIVERY_OPTIONS: DeliveryOption[] = [];

interface StoreContextType {
  // Navigation
  currentPage: PageType;
  selectedProductId: string | null;
  selectedOrderId: string | null;
  navigateTo: (page: PageType, payload?: { productId?: string; orderId?: string; category?: string; query?: string }) => void;
  
  // Products & Categories
  products: Product[];
  isLoadingProducts: boolean;
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Hero & Homepage & Testimonials
  heroSlides: HeroSlide[];
  updateHeroSlides: (slides: HeroSlide[]) => void;
  facebookReviews: FacebookReview[];
  updateFacebookReviews: (reviews: FacebookReview[]) => void;
  addFacebookReview: (review: Omit<FacebookReview, 'id'>) => void;
  deleteFacebookReview: (id: string) => void;
  updateFacebookReview: (id: string, review: Partial<FacebookReview>) => void;
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: { name: string; hex: string }, selectedSize?: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  appliedPromo: string | null;
  appliedDiscountPercent: number;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  isGuestMode: boolean;
  setIsGuestMode: (isGuest: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  lastLoginTime: string | null;
  lastLogoutTime: string | null;
  loginWithEmail: (email: string, pass: string) => void;
  loginWithGoogle: () => void;
  logoutUser: () => void;
  
  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate' | 'trackingNumber' | 'carrier' | 'trackingSteps' | 'emailSentTo'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  
  // Delivery Options (Shipping Rates)
  deliveryOptions: DeliveryOption[];
  updateDeliveryOptions: (options: DeliveryOption[]) => void;
  updateDeliveryOption: (id: string, option: Partial<DeliveryOption>) => void;
  addDeliveryOption: (option: Omit<DeliveryOption, 'id'>) => void;
  deleteDeliveryOption: (id: string) => void;
  
  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponActive: (id: string) => void;
  
  // Quick View & Modals
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  
  // Search & Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  
  // Product Reviews & Comments
  addProductComment: (productId: string, comment: { userName: string; text: string; rating?: number }) => void;

  // Database Connection Status (MongoDB / Mongoose)
  dbStatus: {
    connected: boolean;
    usingFallback: boolean;
    uriConfigured: boolean;
    databaseName: string;
    error?: string | null;
    errorCode?: 'IP_NOT_WHITELISTED' | 'AUTH_FAILED' | 'TIMEOUT' | 'UNKNOWN' | null;
    atlasIpWhitelistNeeded?: boolean;
    recommendation?: string | null;
    lastAttemptAt?: string;
    counts?: {
      products: number;
      categories: number;
      orders: number;
      coupons: number;
      reviews: number;
    };
  } | null;
  refreshDBData: () => Promise<void>;
  reconnectDB: () => Promise<boolean>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Database Status
  const [dbStatus, setDbStatus] = useState<StoreContextType['dbStatus']>(null);

  // Navigation
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Clean any old mock data out of localStorage on initial boot
  useEffect(() => {
    const hasCleanedMockData = localStorage.getItem('lumina_cleaned_mock_v3');
    if (!hasCleanedMockData) {
      localStorage.removeItem('lumina_products');
      localStorage.removeItem('lumina_categories');
      localStorage.removeItem('lumina_hero_slides');
      localStorage.removeItem('lumina_fb_reviews');
      localStorage.removeItem('lumina_coupons');
      localStorage.removeItem('lumina_orders');
      localStorage.removeItem('lumina_wishlist');
      localStorage.setItem('lumina_cleaned_mock_v3', 'true');
    }
  }, []);

  // Products - Only from MongoDB
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('lumina_products');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(() => {
    const saved = localStorage.getItem('lumina_products');
    return !saved || JSON.parse(saved).length === 0;
  });

  // Categories - Only from MongoDB
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('lumina_categories');
    return saved ? JSON.parse(saved) : [];
  });

  // Hero Slides
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    const saved = localStorage.getItem('lumina_hero_slides');
    return saved ? JSON.parse(saved) : [];
  });

  // Facebook Reviews / Testimonials - Only from MongoDB
  const [facebookReviews, setFacebookReviews] = useState<FacebookReview[]>(() => {
    const saved = localStorage.getItem('lumina_fb_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  // Coupons - Only from MongoDB
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('lumina_coupons');
    return saved ? JSON.parse(saved) : [];
  });

  // Store Settings - Synced with MongoDB
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('lumina_settings');
    return saved ? JSON.parse(saved) : DEFAULT_STORE_SETTINGS;
  });

  // Delivery Options
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>(() => {
    const saved = localStorage.getItem('lumina_delivery_options');
    return saved ? JSON.parse(saved) : DEFAULT_DELIVERY_OPTIONS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lumina_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('lumina_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('lumina_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
  });
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [lastLoginTime, setLastLoginTime] = useState<string | null>(() => localStorage.getItem('lumina_last_login_time'));
  const [lastLogoutTime, setLastLogoutTime] = useState<string | null>(() => localStorage.getItem('lumina_last_logout_time'));

  const loginWithEmail = (email: string, pass: string) => {
    const timeStr = new Date().toLocaleString();
    setLastLoginTime(timeStr);
    localStorage.setItem('lumina_last_login_time', timeStr);
    setUserProfile(prev => ({ ...prev, email, name: email.split('@')[0], isGuest: false }));
    setIsGuestMode(false);
    setIsLoginModalOpen(false);
    addToast('Successfully Logged In', `Welcome back, ${email}!`, 'success');
  };

  const loginWithGoogle = () => {
    const timeStr = new Date().toLocaleString();
    setLastLoginTime(timeStr);
    localStorage.setItem('lumina_last_login_time', timeStr);
    setUserProfile(prev => ({
      ...prev,
      name: 'Google User',
      email: 'google.user@lumina.design',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      isGuest: false
    }));
    setIsGuestMode(false);
    setIsLoginModalOpen(false);
    addToast('Google Sign-In Successful', 'Logged in securely with Google account.', 'success');
  };

  const logoutUser = () => {
    const timeStr = new Date().toLocaleString();
    setLastLogoutTime(timeStr);
    localStorage.setItem('lumina_last_logout_time', timeStr);
    setIsGuestMode(true);
    addToast('Logged Out', `Logged out at ${timeStr}.`, 'info');
  };

  // Orders - Only from MongoDB
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('lumina_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Search & Filters State
  const initialFilterState: FilterState = {
    category: 'all',
    subCategory: 'all',
    minPrice: 0,
    maxPrice: 500,
    selectedColors: [],
    selectedSizes: [],
    inStockOnly: false,
    searchQuery: '',
    sortBy: 'featured',
    tag: '',
  };
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('lumina_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('lumina_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('lumina_hero_slides', JSON.stringify(heroSlides));
  }, [heroSlides]);

  useEffect(() => {
    localStorage.setItem('lumina_fb_reviews', JSON.stringify(facebookReviews));
  }, [facebookReviews]);

  useEffect(() => {
    localStorage.setItem('lumina_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('lumina_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem('lumina_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('lumina_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('lumina_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('lumina_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('lumina_delivery_options', JSON.stringify(deliveryOptions));
  }, [deliveryOptions]);

  // Synchronize with backend database (MongoDB / Mongoose)
  const refreshDBData = async () => {
    setIsLoadingProducts(true);
    try {
      const [prodRes, catRes, ordRes, coupRes, settRes, revRes, delRes, statusRes] = await Promise.allSettled([
        fetch('/api/products').then(r => r.ok ? r.json() : []),
        fetch('/api/categories').then(r => r.ok ? r.json() : []),
        fetch('/api/orders').then(r => r.ok ? r.json() : []),
        fetch('/api/coupons').then(r => r.ok ? r.json() : []),
        fetch('/api/settings').then(r => r.ok ? r.json() : null),
        fetch('/api/reviews').then(r => r.ok ? r.json() : []),
        fetch('/api/delivery-options').then(r => r.ok ? r.json() : []),
        fetch('/api/db/status').then(r => r.ok ? r.json() : null),
      ]);

      if (prodRes.status === 'fulfilled' && Array.isArray(prodRes.value)) {
        setProducts(prodRes.value);
      }
      if (catRes.status === 'fulfilled' && Array.isArray(catRes.value)) {
        setCategories(catRes.value);
      }
      if (ordRes.status === 'fulfilled' && Array.isArray(ordRes.value)) {
        setOrders(ordRes.value);
      }
      if (coupRes.status === 'fulfilled' && Array.isArray(coupRes.value)) {
        setCoupons(coupRes.value);
      }
      if (settRes.status === 'fulfilled' && settRes.value) {
        setStoreSettings(settRes.value);
      }
      if (revRes.status === 'fulfilled' && Array.isArray(revRes.value)) {
        setFacebookReviews(revRes.value);
      }
      if (delRes.status === 'fulfilled' && Array.isArray(delRes.value)) {
        setDeliveryOptions(delRes.value);
      }
      if (statusRes.status === 'fulfilled' && statusRes.value) {
        setDbStatus(statusRes.value);
      }
    } catch (err) {
      console.warn('Backend database synchronization warning:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const reconnectDB = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/db/reconnect', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
        if (data.connected) {
          addToast('Database Connected', 'Successfully connected to MongoDB Atlas cluster.');
          await refreshDBData();
          return true;
        } else {
          if (data.atlasIpWhitelistNeeded) {
            addToast('Atlas IP Whitelist Required', 'Please allow 0.0.0.0/0 in MongoDB Atlas Network Access.', 'warning');
          } else {
            addToast('Connection Attempt Failed', data.error || 'Could not connect to MongoDB.', 'warning');
          }
          return false;
        }
      }
    } catch {
      addToast('Connection Check Error', 'Unable to reach backend server.', 'error');
    }
    return false;
  };

  useEffect(() => {
    refreshDBData();
  }, []);

  // Navigation Helper
  const navigateTo = (page: PageType, payload?: { productId?: string; orderId?: string; category?: string; query?: string }) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (payload?.productId) {
      setSelectedProductId(payload.productId);
    }
    if (payload?.orderId) {
      setSelectedOrderId(payload.orderId);
    }
    if (payload?.category) {
      setFilters(prev => ({ ...prev, category: payload.category!, subCategory: 'all' }));
    }
    if (payload?.query !== undefined) {
      setFilters(prev => ({ ...prev, searchQuery: payload.query! }));
    }
    setCurrentPage(page);
  };

  // Toast Helper
  const addToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = generateId('toast');
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart Management
  const addToCart = (product: Product, quantity = 1, selectedColor?: { name: string; hex: string }, selectedSize?: string) => {
    const effectiveColor = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
    const effectiveSize = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.productId === product.id &&
                item.selectedColor?.name === effectiveColor?.name &&
                item.selectedSize === effectiveSize
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, product.stockQuantity);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        const newItem: CartItem = {
          id: generateId('cart_item'),
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images[0],
          quantity: Math.min(quantity, product.stockQuantity || 10),
          selectedColor: effectiveColor,
          selectedSize: effectiveSize,
          category: product.category,
          sku: product.sku,
          maxStock: product.stockQuantity || 10,
          allowCod: product.allowCod !== false,
          allowOnlinePayment: product.allowOnlinePayment !== false,
          product: product,
        };
        return [...prevCart, newItem];
      }
    });

    addToast(`Added to Bag`, `${product.name} has been added to your shopping bag.`);
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return { ...item, quantity: Math.min(newQty, item.maxStock) };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    addToast('Item Removed', 'The item was removed from your bag.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    setAppliedDiscountPercent(0);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartDiscount = appliedDiscountPercent > 0 ? (cartSubtotal * (appliedDiscountPercent / 100)) : 0;

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    
    // Check in custom coupons first
    const matchedCoupon = coupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);
    if (matchedCoupon) {
      if (cartSubtotal < matchedCoupon.minSpend) {
        addToast('Minimum Spend Required', `This coupon requires a minimum subtotal of $${matchedCoupon.minSpend}.`, 'warning');
        return false;
      }
      setAppliedPromo(matchedCoupon.code);
      setAppliedDiscountPercent(matchedCoupon.discountPercent);
      // Increment used count
      setCoupons(prev => prev.map(c => c.id === matchedCoupon.id ? { ...c, usedCount: c.usedCount + 1 } : c));
      addToast('Coupon Applied!', `${matchedCoupon.discountPercent}% discount activated.`);
      return true;
    }

    // Check store settings default promo
    if (cleanCode === storeSettings.promoCode.toUpperCase()) {
      setAppliedPromo(storeSettings.promoCode);
      setAppliedDiscountPercent(storeSettings.promoDiscountPercent);
      addToast('Promo Code Applied!', `${storeSettings.promoDiscountPercent}% savings unlocked.`);
      return true;
    }

    addToast('Invalid Coupon Code', 'Please verify your promo code or check our active offers.', 'error');
    return false;
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setAppliedDiscountPercent(0);
    addToast('Promo code removed', '', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('Removed from Wishlist', '', 'info');
        return prev.filter(id => id !== productId);
      } else {
        addToast('Saved to Wishlist', 'Item saved to your curated favorites.');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // User Profile
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
    addToast('Profile Updated', 'Your customer information and preferences were saved.');
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate' | 'trackingNumber' | 'carrier' | 'trackingSteps' | 'emailSentTo'>) => {
    const orderNumber = `LUM-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `TRK-LUM-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 4);

    const emailSentTo = orderData.customerEmail || 'mdshn1122@gmail.com';

    const newOrder: Order = {
      ...orderData,
      id: generateId('order'),
      orderNumber,
      orderDate: now.toISOString(),
      estimatedDeliveryDate: estDate.toISOString().split('T')[0],
      trackingNumber,
      carrier: 'Lumina Express Carbon Neutral',
      emailSentTo,
      trackingSteps: [
        {
          status: 'confirmed',
          title: 'Order Confirmed & Payment Verified',
          description: `Order receipt and invoice dispatched to ${emailSentTo}.`,
          date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: true,
          current: true,
          location: 'Lumina Global Fulfillment Hub',
        },
        {
          status: 'processing',
          title: 'Artisan Packaging & Quality Inspection',
          description: 'Items will be inspected and packed in biodegradable protective packaging.',
          completed: false,
          current: false,
        },
        {
          status: 'shipped',
          title: 'In Transit with Express Courier',
          description: 'Package scanned and in transit to local delivery hub.',
          completed: false,
          current: false,
        },
        {
          status: 'out_for_delivery',
          title: 'Out for Courier Delivery',
          description: 'Courier assigned for same-day doorstep handover.',
          completed: false,
          current: false,
        },
        {
          status: 'delivered',
          title: 'Delivered',
          description: 'Package successfully delivered.',
          completed: false,
          current: false,
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Persist to MongoDB backend
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch(err => console.warn('Order API sync warning:', err));

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const statusMap: Record<string, number> = {
          pending: 0,
          confirmed: 0,
          processing: 1,
          shipped: 2,
          out_for_delivery: 3,
          delivered: 4,
          cancelled: -1,
        };

        const targetIdx = statusMap[newStatus] ?? 0;
        const now = new Date();
        const updatedSteps = ord.trackingSteps.map((step, idx) => {
          if (idx < targetIdx) {
            return { ...step, completed: true, current: false };
          } else if (idx === targetIdx) {
            return { 
              ...step, 
              completed: true, 
              current: true, 
              date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          } else {
            return { ...step, completed: false, current: false };
          }
        });

        return {
          ...ord,
          status: newStatus,
          trackingSteps: updatedSteps,
        };
      }
      return ord;
    }));

    // Persist status change to MongoDB
    fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    }).catch(err => console.warn('Order status sync warning:', err));

    addToast('Order Status Updated', `Order ${orderId} moved to ${newStatus}.`);
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(ord => ord.id !== orderId));

    fetch(`/api/orders/${orderId}`, {
      method: 'DELETE',
    }).catch(err => console.warn('Order delete API sync warning:', err));

    addToast('Order Removed', `Order was deleted.`, 'info');
  };

  // Product CRUD for Admin
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProd: Product = {
      ...productData,
      id: generateId('prod'),
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [newProd, ...prev]);

    // Persist to MongoDB
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProd),
    }).catch(err => console.warn('Product create API sync warning:', err));

    addToast('Product Added', `${newProd.name} is now available in your catalog.`);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productData } : p));

    // Persist to MongoDB
    fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    }).catch(err => console.warn('Product update API sync warning:', err));

    addToast('Product Updated', 'Product changes saved successfully.');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));

    // Persist to MongoDB
    fetch(`/api/products/${id}`, {
      method: 'DELETE',
    }).catch(err => console.warn('Product delete API sync warning:', err));

    addToast('Product Deleted', 'The product was removed from the catalog.', 'info');
  };

  const toggleProductStock = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextInStock = !p.inStock;
        const nextQty = nextInStock ? (p.stockQuantity || 10) : 0;
        
        fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inStock: nextInStock, stockQuantity: nextQty }),
        }).catch(err => console.warn('Stock update sync warning:', err));

        return { 
          ...p, 
          inStock: nextInStock, 
          stockQuantity: nextQty
        };
      }
      return p;
    }));
  };

  // Category CRUD
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: generateId('cat'),
    };
    setCategories(prev => [...prev, newCat]);

    fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCat),
    }).catch(err => console.warn('Category create sync warning:', err));

    addToast('Category Created', `${newCat.name} was added.`);
  };

  const updateCategory = (id: string, catData: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...catData } : c));

    fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catData),
    }).catch(err => console.warn('Category update sync warning:', err));

    addToast('Category Updated', 'Category details updated.');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));

    fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    }).catch(err => console.warn('Category delete sync warning:', err));

    addToast('Category Deleted', 'Category removed.', 'info');
  };

  // Hero Slides
  const updateHeroSlides = (slides: HeroSlide[]) => {
    setHeroSlides(slides);
    addToast('Hero Customizer', 'Hero slides updated.');
  };

  // Facebook Reviews / Testimonials
  const updateFacebookReviews = (reviews: FacebookReview[]) => {
    setFacebookReviews(reviews);
    addToast('Reviews Updated', 'Customer testimonial slides saved.');
  };

  const addFacebookReview = (reviewData: Omit<FacebookReview, 'id'>) => {
    const newRev: FacebookReview = {
      ...reviewData,
      id: generateId('rev'),
    };
    setFacebookReviews(prev => [newRev, ...prev]);

    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRev),
    }).catch(err => console.warn('Review create sync warning:', err));

    addToast('Review Added', 'Customer story published.');
  };

  const deleteFacebookReview = (id: string) => {
    setFacebookReviews(prev => prev.filter(r => r.id !== id));

    fetch(`/api/reviews/${id}`, {
      method: 'DELETE',
    }).catch(err => console.warn('Review delete sync warning:', err));

    addToast('Review Deleted', 'Story removed.', 'info');
  };

  const updateFacebookReview = (id: string, reviewData: Partial<FacebookReview>) => {
    setFacebookReviews(prev => prev.map(r => r.id === id ? { ...r, ...reviewData } : r));

    fetch(`/api/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    }).catch(err => console.warn('Review update sync warning:', err));

    addToast('Review Updated', 'Testimonial updated.');
  };

  // Store Settings
  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings(prev => ({ ...prev, ...newSettings }));

    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings),
    }).catch(err => console.warn('Settings update sync warning:', err));

    addToast('Store Settings Saved', 'Global store rules and delivery thresholds updated.');
  };

  // Shipping Rates / Delivery Options
  const updateDeliveryOption = (id: string, option: Partial<DeliveryOption>) => {
    setDeliveryOptions(prev => prev.map(opt => opt.id === id ? { ...opt, ...option } : opt));

    fetch(`/api/delivery-options/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(option),
    }).catch(err => console.warn('Delivery option update API sync warning:', err));

    addToast('Shipping Rate Updated', 'Courier rate was updated.');
  };

  const addDeliveryOption = (optionData: Omit<DeliveryOption, 'id'>) => {
    const newOpt: DeliveryOption = {
      ...optionData,
      id: generateId('del'),
    };
    setDeliveryOptions(prev => [...prev, newOpt]);

    fetch('/api/delivery-options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOpt),
    }).catch(err => console.warn('Delivery option create API sync warning:', err));

    addToast('Shipping Option Added', `${newOpt.name} is now available for checkout.`);
  };

  const deleteDeliveryOption = (id: string) => {
    setDeliveryOptions(prev => prev.filter(opt => opt.id !== id));

    fetch(`/api/delivery-options/${id}`, {
      method: 'DELETE',
    }).catch(err => console.warn('Delivery option delete API sync warning:', err));

    addToast('Shipping Rate Deleted', 'Option removed from checkout.', 'info');
  };

  // Coupons CRUD
  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usedCount'>) => {
    const newCoup: Coupon = {
      ...couponData,
      id: generateId('coup'),
      usedCount: 0,
    };
    setCoupons(prev => [newCoup, ...prev]);

    fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCoup),
    }).catch(err => console.warn('Coupon create sync warning:', err));

    addToast('Coupon Created', `Promo code ${newCoup.code} created with ${newCoup.discountPercent}% discount.`);
  };

  const updateCoupon = (id: string, couponData: Partial<Coupon>) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...couponData } : c));

    fetch(`/api/coupons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(couponData),
    }).catch(err => console.warn('Coupon update sync warning:', err));

    addToast('Coupon Updated', 'Coupon rules saved.');
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));

    fetch(`/api/coupons/${id}`, {
      method: 'DELETE',
    }).catch(err => console.warn('Coupon delete sync warning:', err));

    addToast('Coupon Deleted', 'Coupon removed.', 'info');
  };

  const toggleCouponActive = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const resetFilters = () => {
    setFilters(initialFilterState);
  };

  const addProductComment = (productId: string, comment: { userName: string; text: string; rating?: number }) => {
    const newComment = {
      id: generateId('comment'),
      userName: comment.userName || 'Anonymous Buyer',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      date: 'Just now',
      text: comment.text,
      rating: comment.rating || 5,
    };

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const comments = p.comments || [];
        return {
          ...p,
          comments: [newComment, ...comments],
          reviewCount: p.reviewCount + 1,
        };
      }
      return p;
    }));
    addToast('Review Submitted', 'Thank you for sharing your feedback!');
  };

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        selectedProductId,
        selectedOrderId,
        navigateTo,
        products,
        isLoadingProducts,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        addCategory,
        updateCategory,
        deleteCategory,
        heroSlides,
        updateHeroSlides,
        facebookReviews,
        updateFacebookReviews,
        addFacebookReview,
        deleteFacebookReview,
        updateFacebookReview,
        storeSettings,
        updateStoreSettings,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        appliedPromo,
        appliedDiscountPercent,
        applyPromoCode,
        removePromoCode,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        userProfile,
        updateUserProfile,
        isGuestMode,
        setIsGuestMode,
        isLoginModalOpen,
        setIsLoginModalOpen,
        lastLoginTime,
        lastLogoutTime,
        loginWithEmail,
        loginWithGoogle,
        logoutUser,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        deliveryOptions,
        updateDeliveryOptions: setDeliveryOptions,
        updateDeliveryOption,
        addDeliveryOption,
        deleteDeliveryOption,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponActive,
        quickViewProduct,
        setQuickViewProduct,
        filters,
        setFilters,
        resetFilters,
        toasts,
        addToast,
        removeToast,
        addProductComment,
        dbStatus,
        refreshDBData,
        reconnectDB,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
