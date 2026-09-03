import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export const FacebookReviewsSlider: React.FC = () => {
  const { facebookReviews: reviews } = useStore();
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide every 3s if reviews exist
  useEffect(() => {
    if (!reviews || reviews.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setStartIndex(prev => (prev + 1) % reviews.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, reviews?.length]);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const handleNext = () => {
    setStartIndex(prev => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setStartIndex(prev => (prev - 1 + reviews.length) % reviews.length);
  };

  // Select visible items for display
  const visibleReviews = reviews.length === 1 
    ? [reviews[0]] 
    : [reviews[startIndex % reviews.length], reviews[(startIndex + 1) % reviews.length]];

  return (
    <section 
      className="py-12 sm:py-16 bg-[#fafaf9] border-b border-slate-200/70 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Community Reviews
            </h2>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="w-8 h-8 rounded-full border-slate-200"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="w-8 h-8 rounded-full border-slate-200"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {visibleReviews.map((review, idx) => (
              <motion.div
                key={`${review.id}-${idx}-${startIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-4 bg-white rounded-xl border-slate-200/70 shadow-none flex flex-col justify-between h-full">
                  <div>
                    {/* Header: Author + Rating */}
                    <div className="flex items-center justify-between gap-3 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={review.authorAvatar}
                          alt={review.authorName}
                          className="w-8 h-8 rounded-full object-cover bg-slate-100"
                        />
                        <div>
                          <h4 className="text-xs font-semibold text-slate-900">
                            {review.authorName}
                          </h4>
                          <p className="text-[10px] text-slate-400">
                            {review.authorLocation}
                          </p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review text */}
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      "{review.content}"
                    </p>
                  </div>

                  {review.productMentioned && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="truncate">{review.productMentioned}</span>
                      <span>Verified Buyer</span>
                    </div>
                  )}
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
