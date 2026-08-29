import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Truck, 
  Plus, 
  Edit3, 
  Trash2, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Check, 
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import { DeliveryOption } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';

export const AdminShipping: React.FC = () => {
  const { 
    deliveryOptions, 
    addDeliveryOption, 
    updateDeliveryOption, 
    deleteDeliveryOption,
    storeSettings,
    updateStoreSettings,
    addToast 
  } = useStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<DeliveryOption | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formEstimatedDays, setFormEstimatedDays] = useState('3-5 Business Days');
  const [formIsDefault, setFormIsDefault] = useState(false);

  // Store Threshold State
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(storeSettings.freeShippingThreshold);

  const handleOpenAdd = () => {
    setEditingOption(null);
    setFormName('Standard Ground Courier');
    setFormDescription('Carbon-neutral parcel delivery with online tracking');
    setFormPrice(15);
    setFormEstimatedDays('3-5 Business Days');
    setFormIsDefault(false);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (option: DeliveryOption) => {
    setEditingOption(option);
    setFormName(option.name);
    setFormDescription(option.description);
    setFormPrice(option.price);
    setFormEstimatedDays(option.estimatedDays);
    setFormIsDefault(!!option.isDefault);
    setIsDrawerOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingOption) {
      updateDeliveryOption(editingOption.id, {
        name: formName.trim(),
        description: formDescription.trim(),
        price: Number(formPrice),
        estimatedDays: formEstimatedDays.trim(),
        isDefault: formIsDefault,
      });
      addToast('Shipping Rate Updated', `${formName} rate saved.`, 'success');
    } else {
      addDeliveryOption({
        name: formName.trim(),
        description: formDescription.trim(),
        price: Number(formPrice),
        estimatedDays: formEstimatedDays.trim(),
        isDefault: formIsDefault,
      });
      addToast('Shipping Option Added', `${formName} added to checkout methods.`, 'success');
    }

    setIsDrawerOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (deliveryOptions.length <= 1) {
      addToast('Cannot Delete', 'You must maintain at least one shipping method.', 'error');
      return;
    }
    if (confirm(`Are you sure you want to remove shipping method "${name}"?`)) {
      deleteDeliveryOption(id);
      addToast('Shipping Option Removed', `${name} deleted.`, 'info');
    }
  };

  const handleUpdateThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({ freeShippingThreshold: Number(freeShippingThreshold) });
    addToast('Threshold Saved', `Free shipping threshold updated to ${formatCurrency(freeShippingThreshold)}.`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-950">
            Shipping Rates & Delivery Options
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure checkout carrier tiers, delivery windows, pricing, and free shipping triggers.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300 font-black text-xs uppercase tracking-wider gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shipping Option</span>
        </Button>
      </div>

      {/* Free Shipping Rule Banner */}
      <Card className="p-5 bg-white rounded-3xl border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-950">Automatic Free Shipping Threshold</h3>
            <p className="text-xs text-slate-500">Orders exceeding this total qualify for complimentary delivery.</p>
          </div>
        </div>

        <form onSubmit={handleUpdateThreshold} className="flex items-center gap-2">
          <div className="relative">
            <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="number"
              min="0"
              value={freeShippingThreshold}
              onChange={e => setFreeShippingThreshold(Number(e.target.value))}
              className="pl-7 w-28 bg-slate-50 rounded-xl text-xs font-mono font-bold"
            />
          </div>
          <Button type="submit" size="sm" className="rounded-xl text-xs font-bold bg-slate-950 text-white hover:bg-slate-800">
            Save Rule
          </Button>
        </form>
      </Card>

      {/* Shipping Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deliveryOptions.map(option => (
          <Card 
            key={option.id}
            className="p-5 bg-white rounded-3xl border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 font-bold">
                  {option.price === 0 ? <Zap className="w-4 h-4 text-emerald-600" /> : <Truck className="w-4 h-4" />}
                </div>

                {option.isDefault && (
                  <Badge className="bg-slate-950 text-white font-bold text-[9px]">
                    Default Selection
                  </Badge>
                )}
              </div>

              <h3 className="text-base font-black text-slate-950">{option.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{option.description}</p>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 mt-4 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Rate Fee</span>
                  <span className="font-mono text-sm font-black text-slate-950">
                    {option.price === 0 ? 'FREE' : formatCurrency(option.price)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Estimated Delivery</span>
                  <span className="font-medium text-slate-700">{option.estimatedDays}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-slate-100">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenEdit(option)}
                className="rounded-xl text-xs font-bold h-8"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1" />
                <span>Edit</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(option.id, option.name)}
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
              {editingOption ? 'Edit Shipping Tier' : 'Add Shipping Method'}
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-500">
              Set customer carrier label, fee amount, and estimated transit days.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-5">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Tier Name
              </label>
              <Input
                required
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="e.g. Express Air Priority"
                className="bg-slate-50 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Shipping Fee ($)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formPrice}
                  onChange={e => setFormPrice(Number(e.target.value))}
                  className="bg-slate-50 rounded-xl text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  Estimated Days
                </label>
                <Input
                  required
                  value={formEstimatedDays}
                  onChange={e => setFormEstimatedDays(e.target.value)}
                  placeholder="1-2 Business Days"
                  className="bg-slate-50 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Customer Description
              </label>
              <textarea
                rows={3}
                required
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                placeholder="Next-day courier with signature verification..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={formIsDefault}
                onChange={e => setFormIsDefault(e.target.checked)}
                className="rounded"
              />
              <span>Set as Default Checkout Option</span>
            </label>

            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <Button
                type="submit"
                className="flex-1 rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-wider h-11"
              >
                <span>{editingOption ? 'Save Changes' : 'Create Shipping Option'}</span>
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
