import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

export const CategoriesPage: React.FC = () => {
  const { categories, navigateTo, setFilters } = useStore();

  const handleCategoryClick = (slug: string) => {
    setFilters(prev => ({ ...prev, category: slug }));
    navigateTo('shop');
  };

  return (
    <div className="w-full bg-[#fafaf9] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 mb-3">
              Shop by Category
            </h1>
            <p className="text-slate-500 max-w-xl text-sm sm:text-base leading-relaxed">
              Explore our complete collection of meticulously curated pieces across all departments.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setFilters(prev => ({ ...prev, category: 'all' }));
              navigateTo('shop');
            }}
            className="rounded-full shrink-0"
          >
            View All Products
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className="group text-left rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col relative"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-50 relative">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 opacity-60 group-hover:opacity-80 transition-opacity" />
              </div>
              <div className="p-5 sm:p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1 group-hover:text-amber-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 pr-4">
                    {category.description}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-950 transition-colors shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
