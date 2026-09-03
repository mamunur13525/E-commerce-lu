import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCategories } from './AdminCategories';
import { AdminCoupons } from './AdminCoupons';
import { AdminShipping } from './AdminShipping';
import { AdminSettings } from './AdminSettings';
import { 
  Store, 
  Bell, 
  Search, 
  Menu, 
  X,
  User,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export const AdminPage: React.FC = () => {
  const { navigateTo, orders, products } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'categories' | 'coupons' | 'shipping' | 'settings'>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const pendingCount = orders.filter(o => o.status === 'processing' || o.status === 'confirmed').length;

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview onNavigateTab={setActiveTab} />;
      case 'products':
        return <AdminProducts />;
      case 'orders':
        return <AdminOrders />;
      case 'categories':
        return <AdminCategories />;
      case 'coupons':
        return <AdminCoupons />;
      case 'shipping':
        return <AdminShipping />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex text-slate-900 selection:bg-amber-400 selection:text-slate-950 font-sans">
      
      {/* 1. Dedicated Desktop Left Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
            onClick={() => setIsMobileSidebarOpen(false)} 
          />
          <div className="relative z-10 w-56 h-full bg-slate-950 shadow-2xl">
            <AdminSidebar 
              activeTab={activeTab} 
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsMobileSidebarOpen(false);
              }} 
            />
          </div>
        </div>
      )}

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Dedicated Admin Top Navigation Header */}
        <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between shadow-xs">
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden rounded-xl"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div>
              <h1 className="text-sm sm:text-base font-black text-slate-950 capitalize tracking-tight flex items-center gap-2">
                <span>{activeTab === 'overview' ? 'Command Overview' : activeTab}</span>
                <span className="text-[10px] text-slate-400 font-normal uppercase tracking-widest hidden sm:inline">
                  · Lumina Admin
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Storefront return */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateTo('home')}
              className="rounded-xl text-xs font-bold border-slate-300 hover:bg-slate-900 hover:text-white transition-colors gap-1.5 h-9"
            >
              <Store className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Live Storefront</span>
            </Button>

            {/* Quick Order Alert */}
            {pendingCount > 0 && (
              <button
                onClick={() => setActiveTab('orders')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold transition-all hover:bg-amber-100"
              >
                <Bell className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                <span>{pendingCount} Pending</span>
              </button>
            )}

            {/* Admin Profile Chip */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-950 text-white font-bold flex items-center justify-center text-xs">
                A
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight">Master Admin</span>
                <span className="text-[9px] text-emerald-600 font-bold block">Online</span>
              </div>
            </div>
          </div>

        </header>

        {/* Dynamic Admin Sub-View */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderActiveTab()}
        </main>

      </div>

    </div>
  );
};
