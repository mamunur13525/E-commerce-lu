import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Shirt, 
  Home, 
  ShoppingBag, 
  Footprints, 
  Watch, 
  Headphones, 
  ArrowRight, 
  Sparkles, 
  Layers,
  ChevronRight,
  Grid
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

export const StickyCategories: React.FC = () => {
  const { categories, navigateTo, setFilters, filters } = useStore();
  const [isSticky, setIsSticky] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const getCategoryIcon = (iconName: string, sizeClass = 'w-4 h-4') => {
    switch (iconName) {
      case 'Shirt':
        return <Shirt className={sizeClass} />;
      case 'Home':
        return <Home className={sizeClass} />;
      case 'ShoppingBag':
        return <ShoppingBag className={sizeClass} />;
      case 'Footprints':
        return <Footprints className={sizeClass} />;
      case 'Watch':
        return <Watch className={sizeClass} />;
      case 'Headphones':
        return <Headphones className={sizeClass} />;
      default:
        return <Layers className={sizeClass} />;
    }
  };

  // Scroll listener to toggle sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const shouldStick = rect.top <= 75;
        setIsSticky(shouldStick);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryClick = (categorySlug: string) => {
    setFilters(prev => ({ ...prev, category: categorySlug, subCategory: 'all' }));
    navigateTo('shop', { category: categorySlug });
  };

  const handleSubCollectionClick = (categorySlug: string, subSlug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFilters(prev => ({ ...prev, category: categorySlug, subCategory: subSlug }));
    navigateTo('shop', { category: categorySlug });
  };

  return (
    <div ref={triggerRef} className="relative w-full">
      {/* Sticky Compact Category Quick Bar */}
      <div 
        className={`w-full z-30 transition-all duration-300 ${
          isSticky 
            ? 'fixed top-18 sm:top-20 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-2 px-4 animate-in fade-in slide-in-from-top-2 duration-200' 
            : 'hidden'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <Button
              size="sm"
              variant={filters.category === 'all' ? 'default' : 'secondary'}
              onClick={() => handleCategoryClick('all')}
              className="rounded-full px-3 h-7 text-xs capitalize font-bold"
            >
              All Collections
            </Button>

            {categories.map(cat => (
              <Button
                key={cat.id}
                size="sm"
                variant={filters.category === cat.slug ? 'default' : 'secondary'}
                onClick={() => handleCategoryClick(cat.slug)}
                className="rounded-full px-3 h-7 text-xs capitalize font-semibold gap-1.5"
              >
                {getCategoryIcon(cat.iconName, 'w-3 h-3')}
                <span>{cat.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-60">({cat.itemCount})</span>
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateTo('shop')}
            className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-900"
          >
            <span>Catalog</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Main Categories Section: Smaller image in left, title & sub-collections (Req 3) */}
      <section className="py-10 sm:py-14 bg-slate-50/50 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                <Grid className="w-3.5 h-3.5 text-slate-900" />
                <span>Curated Departments</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                Explore by Category
              </h2>
            </div>

            <Button
              variant="link"
              onClick={() => navigateTo('shop')}
              className="text-xs font-bold text-slate-900 p-0 hover:text-slate-600 self-start sm:self-auto"
            >
              View Full Collection Index <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {/* Category Cards with Small Image on the Left (Req 3) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                id={`category-card-${category.slug}`}
                onClick={() => handleCategoryClick(category.slug)}
                className="group p-3 sm:p-3.5 bg-white rounded-2xl border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-400 transition-all cursor-pointer flex items-center gap-3.5"
              >
                {/* Smaller image on the left (Req 3) */}
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative border border-slate-200/60">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-md bg-black/60 backdrop-blur-xs text-white flex items-center justify-center">
                    {getCategoryIcon(category.iconName, 'w-3 h-3')}
                  </div>
                </div>

                {/* Content on the Right */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-sm font-bold text-slate-950 group-hover:text-slate-700 truncate">
                        {category.name}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {category.itemCount} artisan pieces
                    </p>
                  </div>

                  {/* Sub-Collections mini tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {category.subCollections.slice(0, 2).map(sub => (
                      <span
                        key={sub.id}
                        onClick={e => handleSubCollectionClick(category.slug, sub.slug, e)}
                        className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-md text-slate-600 transition-colors"
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};
