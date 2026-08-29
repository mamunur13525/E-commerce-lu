import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export const HeroSection: React.FC = () => {
  const { heroSlides, navigateTo, setFilters } = useStore();
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying || heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIdx(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides.length]);

  if (!heroSlides || heroSlides.length === 0) return null;

  const currentSlide = heroSlides[currentSlideIdx] || heroSlides[0];

  const handleNext = () => {
    setCurrentSlideIdx(prev => (prev + 1) % heroSlides.length);
  };

  const handlePrev = () => {
    setCurrentSlideIdx(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section 
      className="relative w-full overflow-hidden bg-slate-950 text-white"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="relative min-h-[500px] sm:min-h-[580px] lg:min-h-[620px] w-full flex items-center">
        
        {/* Background Image with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 z-0"
          >
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Gradient Overlays for High Contrast Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />
          </motion.div>
        </AnimatePresence>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="space-y-4 sm:space-y-5"
              >
                {/* Badge / Tagline */}
                <div className="flex items-center gap-2.5">
                  {currentSlide.badge && (
                    <Badge variant="secondary" className="bg-white text-slate-900 font-extrabold gap-1">
                      <Sparkles className="w-3 h-3 text-slate-900" />
                      {currentSlide.badge}
                    </Badge>
                  )}
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-300">
                    {currentSlide.tagline}
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                  {currentSlide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-xl">
                  {currentSlide.subtitle}
                </p>

                {/* Call-to-Action Buttons using shadcn Button */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2 sm:pt-4">
                  <Button
                    id="hero-primary-cta"
                    size="lg"
                    onClick={() => {
                      setFilters(prev => ({ ...prev, category: 'all' }));
                      navigateTo('shop');
                    }}
                    className="bg-white text-slate-950 hover:bg-slate-100 shadow-xl rounded-full px-8 group font-bold tracking-wider"
                  >
                    <span>{currentSlide.ctaText || 'Explore Collection'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  {currentSlide.secondaryCtaText && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setFilters(prev => ({ ...prev, category: 'all' }));
                        navigateTo('shop');
                      }}
                      className="bg-slate-900/80 hover:bg-slate-900 text-white rounded-full border-slate-700 hover:border-slate-500 tracking-wider"
                    >
                      {currentSlide.secondaryCtaText}
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide Controls: Previous & Next Arrows */}
        {heroSlides.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-slate-950/50 hover:bg-slate-950/80 text-white border border-white/20 hidden sm:flex"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-slate-950/50 hover:bg-slate-950/80 text-white border border-white/20 hidden sm:flex"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Pagination Dots */}
        {heroSlides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-950/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIdx(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlideIdx === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
