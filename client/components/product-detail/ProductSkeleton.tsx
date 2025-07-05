// components/product-detail/ProductSkeleton.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

const SkeletonBox: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

const SkeletonText: React.FC<{ className?: string; lines?: number }> = ({
  className = "",
  lines = 1,
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`bg-gray-200 animate-pulse rounded h-4 ${
          i === lines - 1 ? "w-3/4" : "w-full"
        }`}
      />
    ))}
  </div>
);

const ProductDetailSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      {/* Breadcrumb Skeleton */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-2">
            <SkeletonBox className="h-4 w-12" />
            <SkeletonBox className="h-4 w-4" />
            <SkeletonBox className="h-4 w-20" />
            <SkeletonBox className="h-4 w-4" />
            <SkeletonBox className="h-4 w-32" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            {/* Main Image */}
            <SkeletonBox className="aspect-[4/5] w-full" />

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBox key={i} className="aspect-square" />
              ))}
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="space-y-10">
            {/* Product Info */}
            <div className="space-y-6">
              {/* Brand Badge */}
              <SkeletonBox className="h-8 w-32" />

              {/* Product Name */}
              <div className="space-y-2">
                <SkeletonBox className="h-10 w-full" />
                <SkeletonBox className="h-10 w-3/4" />
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <SkeletonBox className="h-8 w-24" />
                <SkeletonBox className="h-6 w-20" />
                <SkeletonBox className="h-6 w-16" />
              </div>

              {/* Status Badges */}
              <div className="flex gap-3">
                <SkeletonBox className="h-6 w-20" />
                <SkeletonBox className="h-6 w-16" />
                <SkeletonBox className="h-6 w-18" />
              </div>

              {/* Stock Progress */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <SkeletonBox className="h-4 w-24" />
                  <SkeletonBox className="h-4 w-16" />
                </div>
                <SkeletonBox className="h-2 w-full rounded-full" />
              </div>
            </div>

            {/* Stock Warning Skeleton */}
            <SkeletonBox className="h-16 w-full rounded-lg" />

            {/* Product Options */}
            <div className="space-y-8">
              {/* Size Selection */}
              <div className="space-y-4">
                <SkeletonBox className="h-4 w-20" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonBox key={i} className="h-12" />
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-4">
                <SkeletonBox className="h-4 w-24" />
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonBox key={i} className="h-10 w-16" />
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <SkeletonBox className="h-4 w-16" />
                  <div className="space-y-1">
                    <SkeletonBox className="h-3 w-12" />
                    <SkeletonBox className="h-3 w-16" />
                  </div>
                </div>
                <SkeletonBox className="h-12 w-32" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <SkeletonBox className="h-14 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <SkeletonBox className="h-12" />
                <SkeletonBox className="h-12" />
              </div>

              {/* Additional Info */}
              <div className="space-y-2">
                <SkeletonText lines={3} />
              </div>
            </div>

            {/* Description */}
            <div className="border-t-2 border-gray-100 pt-8 space-y-4">
              <SkeletonBox className="h-6 w-32" />
              <SkeletonText lines={5} />
            </div>

            {/* Product Details */}
            <div className="border-t-2 border-gray-100 pt-8 space-y-4">
              <SkeletonBox className="h-6 w-40" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <SkeletonBox className="h-4 w-16" />
                    <SkeletonBox className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <SkeletonBox className="h-8 w-48 mx-auto mb-4" />
            <SkeletonBox className="h-4 w-64 mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <SkeletonBox className="aspect-[4/5] w-full" />
                <div className="space-y-2">
                  <SkeletonBox className="h-4 w-full" />
                  <SkeletonBox className="h-4 w-3/4" />
                  <div className="flex justify-between items-center">
                    <SkeletonBox className="h-5 w-16" />
                    <SkeletonBox className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailSkeleton;
