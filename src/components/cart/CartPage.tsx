import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  Tag, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  User,
  ArrowLeft
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartCount, 
    cartSubtotal, 
    cartDiscount, 
    appliedPromo, 
    applyPromoCode, 
    removePromoCode, 
    storeSettings, 
    navigateTo,
    isGuestMode,
    setIsGuestMode,
    userProfile,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [orderNote, setOrderNote] = useState('');

  const freeShippingLeft = Math.max(0, storeSettings.freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / storeSettings.freeShippingThreshold) * 100);
  const finalTotal = Math.max(0, cartSubtotal - cartDiscount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
      setPromoInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-[#fdfdfd] min-h-[70vh] py-16 flex items-center justify-center border-b border-slate-100">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-4 border border-slate-100">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Your shopping bag is empty</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Discover fine merino knitwear, Japanese stoneware, and Italian leather accessories.
          </p>
          <Button
            onClick={() => navigateTo('shop')}
            className="mt-6 rounded-lg font-bold text-xs uppercase tracking-wider"
          >
            Explore Catalog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfdfd] min-h-screen py-8 sm:py-12 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
              <span>Shopping Bag Review</span>
              <span>·</span>
              <span>{cartCount} Items</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Review Your Selections
            </h1>
          </div>

          <Button
            variant="ghost"
            onClick={() => navigateTo('shop')}
            className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 gap-1.5 p-0 hover:bg-transparent"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Button>
        </div>

        {/* 2-Column Layout: Left (Items Table) | Right (Summary) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Free Shipping Meter Banner */}
            <Card className="p-4 border-slate-100">
              <div className="flex items-center justify-between text-xs font-medium text-slate-800 mb-2">
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-slate-900" />
                  {freeShippingLeft === 0 ? (
                    <strong className="text-slate-900 font-bold">Congratulations! You unlocked Free Carbon-Neutral Shipping</strong>
                  ) : (
                    <span>Add <strong>{formatCurrency(freeShippingLeft)}</strong> more to receive <strong>Free Delivery</strong></span>
                  )}
                </span>
                <span className="font-bold font-mono">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-900 rounded-full transition-all duration-500" 
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </Card>

            {/* User Profile / Guest Mode Banner */}
            <Card className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border-slate-100">
              <div className="flex items-center gap-2.5">
                {isGuestMode ? (
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <User className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-900">
                    <UserCheck className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-900">
                    {isGuestMode ? 'Guest Checkout Active' : `Shopping as ${userProfile.name}`}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    {isGuestMode ? 'No account required. Fast email confirmation.' : `Saved addresses and fast card billing enabled (${userProfile.email})`}
                  </p>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsGuestMode(!isGuestMode)}
                className="text-xs font-bold uppercase tracking-wider whitespace-nowrap"
              >
                {isGuestMode ? 'Switch to Saved Profile' : 'Switch to Guest'}
              </Button>
            </Card>

            {/* Cart Items Table */}
            <Card className="p-5 divide-y divide-slate-100 border-slate-100">
              {cart.map(item => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-24 sm:w-20 sm:h-24 object-cover rounded-xl bg-slate-50 border border-slate-100 cursor-pointer"
                      onClick={() => navigateTo('product-detail', { productId: item.productId })}
                    />
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {item.category} · {item.sku}
                      </span>
                      <h3
                        onClick={() => navigateTo('product-detail', { productId: item.productId })}
                        className="text-sm sm:text-base font-bold text-slate-900 hover:text-slate-600 cursor-pointer"
                      >
                        {item.name}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        {item.selectedColor && (
                          <span className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: item.selectedColor.hex }} />
                            {item.selectedColor.name}
                          </span>
                        )}
                        {item.selectedColor && item.selectedSize && <span>·</span>}
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      </div>

                      <div className="font-mono text-xs font-bold text-slate-900 sm:hidden pt-0.5">
                        {formatCurrency(item.price)} each
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="p-1.5 hover:bg-slate-100 text-slate-700 transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="p-1.5 hover:bg-slate-100 text-slate-700 transition-colors disabled:opacity-40"
                        aria-label="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total Price for item */}
                    <div className="text-right font-mono min-w-[80px]">
                      <span className="text-sm sm:text-base font-bold text-slate-900 block">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatCurrency(item.originalPrice * item.quantity)}
                        </span>
                      )}
                    </div>

                    {/* Remove */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </Card>

            {/* Special Instructions / Order Note */}
            <Card className="p-5 border-slate-100">
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Special Delivery Instructions or Gift Note (Optional)
              </label>
              <textarea
                rows={2}
                value={orderNote}
                onChange={e => setOrderNote(e.target.value)}
                placeholder="e.g. Leave package by side porch, or write a bespoke gift message..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
              />
            </Card>
          </div>

          {/* Right Column: Sticky Summary & Checkout Action */}
          <Card className="lg:col-span-4 p-6 sticky top-28 space-y-6 border-slate-100">
            <h3 className="text-base font-extrabold tracking-tight text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Promo Code Form */}
            <div>
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Promotional Voucher
              </label>
              {!appliedPromo ? (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      type="text"
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value)}
                      placeholder="Try LUMINA15"
                      className="pl-8 uppercase font-mono bg-slate-50"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    className="font-bold text-xs uppercase tracking-wider"
                  >
                    Apply
                  </Button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-900">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {appliedPromo} (-{storeSettings.promoDiscountPercent}%)
                  </span>
                  <Button variant="link" size="sm" onClick={removePromoCode} className="p-0 h-auto font-bold uppercase text-[10px]">
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Financial Calculations */}
            <div className="space-y-2 text-xs text-slate-600 font-medium pt-1">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono text-slate-900 font-semibold">{formatCurrency(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-slate-900 font-bold">
                  <span>Promotional Discount</span>
                  <span className="font-mono">-{formatCurrency(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-mono text-slate-900 font-semibold">
                  {freeShippingLeft === 0 ? 'FREE' : '$8.00 (Standard)'}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1">
                <span>Total Amount</span>
                <span className="font-mono text-lg">{formatCurrency(finalTotal + (freeShippingLeft === 0 ? 0 : 8))}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              id="cart-proceed-to-checkout"
              size="lg"
              onClick={() => navigateTo('checkout')}
              className="w-full gap-2 rounded-lg uppercase tracking-wider text-xs font-bold"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="text-center space-y-1.5 pt-1">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                <span>Encrypted 256-Bit Payment Gateway</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Taxes calculated and confirmed on order dispatch.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
