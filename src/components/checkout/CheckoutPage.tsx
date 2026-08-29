import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Lock, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  Tag, 
  User, 
  Smartphone, 
  DollarSign, 
  MapPin, 
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
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string>('del-std');

  // Contact & Shipping Form State
  const [fullName, setFullName] = useState(isGuestMode ? '' : userProfile.name);
  const [email, setEmail] = useState(isGuestMode ? 'mdshn1122@gmail.com' : userProfile.email);
  const [phone, setPhone] = useState(isGuestMode ? '+1 (555) 019-2834' : userProfile.phone);
  const [street, setStreet] = useState(isGuestMode ? '742 Evergreen Terrace' : userProfile.savedAddresses[0]?.street || '742 Evergreen Terrace');
  const [city, setCity] = useState(isGuestMode ? 'Springfield' : userProfile.savedAddresses[0]?.city || 'Springfield');
  const [state, setState] = useState(isGuestMode ? 'OR' : userProfile.savedAddresses[0]?.state || 'OR');
  const [zipCode, setZipCode] = useState(isGuestMode ? '97477' : userProfile.savedAddresses[0]?.zipCode || '97477');
  const [country, setCountry] = useState(isGuestMode ? 'United States' : userProfile.savedAddresses[0]?.country || 'United States');

  // Payment Method Selection
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cod' | 'bkash'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Promo Form
  const [promoInput, setPromoInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Delivery charge calculation
  const chosenDelivery = deliveryOptions.find(d => d.id === selectedDeliveryId) || deliveryOptions[0];
  const isEligibleForFreeShipping = cartSubtotal >= storeSettings.freeShippingThreshold;
  const deliveryCharge = (selectedDeliveryId === 'del-std' && isEligibleForFreeShipping) 
    ? 0 
    : chosenDelivery.price;

  const finalGrandTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryCharge);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
      setPromoInput('');
    }
  };

  const handleAutofillProfile = () => {
    setIsGuestMode(false);
    setFullName(userProfile.name);
    setEmail(userProfile.email);
    setPhone(userProfile.phone);
    if (userProfile.savedAddresses[0]) {
      setStreet(userProfile.savedAddresses[0].street);
      setCity(userProfile.savedAddresses[0].city);
      setState(userProfile.savedAddresses[0].state);
      setZipCode(userProfile.savedAddresses[0].zipCode);
      setCountry(userProfile.savedAddresses[0].country);
    }
    addToast('Profile loaded', 'Autofilled saved addresses & preferences.');
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      addToast('Cart is empty', 'Add items before checking out.');
      return;
    }

    if (!fullName || !email || !street || !city || !zipCode) {
      addToast('Missing Details', 'Please complete the shipping fields.');
      return;
    }

    setIsProcessing(true);

    const shippingAddress: UserAddress = {
      id: generateId('addr'),
      fullName,
      phone,
      street,
      city,
      state,
      postalCode: zipCode,
      country,
      isDefault: true,
    };

    const paymentDetails: PaymentDetails = {
      method: paymentMethod,
      cardLast4: paymentMethod === 'card' ? '4242' : undefined,
      cardBrand: paymentMethod === 'card' ? 'Visa' : undefined,
      transactionId: `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      isPaid: true,
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
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
              <Lock className="w-3.5 h-3.5 text-slate-900" />
              <span>SSL 256-Bit Encrypted Checkout</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Complete Your Order
            </h1>
          </div>

          <Button
            variant="ghost"
            onClick={() => navigateTo('cart')}
            className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 gap-1.5 p-0 hover:bg-transparent"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Bag</span>
          </Button>
        </div>

        {/* 2-Column Responsive Form & Summary */}
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7-col): Guest/Profile Toggle + Address + Delivery + Payment */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Account / Guest Switcher */}
            <Card className="p-6 space-y-4 border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-700" />
                  1. Checkout Account Preference
                </h3>
                <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                  Fast 1-Click Ready
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsGuestMode(true)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isGuestMode 
                      ? 'border-slate-900 bg-slate-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 block">Guest Checkout</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">No password required</span>
                </button>

                <button
                  type="button"
                  onClick={handleAutofillProfile}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    !isGuestMode 
                      ? 'border-slate-900 bg-slate-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 block">Saved Profile (Alexandre)</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">Autofill addresses & cards</span>
                </button>
              </div>
            </Card>

            {/* 2. Contact & Delivery Information */}
            <Card className="p-6 space-y-4 border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-slate-700" />
                2. Contact & Shipping Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Alexandre Mercer"
                    className="bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Email Confirmation Address *
                  </label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="mdshn1122@gmail.com"
                    className="bg-slate-50 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Order confirmation & receipt dispatched here
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Street Address & Apartment/Suite *
                  </label>
                  <Input
                    type="text"
                    required
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                    className="bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    City *
                  </label>
                  <Input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Portland"
                    className="bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      State / Prov *
                    </label>
                    <Input
                      type="text"
                      required
                      value={state}
                      onChange={e => setState(e.target.value)}
                      placeholder="OR"
                      className="bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Postal Code *
                    </label>
                    <Input
                      type="text"
                      required
                      value={zipCode}
                      onChange={e => setZipCode(e.target.value)}
                      placeholder="97477"
                      className="bg-slate-50 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="bg-slate-50 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 font-medium h-9"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="Australia">Australia</option>
                    <option value="Bangladesh">Bangladesh</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* 3. Delivery Method Options */}
            <Card className="p-6 space-y-4 border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
                <Truck className="w-4 h-4 text-slate-700" />
                3. Delivery Method & Speed
              </h3>

              <div className="space-y-2.5">
                {deliveryOptions.map(option => {
                  const isSelected = selectedDeliveryId === option.id;
                  const isComplimentary = option.id === 'del-std' && isEligibleForFreeShipping;

                  return (
                    <label
                      key={option.id}
                      onClick={() => setSelectedDeliveryId(option.id)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-slate-900 bg-slate-50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery-method"
                          checked={isSelected}
                          onChange={() => setSelectedDeliveryId(option.id)}
                          className="accent-slate-900 w-4 h-4"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{option.name}</p>
                          <p className="text-[11px] text-slate-500">{option.estimatedDays} · {option.description}</p>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        {isComplimentary ? (
                          <Badge variant="secondary" className="text-[11px] font-bold">
                            FREE (Orders $150+)
                          </Badge>
                        ) : (
                          <span className="text-xs font-bold text-slate-900">
                            {formatCurrency(option.price)}
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </Card>

            {/* 4. Payment Gateway Options */}
            <Card className="p-6 space-y-4 border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
                <CreditCard className="w-4 h-4 text-slate-700" />
                4. Secure Payment Gateway
              </h3>

              {/* Payment Method Radio Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'card', label: 'Credit Card', icon: CreditCard },
                  { id: 'apple_pay', label: 'Apple Pay', icon: Smartphone },
                  { id: 'cod', label: 'Cash on Deliv.', icon: DollarSign },
                  { id: 'bkash', label: 'Mobile Wallet', icon: Smartphone },
                ].map(tab => (
                  <Button
                    key={tab.id}
                    type="button"
                    variant={paymentMethod === tab.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPaymentMethod(tab.id as any)}
                    className="h-auto py-2.5 flex-col gap-1 rounded-lg"
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-[11px] font-semibold">{tab.label}</span>
                  </Button>
                ))}
              </div>

              {/* Card Inputs Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        placeholder="4242 •••• •••• 4242"
                        className="bg-white pl-3 pr-16 font-mono"
                      />
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[9px] font-bold text-slate-600 font-mono">
                        <span className="px-1 py-0.5 bg-slate-100 rounded">VISA</span>
                        <span className="px-1 py-0.5 bg-slate-100 rounded">MC</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Expiration Date
                      </label>
                      <Input
                        type="text"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="bg-white font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Security CVC
                      </label>
                      <Input
                        type="text"
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="bg-white font-mono text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Digital Wallet Prompt */}
              {paymentMethod === 'apple_pay' && (
                <div className="p-4 bg-slate-900 text-white rounded-xl text-center space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider">Apple Pay Express Authorization Ready</p>
                  <p className="text-[11px] text-slate-300">Authenticate using Touch ID or Face ID upon submission.</p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl text-xs space-y-0.5">
                  <p className="font-bold">Cash on Delivery Selected</p>
                  <p className="text-[11px] text-slate-500">Pay cash directly to courier upon arrival.</p>
                </div>
              )}

              {paymentMethod === 'bkash' && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl text-xs space-y-0.5">
                  <p className="font-bold">Mobile Wallet Checkout</p>
                  <p className="text-[11px] text-slate-500">Direct wallet token checkout active for domestic orders.</p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column (5-col): Sticky Order Items, Delivery Charge & Final Summary */}
          <Card className="lg:col-span-5 p-6 sticky top-28 space-y-6 border-slate-100">
            <h3 className="text-base font-extrabold tracking-tight text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Order Breakdown</span>
              <span className="text-xs font-mono font-semibold text-slate-500">
                {cart.reduce((s, i) => s + i.quantity, 0)} Items
              </span>
            </h3>

            {/* Mini Items Thumbnail List */}
            <div className="max-h-56 overflow-y-auto pr-1 space-y-3 divide-y divide-slate-100 no-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 object-cover rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        Qty: {item.quantity} {item.selectedSize ? `· ${item.selectedSize}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 flex-shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="pt-2 border-t border-slate-100">
              {!appliedPromo ? (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      type="text"
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value)}
                      placeholder="Coupon: LUMINA15"
                      className="pl-8 uppercase font-mono bg-slate-50"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleApplyPromo}
                    className="font-bold text-xs uppercase tracking-wider"
                  >
                    Apply
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-900">
                  <span className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Code: {appliedPromo} (-{storeSettings.promoDiscountPercent}%)
                  </span>
                  <Button type="button" variant="link" size="sm" onClick={removePromoCode} className="text-slate-600 hover:text-slate-900 text-[10px] font-bold uppercase p-0 h-auto">
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Cart Subtotal</span>
                <span className="font-mono text-slate-900 font-semibold">{formatCurrency(cartSubtotal)}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-slate-900 font-bold">
                  <span>Promotional Savings</span>
                  <span className="font-mono">-{formatCurrency(cartDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Delivery Charge ({chosenDelivery.name})</span>
                <span className="font-mono text-slate-900 font-semibold">
                  {deliveryCharge === 0 ? (
                    <span className="text-slate-900 font-bold">FREE</span>
                  ) : (
                    formatCurrency(deliveryCharge)
                  )}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1">
                <span>Grand Total</span>
                <span className="font-mono text-xl">{formatCurrency(finalGrandTotal)}</span>
              </div>
            </div>

            {/* Submit / Place Order Button */}
            <Button
              id="checkout-confirm-pay"
              type="submit"
              size="lg"
              disabled={isProcessing}
              className="w-full gap-2 uppercase tracking-wider text-xs font-bold rounded-lg"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing Order...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-white" />
                  <span>Authorize & Place Order ({formatCurrency(finalGrandTotal)})</span>
                </>
              )}
            </Button>

            {/* Trust Badges */}
            <div className="space-y-1.5 pt-1 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
                <span>Instant dispatch confirmation sent to <strong>{email || 'mdshn1122@gmail.com'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
                <span>30-Day Money Back Guarantee & Studio Certification</span>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};
