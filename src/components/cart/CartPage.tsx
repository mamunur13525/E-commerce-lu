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
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Shopping Bag
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </p>
          </div>

          <Button
            variant="ghost"
            onClick={() => navigateTo('shop')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 gap-1.5 p-0 hover:bg-transparent"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Button>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Free Shipping Meter */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-700 mb-2">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-700" />
                  {freeShippingLeft === 0 ? (
                    <span className="font-medium text-slate-900">Free shipping unlocked</span>
                  ) : (
                    <span>Add <strong className="text-slate-900 font-medium">{formatCurrency(freeShippingLeft)}</strong> for free shipping</span>
                  )}
                </span>
                <span className="text-xs font-mono text-slate-500">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-900 rounded-full transition-all duration-300" 
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items Table */}
            <Card className="p-4 divide-y divide-slate-100 border-slate-200/80 shadow-none rounded-xl">
              {cart.map(item => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded-lg bg-slate-50 cursor-pointer flex-shrink-0"
                      onClick={() => navigateTo('product-detail', { productId: item.productId })}
                    />
                    <div className="space-y-0.5">
                      <h3
                        onClick={() => navigateTo('product-detail', { productId: item.productId })}
                        className="text-sm font-medium text-slate-900 hover:text-slate-600 cursor-pointer"
                      >
                        {item.name}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        {item.selectedColor && (
                          <span>{item.selectedColor.name}</span>
                        )}
                        {item.selectedColor && item.selectedSize && <span>·</span>}
                        {item.selectedSize && <span>Size {item.selectedSize}</span>}
                      </div>

                      <div className="font-mono text-xs text-slate-900 sm:hidden pt-0.5">
                        {formatCurrency(item.price)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="p-1 hover:bg-slate-50 text-slate-600 transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-mono text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="p-1 hover:bg-slate-50 text-slate-600 transition-colors disabled:opacity-40"
                        aria-label="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total Price for item */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-xs font-semibold text-slate-900 block">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>

                    {/* Remove */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-600 hover:bg-transparent w-7 h-7"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Right Column: Sticky Summary */}
          <Card className="lg:col-span-4 p-5 sticky top-24 space-y-5 border-slate-200/80 shadow-none rounded-xl">
            <h3 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-100">
              Summary
            </h3>

            {/* Promo Code Form */}
            <div>
              {!appliedPromo ? (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <Input
                      type="text"
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value)}
                      placeholder="Promo code"
                      className="pl-7 text-xs uppercase bg-slate-50 h-8 rounded-lg"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    className="text-xs h-8 px-3 rounded-lg"
                  >
                    Apply
                  </Button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg text-xs text-slate-900">
                  <span className="text-xs font-medium">
                    {appliedPromo} (-{storeSettings.promoDiscountPercent}%)
                  </span>
                  <Button variant="link" size="sm" onClick={removePromoCode} className="p-0 h-auto text-xs text-slate-500 hover:text-slate-900">
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Financial Calculations */}
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-900 font-medium">{formatCurrency(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-slate-900">
                  <span>Discount</span>
                  <span>-{formatCurrency(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-slate-900 font-medium">
                  {freeShippingLeft === 0 ? 'Free' : '$8.00'}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1">
                <span>Total</span>
                <span>{formatCurrency(finalTotal + (freeShippingLeft === 0 ? 0 : 8))}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              id="cart-proceed-to-checkout"
              onClick={() => navigateTo('checkout')}
              className="w-full gap-2 rounded-lg text-xs font-medium h-10 bg-slate-900 text-white hover:bg-slate-800"
            >
              <span>Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
