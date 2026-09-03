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
  ShieldCheck,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Zap
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface AdminOverviewProps {
  onNavigateTab: (tab: any) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const { products, orders, categories, coupons, deliveryOptions, dbStatus, refreshDBData, reconnectDB } = useStore();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isReconnecting, setIsReconnecting] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshDBData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleReconnect = async () => {
    setIsReconnecting(true);
    await reconnectDB();
    setIsReconnecting(false);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'processing' || o.status === 'confirmed');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const lowStockProducts = products.filter(p => p.stockQuantity <= 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* MongoDB Database Connection Status Banner */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-none">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            dbStatus?.connected 
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
              : dbStatus?.atlasIpWhitelistNeeded
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-slate-50 text-slate-700 border border-slate-200'
          }`}>
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900">
                {dbStatus?.connected ? 'MongoDB Atlas Active' : 'Resilient In-Memory Mode'}
              </span>
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                dbStatus?.connected
                  ? 'bg-emerald-100 text-emerald-800'
                  : dbStatus?.atlasIpWhitelistNeeded
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-800'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  dbStatus?.connected ? 'bg-emerald-500' : dbStatus?.atlasIpWhitelistNeeded ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'
                }`} />
                {dbStatus?.connected ? 'Mongoose Connected' : dbStatus?.atlasIpWhitelistNeeded ? 'Atlas IP Whitelist Required' : 'Fallback Active'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {dbStatus?.connected 
                ? `Connected to database "${dbStatus.databaseName}". Real-time cloud synchronization active.` 
                : dbStatus?.atlasIpWhitelistNeeded
                  ? 'Your MongoDB Atlas connection string was detected, but Atlas firewall requires IP whitelist permission (0.0.0.0/0).'
                  : 'Configure MONGODB_URI in Settings to connect your remote MongoDB Atlas cluster. All operations work seamlessly in fallback mode.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {dbStatus?.uriConfigured && !dbStatus?.connected && (
            <Button
              size="sm"
              variant="default"
              onClick={handleReconnect}
              disabled={isReconnecting}
              className="h-8 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium gap-1.5 shadow-none"
            >
              <Zap className={`w-3.5 h-3.5 ${isReconnecting ? 'animate-spin' : ''}`} />
              <span>{isReconnecting ? 'Connecting...' : 'Test & Connect'}</span>
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 rounded-lg border-slate-200 text-xs font-medium text-slate-700 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Data</span>
          </Button>
        </div>
      </div>

      {/* Atlas IP Whitelist Setup Assistance Card */}
      {dbStatus?.uriConfigured && !dbStatus?.connected && dbStatus?.atlasIpWhitelistNeeded && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-900">How to authorize MongoDB Atlas access</h4>
              <p className="text-slate-600 leading-relaxed">
                Cloud container environments run on dynamic IP addresses. To allow your cloud app to connect to your MongoDB Atlas cluster:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="bg-white/90 border border-amber-200/80 rounded-lg p-2.5">
              <div className="font-semibold text-slate-900 mb-0.5">1. Open Network Access</div>
              <p className="text-slate-600 text-[11px]">
                In <a href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline font-medium inline-flex items-center gap-0.5">MongoDB Atlas <ExternalLink className="w-2.5 h-2.5" /></a>, click <strong>Network Access</strong> under Security.
              </p>
            </div>

            <div className="bg-white/90 border border-amber-200/80 rounded-lg p-2.5">
              <div className="font-semibold text-slate-900 mb-0.5">2. Add IP Address</div>
              <p className="text-slate-600 text-[11px]">
                Click <strong>+ Add IP Address</strong>, then click <strong>Allow Access from Anywhere</strong> (<code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono text-[10px]">0.0.0.0/0</code>).
              </p>
            </div>

            <div className="bg-white/90 border border-amber-200/80 rounded-lg p-2.5">
              <div className="font-semibold text-slate-900 mb-0.5">3. Confirm & Connect</div>
              <p className="text-slate-600 text-[11px]">
                Click <strong>Confirm</strong>. Wait ~30 seconds for Atlas to update, then click <strong>Test & Connect</strong> above.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-[11px] text-amber-800">
            <span>✨ Zero downtime: The store is running seamlessly in resilient fallback mode with full purchasing and order processing.</span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReconnect}
              disabled={isReconnecting}
              className="h-7 bg-white border-amber-300 text-amber-900 hover:bg-amber-100 text-[11px] px-2.5"
            >
              {isReconnecting ? 'Testing Connection...' : 'Retry Connection Now'}
            </Button>
          </div>
        </div>
      )}
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Overview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Store performance and operational status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => onNavigateTab('products')}
            className="rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium"
          >
            Products
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigateTab('orders')}
            className="rounded-lg border-slate-200 text-xs font-medium text-slate-700"
          >
            Orders ({pendingOrders.length})
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white rounded-xl border-slate-200/80 shadow-none">
          <span className="text-xs font-medium text-slate-500">Revenue</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            +18.4% this month
          </p>
        </Card>

        <Card className="p-4 bg-white rounded-xl border-slate-200/80 shadow-none">
          <span className="text-xs font-medium text-slate-500">Orders</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {orders.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {pendingOrders.length} pending
          </p>
        </Card>

        <Card className="p-4 bg-white rounded-xl border-slate-200/80 shadow-none">
          <span className="text-xs font-medium text-slate-500">Products</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {products.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {categories.length} categories
          </p>
        </Card>

        <Card className="p-4 bg-white rounded-xl border-slate-200/80 shadow-none">
          <span className="text-xs font-medium text-slate-500">Coupons</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {coupons.filter(c => c.isActive).length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {coupons.reduce((sum, c) => sum + c.usedCount, 0)} redeemed
          </p>
        </Card>
      </div>

      {/* 2-Column: Recent Orders & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="p-5 bg-white rounded-xl border-slate-200/80 shadow-none">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                Recent Orders
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab('orders')}
                className="text-xs text-slate-600 hover:text-slate-900 h-auto p-0"
              >
                View all
              </Button>
            </div>

            <div className="space-y-2">
              {orders.slice(0, 4).map(order => (
                <div 
                  key={order.id}
                  onClick={() => onNavigateTab('orders')}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-slate-100"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-900">{order.orderNumber}</span>
                      <span className="text-[10px] text-slate-500 capitalize">{order.status}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{order.shippingAddress.fullName}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-900 block">{formatCurrency(order.total)}</span>
                    <span className="text-[10px] text-slate-400">{formatDate(order.orderDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Inventory (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 bg-white rounded-xl border-slate-200/80 shadow-none">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                Low Stock
              </h3>
              <span className="text-xs text-slate-500">
                {lowStockProducts.length} items
              </span>
            </div>

            {lowStockProducts.length > 0 ? (
              <div className="space-y-2">
                {lowStockProducts.slice(0, 3).map(prod => (
                  <div key={prod.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={prod.images[0]} alt="" className="w-7 h-7 object-cover rounded flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">{prod.name}</p>
                        <p className="text-[10px] text-slate-500">{prod.stockQuantity} in stock</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onNavigateTab('products')}
                      className="text-xs h-6 px-2 text-slate-700"
                    >
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">Stock levels are healthy.</p>
            )}
          </Card>
        </div>

      </div>

    </div>
  );
};
