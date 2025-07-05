// components/product/ProductInfo.tsx
"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { SanityProduct } from '@/lib/sanity';

interface ProductInfoProps {
  product: SanityProduct;
  className?: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, className = "" }) => {
  const effectivePrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Brand Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-xs font-medium uppercase tracking-wider">
          <Star className="w-3 h-3 mr-2" />
          Aleebansparks
        </span>
      </motion.div>

      {/* Product Name */}
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl lg:text-4xl font-light text-gray-900 leading-tight"
      >
        {product.name}
      </motion.h1>
      
      {/* Price Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-baseline gap-4"
      >
        <span className="text-2xl lg:text-3xl font-medium text-gray-900">
          ₦{effectivePrice.toLocaleString()}
        </span>
        {hasDiscount && (
          <>
            <span className="text-lg text-gray-500 line-through">
              ₦{product.price.toLocaleString()}
            </span>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-3 py-1 bg-red-600 text-white text-sm font-medium uppercase tracking-wide"
            >
              {Math.round(((product.price - effectivePrice) / product.price) * 100)}% OFF
            </motion.span>
          </>
        )}
      </motion.div>

      {/* Status Indicators */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-3"
      >
        {product.isNew && (
          <span className="px-3 py-1 bg-green-50 text-green-800 text-xs font-medium uppercase tracking-wide border border-green-200">
            New Arrival
          </span>
        )}
        {product.isFeatured && (
          <span className="px-3 py-1 bg-blue-50 text-blue-800 text-xs font-medium uppercase tracking-wide border border-blue-200">
            Featured
          </span>
        )}
      </motion.div>
    </div>
  );
};

export default ProductInfo;