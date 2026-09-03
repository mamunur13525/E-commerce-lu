import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';

export const HeroSection: React.FC = () => {
  const { heroSlides, navigateTo, setFilters } = useStore();
  const [[currentSlideIdx, direction], setSlideTuple] = useState([0, 0]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying || heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setSlideTuple(prev => [(prev[0] + 1) % heroSlides.length, 1]);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides.length]);

  if (!heroSlides || heroSlides.length === 0) return null;

  const currentSlide = heroSlides[currentSlideIdx] || heroSlides[0];

  const handleNext = () => {
    setSlideTuple(prev => [(prev[0] + 1) % heroSlides.length, 1]);
  };

  const handlePrev = () => {
    setSlideTuple(prev => [(prev[0] - 1 + heroSlides.length) % heroSlides.length, -1]);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    if (swipe < -10000 || offset.x < -100) {
      handleNext();
    } else if (swipe > 10000 || offset.x > 100) {
      handlePrev();
    }
  };

  return (
    <section 
      className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[500px] sm:min-h-[580px] lg:min-h-[620px] flex items-center"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Gradient Overlays for High Contrast Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full h-full flex items-center">
            <div className="max-w-2xl pointer-events-auto space-y-4 sm:space-y-5">
              {/* Badge / Tagline */}
              {currentSlide.tagline && (
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-300">
                  {currentSlide.tagline}
                </p>
              )}

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.15]">
                {currentSlide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-lg">
                {currentSlide.subtitle}
              </p>

              {/* Call-to-Action Buttons */}
              <div className="flex items-center gap-4 pt-2">
                <Button
                  id="hero-primary-cta"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilters(prev => ({ ...prev, category: 'all' }));
                    navigateTo('shop');
                  }}
                  className="bg-white text-slate-950 hover:bg-slate-100 shadow-md rounded-full px-7 font-medium text-xs tracking-wider uppercase"
                >
                  <span>{currentSlide.ctaText || 'Shop Collection'}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Controls: Previous & Next Arrows */}
      {heroSlides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-slate-950/50 hover:bg-slate-950/80 text-white border border-white/20 hidden sm:flex"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
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
              onClick={(e) => {
                e.stopPropagation();
                setSlideTuple([idx, idx > currentSlideIdx ? 1 : -1]);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlideIdx === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
