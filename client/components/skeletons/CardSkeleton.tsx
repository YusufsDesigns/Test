// components/skeletons/CardSkeleton.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

interface CardSkeletonProps {
  count?: number;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({ count = 4 }) => {
  return (
    <div className="flex gap-1 lg:gap-2 overflow-x-auto scrollbar-hide pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: index * 0.1,
              duration: 0.4,
            },
          }}
          className="flex-shrink-0 w-40 md:w-[320px] lg:w-auto"
        >
          {/* Image skeleton */}
          <div className="relative bg-gray-200 h-[241px] md:h-[350px] lg:h-[430px] w-full overflow-hidden animate-pulse">
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>

            {/* Heart icon skeleton */}
            <div className="absolute top-3 right-3 w-9 h-9 bg-gray-300 rounded-full animate-pulse"></div>
          </div>

          {/* Product info skeleton */}
          <div className="mt-3 space-y-2">
            {/* Product name skeleton */}
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>

            {/* Price skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Custom CSS for shimmer effect */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default CardSkeleton;
