import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Home, 
  ShoppingBag, 
  Heart, 
  PackageCheck, 
  ShieldCheck, 
  Grid 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export const MobileDock: React.FC = () => {
  const { 
    currentPage, 
    navigateTo, 
    cartCount, 
    wishlist, 
    setIsCartOpen 
  } = useStore();

  const dockItems = [
    { id: 'home', label: 'Home', icon: Home, action: () => navigateTo('home') },
    { id: 'categories', label: 'Explore', icon: Grid, action: () => navigateTo('categories') },
    { id: 'shop', label: 'Shop', icon: ShoppingBag, action: () => navigateTo('shop') },
    { 
      id: 'cart', 
      label: 'Bag', 
      icon: ShoppingBag, 
      badge: cartCount, 
      action: () => setIsCartOpen(true) 
    },
    { 
      id: 'wishlist', 
      label: 'Saved', 
      icon: Heart, 
      badge: wishlist.length, 
      action: () => navigateTo('wishlist') 
    },
    { id: 'orders', label: 'Orders', icon: PackageCheck, action: () => navigateTo('orders') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden w-full bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] pb-[max(0.25rem,env(safe-area-inset-bottom))]">
      <nav 
        id="mobile-bottom-nav"
        className="grid grid-cols-6 items-center w-full px-1 py-1 max-w-lg mx-auto"
        aria-label="Mobile Navigation"
      >
        {dockItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              id={`bottom-nav-item-${item.id}`}
              className={`relative flex flex-col items-center justify-center py-1 px-0.5 min-h-[48px] rounded-xl transition-all duration-150 ${
                isActive 
                  ? 'text-slate-950 font-bold bg-slate-100/70' 
                  : 'text-slate-500 hover:text-slate-900 active:bg-slate-50'
              }`}
              aria-label={item.label}
            >
              {/* Active top accent indicator */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active-indicator"
                  className="absolute -top-1 w-6 h-0.5 bg-slate-950 rounded-full"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}

              <div className="relative flex items-center justify-center">
                <Icon 
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-105 stroke-[2.5]' : 'stroke-[1.75]'
                  }`} 
                />
                
                {/* Badge indicator */}
                {item.badge !== undefined && item.badge > 0 ? (
                  <span 
                    className="absolute -top-1.5 -right-2 bg-slate-950 text-white font-bold text-[9px] h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center border border-white shadow-xs"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                ) : null}
              </div>

              <span className={`text-[10px] mt-1 tracking-tight leading-none ${
                isActive ? 'font-bold text-slate-950' : 'font-medium text-slate-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
