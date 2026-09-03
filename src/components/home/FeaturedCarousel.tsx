import React, { useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  Eye, 
  Heart, 
  Star, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

export const FeaturedCarousel: React.FC = () => {
  const { 
    products, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setQuickViewProduct, 
    navigateTo,
    setFilters,
    addToast
  } = useStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter featured products
  const featuredProducts = products.filter(p => p.isFeatured || p.isBestSeller || p.rating >= 4.8);

  if (!featuredProducts || featuredProducts.length === 0) {
    return null;
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="w-full py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Carousel Navigation */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Featured Archive
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full border-slate-200"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full border-slate-200"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Horizontal Carousel Track using shadcn Card */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {featuredProducts.map(product => {
            const isFavorited = isInWishlist(product.id);

            return (
              <Card
                key={product.id}
                id={`featured-card-${product.id}`}
                className="w-[220px] sm:w-[240px] flex-shrink-0 snap-start group flex flex-col justify-between p-2.5 rounded-xl border-slate-200/70 hover:border-slate-300 shadow-none hover:shadow-xs transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden bg-slate-50">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300 cursor-pointer"
                    onClick={() => navigateTo('product-detail', { productId: product.id })}
                  />

                  {/* Top Right Wishlist Button */}
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full p-0 shadow-xs ${
                      isFavorited
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-white/90 hover:bg-white text-slate-700'
                    }`}
                    aria-label="Save to Wishlist"
                  >
                    <Heart className={`w-3 h-3 ${isFavorited ? 'fill-rose-600' : ''}`} />
                  </Button>
                </div>

                {/* Product Info */}
                <div className="pt-2.5 flex flex-col justify-between flex-1">
                  <div>
                    <h3
                      onClick={() => navigateTo('product-detail', { productId: product.id })}
                      className="text-xs font-semibold text-slate-900 hover:text-slate-600 cursor-pointer line-clamp-1 transition-colors"
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-900">
                      {formatCurrency(product.price)}
                    </span>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        addToCart(product, 1);
                      }}
                      disabled={!product.inStock}
                      className="h-7 px-2.5 text-[11px] font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
