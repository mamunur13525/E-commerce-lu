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
    { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
    { id: 'products', label: 'Products & Inventory', icon: Package, count: products.length },
    { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, count: orders.length, alert: orders.filter(o => o.status === 'processing' || o.status === 'confirmed').length },
    { id: 'categories', label: 'Categories & Depts', icon: Layers, count: categories.length },
    { id: 'coupons', label: 'Promo Coupons', icon: Ticket, count: coupons.length },
    { id: 'shipping', label: 'Shipping Rates', icon: Truck, count: deliveryOptions.length },
    { id: 'settings', label: 'Hero & Testimonials', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 z-30 flex-shrink-0">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
            L
          </div>
          <div>
            <span className="font-black text-base text-white tracking-tight block">LUMINA ADMIN</span>
            <span className="text-[9px] uppercase font-bold text-amber-400 tracking-widest block">Studio Operations</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2">
          Management
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive 
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.alert && item.alert > 0 ? (
                  <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                    {item.alert}
                  </span>
                ) : null}
                {item.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}>
                    {item.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Return Action */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <button
          onClick={() => navigateTo('home')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-xs border border-slate-700"
        >
          <Store className="w-3.5 h-3.5 text-amber-300" />
          <span>Exit to Customer Store</span>
        </button>
      </div>

    </aside>
  );
};
