import React from 'react';
import { HeroSection } from '../home/HeroSection';
import { StickyCategories } from '../home/StickyCategories';
import { PopularProducts } from '../home/PopularProducts';
import { FacebookReviewsSlider } from '../home/FacebookReviewsSlider';
import { useStore } from '../../context/StoreContext';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full bg-[#fafaf9] overflow-hidden">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Categories section directly below hero section (Req 3) */}
      <StickyCategories />

      {/* 3. Products cards (5 or 6 items in the line, compact) (Req 4) */}
      <PopularProducts />

      {/* 4. Real Stories from Satisfied Owners (2 items per line, auto-slide 1s) (Req 6) */}
      <FacebookReviewsSlider />
    </div>
  );
};
