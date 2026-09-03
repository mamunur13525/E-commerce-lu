import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Lock, 
  Instagram, 
  Facebook, 
  Twitter,
  Youtube,
  Share2,
  Linkedin,
  Mail,
  Phone,
  ArrowUpRight
} from 'lucide-react';
import { Badge } from '../ui/badge';

export const Footer: React.FC = () => {
  const { navigateTo, categories, setFilters, storeSettings } = useStore();
  const { socialLinks, contactInfo } = storeSettings;

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-16 border-t border-slate-900 transition-all">
      {/* Top Value Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-slate-900">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white flex-shrink-0 border border-slate-800">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white tracking-tight">Free Carbon-Neutral Delivery</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">On all orders over ${storeSettings.freeShippingThreshold || 150}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white flex-shrink-0 border border-slate-800">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white tracking-tight">30-Day Easy Returns</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Hassle-free guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white flex-shrink-0 border border-slate-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white tracking-tight">Verified Artisan Studio</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Authentic craftsmanship</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white flex-shrink-0 border border-slate-800">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white tracking-tight">256-Bit Encrypted Payment</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Safe & secure checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Streamlined Links Section (Req 7) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white text-slate-950 flex items-center justify-center font-black text-xs">
                L
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                LUMINA
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Minimalist artisan pieces, timeless wardrobe staples, and heirloom homeware designed for intentional everyday living.
            </p>

            {/* Quick Contact snippet from Settings */}
            <div className="pt-2 text-[11px] text-slate-400 space-y-1.5 border-t border-slate-900">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href={`mailto:${contactInfo?.email || 'support@lumina.com'}`} className="hover:text-white transition-colors truncate">
                  {contactInfo?.email || 'support@lumina.com'}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href={`tel:${contactInfo?.phone || '+15552345678'}`} className="hover:text-white transition-colors">
                  {contactInfo?.phone || '+1 (555) 234-5678'}
                </a>
              </p>
            </div>
          </div>

          {/* Catalog Collections */}
          <div>
            <h6 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Shop Collections
            </h6>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, category: 'all' }));
                    navigateTo('shop');
                  }}
                  className="hover:text-white transition-colors"
                >
                  All Products
                </button>
              </li>
              {categories.slice(0, 4).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, category: cat.slug, subCategory: 'all' }));
                      navigateTo('shop', { category: cat.slug });
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Portal */}
          <div>
            <h6 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Customer Portal
            </h6>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors flex items-center gap-1.5 font-medium text-slate-200">
                  <span>Contact Concierge</span>
                  <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1.5 rounded-sm">Support</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('track-order')} className="hover:text-white transition-colors">
                  Track Order
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('orders')} className="hover:text-white transition-colors">
                  My Orders & Receipts
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('wishlist')} className="hover:text-white transition-colors">
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('cart')} className="hover:text-white transition-colors">
                  Shopping Cart
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Store Admin */}
          <div>
            <h6 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Store Administration
            </h6>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Manage inventory, shipping rules, coupons, categories, and customer orders.
            </p>
            <button
              onClick={() => navigateTo('admin')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition-colors"
            >
              <span>Admin Dashboard</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <p>© 2026 Lumina Studio Archive. All rights reserved.</p>
          <div className="flex items-center gap-3 text-[11px]">
            <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">Contact Us</button>
            <button onClick={() => navigateTo('terms')} className="hover:text-white transition-colors">Terms</button>
            <button onClick={() => navigateTo('privacy')} className="hover:text-white transition-colors">Privacy</button>
          </div>
        </div>

        {/* Payment Badges */}
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
          <Badge variant="outline" className="bg-slate-900 border-slate-800 text-slate-300">VISA</Badge>
          <Badge variant="outline" className="bg-slate-900 border-slate-800 text-slate-300">MASTERCARD</Badge>
          <Badge variant="outline" className="bg-slate-900 border-slate-800 text-slate-300">AMEX</Badge>
          <Badge variant="outline" className="bg-slate-900 border-slate-800 text-slate-300">APPLE PAY</Badge>
        </div>

        {/* Dynamic Social Links from Admin Settings */}
        <div className="flex items-center gap-3 text-slate-400">
          {socialLinks?.instagram && (
            <a 
              href={socialLinks.instagram} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors p-1" 
              aria-label="Instagram"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {socialLinks?.facebook && (
            <a 
              href={socialLinks.facebook} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors p-1" 
              aria-label="Facebook"
              title="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {socialLinks?.twitter && (
            <a 
              href={socialLinks.twitter} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors p-1" 
              aria-label="Twitter"
              title="Twitter / X"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
          {socialLinks?.youtube && (
            <a 
              href={socialLinks.youtube} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors p-1" 
              aria-label="YouTube"
              title="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          )}
          {socialLinks?.pinterest && (
            <a 
              href={socialLinks.pinterest} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors p-1" 
              aria-label="Pinterest"
              title="Pinterest"
            >
              <Share2 className="w-4 h-4" />
            </a>
          )}
          {socialLinks?.tiktok && (
            <a 
              href={socialLinks.tiktok} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors p-1" 
              aria-label="TikTok"
              title="TikTok"
            >
              <Share2 className="w-4 h-4" />
            </a>
          )}
          {socialLinks?.linkedin && (
            <a 
              href={socialLinks.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors p-1" 
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};
