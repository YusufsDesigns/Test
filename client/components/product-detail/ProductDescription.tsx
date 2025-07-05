// components/product/ProductDescription.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { PortableText } from "@portabletext/react";
import { SanityProduct } from "@/lib/sanity";

interface ProductDescriptionProps {
  product: SanityProduct;
  className?: string;
}

// Portable Text components for rich description
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-xl font-semibold mb-3 text-gray-900">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg font-medium mb-2 text-gray-900">{children}</h3>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
  },
};

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  product,
  className = "",
}) => {
  return (
    <div className={className}>
      {/* Product Description */}
      {product.description && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="border-t-2 border-gray-100 pt-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Description
          </h3>
          <div className="prose prose-gray max-w-none">
            <PortableText
              value={product.description}
              components={portableTextComponents}
            />
          </div>
        </motion.div>
      )}

      {/* Product Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="border-t-2 border-gray-100 pt-8 space-y-3 text-sm"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Product Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-900">SKU:</span>
            <span className="text-gray-600">
              {product._id.slice(-8).toUpperCase()}
            </span>
          </div>

          {product.category && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-900">Category:</span>
              <span className="text-gray-600 capitalize">
                {product.category.replace("_", " ")}
              </span>
            </div>
          )}

          {product.subcategory && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-900">Type:</span>
              <span className="text-gray-600 capitalize">
                {product.subcategory.replace("_", " ")}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="font-medium text-gray-900">Brand:</span>
            <span className="text-gray-600">Aleebansparks</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDescription;