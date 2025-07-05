// components/product/RelatedProducts.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SanityProduct } from "@/lib/sanity";
import Card from "@/components/kits/Card";

interface RelatedProductsProps {
  products: SanityProduct[];
  categorySlug?: string;
  className?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products,
  categorySlug,
  className = "",
}) => {
  if (products.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className={`mt-20 border-t-2 border-gray-100 pt-16 ${className}`}
    >
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
          You might also love
        </h2>
        {categorySlug && (
          <Link
            href={`/${categorySlug}`}
            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center group"
          >
            View all
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: 1.4 + index * 0.1,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            }}
          >
            <Card product={product} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedProducts;
