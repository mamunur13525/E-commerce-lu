import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Mail, 
  Printer, 
  Search, 
  RotateCcw, 
  ChevronRight, 
  ArrowRight,
  MapPin,
  CreditCard,
  Receipt,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  Eye,
  Copy,
  Check,
  Clock
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '../../lib/utils';
import { Order } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '../ui/sheet';

export const OrdersPage: React.FC = () => {
  const { orders, navigateTo, addToCart, addToast } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter(order => {
    const matchStatus = statusFilter === 'all' || order.status === statusFilter;
    if (!matchStatus) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(q) ||
      order.shippingAddress.fullName.toLowerCase().includes(q) ||
      order.items.some(i => i.name.toLowerCase().includes(q))
    );
  });

  const openOrderSheet = (order: Order) => {
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      addToCart(
        {
          id: item.productId,
          name: item.name,
          slug: item.name.toLowerCase().replace(/\s+/g, '-'),
          sku: item.sku,
          price: item.price,
          category: item.category,
          subCategory: 'all',
          description: '',
          images: [item.image],
          tags: [],
          rating: 4.9,
          reviewCount: 10,
          inStock: true,
          stockQuantity: 20,
          isFeatured: true,
          isBestSeller: false,
          isNewArrival: false,
          isPopular: true,
          createdAt: new Date().toISOString(),
        },
        item.quantity,
        item.selectedColor,
        item.selectedSize
      );
    });
    addToast('Items Added to Bag', `Re-added ${order.items.length} items from ${order.orderNumber}.`, 'success');
    setIsSheetOpen(false);
    navigateTo('cart');
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] uppercase font-bold tracking-wider">Delivered</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-600 text-white hover:bg-blue-700 text-[10px] uppercase font-bold tracking-wider">In Transit</Badge>;
      case 'out_for_delivery':
        return <Badge className="bg-purple-600 text-white hover:bg-purple-700 text-[10px] uppercase font-bold tracking-wider">Out for Delivery</Badge>;
      case 'processing':
        return <Badge className="bg-amber-500 text-slate-950 hover:bg-amber-600 text-[10px] uppercase font-bold tracking-wider">Processing</Badge>;
      case 'confirmed':
        return <Badge className="bg-slate-900 text-white text-[10px] uppercase font-bold tracking-wider">Confirmed</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">{status}</Badge>;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-[#fafaf9] min-h-[70vh] py-16 flex items-center justify-center border-b border-slate-100">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 mx-auto mb-4 border border-slate-200">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">No orders placed yet</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Your purchases and shipment tracking will appear here as soon as you checkout.
          </p>
          <Button
            onClick={() => navigateTo('shop')}
            className="mt-6 rounded-full px-8 bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-wider"
          >
            Start Shopping Catalog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fafaf9] min-h-screen py-8 sm:py-12 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              <span>Account Order Portal</span>
              <span>·</span>
              <span>{orders.length} Placed Orders</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              My Orders & Receipts
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Click any order to view full invoice, shipping journey, and item specifics in the side panel.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search order # or item..."
                className="bg-white pl-9 w-60 text-xs rounded-xl h-10 border-slate-200"
              />
            </div>
            
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
              {['all', 'shipped', 'delivered'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-colors ${
                    statusFilter === st ? 'bg-slate-950 text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List Cards */}
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <Card
              key={order.id}
              onClick={() => openOrderSheet(order)}
              className="p-5 sm:p-6 bg-white rounded-2xl border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-400 transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-mono font-bold text-xs">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-slate-950">
                        {order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Placed on {formatDate(order.orderDate)} · Est. Delivery: {order.estimatedDeliveryDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
                    <span className="font-mono text-base font-black text-slate-950">
                      {formatCurrency(order.total)}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs font-bold group-hover:bg-slate-950 group-hover:text-white transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Items Thumbnail Bar */}
              <div className="pt-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 overflow-x-auto py-1">
                  {order.items.map(item => (
                    <div 
                      key={item.id}
                      className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg bg-white border border-slate-200/60"
                      />
                      <div className="pr-2">
                        <p className="text-[11px] font-bold text-slate-800 truncate max-w-[120px] sm:max-w-[160px]">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Qty: {item.quantity} · {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <span className="hidden md:inline-block text-xs font-semibold text-slate-400 whitespace-nowrap">
                  {order.deliveryOption.name}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Right-Side shadcn Sheet Drawer for Selected Order Details */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col h-full bg-white shadow-2xl border-l border-slate-200">
            {selectedOrder && (
              <div className="flex flex-col h-full overflow-hidden">
                
                {/* 1. Sheet Header */}
                <SheetHeader className="p-6 pb-4 border-b border-slate-100 bg-white sticky top-0 z-10 space-y-1">
                  <div className="flex items-center justify-between pr-8">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Order Details
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {formatDate(selectedOrder.orderDate)}
                      </span>
                    </div>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  
                  <SheetTitle className="text-xl font-black font-mono text-slate-950 flex items-center gap-2">
                    <span>{selectedOrder.orderNumber}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedOrder.orderNumber);
                        addToast('Copied', 'Order reference copied to clipboard.', 'info');
                      }}
                      className="text-slate-400 hover:text-slate-900 transition-colors p-1 rounded-md hover:bg-slate-100"
                      title="Copy Order Number"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </SheetTitle>

                  <SheetDescription className="text-xs text-slate-500">
                    Dispatched to <span className="font-semibold text-slate-700">{selectedOrder.customerEmail}</span>
                  </SheetDescription>
                </SheetHeader>

                {/* 2. Sheet Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#fafaf9]">
                  
                  {/* Carrier & Live Tracking Card */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-bold text-slate-900">{selectedOrder.trackingNumber}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(selectedOrder.trackingNumber);
                              addToast('Copied', 'Tracking number copied.', 'info');
                            }}
                            className="text-slate-400 hover:text-slate-900 transition-colors"
                            title="Copy Tracking ID"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Carrier: <span className="font-semibold text-slate-700">{selectedOrder.carrier}</span> · Est. Delivery: <span className="font-semibold text-slate-700">{selectedOrder.estimatedDeliveryDate}</span>
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsSheetOpen(false);
                        navigateTo('track-order');
                      }}
                      className="text-xs font-bold rounded-xl border-amber-300 bg-amber-50/50 text-amber-900 hover:bg-amber-100 hover:text-amber-950 h-8 self-start sm:self-auto"
                    >
                      <span>Track Live</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </div>

                  {/* Shipment Milestones Timeline */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Shipment Milestones</span>
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {selectedOrder.deliveryOption.name}
                      </span>
                    </div>

                    <div className="space-y-4 pl-1 pt-1">
                      {selectedOrder.trackingSteps.map((step, idx) => {
                        const isLast = idx === selectedOrder.trackingSteps.length - 1;
                        return (
                          <div key={idx} className="flex items-start gap-3 relative group">
                            {!isLast && (
                              <div
                                className={cn(
                                  "absolute left-3 top-6 bottom-0 w-0.5 -translate-x-1/2",
                                  step.completed ? "bg-amber-400" : "bg-slate-200"
                                )}
                              />
                            )}
                            <div
                              className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-[10px] font-bold transition-all",
                                step.current
                                  ? "bg-amber-400 text-slate-950 ring-4 ring-amber-100 shadow-xs"
                                  : step.completed
                                  ? "bg-amber-400 text-slate-950"
                                  : "bg-slate-100 border border-slate-200 text-slate-400"
                              )}
                            >
                              {step.completed ? (
                                <Check className="w-3 h-3 stroke-[2.5]" />
                              ) : (
                                <span>{idx + 1}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                              <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                                <span className={cn("font-bold", step.completed || step.current ? "text-slate-900" : "text-slate-400")}>
                                  {step.title}
                                </span>
                                {step.date && (
                                  <span className="text-[10px] font-medium text-slate-400">{step.date}</span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ordered Items List */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-slate-500" />
                        <span>Ordered Items ({selectedOrder.items.length})</span>
                      </h4>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="py-3 first:pt-1 last:pb-1 flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-xl bg-slate-50 border border-slate-200/80 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate leading-snug">{item.name}</p>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                Qty: {item.quantity}
                              </span>
                              {item.selectedSize && (
                                <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                  Size: {item.selectedSize}
                                </span>
                              )}
                              {item.selectedColor && (
                                <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.selectedColor.hex }} />
                                  {item.selectedColor.name}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 pl-2">
                            <span className="font-mono text-xs font-black text-slate-950 block">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {formatCurrency(item.price)} ea
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery & Payment Breakdown Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Shipping Destination */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>Shipping Address</span>
                      </div>
                      <p className="font-bold text-slate-900">{selectedOrder.shippingAddress.fullName}</p>
                      <p className="text-slate-600 text-[11px] leading-snug">{selectedOrder.shippingAddress.street}</p>
                      <p className="text-slate-600 text-[11px] leading-snug">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                      </p>
                      {selectedOrder.shippingAddress.phone && (
                        <p className="text-slate-500 text-[10px] pt-1">Tel: {selectedOrder.shippingAddress.phone}</p>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        <CreditCard className="w-3 h-3 text-slate-500" />
                        <span>Payment Details</span>
                      </div>
                      <p className="font-bold text-slate-900 capitalize">
                        {selectedOrder.paymentDetails.method.replace('_', ' ')}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-semibold text-emerald-600">Payment Authorized</span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-400 pt-1">
                        Ref: {selectedOrder.paymentDetails.transactionId || `TXN-${selectedOrder.orderNumber.replace(/\D/g, '')}`}
                      </p>
                    </div>
                  </div>

                  {/* Payment & Charges Financial Breakdown */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2 text-xs">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Payment & Charges
                    </h4>
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal ({selectedOrder.items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                      <span className="font-mono font-medium text-slate-900">{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Promotional Discount</span>
                        <span className="font-mono">-{formatCurrency(selectedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>Delivery ({selectedOrder.deliveryOption.name})</span>
                      <span className="font-mono font-medium text-slate-900">
                        {selectedOrder.deliveryCharge === 0 ? 'FREE' : formatCurrency(selectedOrder.deliveryCharge)}
                      </span>
                    </div>
                    <Separator className="my-1.5" />
                    <div className="flex justify-between items-baseline pt-1">
                      <div>
                        <span className="text-xs font-black text-slate-950 uppercase tracking-wider">Total Amount</span>
                        <span className="text-[10px] text-slate-400 block font-normal">All taxes and fees included</span>
                      </div>
                      <span className="font-mono text-lg font-black text-slate-950">
                        {formatCurrency(selectedOrder.total)}
                      </span>
                    </div>
                  </div>

                </div>

                {/* 3. Sheet Footer */}
                <SheetFooter className="p-4 sm:p-6 bg-white border-t border-slate-200 sticky bottom-0 z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <Button
                    variant="outline"
                    onClick={() => {
                      addToast('Printing Receipt', `Preparing invoice for ${selectedOrder.orderNumber}...`, 'info');
                      window.print();
                    }}
                    className="rounded-xl h-11 px-4 text-xs font-bold border-slate-200 hover:bg-slate-50 gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Invoice</span>
                  </Button>

                  <Button
                    onClick={() => handleReorder(selectedOrder)}
                    className="flex-1 bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl h-11 gap-1.5 shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder All Items</span>
                  </Button>
                </SheetFooter>

              </div>
            )}
          </SheetContent>
        </Sheet>

      </div>
    </div>
  );
};
