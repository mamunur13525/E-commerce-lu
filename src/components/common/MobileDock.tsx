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
    { id: 'shop', label: 'Shop', icon: Grid, action: () => navigateTo('shop') },
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
    { id: 'admin', label: 'Admin', icon: ShieldCheck, action: () => navigateTo('admin') },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4 md:hidden pointer-events-none">
      <nav 
        id="mobile-dock-nav"
        className="pointer-events-auto flex items-center justify-between gap-1 bg-slate-950 text-white px-3 py-1.5 rounded-full shadow-2xl border border-slate-800 max-w-sm w-full"
      >
        {dockItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={item.action}
              id={`dock-item-${item.id}`}
              className="relative flex flex-col items-center justify-center p-1.5 h-auto rounded-full hover:bg-white/10 text-white group"
              aria-label={item.label}
            >
              {/* Active pill background */}
              {isActive && (
                <motion.div
                  layoutId="dock-active-pill"
                  className="absolute inset-0 bg-white/15 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative">
                <Icon 
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`} 
                />
                
                {/* Badge indicator */}
                {item.badge !== undefined && item.badge > 0 ? (
                  <Badge 
                    variant="secondary"
                    className="absolute -top-1.5 -right-2 bg-white text-slate-950 font-bold text-[8px] h-3.5 min-w-[14px] px-1 rounded-full flex items-center justify-center border border-slate-900"
                  >
                    {item.badge}
                  </Badge>
                ) : null}
              </div>

              <span className={`text-[9px] mt-0.5 tracking-wider uppercase font-bold ${
                isActive ? 'text-white' : 'text-slate-400'
              }`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </nav>
    </div>
  );
};
