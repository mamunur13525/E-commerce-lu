import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { formatCurrency, cn } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react';

export interface ProductCardProps {
  product: Product;
  id?: string;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  id,
  className,
}) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    navigateTo,
  } = useStore();

  const isFavorited = isInWishlist(product.id);

  return (
    <div
      id={id || `product-card-${product.id}`}
      className={cn(
        "group bg-white rounded-2xl border border-slate-100 p-3 sm:p-4 flex flex-col justify-between hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-300",
        className
      )}
    >
      {/* Image Frame with Aspect Ratio 4:5 */}
      <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={() => navigateTo('product-detail', { productId: product.id })}
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.productStatus === 'out_of_stock' || !product.inStock ? (
            <Badge className="bg-rose-500 text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider rounded-full shadow-xs px-1.5 py-0.5 sm:px-2">
              Out of Stock
            </Badge>
          ) : product.productStatus === 'pre_order' ? (
            <Badge className="bg-indigo-600 text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider rounded-full shadow-xs px-1.5 py-0.5 sm:px-2">
              Pre-Order
            </Badge>
          ) : product.isBestSeller ? (
            <Badge className="bg-slate-900 text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider rounded-full shadow-xs px-1.5 py-0.5 sm:px-2">
              Bestseller
            </Badge>
          ) : null}
          {product.originalPrice && product.originalPrice > product.price && (
            <Badge className="bg-amber-400 text-slate-950 text-[8px] sm:text-[9px] font-black uppercase rounded-full shadow-xs px-1.5 py-0.5 sm:px-2">
              Save {formatCurrency(product.originalPrice - product.price)}
            </Badge>
          )}
          {product.allowCod && !product.allowOnlinePayment && (
            <Badge variant="outline" className="bg-white/90 text-slate-800 border-slate-300 text-[8px] font-semibold py-0">
              COD Only
            </Badge>
          )}
          {!product.allowCod && product.allowOnlinePayment && (
            <Badge variant="outline" className="bg-white/90 text-slate-800 border-slate-300 text-[8px] font-semibold py-0">
              Online Only
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full border transition-all p-0 shadow-xs ${
            isFavorited
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-white/90 border-slate-200 hover:bg-slate-900 hover:text-white text-slate-600'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-600' : ''}`} />
        </Button>

        {/* Quick View Button (Desktop Hover) */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="w-full bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-[11px] uppercase tracking-wider border border-slate-200 gap-1.5 h-8 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </Button>
        </div>
      </div>

      {/* Product Content */}
      <div className="pt-2.5 sm:pt-3.5 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate max-w-[60%]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-slate-700 font-semibold text-[10px] sm:text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
              <span>{product.rating ?? 5.0}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount ?? 0})</span>
            </div>
          </div>

          <h3
            onClick={() => navigateTo('product-detail', { productId: product.id })}
            className="text-xs sm:text-sm font-bold text-slate-900 hover:text-slate-600 cursor-pointer line-clamp-1 transition-colors"
          >
            {product.name}
          </h3>

          <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 mt-0.5 font-normal">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2.5 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-100 gap-1">
          <div className="font-mono flex items-baseline gap-1 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              {formatCurrency(product.price)}
            </span>
            {product.unit && (
              <span className="text-[10px] text-slate-500 font-sans font-normal">
                /{product.unit}
              </span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1, product.colors?.[0], product.sizes?.[0]);
            }}
            disabled={product.productStatus === 'out_of_stock' || !product.inStock}
            className="text-[10px] sm:text-xs font-bold uppercase tracking-wider gap-1 h-7 px-2.5 sm:px-3 rounded-lg shrink-0"
          >
            <ShoppingBag className="w-3 h-3 shrink-0" />
            <span>
              {product.productStatus === 'out_of_stock' || !product.inStock
                ? 'Sold Out'
                : product.productStatus === 'pre_order'
                ? 'Pre-Order'
                : 'Add'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
