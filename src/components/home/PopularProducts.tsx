import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShoppingBag, 
  Heart, 
  Eye, 
  Star, 
  ArrowRight, 
  Flame,
  Plus
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

export const PopularProducts: React.FC = () => {
  const { 
    products, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setQuickViewProduct, 
    navigateTo,
    addToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | 'bestsellers' | 'new' | 'popular'>('all');

  const filteredProducts = products.filter(product => {
    if (activeTab === 'bestsellers') return product.isBestSeller;
    if (activeTab === 'new') return product.isNewArrival;
    if (activeTab === 'popular') return product.isPopular;
    return true;
  }).slice(0, 12); // Showing up to 12 items for 2 full 6-item rows

  const handleQuickAdd = (e: React.MouseEvent, product: typeof products[0]) => {
    e.stopPropagation();
    addToCart(product, 1, product.colors[0], product.sizes[0]);
    addToast('Added to Cart', `${product.name} has been added.`, 'success');
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-slate-900" />
              <span>Studio Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              Popular Catalog Items
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'bestsellers', label: 'Best Sellers' },
              { id: 'new', label: 'New In' },
              { id: 'popular', label: 'Trending' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-slate-950 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Smaller Product Cards Grid: 5 or 6 items in the line (Req 4) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredProducts.map(product => {
            const isFavorited = isInWishlist(product.id);

            return (
              <Card
                key={product.id}
                id={`product-card-${product.id}`}
                onClick={() => navigateTo('product-detail', { productId: product.id })}
                className="group p-2.5 sm:p-3 bg-white rounded-2xl border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-400 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Image Container with compact aspect */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 mb-2.5">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {product.isBestSeller && (
                      <span className="bg-slate-950 text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-2xs">
                        Hot
                      </span>
                    )}
                    {product.isNewArrival && (
                      <span className="bg-amber-400 text-slate-950 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-2xs">
                        New
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center shadow-xs transition-colors ${
                      isFavorited
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-white/90 hover:bg-white text-slate-600'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-3 h-3 ${isFavorited ? 'fill-rose-600' : ''}`} />
                  </button>

                  {/* Hover Quick Add to Cart Button */}
                  <div className="absolute inset-x-2 bottom-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <Button
                      size="sm"
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="w-full h-7 bg-slate-950 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add to Bag</span>
                    </Button>
                  </div>
                </div>

                {/* Info Container */}
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5 truncate">
                      {product.category}
                    </p>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-slate-600 transition-colors leading-snug">
                      {product.name}
                    </h3>
                  </div>

                  {/* Price & Rating */}
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-xs font-black text-slate-950">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[10px] text-slate-400 line-through font-mono">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-0.5 text-[10px] font-bold text-slate-700">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* View All CTA Button */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigateTo('shop')}
            className="rounded-full px-8 text-xs font-bold uppercase tracking-wider border-slate-300 hover:bg-slate-950 hover:text-white transition-colors"
          >
            Explore Complete Archive <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>

      </div>
    </section>
  );
};
