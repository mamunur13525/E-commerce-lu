import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  Truck, 
  ArrowUpRight, 
  Star, 
  Sparkles,
  Ticket,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface AdminOverviewProps {
  onNavigateTab: (tab: any) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const { products, orders, categories, coupons, deliveryOptions } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'processing' || o.status === 'confirmed');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const lowStockProducts = products.filter(p => p.stockQuantity <= 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Store Command Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome to Lumina Archive Admin
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Real-time fulfillment metrics, inventory stock control, shipping rate tables, and promotional campaign controls.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Button
            onClick={() => onNavigateTab('products')}
            className="rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 font-black text-xs uppercase tracking-wider"
          >
            Manage Products
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigateTab('orders')}
            className="rounded-xl bg-slate-900 border-slate-700 text-white hover:bg-slate-800 text-xs font-bold"
          >
            Review Orders ({pendingOrders.length})
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <Card className="p-5 bg-white rounded-2xl border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-2xl sm:text-3xl font-black text-slate-950">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% this month
          </p>
        </Card>

        <Card className="p-5 bg-white rounded-2xl border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Customer Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-2xl sm:text-3xl font-black text-slate-950">
            {orders.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            <span className="text-amber-600 font-bold">{pendingOrders.length} pending</span> · {deliveredOrders.length} fulfilled
          </p>
        </Card>

        <Card className="p-5 bg-white rounded-2xl border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Catalog SKUs</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-2xl sm:text-3xl font-black text-slate-950">
            {products.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Across {categories.length} departments
          </p>
        </Card>

        <Card className="p-5 bg-white rounded-2xl border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Coupons</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-2xl sm:text-3xl font-black text-slate-950">
            {coupons.filter(c => c.isActive).length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {coupons.reduce((sum, c) => sum + c.usedCount, 0)} total coupon redemptions
          </p>
        </Card>
      </div>

      {/* 2-Column: Recent Orders & Quick Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="p-5 sm:p-6 bg-white rounded-3xl border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-950">
                  Recent Customer Orders
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Latest transactions from customer storefront</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab('orders')}
                className="text-xs font-bold text-slate-900"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="space-y-2.5">
              {orders.slice(0, 4).map(order => (
                <div 
                  key={order.id}
                  onClick={() => onNavigateTab('orders')}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-900 text-xs">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-950">{order.orderNumber}</span>
                        <Badge variant="outline" className="text-[9px] uppercase font-bold py-0">{order.status}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-400">{order.shippingAddress.fullName} · {order.items.length} items</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-black text-slate-950 block">{formatCurrency(order.total)}</span>
                    <span className="text-[10px] text-slate-400">{formatDate(order.orderDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Inventory & Quick Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-5 sm:p-6 bg-white rounded-3xl border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-950">
                Low Stock Alerts
              </h3>
              <Badge variant="secondary" className="text-[10px] font-bold">
                {lowStockProducts.length} Items
              </Badge>
            </div>

            {lowStockProducts.length > 0 ? (
              <div className="space-y-2">
                {lowStockProducts.slice(0, 3).map(prod => (
                  <div key={prod.id} className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/60 border border-rose-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={prod.images[0]} alt="" className="w-8 h-8 object-cover rounded-lg flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{prod.name}</p>
                        <p className="text-[10px] text-rose-600 font-bold font-mono">Only {prod.stockQuantity} remaining</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onNavigateTab('products')}
                      className="text-[10px] font-bold h-7 px-2"
                    >
                      Restock
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">All inventory levels healthy.</p>
            )}
          </Card>

          {/* Quick System Navigation Cards */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigateTab('coupons')}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-400 text-left transition-all group"
            >
              <Ticket className="w-5 h-5 text-amber-500 mb-1.5 group-hover:scale-110 transition-transform" />
              <h4 className="text-xs font-bold text-slate-900">Manage Coupons</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{coupons.length} Discount Codes</p>
            </button>

            <button
              onClick={() => onNavigateTab('shipping')}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-400 text-left transition-all group"
            >
              <Truck className="w-5 h-5 text-blue-500 mb-1.5 group-hover:scale-110 transition-transform" />
              <h4 className="text-xs font-bold text-slate-900">Shipping Rates</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{deliveryOptions.length} Carriers & Rates</p>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
