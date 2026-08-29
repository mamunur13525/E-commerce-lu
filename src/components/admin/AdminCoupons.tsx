import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Ticket, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Percent, 
  Calendar, 
  DollarSign,
  Copy
} from 'lucide-react';
import { Coupon } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';

export const AdminCoupons: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, addToast } = useStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form
  const [formCode, setFormCode] = useState('');
  const [formDiscount, setFormDiscount] = useState<number>(15);
  const [formMinSpend, setFormMinSpend] = useState<number>(50);
  const [formExpiry, setFormExpiry] = useState('2026-12-31');
  const [formUsageLimit, setFormUsageLimit] = useState<number>(500);
  const [formDescription, setFormDescription] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setFormCode('SAVE15');
    setFormDiscount(15);
    setFormMinSpend(50);
    setFormExpiry('2026-12-31');
    setFormUsageLimit(500);
    setFormDescription('15% off all seasonal garments');
    setFormIsActive(true);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setFormCode(c.code);
    setFormDiscount(c.discountPercent);
    setFormMinSpend(c.minSpend);
    setFormExpiry(c.expiryDate);
    setFormUsageLimit(c.usageLimit || 500);
    setFormDescription(c.description || '');
    setFormIsActive(c.isActive);
    setIsDrawerOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim()) return;

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, {
        code: formCode.trim().toUpperCase(),
        discountPercent: Number(formDiscount),
        minSpend: Number(formMinSpend),
        expiryDate: formExpiry,
        usageLimit: Number(formUsageLimit),
        description: formDescription.trim(),
        isActive: formIsActive,
      });
      addToast('Coupon Updated', `Coupon ${formCode.toUpperCase()} saved.`, 'success');
    } else {
      addCoupon({
        code: formCode.trim().toUpperCase(),
        discountPercent: Number(formDiscount),
        minSpend: Number(formMinSpend),
        expiryDate: formExpiry,
        usageLimit: Number(formUsageLimit),
        usedCount: 0,
        isActive: formIsActive,
        description: formDescription.trim(),
      });
      addToast('Coupon Created', `New coupon code ${formCode.toUpperCase()} created.`, 'success');
    }

    setIsDrawerOpen(false);
  };

  const handleDelete = (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete coupon code "${code}"?`)) {
      deleteCoupon(id);
      addToast('Coupon Deleted', `${code} deleted.`, 'info');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    addToast('Code Copied', `Coupon code "${code}" copied to clipboard.`, 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-950">
            Promotional Coupons & Vouchers
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create percentage discounts, minimum cart spend requirements, and usage limits.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300 font-black text-xs uppercase tracking-wider gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Coupon Code</span>
        </Button>
      </div>

      {/* Coupon Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(coupon => (
          <Card 
            key={coupon.id}
            className="p-5 bg-white rounded-3xl border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm font-black text-slate-950 tracking-wider">
                        {coupon.code}
                      </span>
                      <button 
                        onClick={() => handleCopyCode(coupon.code)}
                        className="text-slate-400 hover:text-slate-900"
                        title="Copy code"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400">Expires {coupon.expiryDate}</span>
                  </div>
                </div>

                <Badge className={coupon.isActive ? 'bg-emerald-500 text-white font-bold text-[9px]' : 'bg-slate-200 text-slate-600 text-[9px]'}>
                  {coupon.isActive ? 'Active' : 'Disabled'}
                </Badge>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-3 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Discount Value</span>
                  <span className="text-emerald-600 font-mono">{coupon.discountPercent}% OFF</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Minimum Spend</span>
                  <span className="font-mono">{formatCurrency(coupon.minSpend)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Total Redemptions</span>
                  <span className="font-mono font-bold text-slate-800">{coupon.usedCount} uses</span>
                </div>
              </div>

              {coupon.description && (
                <p className="text-xs text-slate-600 italic">"{coupon.description}"</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-slate-100">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenEdit(coupon)}
                className="rounded-xl text-xs font-bold h-8"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1" />
                <span>Edit</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(coupon.id, coupon.code)}
                className="rounded-xl text-xs font-bold h-8 text-rose-600 hover:bg-rose-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Sheet */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-6">
          <SheetHeader className="pb-4 border-b border-slate-200">
            <SheetTitle className="text-xl font-black text-slate-950">
              {editingCoupon ? 'Edit Coupon Parameters' : 'Create New Promo Coupon'}
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-500">
              Set discount %, minimum order spend, and activation status.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-5">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Coupon Promo Code
              </label>
              <Input
                required
                value={formCode}
                onChange={e => setFormCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER25"
                className="bg-slate-50 rounded-xl text-xs font-mono font-bold uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Discount (%)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={formDiscount}
                  onChange={e => setFormDiscount(Number(e.target.value))}
                  className="bg-slate-50 rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Min Spend ($)
                </label>
                <Input
                  type="number"
                  min="0"
                  required
                  value={formMinSpend}
                  onChange={e => setFormMinSpend(Number(e.target.value))}
                  className="bg-slate-50 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Expiration Date
                </label>
                <Input
                  type="date"
                  required
                  value={formExpiry}
                  onChange={e => setFormExpiry(e.target.value)}
                  className="bg-slate-50 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Max Redemptions
                </label>
                <Input
                  type="number"
                  value={formUsageLimit}
                  onChange={e => setFormUsageLimit(Number(e.target.value))}
                  className="bg-slate-50 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Campaign Description
              </label>
              <textarea
                rows={2}
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                placeholder="Internal or customer banner note..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={formIsActive}
                onChange={e => setFormIsActive(e.target.checked)}
                className="rounded"
              />
              <span>Activate Coupon Immediately</span>
            </label>

            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <Button
                type="submit"
                className="flex-1 rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-wider h-11"
              >
                <span>{editingCoupon ? 'Save Coupon' : 'Create Coupon'}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-xl text-xs font-bold h-11"
              >
                Cancel
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

    </div>
  );
};
