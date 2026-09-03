import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Truck, 
  Search, 
  CheckCircle2, 
  Package, 
  MapPin, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Copy, 
  Check, 
  ShieldCheck, 
  ExternalLink,
  Info,
  CornerDownRight,
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Order } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';

export const TrackOrderPage: React.FC = () => {
  const { orders, navigateTo, addToast } = useStore();
  const [trackingInput, setTrackingInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);

  const [isSearching, setIsSearching] = useState(false);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = trackingInput.trim().toUpperCase();
    if (!cleanQuery) return;

    setHasSearched(true);
    setIsSearching(true);

    // First check in-memory store
    const localFound = orders.find(
      o => o.orderNumber.toUpperCase() === cleanQuery ||
           o.trackingNumber.toUpperCase() === cleanQuery ||
           o.id.toUpperCase() === cleanQuery
    );

    if (localFound) {
      setSearchedOrder(localFound);
      setIsSearching(false);
      addToast('Order Located', `Found tracking records for ${localFound.orderNumber}.`, 'success');
      return;
    }

    // Direct database lookup
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(cleanQuery)}`);
      if (res.ok) {
        const orderFromDb: Order = await res.json();
        setSearchedOrder(orderFromDb);
        addToast('Order Located', `Found tracking records for ${orderFromDb.orderNumber} from database.`, 'success');
      } else {
        setSearchedOrder(null);
        addToast('No Order Found', 'Please check the order or tracking number and try again.', 'error');
      }
    } catch {
      setSearchedOrder(null);
      addToast('Search Error', 'Unable to retrieve order from server.', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTracking(true);
    addToast('Copied to Clipboard', text, 'info');
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'processing':
      case 'confirmed':
        return 'bg-amber-500/10 text-amber-600 border-amber-200';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-[#fafaf9] min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-widest uppercase mb-3">
            <Truck className="w-3.5 h-3.5 text-amber-300" />
            <span>Real-Time Logistics Portal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950">
            Track Your Consignment
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-3 leading-relaxed">
            Enter your Lumina order reference (e.g. <span className="font-mono font-semibold text-slate-700">LUM-98241</span>) or courier tracking number to inspect real-time linehaul progress.
          </p>
        </div>

        {/* Search Box Input Card */}
        <Card className="p-4 sm:p-6 bg-white rounded-3xl shadow-xl border-slate-200/80 mb-10">
          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <Input
                id="track-order-input"
                type="text"
                value={trackingInput}
                onChange={e => setTrackingInput(e.target.value)}
                placeholder="Paste Order Number (e.g., LUM-98241) or Tracking ID..."
                className="pl-12 h-13 text-sm rounded-2xl bg-slate-50 border-slate-200 focus-visible:bg-white font-medium"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-13 px-8 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-wider"
            >
              Track Package <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>
        </Card>

        {/* Tracking Details Display */}
        {searchedOrder ? (
          <div className="space-y-8 animate-in fade-in-50 duration-300">
            
            {/* Status Hero Card */}
            <Card className="p-0 bg-white rounded-3xl shadow-sm border-slate-200/60 overflow-hidden">
              <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusBadgeVariant(searchedOrder.status)}`}>
                      {searchedOrder.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Order <span className="font-mono text-slate-900 font-bold">#{searchedOrder.orderNumber}</span>
                    </span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 mb-2">
                    {searchedOrder.status === 'delivered' ? 'Delivered on ' : 'Expected '} 
                    <span className="text-amber-500">{searchedOrder.estimatedDeliveryDate}</span>
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium mt-4">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                      <span>{searchedOrder.carrier}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 text-emerald-700">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Carbon Neutral Transit</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-2 min-w-[260px]">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Tracking Number
                  </span>
                  <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <span className="font-mono text-sm font-bold text-slate-900 tracking-wider">{searchedOrder.trackingNumber}</span>
                    <button
                      onClick={() => copyToClipboard(searchedOrder.trackingNumber)}
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                      title="Copy Tracking ID"
                    >
                      {copiedTracking ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Steps Timeline */}
              <div className="bg-slate-950 p-6 sm:p-8 text-white relative overflow-hidden">
                <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2 relative z-10">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Live Journey Milestones
                </div>

                <div className="space-y-0 relative z-10">
                  {searchedOrder.trackingSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-6 relative group pb-8 last:pb-0">
                      {/* Timeline vertical connector */}
                      {idx < searchedOrder.trackingSteps.length - 1 && (
                        <div 
                          className={`absolute left-3 top-8 bottom-0 w-0.5 -translate-x-1/2 rounded-full ${
                            step.completed ? 'bg-amber-400' : 'bg-slate-800'
                          }`} 
                        />
                      )}

                      {/* Icon Circle */}
                      <div className={`relative w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                        step.current 
                          ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/20' 
                          : step.completed 
                            ? 'bg-amber-400 text-slate-950' 
                            : 'bg-slate-900 text-slate-500 border-2 border-slate-800'
                      }`}>
                        {step.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : step.current ? (
                          <div className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50 hover:bg-slate-900 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h4 className={`text-sm font-bold ${
                            step.current ? 'text-amber-400' : step.completed ? 'text-white' : 'text-slate-500'
                          }`}>
                            {step.title}
                          </h4>
                          {step.date && (
                            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded-lg">
                              <Calendar className="w-3 h-3" />
                              {step.date} <span className="text-slate-600">|</span> {step.time}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {step.description}
                        </p>
                        {step.location && (
                          <p className={`text-xs mt-2 flex items-center gap-1.5 ${step.current || step.completed ? 'text-slate-300' : 'text-slate-600'}`}>
                            <MapPin className="w-3.5 h-3.5 opacity-70" />
                            {step.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Consignment Items & Destination */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Manifest Items List (7 cols) */}
              <div className="md:col-span-7">
                <Card className="p-6 bg-white rounded-3xl border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                      Consignment Items ({searchedOrder.items.length})
                    </h3>
                    <span className="text-xs text-slate-500">Order Date: {formatDate(searchedOrder.orderDate)}</span>
                  </div>

                  <div className="space-y-3">
                    {searchedOrder.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-14 h-14 object-cover rounded-xl border border-slate-200/60 bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Qty: <span className="font-semibold text-slate-900">{item.quantity}</span>
                            {item.selectedColor && ` · Color: ${item.selectedColor.name}`}
                            {item.selectedSize && ` · Size: ${item.selectedSize}`}
                          </p>
                          <span className="font-mono text-xs font-bold text-slate-900 mt-1 block">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span>Total Amount Paid</span>
                    <span className="font-mono text-base font-black text-slate-950">
                      {formatCurrency(searchedOrder.total)}
                    </span>
                  </div>
                </Card>
              </div>

              {/* Delivery Details & Recipient (5 cols) */}
              <div className="md:col-span-5 space-y-6">
                <Card className="p-6 bg-white rounded-3xl border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>Delivery Address</span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-900">{searchedOrder.shippingAddress.fullName}</p>
                    <p>{searchedOrder.shippingAddress.street}</p>
                    <p>{searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.state} {searchedOrder.shippingAddress.postalCode}</p>
                    <p>{searchedOrder.shippingAddress.country}</p>
                    <p className="text-slate-400 mt-2 font-mono">Recipient Phone: {searchedOrder.shippingAddress.phone}</p>
                  </div>
                </Card>

                <Card className="p-6 bg-amber-500/10 border-amber-200 rounded-3xl text-amber-950">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Lumina Transit Guarantee</h4>
                      <p className="text-[11px] text-amber-800/90 mt-1 leading-relaxed">
                        All consignments are fully insured against loss or breakage. Signature verification is required upon handover.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

            </div>

          </div>
        ) : hasSearched ? (
          <Card className="p-12 text-center bg-white rounded-3xl border-slate-200/80 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No consignment records found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2">
              We couldn't match "{trackingInput}" with any dispatched order in our system. Please check your confirmation email or order history.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" onClick={() => navigateTo('orders')}>
                View My Orders
              </Button>
              <Button onClick={() => navigateTo('shop')}>
                Browse Shop
              </Button>
            </div>
          </Card>
        ) : null}

      </div>
    </div>
  );
};
