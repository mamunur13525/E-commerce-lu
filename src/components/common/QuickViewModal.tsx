import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Check, 
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    navigateTo,
  } = useStore();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | undefined>(
    quickViewProduct?.colors && quickViewProduct.colors.length > 0 ? quickViewProduct.colors[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    quickViewProduct?.sizes && quickViewProduct.sizes.length > 0 ? quickViewProduct.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setQuickViewProduct(null);
    navigateTo('checkout');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Container */}
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            id="quick-view-modal"
            className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl max-h-[90vh] flex flex-col md:flex-row border border-slate-100"
          >
            {/* Close Button */}
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-slate-900 hover:text-white text-slate-700 shadow-xs border border-slate-200"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Left: Product Images */}
            <div className="w-full md:w-1/2 bg-slate-50 p-6 flex flex-col justify-between border-r border-slate-100">
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-slate-100">
                <img
                  src={product.images[selectedImageIdx] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {product.isBestSeller && (
                  <Badge className="absolute top-3 left-3 bg-slate-900 text-white text-[9px] uppercase font-bold tracking-wider rounded-full">
                    Bestseller
                  </Badge>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border transition-all flex-shrink-0 bg-white ${
                        selectedImageIdx === idx ? 'border-slate-900 shadow-xs' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details & Controls */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {product.category} · {product.sku}
                  </span>
                  <div className="flex items-center gap-1 text-slate-700 text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviewCount})</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
                  {product.name}
                </h3>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-3 font-mono">
                  <span className="text-xl font-extrabold text-slate-900">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase">
                      Save {formatCurrency(product.originalPrice - product.price)}
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                      Color: <span className="font-normal text-slate-500">{selectedColor?.name || product.colors[0].name}</span>
                    </label>
                    <div className="flex gap-2">
                      {product.colors.map(color => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                            (selectedColor?.name || product.colors?.[0].name) === color.name
                              ? 'border-slate-900 scale-110'
                              : 'border-transparent hover:scale-105'
                          }`}
                          title={color.name}
                        >
                          <span 
                            className="w-4 h-4 rounded-full border border-black/10 shadow-xs" 
                            style={{ backgroundColor: color.hex }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                      Select Size
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes.map(sz => (
                        <Button
                          key={sz}
                          type="button"
                          variant={(selectedSize || product.sizes?.[0]) === sz ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedSize(sz)}
                          className="h-7 px-3 text-xs font-bold uppercase tracking-wider"
                        >
                          {sz}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Stock Status */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Quantity</span>
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="h-7 w-7 rounded-none text-slate-700"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="px-2.5 text-xs font-bold text-slate-900 font-mono">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                        className="h-7 w-7 rounded-none text-slate-700"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs font-medium">
                    {product.inStock ? (
                      <span className="text-slate-700 flex items-center gap-1 text-[11px] font-semibold">
                        <Check className="w-3 h-3 text-slate-900" /> In Stock ({product.stockQuantity})
                      </span>
                    ) : (
                      <span className="text-rose-600 font-semibold text-[11px]">Out of Stock</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action CTA Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 font-bold text-xs uppercase tracking-wider gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleWishlist(product.id)}
                    className={isFavorited ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-700'}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600 text-rose-600' : ''}`} />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="w-full border-slate-900 font-bold text-xs uppercase tracking-wider text-slate-900 hover:bg-slate-50"
                >
                  Instant Buy Now
                </Button>

                <Button
                  variant="link"
                  onClick={() => {
                    setQuickViewProduct(null);
                    navigateTo('product-detail', { productId: product.id });
                  }}
                  className="w-full text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 p-0 h-auto pt-1"
                >
                  View Complete Specifications & Reviews →
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
