import React, { useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';

interface ImagePreviewModalProps {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  productName?: string;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  images,
  initialIndex = 0,
  onClose,
  productName = 'Product Preview'
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImg = images[currentIndex] || images[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Drag / Swipe handlers for drag-to-slide
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX === null) return;
    const currentX = e.touches[0].clientX;
    setDragOffset(currentX - dragStartX);
  };

  const handleTouchEnd = () => {
    if (dragStartX === null) return;
    if (dragOffset > 70 && images.length > 1) {
      handlePrev();
    } else if (dragOffset < -70 && images.length > 1) {
      handleNext();
    }
    setDragStartX(null);
    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartX === null) return;
    const currentX = e.clientX;
    setDragOffset(currentX - dragStartX);
  };

  const handleMouseUp = () => {
    if (dragStartX === null) return;
    if (dragOffset > 70 && images.length > 1) {
      handlePrev();
    } else if (dragOffset < -70 && images.length > 1) {
      handleNext();
    }
    setDragStartX(null);
    setDragOffset(0);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none"
        onClick={onClose}
      >
        {/* Top Header */}
        <div className="w-full max-w-7xl flex items-center justify-between text-white z-10" onClick={e => e.stopPropagation()}>
          <div>
            <h3 className="text-sm sm:text-base font-bold tracking-tight truncate max-w-md">{productName}</h3>
            <p className="text-xs text-slate-400">
              Image {currentIndex + 1} of {images.length} {images.length > 1 && '· Drag or use arrows to slide'}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Image Stage with Drag / Swipe */}
        <div
          className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-4 overflow-hidden cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={e => e.stopPropagation()}
        >
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-white hover:text-slate-950 text-white flex items-center justify-center transition-all shadow-lg border border-white/10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-6 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-white hover:text-slate-950 text-white flex items-center justify-center transition-all shadow-lg border border-white/10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95, x: dragOffset }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative max-h-[75vh] max-w-full flex items-center justify-center"
          >
            <img
              src={currentImg}
              alt={productName}
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl pointer-events-none"
            />
          </motion.div>
        </div>

        {/* Bottom Thumbnails */}
        {images.length > 1 && (
          <div className="w-full max-w-md flex items-center justify-center gap-2 overflow-x-auto pb-2 z-10 no-scrollbar" onClick={e => e.stopPropagation()}>
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-white/10 ${
                  currentIndex === idx ? 'border-white scale-105 shadow-md' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
