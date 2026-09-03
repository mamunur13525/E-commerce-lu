import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShieldCheck, 
  Truck, 
  Lock, 
  CheckCircle2, 
  ArrowLeft, 
  User, 
  DollarSign, 
  MapPin, 
  Tag,
  X,
  Check
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import confetti from 'canvas-confetti';
import { generateId } from '../../lib/utils';
import { UserAddress, PaymentDetails } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    products,
    cartSubtotal, 
    cartDiscount, 
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    storeSettings, 
    deliveryOptions, 
    userProfile, 
    isGuestMode, 
    setIsGuestMode, 
    createOrder, 
    navigateTo, 
    addToast 
  } = useStore();

  // Delivery Method Selection
  const defaultDelivery = deliveryOptions.find(d => d.isDefault) || deliveryOptions[0];
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string>(defaultDelivery?.id || '');

  // Keep selected delivery option in sync when fetched from database
  useEffect(() => {
    if (!selectedDeliveryId && deliveryOptions.length > 0) {
      const def = deliveryOptions.find(d => d.isDefault) || deliveryOptions[0];
      if (def) setSelectedDeliveryId(def.id);
    }
  }, [deliveryOptions, selectedDeliveryId]);

  // Contact & Shipping Form State (Full Name, Email, Phone, then City, Upazila, Special Note)
  const [fullName, setFullName] = useState(isGuestMode ? '' : userProfile.name);
  const [email, setEmail] = useState(isGuestMode ? '' : userProfile.email);
  const [phone, setPhone] = useState(isGuestMode ? '' : userProfile.phone);
  const [street, setStreet] = useState(isGuestMode ? '' : userProfile.savedAddresses[0]?.street || '');
  const [city, setCity] = useState(isGuestMode ? '' : userProfile.savedAddresses[0]?.city || '');
  const [upazila, setUpazila] = useState(isGuestMode ? '' : userProfile.savedAddresses[0]?.upazila || '');
  const [specialNote, setSpecialNote] = useState(isGuestMode ? '' : userProfile.savedAddresses[0]?.specialNote || '');
  const [state, setState] = useState(isGuestMode ? '' : userProfile.savedAddresses[0]?.state || '');
  const [zipCode, setZipCode] = useState(isGuestMode ? '' : userProfile.savedAddresses[0]?.postalCode || '');
  const [country, setCountry] = useState(isGuestMode ? '' : userProfile.savedAddresses[0]?.country || 'Bangladesh');

  // Coupon code input state
  const [couponInput, setCouponInput] = useState('');

  // Payment Method: COD only as requested
  const paymentMethod = 'cod' as const;
  const [isProcessing, setIsProcessing] = useState(false);

  // Delivery charge calculation
  const chosenDelivery = deliveryOptions.find(d => d.id === selectedDeliveryId) || deliveryOptions[0];
  const isEligibleForFreeShipping = storeSettings.freeShippingThreshold > 0 && cartSubtotal >= storeSettings.freeShippingThreshold;
  const deliveryCharge = chosenDelivery 
    ? (chosenDelivery.isDefault && isEligibleForFreeShipping ? 0 : chosenDelivery.price)
    : 0;

  const finalGrandTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryCharge);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyPromoCode(couponInput.trim());
    setCouponInput('');
  };

  const handleAutofillProfile = () => {
    setIsGuestMode(false);
    setFullName(userProfile.name);
    setEmail(userProfile.email);
    setPhone(userProfile.phone);
    if (userProfile.savedAddresses[0]) {
      setStreet(userProfile.savedAddresses[0].street);
      setCity(userProfile.savedAddresses[0].city);
      setUpazila(userProfile.savedAddresses[0].upazila || '');
      setState(userProfile.savedAddresses[0].state);
      setZipCode(userProfile.savedAddresses[0].postalCode);
      setSpecialNote(userProfile.savedAddresses[0].specialNote || '');
    }
    addToast('Profile loaded', 'Autofilled saved addresses & preferences.');
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      addToast('Cart is empty', 'Add items before checking out.');
      return;
    }

    if (!fullName || !email || !phone || !city || !upazila || !street) {
      addToast('Missing Details', 'Please complete Full Name, Email, Phone, City, Upazila and Street Address.');
      return;
    }

    setIsProcessing(true);

    const shippingAddress: UserAddress = {
      id: generateId('addr'),
      fullName,
      phone,
      street,
      city,
      upazila,
      state: state || city,
      postalCode: zipCode || '1000',
      country: country || 'Bangladesh',
      specialNote,
      isDefault: true,
    };

    const paymentDetails: PaymentDetails = {
      method: 'cod',
      transactionId: `TXN-COD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      isPaid: false,
    };

    setTimeout(() => {
      // Create order
      const newOrder = createOrder({
        customerName: fullName,
        customerEmail: email || 'mdshn1122@gmail.com',
        customerPhone: phone,
        items: [...cart],
        subtotal: cartSubtotal,
        discount: cartDiscount,
        deliveryCharge,
        total: finalGrandTotal,
        shippingAddress,
        deliveryOption: chosenDelivery,
        paymentDetails,
        status: 'confirmed',
        estimatedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isGuest: isGuestMode,
      });

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }

      setIsProcessing(false);
      navigateTo('orders', { orderId: newOrder.id });
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="bg-[#fdfdfd] min-h-[70vh] py-16 flex items-center justify-center border-b border-slate-100">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">No items in checkout</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Please add items to your cart before proceeding to the checkout portal.
          </p>
          <Button
            onClick={() => navigateTo('shop')}
            className="mt-6 rounded-lg font-bold text-xs uppercase tracking-wider"
          >
            Go to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfdfd] min-h-screen py-8 sm:py-12 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Back link */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Checkout
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your shipping and payment details.
            </p>
          </div>

          <Button
            variant="ghost"
            onClick={() => navigateTo('cart')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 gap-1.5 p-0 hover:bg-transparent"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Bag</span>
          </Button>
        </div>

        {/* 2-Column Responsive Form & Summary */}
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* 1. Contact & Shipping Address */}
            <Card className="p-5 space-y-4 border-slate-200/80 shadow-none rounded-xl">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>1. Shipping Address</span>
                {!isGuestMode && userProfile.savedAddresses.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleAutofillProfile}
                    className="text-[11px] h-6 px-2 text-slate-600 hover:text-slate-900"
                  >
                    Autofill Saved
                  </Button>
                )}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="bg-slate-50 text-xs h-9 rounded-lg border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className="bg-slate-50 text-xs h-9 rounded-lg border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. +880 1700 000000"
                    className="bg-slate-50 text-xs h-9 rounded-lg border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Dhaka"
                    className="bg-slate-50 text-xs h-9 rounded-lg border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">
                    Upazila / Area <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    value={upazila}
                    onChange={e => setUpazila(e.target.value)}
                    placeholder="e.g. Dhanmondi / Upazila"
                    className="bg-slate-50 text-xs h-9 rounded-lg border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">
                    Street Address <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    placeholder="House, Road, Area"
                    className="bg-slate-50 text-xs h-9 rounded-lg border-slate-200"
                  />
                </div>

                <div className="sm:col-span-2 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">
                      State / Province
                    </label>
                    <Input
                      type="text"
                      value={state}
                      onChange={e => setState(e.target.value)}
                      placeholder="State"
                      className="bg-slate-50 text-xs h-9 rounded-lg border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">
                      Postal / Zip Code
                    </label>
                    <Input
                      type="text"
                      value={zipCode}
                      onChange={e => setZipCode(e.target.value)}
                      placeholder="Zip code"
                      className="bg-slate-50 text-xs h-9 rounded-lg border-slate-200"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-600 block mb-1">
                    Special Note / Delivery Instructions (Optional)
                  </label>
                  <Input
                    type="text"
                    value={specialNote}
                    onChange={e => setSpecialNote(e.target.value)}
                    placeholder="e.g. Fragile item, please call before delivery"
                    className="bg-slate-50 text-xs h-9 rounded-lg border-slate-200"
                  />
                </div>
              </div>
            </Card>

            {/* 2. Delivery Method */}
            <Card className="p-5 space-y-3 border-slate-200/80 shadow-none rounded-xl">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                2. Delivery Method
              </h3>

              <div className="space-y-2">
                {deliveryOptions.map(option => {
                  const isSelected = selectedDeliveryId === option.id;
                  const isComplimentary = option.id === 'del-std' && isEligibleForFreeShipping;

                  return (
                    <label
                      key={option.id}
                      onClick={() => setSelectedDeliveryId(option.id)}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-slate-900 bg-slate-50/70' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="delivery-method"
                          checked={isSelected}
                          onChange={() => setSelectedDeliveryId(option.id)}
                          className="accent-slate-900 w-3.5 h-3.5"
                        />
                        <div>
                          <p className="text-xs font-medium text-slate-900">{option.name}</p>
                          <p className="text-[11px] text-slate-400">{option.estimatedDays}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-semibold text-slate-900">
                          {isComplimentary ? 'Free' : formatCurrency(option.price)}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </Card>

            {/* 3. Payment Method (Simplified to Cash on Delivery as requested) */}
            <Card className="p-5 space-y-3.5 border-slate-200/80 shadow-none rounded-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                  3. Payment Method
                </h3>
                <span className="text-[10px] text-slate-500 font-medium">
                  Cash on Delivery
                </span>
              </div>

              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <DollarSign className="w-4 h-4 text-amber-700" />
                  <span>Cash on Delivery (Pay upon Receipt)</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {storeSettings.paymentSettings?.codInstructions || 
                    'Please have the exact cash amount ready for the courier upon parcel delivery.'}
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column: Order Summary */}
          <Card className="lg:col-span-5 p-5 sticky top-24 space-y-4 border-slate-200/80 shadow-none rounded-xl">
            <h3 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs text-slate-500 font-normal">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </h3>

            {/* Mini Items Thumbnail List */}
            <div className="max-h-48 overflow-y-auto pr-1 space-y-2.5 divide-y divide-slate-100 no-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-12 object-cover rounded-md bg-slate-50 flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-medium text-slate-900 line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-slate-400">
                        Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-slate-900 flex-shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="pt-3 border-t border-slate-100">
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-medium">
                    <Tag className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Coupon <strong className="font-bold">{appliedPromo}</strong> applied</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={removePromoCode}
                    className="h-6 px-1.5 text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100/50"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Coupon code (e.g. SAVE10)"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    className="bg-slate-50 text-xs h-9 rounded-lg border-slate-200 uppercase"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleApplyCoupon}
                    className="text-xs h-9 px-3 rounded-lg flex-shrink-0"
                  >
                    Apply
                  </Button>
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-900 font-medium">{formatCurrency(cartSubtotal)}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span>-{formatCurrency(cartDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Shipping</span>
                <span className="text-slate-900 font-medium">
                  {deliveryCharge === 0 ? 'Free' : formatCurrency(deliveryCharge)}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1">
                <span>Total</span>
                <span>{formatCurrency(finalGrandTotal)}</span>
              </div>
            </div>

            {/* Submit / Place Order Button */}
            <Button
              id="checkout-confirm-pay"
              type="submit"
              disabled={isProcessing}
              className="w-full text-xs font-medium h-10 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
            >
              {isProcessing ? (
                <span>Processing...</span>
              ) : (
                <span>Place Order · {formatCurrency(finalGrandTotal)}</span>
              )}
            </Button>
          </Card>
        </form>
      </div>
    </div>
  );
};
