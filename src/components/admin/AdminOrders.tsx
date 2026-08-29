import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShoppingBag, 
  Search, 
  Eye, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MapPin, 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  DollarSign,
  Package,
  ShieldCheck,
  Send
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Order, OrderStatus } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '../ui/sheet';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, addToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [newTrackingNumber, setNewTrackingNumber] = useState('');

  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setNewTrackingNumber(order.trackingNumber || '');
    setIsDetailsOpen(true);
  };

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status } : null);
    }
    addToast('Order Status Updated', `Order status changed to ${status.toUpperCase()}`, 'success');
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-emerald-600 text-white font-bold text-[10px] uppercase">Delivered</Badge>;
      case 'shipped':
      case 'out_for_delivery':
        return <Badge className="bg-blue-600 text-white font-bold text-[10px] uppercase">In Transit</Badge>;
      case 'processing':
      case 'confirmed':
        return <Badge className="bg-amber-500 text-slate-950 font-bold text-[10px] uppercase">Processing</Badge>;
      case 'cancelled':
        return <Badge className="bg-rose-600 text-white font-bold text-[10px] uppercase">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] uppercase">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-950">
            Customer Orders & Fulfillment
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View orders, inspect customer shipping details, update dispatch status and tracking codes.
          </p>
        </div>

        <Badge variant="outline" className="font-mono text-xs px-3 py-1 bg-white border-slate-200">
          Total Orders: {orders.length}
        </Badge>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by order #, customer name, email, or tracking ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50 rounded-xl text-xs h-10 border-slate-200"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 h-10 focus:outline-none"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="processing">Processing / Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="bg-white rounded-3xl border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map(order => (
                <tr 
                  key={order.id} 
                  onClick={() => handleOpenDetails(order)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-black text-slate-950 block">{order.orderNumber}</span>
                    <span className="text-[10px] text-slate-400">{formatDate(order.orderDate)}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{order.customerName}</p>
                    <p className="text-[10px] text-slate-400">{order.customerEmail}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-700">{order.items.length} items</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-black text-slate-950">
                    {formatCurrency(order.total)}
                  </td>

                  <td className="py-3.5 px-4">
                    {getStatusBadge(order.status)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetails(order);
                      }}
                      className="rounded-xl text-xs font-bold h-8"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span>Details</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Full Details Right Drawer */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col h-full bg-white shadow-2xl border-l border-slate-200">
          {selectedOrder && (
            <div className="flex flex-col h-full overflow-hidden">
              
              <SheetHeader className="p-6 pb-4 border-b border-slate-100 bg-white sticky top-0 z-10 space-y-1">
                <div className="flex items-center justify-between pr-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order Inspection</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <SheetTitle className="text-xl font-black font-mono text-slate-950">
                  {selectedOrder.orderNumber}
                </SheetTitle>
                <SheetDescription className="text-xs text-slate-500">
                  Placed on {formatDate(selectedOrder.orderDate)} · Carrier: {selectedOrder.carrier}
                </SheetDescription>
              </SheetHeader>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#fafaf9]">
                {/* Status Update Quick Control */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                    Update Order Status
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(selectedOrder.id, st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                          selectedOrder.status === st 
                            ? 'bg-slate-950 text-white shadow-xs' 
                            : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Purchased Items List */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                    Ordered Items ({selectedOrder.items.length})
                  </h4>
                  <div className="divide-y divide-slate-100">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt="" className="w-11 h-11 object-cover rounded-xl bg-slate-50 border border-slate-200" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              Qty: {item.quantity} {item.selectedSize ? `· Size: ${item.selectedSize}` : ''}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address & Contact */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2 text-xs">
                  <h4 className="font-bold uppercase text-[10px] text-slate-400 tracking-wider">Shipping Destination</h4>
                  <p className="font-bold text-slate-900">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-slate-600 text-[11px]">{selectedOrder.shippingAddress.street}</p>
                  <p className="text-slate-600 text-[11px]">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                    <p>Email: <span className="text-slate-900 font-medium">{selectedOrder.customerEmail}</span></p>
                    <p>Phone: <span className="text-slate-900 font-medium">{selectedOrder.customerPhone || selectedOrder.shippingAddress.phone}</span></p>
                    <p>Tracking Code: <span className="font-mono font-bold text-slate-900">{selectedOrder.trackingNumber}</span></p>
                  </div>
                </div>

                {/* Order Financial Breakdown */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery Charge</span>
                    <span>{formatCurrency(selectedOrder.deliveryCharge)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between font-black text-sm text-slate-950">
                    <span>Total Paid</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              <SheetFooter className="p-4 sm:p-6 bg-white border-t border-slate-200 sticky bottom-0 z-10">
                <Button
                  onClick={() => setIsDetailsOpen(false)}
                  className="w-full rounded-xl bg-slate-950 text-white font-bold text-xs uppercase tracking-wider h-11"
                >
                  Close Inspection
                </Button>
              </SheetFooter>

            </div>
          )}
        </SheetContent>
      </Sheet>

    </div>
  );
};
