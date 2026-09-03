import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { ProductCard } from '../product/ProductCard';
import { ProductGridSkeleton } from '../product/ProductCardSkeleton';

export const PopularProducts: React.FC = () => {
  const { 
    products, 
    isLoadingProducts,
    navigateTo,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | 'bestsellers' | 'new'>('all');
  const [isTabChanging, setIsTabChanging] = useState(false);

  const handleTabChange = (tabId: 'all' | 'bestsellers' | 'new') => {
    if (tabId === activeTab) return;
    setIsTabChanging(true);
    setActiveTab(tabId);
    setTimeout(() => {
      setIsTabChanging(false);
    }, 200);
  };

  const filteredProducts = products.filter(product => {
    if (activeTab === 'bestsellers') return product.isBestSeller;
    if (activeTab === 'new') return product.isNewArrival;
    return true;
  }).slice(0, 12);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Selected Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Curated essentials from our studio archive
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60 self-start sm:self-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'bestsellers', label: 'Bestsellers' },
              { id: 'new', label: 'New In' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
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

        {/* Product Cards Grid with Skeletons */}
        {isLoadingProducts || isTabChanging ? (
          <ProductGridSkeleton count={8} columnsClass="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" />
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm font-semibold text-slate-800">No products found in database</p>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Your catalog is currently empty. Add items in the Admin portal to display live MongoDB products.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigateTo('admin')}
              className="mt-4 text-xs font-medium rounded-full"
            >
              Go to Admin Catalog
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                id={`selected-works-card-${product.id}`}
              />
            ))}
          </div>
        )}

        {/* View All CTA Button */}
        <div className="mt-10 text-center">
          <Button
            variant="outline"
            onClick={() => navigateTo('shop')}
            className="rounded-full px-6 text-xs font-medium border-slate-200 hover:bg-slate-950 hover:text-white transition-colors h-9"
          >
            View All Products <ArrowRight className="w-3 h-3 ml-1.5" />
          </Button>
        </div>

      </div>
    </section>
  );
};

