import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  ChevronRight, 
  Check, 
  MessageSquare, 
  Send,
  User,
  FileText,
  HelpCircle,
  Sparkles,
  Share2,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Info
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProductId, 
    products, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    navigateTo, 
    addProductComment,
    addToast
  } = useStore();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | undefined>(
    product?.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'write-review' | 'discussion'>('description');

  // Review & Comment Form State
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [discussionQuestion, setDiscussionQuestion] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Button onClick={() => navigateTo('shop')} className="mt-4 rounded-full">
          Return to Shop
        </Button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 6);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    addToast('Added to Cart', `${product.name} (Qty: ${quantity}) is in your shopping bag.`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    navigateTo('checkout');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    addProductComment(product.id, {
      userName: commentName.trim() || 'Verified Collector',
      text: commentText.trim(),
      rating: commentRating,
    });

    setCommentText('');
    setCommentName('');
    setCommentEmail('');
    setIsSubmittingComment(false);
    addToast('Review Submitted', 'Thank you for sharing your feedback with the community!', 'success');
    setActiveTab('reviews');
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionQuestion.trim()) return;
    addProductComment(product.id, {
      userName: 'Collector Inquiry',
      text: `Question: ${discussionQuestion.trim()}`,
      rating: 5,
    });
    setDiscussionQuestion('');
    addToast('Question Posted', 'Our studio specialists will reply within 24 hours.', 'info');
  };

  return (
    <div className="bg-[#fafaf9] min-h-screen py-6 sm:py-10 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
          <button onClick={() => navigateTo('home')} className="hover:text-slate-900 transition-colors">Home</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => navigateTo('shop')} className="hover:text-slate-900 transition-colors">Catalog</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="capitalize text-slate-600">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Hero Stage */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 border border-slate-200/80 shadow-xs mb-10">
          
          {/* Left: Gallery (5 cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
              <img
                src={product.images[selectedImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Badges */}
              <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
                {product.isBestSeller && (
                  <Badge className="bg-slate-950 text-white font-bold uppercase tracking-wider text-[9px]">
                    Bestseller
                  </Badge>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <Badge className="bg-amber-400 text-slate-950 font-black text-[9px]">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </Badge>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-xs ${
                  isFavorited ? 'bg-rose-50 text-rose-600' : 'bg-white text-slate-700 hover:text-slate-950'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-slate-50 ${
                      selectedImageIdx === idx ? 'border-slate-950 ring-2 ring-slate-950/10' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Purchase Controls (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {product.category} · SKU: {product.sku}
                  </span>
                  <div className="flex items-center gap-1 text-slate-900 text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviewCount} reviews)</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 mt-1.5 leading-tight">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-3 font-mono">
                  <span className="text-3xl font-black text-slate-950">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base text-slate-400 line-through font-mono">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 text-xs font-bold font-mono">
                      Save {formatCurrency(product.originalPrice - product.price)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block mb-2">
                    Color: <span className="font-normal text-slate-600">{selectedColor?.name || product.colors[0].name}</span>
                  </label>
                  <div className="flex gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          (selectedColor?.name || product.colors?.[0].name) === color.name
                            ? 'border-slate-950 scale-110 shadow-xs'
                            : 'border-transparent hover:scale-105'
                        }`}
                        title={color.name}
                      >
                        <span 
                          className="w-5 h-5 rounded-full border border-black/10 shadow-xs" 
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                      Select Size
                    </label>
                    <span className="text-xs text-slate-400 underline cursor-pointer hover:text-slate-900">Size Chart</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map(sz => (
                      <Button
                        key={sz}
                        variant={(selectedSize || product.sizes?.[0]) === sz ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedSize(sz)}
                        className="h-8 px-3.5 text-xs font-bold uppercase tracking-wider rounded-xl"
                      >
                        {sz}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Stock */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quantity</span>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-slate-100 text-slate-700 transition-colors"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3.5 text-xs font-bold text-slate-900 font-mono">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="p-2 hover:bg-slate-100 text-slate-700 transition-colors"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs font-semibold">
                  {product.inStock ? (
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1 font-bold text-[11px]">
                      <Check className="w-3.5 h-3.5" />
                      In Stock ({product.stockQuantity} units)
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold">Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="space-y-2.5 pt-2">
                <div className="flex gap-3">
                  <Button
                    id="pdp-add-to-bag"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 rounded-2xl h-12 bg-slate-950 text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-wider gap-2 shadow-xs"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag</span>
                  </Button>
                </div>

                <Button
                  id="pdp-instant-buy"
                  variant="outline"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="w-full rounded-2xl h-12 border-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-900 hover:text-white transition-colors"
                >
                  Instant Direct Checkout
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4 text-slate-900 mb-0.5" />
                  <span className="text-[11px] font-bold text-slate-900">Carbon Neutral</span>
                  <span className="text-[9px] text-slate-400">Free on $150+</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 text-slate-900 mb-0.5" />
                  <span className="text-[11px] font-bold text-slate-900">30-Day Returns</span>
                  <span className="text-[9px] text-slate-400">Prepaid shipping</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-slate-900 mb-0.5" />
                  <span className="text-[11px] font-bold text-slate-900">Authentic Guild</span>
                  <span className="text-[9px] text-slate-400">Studio certified</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Detailed Tabs Section (Req 10): Description, Customer Reviews, Custom Review, Discussion */}
        <Card className="p-6 sm:p-10 bg-white rounded-3xl border-slate-200/80 shadow-xs mb-14">
          
          {/* Tab Navigation Header */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('description')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'description'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Description & Specs</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Customer Reviews ({product.comments?.length || product.reviewCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('write-review')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'write-review'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Write a Custom Review</span>
            </button>

            <button
              onClick={() => setActiveTab('discussion')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'discussion'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discussion & Questions</span>
            </button>
          </div>

          {/* Tab 1: Detailed Description */}
          {activeTab === 'description' && (
            <div className="pt-8 space-y-8 animate-in fade-in duration-200">
              <div className="max-w-3xl">
                <h3 className="text-xl font-black text-slate-950 mb-3">
                  Craftsmanship & Material Integrity
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.detailedDescription || product.description}
                </p>
              </div>

              {/* Specifications Table */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Materials</span>
                  <p className="text-xs font-bold text-slate-900">100% Certified Sustainable</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Vegetable dyes & unbleached natural fibers</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Origin & Workshop</span>
                  <p className="text-xs font-bold text-slate-900">Artisan Guild Partner</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Numbered limited batch release</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Care & Longevity</span>
                  <p className="text-xs font-bold text-slate-900">Gentle Hand Clean</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Includes complimentary lifetime warranty</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Customer Reviews */}
          {activeTab === 'reviews' && (
            <div className="pt-8 space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-black text-slate-950">
                    Verified Customer Feedback
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real impressions from verified collectors worldwide.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                  <span className="font-mono text-2xl font-black text-slate-950">{product.rating}</span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {product.comments && product.comments.length > 0 ? (
                  product.comments.map(comment => (
                    <Card key={comment.id} className="p-4 bg-slate-50/70 border-slate-100 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                            <AvatarFallback className="text-xs font-bold">{comment.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{comment.userName}</span>
                              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-emerald-50 text-emerald-700 border-emerald-200">
                                Verified Owner
                              </Badge>
                            </div>
                            <span className="text-[10px] text-slate-400">{comment.date}</span>
                          </div>
                        </div>

                        {comment.rating && (
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < (comment.rating || 5) ? 'fill-amber-400' : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                        {comment.text}
                      </p>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs text-slate-500">No customer reviews yet for this piece.</p>
                    <Button
                      size="sm"
                      onClick={() => setActiveTab('write-review')}
                      className="mt-3 rounded-full text-xs font-bold"
                    >
                      Write First Review
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Custom Review Form */}
          {activeTab === 'write-review' && (
            <div className="pt-8 max-w-2xl animate-in fade-in duration-200">
              <h3 className="text-xl font-black text-slate-950 mb-1">
                Share Your Customer Review
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Tell the community about material handfeel, craftsmanship, sizing, and your overall experience.
              </p>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Rating selection */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Your Overall Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setCommentRating(star)}
                        className="p-1 hover:scale-115 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${star <= commentRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-800 ml-2">{commentRating}.0 Stars</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Your Full Name
                    </label>
                    <Input
                      type="text"
                      required
                      value={commentName}
                      onChange={e => setCommentName(e.target.value)}
                      placeholder="e.g. Jordan Mitchell"
                      className="bg-slate-50 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                      Email (Private)
                    </label>
                    <Input
                      type="email"
                      required
                      value={commentEmail}
                      onChange={e => setCommentEmail(e.target.value)}
                      placeholder="jordan@example.com"
                      className="bg-slate-50 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Your Written Review
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Describe how the piece looks in person, texture, weight, sizing..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="rounded-2xl h-11 px-8 bg-slate-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800"
                >
                  <Send className="w-3.5 h-3.5 mr-2" />
                  <span>Publish Review</span>
                </Button>
              </form>
            </div>
          )}

          {/* Tab 4: Discussion & Questions */}
          {activeTab === 'discussion' && (
            <div className="pt-8 space-y-6 max-w-3xl animate-in fade-in duration-200">
              <div>
                <h3 className="text-xl font-black text-slate-950">
                  Community Q&A and Studio Discussion
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Have a question about dimensions, custom fit, or studio care? Ask directly below.
                </p>
              </div>

              <form onSubmit={handlePostQuestion} className="flex gap-2">
                <Input
                  type="text"
                  value={discussionQuestion}
                  onChange={e => setDiscussionQuestion(e.target.value)}
                  placeholder="Ask a question about this archive piece..."
                  className="bg-slate-50 rounded-2xl h-12 text-xs"
                />
                <Button
                  type="submit"
                  className="rounded-2xl h-12 px-6 bg-slate-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 flex-shrink-0"
                >
                  Post Question
                </Button>
              </form>

              {/* Sample Studio QA thread */}
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Q: Does this piece require dry cleaning or cold wash?</span>
                    <span className="text-[10px] text-slate-400">2 days ago</span>
                  </div>
                  <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                    <strong className="text-slate-900">Lumina Studio:</strong> Hand wash with cold water or dry clean is recommended to maintain the natural fiber resilience and organic botanical dyes.
                  </p>
                </div>
              </div>
            </div>
          )}

        </Card>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-slate-950">
                You May Also Admire
              </h3>
              <Button
                variant="link"
                onClick={() => navigateTo('shop')}
                className="text-xs font-bold text-slate-900 p-0"
              >
                View Catalog
              </Button>
            </div>

            {/* Smaller product cards 5-6 in a line */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {relatedProducts.map(rel => (
                <Card
                  key={rel.id}
                  onClick={() => navigateTo('product-detail', { productId: rel.id })}
                  className="p-2.5 bg-white hover:border-slate-400 transition-all cursor-pointer group border-slate-200/80 rounded-2xl flex flex-col justify-between"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-50 border border-slate-100 mb-2">
                    <img src={rel.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500" />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-slate-600">{rel.name}</h4>
                    <span className="font-mono text-xs font-bold text-slate-950 mt-0.5 block">
                      {formatCurrency(rel.price)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
