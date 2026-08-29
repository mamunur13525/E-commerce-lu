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
    setFilters
  } = useStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter featured products
  const featuredProducts = products.filter(p => p.isFeatured || p.isBestSeller || p.rating >= 4.8);

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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-900" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Featured Archive Pieces
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg">
              Hand-finished garments and studio ceramics receiving our highest customer accolades.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="link"
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'all' }));
                navigateTo('shop');
              }}
              className="text-xs font-bold text-slate-900 flex items-center gap-1 mr-2 p-0"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('left')}
                className="w-8 h-8 rounded-full"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('right')}
                className="w-8 h-8 rounded-full"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Horizontal Carousel Track using shadcn Card */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {featuredProducts.map(product => {
            const isFavorited = isInWishlist(product.id);

            return (
              <Card
                key={product.id}
                id={`featured-card-${product.id}`}
                className="w-[260px] sm:w-[280px] flex-shrink-0 snap-start group flex flex-col justify-between p-3 hover:border-slate-300 transition-all duration-300"
              >
                {/* Image Container with Floating Badges and Quick Actions */}
                <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-slate-50">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => navigateTo('product-detail', { productId: product.id })}
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                    {product.isBestSeller && (
                      <Badge className="bg-slate-950 text-white font-bold uppercase tracking-wider text-[9px] shadow-xs">
                        Bestseller
                      </Badge>
                    )}
                    {product.originalPrice && (
                      <Badge variant="secondary" className="bg-slate-900 text-white font-bold text-[9px] shadow-xs">
                        Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </Badge>
                    )}
                  </div>

                  {/* Top Right Wishlist Button */}
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full p-0 shadow-xs ${
                      isFavorited
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950'
                    }`}
                    aria-label="Save to Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-600' : ''}`} />
                  </Button>

                  {/* Bottom Quick View Overlay Button */}
                  <div className="absolute inset-x-2.5 bottom-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuickViewProduct(product)}
                      className="w-full bg-white/95 hover:bg-white text-slate-900 font-bold text-[11px] uppercase tracking-wider rounded-lg shadow-xs backdrop-blur-md gap-1.5 border border-slate-100"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="pt-3 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-medium">
                      <span className="capitalize">{product.category}</span>
                      <div className="flex items-center gap-1 text-slate-700">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => navigateTo('product-detail', { productId: product.id })}
                      className="text-xs font-bold text-slate-900 hover:text-slate-600 cursor-pointer line-clamp-1 transition-colors"
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                    <div className="font-mono">
                      <span className="text-xs font-bold text-slate-900">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through ml-1.5">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => addToCart(product, 1)}
                      disabled={!product.inStock}
                      className="h-8 px-2.5 text-[11px] font-bold uppercase tracking-wider gap-1.5"
                      aria-label="Add to Bag"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span className="hidden sm:inline">Add</span>
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
