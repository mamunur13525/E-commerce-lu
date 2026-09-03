import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  PackageCheck, 
  ShieldCheck, 
  X, 
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Truck,
  Layers,
  SlidersHorizontal,
  Compass,
  Phone
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    navigateTo,
    cartCount,
    cartSubtotal,
    wishlist,
    setIsCartOpen,
    products,
    storeSettings,
    userProfile,
    isGuestMode,
    setIsGuestMode,
    setIsLoginModalOpen,
    logoutUser,
    lastLoginTime,
    lastLogoutTime,
    setFilters
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products based on search
  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilters(prev => ({ ...prev, searchQuery: searchQuery.trim() }));
      navigateTo('shop', { query: searchQuery.trim() });
      setIsSearchFocused(false);
      setIsMobileSearchOpen(false);
    }
  };

  const selectSearchResult = (productId: string) => {
    navigateTo('product-detail', { productId });
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      {/* Announcement Bar */}
      {storeSettings.showAnnouncement && isAnnouncementVisible && (
        <div className="bg-slate-950 text-slate-200 text-[11px] sm:text-xs text-center font-normal tracking-wider py-2 px-4 flex items-center justify-center gap-2 relative">
          <span>{storeSettings.announcementText}</span>
          <button 
            onClick={() => setIsAnnouncementVisible(false)}
            className="absolute right-2 sm:right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navbar: Centered Search Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20 gap-4 lg:gap-8">
            
            {/* Brand Logo (Left) */}
          <button
            id="navbar-brand-logo"
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 text-left group flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
              L
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-950">
              LUMINA
            </span>
          </button>

          {/* Big Center Search Box */}
          <div 
            ref={searchContainerRef} 
            className="hidden md:flex flex-1 max-w-xl relative mx-2 lg:mx-6"
          >
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-4.5 pointer-events-none" />
                <Input
                  id="navbar-big-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search collection..."
                  className="w-full h-11 pl-11 pr-10 text-xs bg-slate-50/80 hover:bg-slate-100/60 border-slate-200/70 rounded-full transition-all focus-visible:bg-white focus-visible:border-slate-900 focus-visible:ring-1 focus-visible:ring-slate-900 placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* Instant Search Dropdown Results */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2.5 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in-50 duration-150">
                {searchResults.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
                      <span>Matching Products ({searchResults.length})</span>
                      <span>Press enter for full shop</span>
                    </div>
                    <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                      {searchResults.map(prod => (
                        <div
                          key={prod.id}
                          onClick={() => selectSearchResult(prod.id)}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group border border-transparent hover:border-slate-100"
                        >
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded-lg bg-slate-50 flex-shrink-0 border border-slate-100"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate group-hover:text-slate-700">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-slate-500 capitalize flex items-center gap-2 mt-0.5">
                              <span className="font-semibold text-slate-950">{formatCurrency(prod.price)}</span>
                              {prod.originalPrice && prod.originalPrice > prod.price && (
                                <span className="line-through text-slate-400 text-[10px]">{formatCurrency(prod.originalPrice)}</span>
                              )}
                              <span>·</span>
                              <span className="text-slate-400">{prod.category}</span>
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-800 transition-colors" />
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSearchSubmit}
                      className="w-full mt-3 text-xs font-bold"
                    >
                      View all catalog results for "{searchQuery}" <ArrowUpRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ) : searchQuery ? (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    <p className="font-medium">No products match "{searchQuery}".</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try keywords like 'cashmere', 'lamp', 'leather', or 'ceramic'.</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                      Popular Searches & Collections
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['Cashmere', 'Ceramics', 'Leather Duffel', 'Mules', 'Steel Watch', 'Selvedge Denim', 'Incense'].map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          onClick={() => {
                            setSearchQuery(tag);
                            setFilters(prev => ({ ...prev, searchQuery: tag }));
                            navigateTo('shop', { query: tag });
                            setIsSearchFocused(false);
                          }}
                          className="cursor-pointer hover:bg-slate-950 hover:text-white transition-colors py-1 px-2.5 text-[11px]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Actions (Track Order, User Orders, Wishlist, Cart, Profile) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Mobile Search Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              id="mobile-search-btn"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden rounded-full text-slate-700"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Button>



            {/* Track Order Direct Button (Req 2) */}
            <Button
              variant="ghost"
              size="sm"
              id="navbar-track-order-btn"
              onClick={() => navigateTo('track-order')}
              className={`hidden lg:flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1.5 transition-colors ${
                currentPage === 'track-order' 
                  ? 'bg-slate-950 text-white hover:bg-slate-900' 
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </Button>

            {/* My Orders Button (Req 2) */}
            <Button
              variant="ghost"
              size="sm"
              id="navbar-orders-btn"
              onClick={() => navigateTo('orders')}
              className={`hidden sm:flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1.5 transition-colors ${
                currentPage === 'orders' 
                  ? 'bg-slate-950 text-white hover:bg-slate-900' 
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>My Orders</span>
            </Button>

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              id="navbar-wishlist-btn"
              onClick={() => navigateTo('wishlist')}
              className="relative hidden sm:flex rounded-full text-slate-700 hover:text-slate-950 hover:bg-slate-100"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
              )}
            </Button>

            {/* Shopping Bag Button */}
            <Button
              variant="default"
              size="sm"
              id="navbar-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="rounded-full bg-slate-950 text-white hover:bg-slate-800 shadow-sm flex items-center gap-2 px-3.5 py-2 font-bold text-xs"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2.5 -right-3 bg-white text-slate-950 font-black text-[9px] h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center border border-slate-900"
                  >
                    {cartCount}
                  </Badge>
                )}
              </div>
              <span className="hidden sm:inline-block font-semibold">
                {formatCurrency(cartSubtotal)}
              </span>
            </Button>

            {/* User Profile & Admin Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  id="navbar-profile-btn"
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors focus-visible:outline-none ml-1"
                  aria-label="User profile"
                >
                  <Avatar className="w-8 h-8 ring-2 ring-slate-100">
                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                    <AvatarFallback className="text-xs font-bold bg-slate-900 text-white">
                      {userProfile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 bg-white rounded-2xl shadow-xl border border-slate-100">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Account</span>
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {isGuestMode ? 'Guest Collector' : userProfile.name}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate">
                      {isGuestMode ? 'guest@lumina.design' : userProfile.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => navigateTo('orders')}
                  className="text-xs cursor-pointer flex items-center justify-between py-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-slate-500" />
                    <span>My Orders</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => navigateTo('track-order')}
                  className="text-xs cursor-pointer flex items-center justify-between py-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-slate-500" />
                    <span>Track Order by ID</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => navigateTo('wishlist')}
                  className="text-xs cursor-pointer flex items-center justify-between py-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-slate-500" />
                    <span>Saved Favorites ({wishlist.length})</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Login / Auth Options */}
                <div className="px-2 py-1.5 space-y-1 text-[11px] text-slate-500 bg-slate-50 rounded-xl my-1">
                  <div className="flex justify-between">
                    <span>Last Login:</span>
                    <span className="font-mono text-slate-800">{lastLoginTime || 'Never'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Logout:</span>
                    <span className="font-mono text-slate-800">{lastLogoutTime || 'None'}</span>
                  </div>
                </div>

                <DropdownMenuItem
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-xs cursor-pointer flex items-center justify-between py-2 rounded-lg font-bold text-slate-900 bg-slate-100 hover:bg-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-900" />
                    <span>Sign In / Login</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={logoutUser}
                  className="text-xs cursor-pointer flex items-center justify-between py-2 rounded-lg text-rose-600 hover:bg-rose-50"
                >
                  <div className="flex items-center gap-2">
                    <span>Log Out</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Direct link to Standalone Admin Dashboard */}
                <DropdownMenuItem 
                  onClick={() => navigateTo('admin')}
                  className="text-xs font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 cursor-pointer flex items-center justify-between py-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-900" />
                    <span>Admin Dashboard</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] bg-slate-900 text-white">Admin</Badge>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem 
                  onClick={() => setIsGuestMode(!isGuestMode)}
                  className="text-[11px] text-slate-500 cursor-pointer py-1.5"
                >
                  {isGuestMode ? 'Switch to Registered User' : 'Switch to Guest Mode'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        {isMobileSearchOpen && (
          <div className="md:hidden pb-4 pt-1" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search products, cashmere, leather..."
                className="w-full pl-10 pr-10 text-xs rounded-full bg-slate-50 border-slate-200"
                autoFocus
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Mobile Search Dropdown Results */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-b-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in-50">
                {searchResults.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                      <span>Matching Products ({searchResults.length})</span>
                    </div>
                    <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                      {searchResults.map(prod => (
                        <div
                          key={prod.id}
                          onClick={() => selectSearchResult(prod.id)}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-10 h-10 object-cover rounded-md bg-slate-50 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-slate-900 truncate">
                              {prod.name}
                            </p>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <span className="font-semibold text-slate-950">{formatCurrency(prod.price)}</span>
                            </p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSearchSubmit}
                      className="w-full mt-2 text-[11px] font-bold h-8"
                    >
                      View all results <ArrowUpRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                ) : searchQuery ? (
                  <div className="py-6 text-center text-slate-500 text-[11px]">
                    <p className="font-medium">No products match "{searchQuery}".</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                      Popular Searches
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['Cashmere', 'Leather', 'Steel'].map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          onClick={() => {
                            setSearchQuery(tag);
                            setFilters(prev => ({ ...prev, searchQuery: tag }));
                            navigateTo('shop', { query: tag });
                            setIsSearchFocused(false);
                            setIsMobileSearchOpen(false);
                          }}
                          className="cursor-pointer hover:bg-slate-950 hover:text-white transition-colors py-0.5 px-2 text-[10px]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </header>
    </>
  );
};
