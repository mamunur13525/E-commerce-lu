import React from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  Layers, 
  Ticket, 
  Truck, 
  Sliders, 
  ArrowLeft, 
  ShieldCheck,
  Store,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Badge } from '../ui/badge';

interface AdminSidebarProps {
  activeTab: 'overview' | 'products' | 'orders' | 'categories' | 'coupons' | 'shipping' | 'settings';
  setActiveTab: (tab: 'overview' | 'products' | 'orders' | 'categories' | 'coupons' | 'shipping' | 'settings') => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { products, orders, categories, coupons, deliveryOptions, navigateTo } = useStore();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package, count: products.length },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length, alert: orders.filter(o => o.status === 'processing' || o.status === 'confirmed').length },
    { id: 'categories', label: 'Categories', icon: Layers, count: categories.length },
    { id: 'coupons', label: 'Coupons', icon: Ticket, count: coupons.length },
    { id: 'shipping', label: 'Shipping', icon: Truck, count: deliveryOptions.length },
    { id: 'settings', label: 'Content & Settings', icon: Sliders },
  ];

  return (
    <aside className="w-56 bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 z-30 flex-shrink-0">
      
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
            L
          </div>
          <span className="font-semibold text-sm text-white tracking-tight">Admin Console</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-2.5 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive 
                  ? 'bg-white/10 text-white font-semibold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.alert && item.alert > 0 ? (
                  <span className="bg-amber-400 text-slate-950 text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                    {item.alert}
                  </span>
                ) : null}
                {item.count !== undefined && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    {item.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Return Action */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={() => navigateTo('home')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-all border border-slate-800"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </button>
      </div>

    </aside>
  );
};
