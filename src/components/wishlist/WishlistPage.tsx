import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  Star, 
  Eye, 
  ArrowLeft
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

export const WishlistPage: React.FC = () => {
  const { 
    wishlist, 
    products, 
    toggleWishlist, 
    addToCart, 
    setQuickViewProduct, 
    navigateTo,
    addToast
  } = useStore();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleMoveAllToCart = () => {
    let count = 0;
    wishlistProducts.forEach(p => {
      if (p.inStock) {
        addToCart(p, 1);
        count++;
      }
    });
    if (count > 0) {
      addToast('Added to bag!', `Moved ${count} wishlist items to your shopping bag.`);
    }
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="bg-[#fdfdfd] min-h-[70vh] py-16 flex items-center justify-center border-b border-slate-100">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-4 border border-slate-100">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Your wishlist is empty</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Click the heart icon on any archive item to curate your personal wish list.
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
              <span>Saved Archive</span>
              <span>·</span>
              <span>{wishlistProducts.length} Items</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Curated Wishlist
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigateTo('shop')}
              className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 gap-1.5 p-0 hover:bg-transparent"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Shop</span>
            </Button>

            <Button
              size="sm"
              onClick={handleMoveAllToCart}
              className="gap-2 rounded-lg text-xs font-bold uppercase tracking-wider"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add All to Bag</span>
            </Button>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {wishlistProducts.map(product => (
            <Card
              key={product.id}
              className="group p-3.5 flex flex-col justify-between hover:border-slate-300 transition-all duration-200 border-slate-100"
            >
              <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => navigateTo('product-detail', { productId: product.id })}
                />

                {/* Remove from Wishlist Button */}
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-rose-600 shadow-xs border border-slate-100 p-0"
                  aria-label="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>

                {/* Quick View Button */}
                <div className="absolute inset-x-2.5 bottom-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 hidden sm:block">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickViewProduct(product)}
                    className="w-full bg-white/95 hover:bg-white text-slate-900 font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-sm gap-1.5 border-slate-200 h-8"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Quick View</span>
                  </Button>
                </div>
              </div>

              <div className="pt-3 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="capitalize font-medium text-slate-500 text-[11px]">{product.category}</span>
                    <div className="flex items-center gap-1 text-slate-900 font-semibold text-[11px]">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => navigateTo('product-detail', { productId: product.id })}
                    className="text-xs font-bold text-slate-900 hover:text-slate-600 cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                  <div className="font-mono">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {formatCurrency(product.price)}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => {
                      addToCart(product, 1);
                    }}
                    disabled={!product.inStock}
                    className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider gap-1.5"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Move to Bag</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
