// app/wishlist/page.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  useWishlist,
  WishlistItem,
} from "@/providers/WishlistProvider";
import { useCart } from "@/providers/CartProvider";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, Heart, ArrowLeft, X } from "lucide-react";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.3,
    },
  },
};

const WishlistItemComponent: React.FC<{ item: WishlistItem }> = ({ item }) => {
  const { removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const addToCartFromWishlist = () => {
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.discountPrice || item.price,
      mainImage: item.mainImage,
      slug: item.slug,
      inStock: item.inStock,
      quantity: 1,
    });
    removeFromWishlist(item._id);
  };

  const effectivePrice = item.discountPrice || item.price;
  const hasDiscount = item.discountPrice && item.discountPrice < item.price;

  return (
    <motion.div
      variants={itemVariants}
      layout
      className="bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 group"
    >
      <div className="flex">
        {/* Product Image */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gray-100 flex-shrink-0">
          <Image
            src={item.mainImage?.asset?.url || ""}
            alt={item.mainImage?.alt || item.name}
            fill
            className="object-cover"
          />
          
          {/* Stock status overlay */}
          {!item.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 p-4 flex flex-col justify-between min-h-[96px] md:min-h-[128px]">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <Link href={`/product/${item.slug.current}`}>
                <h3 className="font-medium text-gray-900 hover:text-gray-700 transition-colors text-sm md:text-base line-clamp-2 pr-2">
                  {item.name}
                </h3>
              </Link>
              
              {/* Remove button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeFromWishlist(item._id)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </motion.button>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-semibold text-gray-900 text-lg">
                ₦{effectivePrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    ₦{item.price.toLocaleString()}
                  </span>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                    Save ₦{(item.price - effectivePrice).toLocaleString()}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addToCartFromWishlist}
              disabled={!item.inStock}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                item.inStock
                  ? "bg-gray-900 hover:bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-4 h-4 mr-2 inline" />
              {item.inStock ? "Add to Cart" : "Out of Stock"}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Added date footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          Added on {new Date(item.addedAt).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      </div>
    </motion.div>
  );
};

const WishlistPage: React.FC = () => {
  const { items, totalItems, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const EmptyWishlist = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Heart className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-light text-gray-900 mb-4">
        Your wishlist is empty
      </h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Save items you love to your wishlist and they'll appear here.
      </p>
      <Link href="/">
        <Button variant="outline" className="px-8 py-3">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </Button>
      </Link>
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">
                Wishlist
              </h1>
              {totalItems > 0 && (
                <p className="text-gray-500">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </p>
              )}
            </div>

            {totalItems > 0 && (
              <div className="flex gap-3">
                <Button
                  onClick={clearWishlist}
                  variant="outline"
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            )}
          </div>

          {/* Summary bar */}
          {totalItems > 0 && (
            <div className="bg-gray-50 border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>
                  <span className="font-medium text-gray-900">{items.filter(item => item.inStock).length}</span> in stock
                </span>
                <span>
                  <span className="font-medium text-gray-900">{items.filter(item => item.discountPrice).length}</span> on sale
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Total value: <span className="font-medium text-gray-900">
                  ₦{items.reduce((total, item) => total + (item.discountPrice || item.price), 0).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {items.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <motion.div variants={itemVariants} className="space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <WishlistItemComponent key={item._id} item={item} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Continue Shopping */}
        {items.length > 0 && (
          <motion.div variants={itemVariants} className="mt-12 text-center">
            <Link href="/">
              <Button variant="outline" className="px-8 py-3">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Tips section */}
        {items.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mt-16 bg-gray-50 border border-gray-200 p-6 text-center"
          >
            <h3 className="font-medium text-gray-900 mb-2">💡 Tip</h3>
            <p className="text-sm text-gray-600">
              Items in your wishlist are saved across all your devices. 
              We'll also notify you if any items go on sale!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WishlistPage;