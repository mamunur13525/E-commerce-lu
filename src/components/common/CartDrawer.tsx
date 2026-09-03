import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck,
  UserCheck,
  User
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    storeSettings,
    navigateTo,
    isGuestMode,
    setIsGuestMode,
    userProfile
  } = useStore();

  const freeShippingLeft = Math.max(0, storeSettings.freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / storeSettings.freeShippingThreshold) * 100);
  const finalTotal = Math.max(0, cartSubtotal - cartDiscount);

  const proceedToCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  const viewFullBag = () => {
    setIsCartOpen(false);
    navigateTo('cart');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              id="sidebar-cart-drawer"
              className="w-screen max-w-md bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)] border-l border-slate-100 flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-slate-900" />
                    <h3 className="text-sm font-semibold text-slate-900">Cart ({cartCount})</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCartOpen(false)}
                    className="h-7 w-7 text-slate-400 hover:text-slate-900 rounded-full"
                    aria-label="Close cart"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Free Shipping Progress Meter */}
                <div className="mt-3 bg-slate-50 rounded-lg p-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-700" />
                      {freeShippingLeft === 0 ? (
                        <span className="text-slate-900 font-medium">Free shipping unlocked</span>
                      ) : (
                        <span>Add <strong className="text-slate-900 font-medium">{formatCurrency(freeShippingLeft)}</strong> for free shipping</span>
                      )}
                    </span>
                    <span className="font-mono text-slate-500">{Math.round(freeShippingProgress)}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-slate-900 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${freeShippingProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Your bag is empty</h4>
                    <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                      Explore our timeless minimalist staples and collections.
                    </p>
                    <Button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigateTo('shop');
                      }}
                      className="mt-5 rounded-full text-xs font-bold uppercase tracking-widest"
                    >
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="py-4 first:pt-0 flex gap-4 group">
                      <div 
                        className="w-16 h-20 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border border-slate-100"
                        onClick={() => {
                          setIsCartOpen(false);
                          navigateTo('product-detail', { productId: item.productId });
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 
                              onClick={() => {
                                setIsCartOpen(false);
                                navigateTo('product-detail', { productId: item.productId });
                              }}
                              className="text-xs font-bold text-slate-900 hover:text-slate-600 transition-colors cursor-pointer truncate"
                            >
                              {item.name}
                            </h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                              className="h-6 w-6 text-slate-400 hover:text-rose-600 p-0"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>

                          {/* Variants Info */}
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                            {item.selectedColor && (
                              <span className="flex items-center gap-1">
                                <span 
                                  className="w-2 h-2 rounded-full border border-slate-300 inline-block" 
                                  style={{ backgroundColor: item.selectedColor.hex }}
                                />
                                {item.selectedColor.name}
                              </span>
                            )}
                            {item.selectedColor && item.selectedSize && <span>·</span>}
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2.5">
                          {/* Quantity Stepper */}
                          <div className="flex items-center border border-slate-200 rounded overflow-hidden bg-slate-50">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateCartQuantity(item.id, -1)}
                              className="h-6 w-6 p-0 hover:bg-slate-200 text-slate-600 rounded-none"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="px-2 text-xs font-medium text-slate-900 font-mono">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateCartQuantity(item.id, 1)}
                              disabled={item.quantity >= item.maxStock}
                              className="h-6 w-6 p-0 hover:bg-slate-200 text-slate-600 rounded-none disabled:opacity-40"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Price */}
                          <div className="text-right font-mono">
                            <span className="text-xs font-bold text-slate-900">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                            {item.originalPrice && (
                              <span className="block text-[10px] text-slate-400 line-through">
                                {formatCurrency(item.originalPrice * item.quantity)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer / Summary */}
              {cart.length > 0 && (
                <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-3">
                  {/* Financial Breakdown */}
                  <div className="space-y-1.5 text-xs text-slate-500 font-medium">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-slate-900 font-bold">{formatCurrency(cartSubtotal)}</span>
                    </div>
                    {cartDiscount > 0 && (
                      <div className="flex justify-between text-slate-900 font-semibold">
                        <span>Discount</span>
                        <span className="font-mono">-{formatCurrency(cartDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-mono text-slate-900 font-medium">
                        {freeShippingLeft === 0 ? 'FREE' : 'Calculated at Checkout'}
                      </span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between text-xs font-bold text-slate-900 pt-1">
                      <span>Estimated Total</span>
                      <span className="font-mono text-sm">{formatCurrency(finalTotal)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <Button
                      id="drawer-checkout-btn"
                      onClick={proceedToCheckout}
                      className="w-full gap-1.5 text-xs font-medium h-9 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
                    >
                      <span>Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={viewFullBag}
                      className="w-full text-xs font-medium h-8 rounded-lg text-slate-700 hover:text-slate-900 border-slate-200"
                    >
                      View Shopping Bag
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
