import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';

export interface ProductCardSkeletonProps {
  className?: string;
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-100 p-3 sm:p-4 flex flex-col justify-between shadow-xs animate-pulse",
        className
      )}
    >
      {/* Image frame skeleton (aspect 4/5) */}
      <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-slate-100/90 flex items-center justify-center">
        <Skeleton className="w-full h-full rounded-xl bg-slate-200/70" />

        {/* Top Badges placeholder */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1">
          <Skeleton className="w-12 sm:w-16 h-4 sm:h-4.5 rounded-full bg-slate-300/80" />
        </div>

        {/* Top Right Wishlist button placeholder */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5">
          <Skeleton className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-300/80" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="pt-2.5 sm:pt-3.5 flex flex-col justify-between flex-1">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-1.5">
            <Skeleton className="w-14 sm:w-16 h-3 rounded bg-slate-200/80" />
            <Skeleton className="w-10 sm:w-12 h-3 rounded bg-slate-200/80" />
          </div>

          {/* Title */}
          <Skeleton className="w-3/4 h-3.5 sm:h-4 rounded bg-slate-300/90 mb-1.5" />

          {/* Description */}
          <Skeleton className="w-full h-2.5 sm:h-3 rounded bg-slate-200/60" />
        </div>

        {/* Price & Action Button */}
        <div className="flex items-center justify-between mt-2.5 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-100 gap-2">
          <Skeleton className="w-12 sm:w-16 h-4 sm:h-4.5 rounded bg-slate-300/80" />
          <Skeleton className="w-12 sm:w-14 h-7 rounded-lg bg-slate-200/90 shrink-0" />
        </div>
      </div>
    </div>
  );
};

export interface ProductGridSkeletonProps {
  count?: number;
  columnsClass?: string;
  className?: string;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  count = 8,
  columnsClass = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  className,
}) => {
  return (
    <div
      className={cn(
        "grid gap-3 sm:gap-4 w-full",
        columnsClass,
        className
      )}
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export interface ProductListSkeletonProps {
  count?: number;
  className?: string;
}

export const ProductListSkeleton: React.FC<ProductListSkeletonProps> = ({
  count = 4,
  className,
}) => {
  return (
    <div className={cn("space-y-3 w-full", className)} aria-label="Loading products list">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col sm:flex-row gap-4 animate-pulse shadow-xs"
        >
          {/* Image skeleton */}
          <Skeleton className="w-full sm:w-40 h-44 sm:h-36 rounded-xl shrink-0 bg-slate-200/70" />

          {/* Info skeleton */}
          <div className="flex-1 flex flex-col justify-between py-1">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Skeleton className="w-20 h-3 rounded bg-slate-200/80" />
                <Skeleton className="w-12 h-3 rounded bg-slate-200/80" />
              </div>
              <Skeleton className="w-2/3 h-5 rounded bg-slate-300/90" />
              <Skeleton className="w-full h-3 rounded bg-slate-200/60" />
              <div className="flex gap-1.5 pt-1">
                <Skeleton className="w-12 h-4 rounded-full bg-slate-200/60" />
                <Skeleton className="w-12 h-4 rounded-full bg-slate-200/60" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
              <Skeleton className="w-16 h-5 rounded bg-slate-300/80" />
              <div className="flex gap-2">
                <Skeleton className="w-20 h-8 rounded-lg bg-slate-200/80" />
                <Skeleton className="w-24 h-8 rounded-lg bg-slate-200/90" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
