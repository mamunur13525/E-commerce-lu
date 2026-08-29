import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  ShieldCheck, 
  ExternalLink,
  Pause,
  Play
} from 'lucide-react';
import { INITIAL_FACEBOOK_REVIEWS } from '../../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

export const FacebookReviewsSlider: React.FC = () => {
  const { navigateTo } = useStore();
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  const reviews = INITIAL_FACEBOOK_REVIEWS;

  // Auto-slide every 1s (1000ms) as requested (Req 6)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setStartIndex(prev => (prev + 1) % reviews.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, reviews.length]);

  const handleNext = () => {
    setStartIndex(prev => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setStartIndex(prev => (prev - 1 + reviews.length) % reviews.length);
  };

  const toggleLike = (reviewId: string) => {
    setLikedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Select 2 visible items for 2 items in a line (Req 6)
  const visibleReviews = [
    reviews[startIndex],
    reviews[(startIndex + 1) % reviews.length]
  ];

  return (
    <section 
      className="py-12 sm:py-16 bg-[#fafaf9] border-b border-slate-200/70 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              <div className="w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-[9px]">
                f
              </div>
              <span>Verified Facebook Reviews</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              Real Stories from Satisfied Owners
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live community feedback auto-updating in real time.
            </p>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors text-xs flex items-center gap-1 px-2.5"
              title={isPaused ? "Resume auto slide" : "Pause auto slide"}
            >
              {isPaused ? <Play className="w-3 h-3 text-emerald-600" /> : <Pause className="w-3 h-3" />}
              <span className="text-[10px] font-bold">{isPaused ? 'Paused' : '1s Auto'}</span>
            </button>

            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="w-8 h-8 rounded-full bg-white"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-white"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 2 Items in a Line, smaller review cards like product cards (Req 6) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {visibleReviews.map((review, idx) => (
              <motion.div
                key={`${review.id}-${idx}-${startIndex}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="p-4 bg-white rounded-2xl border-slate-200/90 shadow-xs hover:border-slate-400 transition-all flex flex-col justify-between h-full">
                  <div>
                    {/* Header: Author + Facebook badge + Rating */}
                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <img
                            src={review.authorAvatar}
                            alt={review.authorName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-100"
                          />
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-[8px] border border-white">
                            f
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-slate-900 truncate max-w-[140px]">
                              {review.authorName}
                            </h4>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {review.authorLocation} · {review.timeAgo}
                          </p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex-shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-2.5 h-2.5 ${
                              i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review text */}
                    <p className="text-xs text-slate-700 mt-3 leading-relaxed line-clamp-3">
                      "{review.content}"
                    </p>

                    {/* Product Mentioned Mini Box */}
                    {review.productMentioned && (
                      <div className="mt-3 flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                        {review.productImage && (
                          <img
                            src={review.productImage}
                            alt={review.productMentioned}
                            className="w-8 h-8 rounded-lg object-cover bg-white flex-shrink-0 border border-slate-200"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Verified Item</span>
                          <span className="text-[11px] font-bold text-slate-900 truncate block">
                            {review.productMentioned}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Facebook Reaction Footer */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <button
                      onClick={() => toggleLike(review.id)}
                      className={`flex items-center gap-1 font-bold text-[10px] uppercase transition-colors ${
                        likedReviews[review.id] ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                      }`}
                    >
                      <ThumbsUp className={`w-3 h-3 ${likedReviews[review.id] ? 'fill-blue-600' : ''}`} />
                      <span>{review.likes + (likedReviews[review.id] ? 1 : 0)} Likes</span>
                    </button>

                    <div className="flex items-center gap-3 text-slate-400">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" /> {review.comments}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-emerald-700 font-semibold text-[10px]">Verified Buyer</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Progress dot indicators */}
        <div className="flex justify-center gap-1.5 mt-5">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStartIndex(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${
                startIndex === idx ? 'w-5 bg-slate-950' : 'w-1 bg-slate-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
