import React, { useState, useMemo, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  SlidersHorizontal, 
  Search, 
  Grid3X3, 
  LayoutList, 
  X, 
  ChevronDown, 
  Star, 
  Heart, 
  ShoppingBag, 
  Eye, 
  ArrowDown
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

export const ShopPage: React.FC = () => {
  const { 
    products, 
    categories, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setQuickViewProduct, 
    navigateTo, 
    filters, 
    setFilters, 
    resetFilters 
  } = useStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Available unique colors & sizes
  const allColors = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach(p => {
      p.colors?.forEach(c => {
        if (!map.has(c.name)) map.set(c.name, c.hex);
      });
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      p.sizes?.forEach(s => set.add(s));
    });
    return Array.from(set);
  }, [products]);

  // Filter & Sort logic
  const filteredAndSortedProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }
      // Sub-category filter
      if (filters.subCategory !== 'all' && product.subCategory !== filters.subCategory) {
        return false;
      }
      // Price range
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }
      // In stock only
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }
      // Tag filter
      if (filters.tag && !product.tags.some(t => t.toLowerCase() === filters.tag?.toLowerCase())) {
        return false;
      }
      // Color filter
      if (filters.selectedColors.length > 0) {
        const hasColor = product.colors?.some(c => filters.selectedColors.includes(c.name));
        if (!hasColor) return false;
      }
      // Size filter
      if (filters.selectedSizes.length > 0) {
        const hasSize = product.sizes?.some(s => filters.selectedSizes.includes(s));
        if (!hasSize) return false;
      }
      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        const matchCat = product.category.toLowerCase().includes(query);
        const matchTag = product.tags.some(t => t.toLowerCase().includes(query));
        if (!matchName && !matchDesc && !matchCat && !matchTag) return false;
      }
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [products, filters]);

  // Paginated visible slice
  const displayedProducts = filteredAndSortedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedProducts.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 12);
      setIsLoadingMore(false);
    }, 500);
  };

  // Color selection toggle
  const toggleColorFilter = (colorName: string) => {
    setFilters(prev => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(colorName)
        ? prev.selectedColors.filter(c => c !== colorName)
        : [...prev.selectedColors, colorName]
    }));
  };

  // Size selection toggle
  const toggleSizeFilter = (size: string) => {
    setFilters(prev => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter(s => s !== size)
        : [...prev.selectedSizes, size]
    }));
  };

  const activeFiltersCount = 
    (filters.category !== 'all' ? 1 : 0) +
    (filters.subCategory !== 'all' ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 500 ? 1 : 0) +
    filters.selectedColors.length +
    filters.selectedSizes.length +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="bg-[#fdfdfd] min-h-screen py-8 sm:py-12 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8 border-b border-slate-100 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
                <span>Lumina Archive</span>
                <span>/</span>
                <span className="text-slate-900 font-bold capitalize">
                  {filters.category === 'all' ? 'All Collections' : filters.category}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Studio Archive & Shop
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Showing {filteredAndSortedProducts.length} curated design pieces
              </p>
            </div>

            {/* Top Toolbar Controls */}
            <div className="flex items-center flex-wrap gap-2.5">
              {/* Mobile Filter Toggle */}
              <Button
                id="shop-mobile-filter-btn"
                variant="outline"
                size="sm"
                onClick={() => setIsFilterSidebarOpen(true)}
                className="md:hidden gap-2 uppercase tracking-wider text-xs font-bold"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </Button>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select
                  id="shop-sort-select"
                  value={filters.sortBy}
                  onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="appearance-none bg-white border border-slate-200 text-slate-800 px-3.5 py-2 pr-9 rounded-lg text-xs font-semibold focus:outline-none focus:border-slate-900 cursor-pointer"
                >
                  <option value="featured">Sort: Curated Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Grid / List Switcher */}
              <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="h-7 w-7 rounded-md p-0"
                  aria-label="Grid view"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="h-7 w-7 rounded-md p-0"
                  aria-label="List view"
                >
                  <LayoutList className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active:</span>
              
              {filters.category !== 'all' && (
                <Badge className="bg-slate-900 text-white gap-1 pr-1.5">
                  Category: {filters.category}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFilters(prev => ({ ...prev, category: 'all', subCategory: 'all' }))}
                    className="h-3 w-3 p-0 hover:bg-transparent text-white"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}

              {filters.subCategory !== 'all' && (
                <Badge className="bg-slate-900 text-white gap-1 pr-1.5">
                  Sub: {filters.subCategory}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFilters(prev => ({ ...prev, subCategory: 'all' }))}
                    className="h-3 w-3 p-0 hover:bg-transparent text-white"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}

              {filters.searchQuery && (
                <Badge className="bg-slate-900 text-white gap-1 pr-1.5">
                  Search: "{filters.searchQuery}"
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                    className="h-3 w-3 p-0 hover:bg-transparent text-white"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}

              {filters.selectedColors.map(color => (
                <Badge key={color} variant="secondary" className="gap-1 pr-1.5">
                  Color: {color}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleColorFilter(color)}
                    className="h-3 w-3 p-0 hover:bg-transparent text-slate-700"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}

              {filters.selectedSizes.map(size => (
                <Badge key={size} variant="secondary" className="gap-1 pr-1.5">
                  Size: {size}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSizeFilter(size)}
                    className="h-3 w-3 p-0 hover:bg-transparent text-slate-700"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}

              {filters.inStockOnly && (
                <Badge variant="outline" className="gap-1 pr-1.5">
                  In Stock Only
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFilters(prev => ({ ...prev, inStockOnly: false }))}
                    className="h-3 w-3 p-0 hover:bg-transparent text-slate-700"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}

              <Button
                variant="link"
                size="sm"
                onClick={resetFilters}
                className="text-[11px] text-slate-500 hover:text-slate-900 font-bold uppercase tracking-wider p-0 h-auto ml-2"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="flex gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block w-60 bg-white rounded-2xl border border-slate-100 p-5 sticky top-28 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-700" />
                Refine Catalog
              </h3>
              {activeFiltersCount > 0 && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={resetFilters}
                  className="text-[11px] text-slate-400 hover:text-slate-900 font-medium p-0 h-auto"
                >
                  Reset
                </Button>
              )}
            </div>

            {/* Categories Filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Categories
              </label>
              <div className="space-y-1 text-xs">
                <Button
                  variant={filters.category === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, category: 'all', subCategory: 'all' }))}
                  className="w-full justify-between h-8 px-2.5 text-xs font-medium"
                >
                  <span>All Products</span>
                  <span className="text-[10px] opacity-70">{products.length}</span>
                </Button>
                {categories.map(cat => (
                  <div key={cat.id}>
                    <Button
                      variant={filters.category === cat.slug ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setFilters(prev => ({ ...prev, category: cat.slug, subCategory: 'all' }))}
                      className="w-full justify-between h-8 px-2.5 text-xs font-medium"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] opacity-70">{cat.itemCount}</span>
                    </Button>

                    {/* Subcategories list if parent active */}
                    {filters.category === cat.slug && (
                      <div className="pl-3 pr-1 py-1 space-y-1">
                        {cat.subCollections.map(sub => (
                          <Button
                            key={sub.id}
                            variant={filters.subCategory === sub.slug ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setFilters(prev => ({ ...prev, subCategory: sub.slug }))}
                            className="w-full justify-between h-7 px-2 text-[11px]"
                          >
                            <span>· {sub.name}</span>
                            <span className="text-[10px] opacity-60">({sub.itemCount})</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                <span>Price Range</span>
                <span className="font-mono text-slate-900 font-bold">
                  ${filters.minPrice} - ${filters.maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={filters.maxPrice}
                onChange={e => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>

            {/* In Stock Only Checkbox */}
            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={e => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 accent-slate-900 w-3.5 h-3.5"
                />
                <span>In Stock Ready to Ship</span>
              </label>
            </div>

            {/* Color Swatches Filter */}
            {allColors.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Colors
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {allColors.map(color => {
                    const isSelected = filters.selectedColors.includes(color.name);
                    return (
                      <button
                        key={color.name}
                        onClick={() => toggleColorFilter(color.name)}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-transform ${
                          isSelected ? 'ring-2 ring-slate-900 ring-offset-1 scale-110' : 'hover:scale-105'
                        }`}
                        title={color.name}
                      >
                        <span 
                          className="w-full h-full rounded-full border border-black/10" 
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes Filter */}
            {allSizes.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Sizes
                </label>
                <div className="flex flex-wrap gap-1">
                  {allSizes.map(sz => {
                    const isSelected = filters.selectedSizes.includes(sz);
                    return (
                      <Button
                        key={sz}
                        variant={isSelected ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleSizeFilter(sz)}
                        className="h-6 px-2 text-[11px] font-bold uppercase tracking-wider"
                      >
                        {sz}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1 min-w-0">
            {displayedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center max-w-lg mx-auto my-12">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-4 border border-slate-100">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Try adjusting your filter settings or search terms to find what you're looking for.
                </p>
                <Button
                  onClick={resetFilters}
                  className="mt-5 text-xs font-bold uppercase tracking-wider"
                >
                  Reset All Filters
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedProducts.map(product => {
                  const isFavorited = isInWishlist(product.id);

                  return (
                    <div
                      key={product.id}
                      id={`shop-grid-card-${product.id}`}
                      className="group bg-white rounded-2xl border border-slate-100 p-4 flex flex-col justify-between hover:border-slate-300 transition-all duration-300"
                    >
                      {/* Image Frame */}
                      <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                          onClick={() => navigateTo('product-detail', { productId: product.id })}
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                          {product.isBestSeller && (
                            <Badge className="bg-slate-900 text-white text-[8px] font-bold uppercase tracking-wider rounded-full">
                              Bestseller
                            </Badge>
                          )}
                          {product.originalPrice && (
                            <Badge className="bg-slate-900 text-white text-[8px] font-bold uppercase rounded-full">
                              Save {formatCurrency(product.originalPrice - product.price)}
                            </Badge>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleWishlist(product.id)}
                          className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full border transition-all p-0 ${
                            isFavorited
                              ? 'bg-rose-50 border-rose-200 text-rose-600'
                              : 'bg-white/90 border-slate-200 hover:bg-slate-900 hover:text-white text-slate-600'
                          }`}
                          aria-label="Wishlist"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-600' : ''}`} />
                        </Button>

                        {/* Quick View Button */}
                        <div className="absolute inset-x-2.5 bottom-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
                          <Button
                            variant="secondary"
                            onClick={() => setQuickViewProduct(product)}
                            className="w-full bg-white hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-[11px] uppercase tracking-wider border border-slate-200 gap-1.5 h-8"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Quick View</span>
                          </Button>
                        </div>
                      </div>

                      {/* Product Content */}
                      <div className="pt-3.5 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{product.category}</span>
                            <div className="flex items-center gap-1 text-slate-700 font-semibold text-[11px]">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{product.rating}</span>
                              <span className="text-slate-400 font-normal">({product.reviewCount})</span>
                            </div>
                          </div>

                          <h3
                            onClick={() => navigateTo('product-detail', { productId: product.id })}
                            className="text-sm font-bold text-slate-900 hover:text-slate-600 cursor-pointer line-clamp-1 transition-colors"
                          >
                            {product.name}
                          </h3>

                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-normal">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                          <div className="font-mono">
                            <span className="text-sm font-bold text-slate-900">
                              {formatCurrency(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-slate-400 line-through ml-1.5">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            )}
                          </div>

                          <Button
                            size="sm"
                            onClick={() => addToCart(product, 1)}
                            disabled={!product.inStock}
                            className="text-xs font-bold uppercase tracking-wider gap-1 h-7 px-3"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="space-y-3">
                {displayedProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col sm:flex-row gap-4 hover:border-slate-300 transition-all"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full sm:w-40 h-44 sm:h-auto object-cover rounded-xl bg-slate-50 cursor-pointer border border-slate-100"
                      onClick={() => navigateTo('product-detail', { productId: product.id })}
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{product.category} · {product.sku}</span>
                          <div className="flex items-center gap-1 text-slate-700 font-semibold text-xs">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{product.rating}</span>
                            <span className="text-slate-400 font-normal">({product.reviewCount})</span>
                          </div>
                        </div>

                        <h3
                          onClick={() => navigateTo('product-detail', { productId: product.id })}
                          className="text-base font-bold text-slate-900 hover:text-slate-600 cursor-pointer mt-1"
                        >
                          {product.name}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                          {product.detailedDescription || product.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {product.tags.map(t => (
                            <Badge key={t} variant="secondary" className="text-[9px] font-bold uppercase tracking-wider">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <div className="font-mono">
                          <span className="text-base font-bold text-slate-900">
                            {formatCurrency(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-slate-400 line-through ml-2">
                              {formatCurrency(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setQuickViewProduct(product)}
                            className="text-xs font-bold uppercase tracking-wider"
                          >
                            Quick View
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => addToCart(product, 1)}
                            disabled={!product.inStock}
                            className="text-xs font-bold uppercase tracking-wider gap-1.5"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Bag</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Trigger */}
            {hasMore && (
              <div ref={loadMoreRef} className="mt-10 text-center py-4">
                <Button
                  id="shop-load-more-btn"
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="gap-2 uppercase tracking-wider text-xs font-bold mx-auto"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="w-3.5 h-3.5" />
                      <span>Load More ({filteredAndSortedProducts.length - visibleCount} remaining)</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </main>
        </div>

        {/* Mobile Filter Modal */}
        {isFilterSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="fixed inset-0 bg-slate-950/60" onClick={() => setIsFilterSidebarOpen(false)} />
            <div className="relative ml-auto w-4/5 max-w-sm bg-white h-full p-6 overflow-y-auto z-10 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Filters</h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsFilterSidebarOpen(false)} className="h-8 w-8 text-slate-400 hover:text-slate-900">
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Category</label>
                  <div className="space-y-1 text-xs">
                    <Button
                      variant={filters.category === 'all' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => {
                        setFilters(prev => ({ ...prev, category: 'all', subCategory: 'all' }));
                        setIsFilterSidebarOpen(false);
                      }}
                      className="w-full justify-start text-xs font-medium"
                    >
                      All Products
                    </Button>
                    {categories.map(cat => (
                      <Button
                        key={cat.id}
                        variant={filters.category === cat.slug ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => {
                          setFilters(prev => ({ ...prev, category: cat.slug, subCategory: 'all' }));
                          setIsFilterSidebarOpen(false);
                        }}
                        className="w-full justify-start text-xs font-medium"
                      >
                        {cat.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setIsFilterSidebarOpen(false)}
                className="w-full font-bold text-xs uppercase tracking-wider mt-6"
              >
                Show Results
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
