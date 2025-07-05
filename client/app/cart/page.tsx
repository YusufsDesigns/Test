// app/cart/page.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart, CartItem } from "@/providers/CartProvider";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Heart,
} from "lucide-react";
import { useWishlist } from "@/providers/WishlistProvider";

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

const CartItemComponent: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateQuantity, removeFromCart, getUniqueItemId } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const uniqueId = getUniqueItemId(item);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(uniqueId);
    } else {
      const maxQuantity = 999;
      const finalQuantity = Math.min(newQuantity, maxQuantity);
      updateQuantity(uniqueId, finalQuantity);
    }
  };

  const moveToWishlist = () => {
    if (!isInWishlist(item._id)) {
      addToWishlist({
        _id: item._id,
        name: item.name,
        price: item.price,
        mainImage: item.mainImage,
        slug: item.slug,
        inStock: item.inStock,
      });
    }
    removeFromCart(uniqueId);
  };

  const maxQuantity = 999;
  const isAtMaxQuantity = item.quantity >= maxQuantity;

  return (
    <motion.div
      variants={itemVariants}
      layout
      className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      {/* Product Image */}
      <div className="relative w-24 h-24 lg:w-32 lg:h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
        {item.mainImage?.asset?.url ? (
          <Image
            src={item.mainImage.asset.url}
            alt={item.mainImage?.alt || item.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 96px, 128px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/product/${item.slug?.current || ''}`}>
              <h3 className="font-semibold text-gray-900 hover:text-gray-700 transition-colors line-clamp-2">
                {item.name}
              </h3>
            </Link>
            <div className="text-sm text-gray-500 space-y-1 mt-1">
              {item.size && (
                <p>
                  Size: <span className="font-medium">{item.size}</span>
                </p>
              )}
              {item.color && (
                <p>
                  Color: <span className="font-medium">{item.color}</span>
                </p>
              )}
              <p className="text-xs">
                {item.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              ₦{(item.price * item.quantity).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              ₦{item.price.toLocaleString()} each
            </p>
          </div>
        </div>

        {/* Quantity & Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            <span className="px-4 py-2 border-x border-gray-200 min-w-[60px] text-center font-medium">
              {item.quantity}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isAtMaxQuantity}
              className={`p-2 transition-colors ${
                isAtMaxQuantity 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'hover:bg-gray-50'
              }`}
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={moveToWishlist}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Move to wishlist"
            >
              <Heart className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => removeFromCart(uniqueId)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Remove from cart"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
        
        {isAtMaxQuantity && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded"
          >
            Maximum quantity reached
          </motion.p>
        )}

        {!item.inStock && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded"
          >
            This item is currently out of stock
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

const CartPage: React.FC = () => {
  const { items, totalItems, totalPrice, clearCart, isLoading, error, getUniqueItemId } = useCart();

  const EmptyCart = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag className="w-16 h-16 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Your cart is empty
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Looks like you haven't added anything to your cart yet. Start shopping
        to fill it up!
      </p>
      <Link href="/">
        <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </Button>
      </Link>
    </motion.div>
  );

  const LoadingCart = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16"
    >
      <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading your cart...</p>
    </motion.div>
  );

  const ErrorCart = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16"
    >
      <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag className="w-16 h-16 text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {error || 'Failed to load your cart. Please try refreshing the page.'}
      </p>
      <Button 
        onClick={() => window.location.reload()} 
        className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full"
      >
        Refresh Page
      </Button>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <LoadingCart />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ErrorCart />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Shopping Cart
              </h1>
              {totalItems > 0 && (
                <p className="text-gray-600">
                  {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                </p>
              )}
            </div>
            <Link href="/">
              <Button variant="outline" className="hidden sm:flex">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </motion.div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItemComponent
                    key={getUniqueItemId(item)}
                    item={item}
                  />
                ))}
              </AnimatePresence>

              {/* Clear Cart */}
              <motion.div variants={itemVariants} className="pt-4 border-t border-gray-200">
                <Button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear your entire cart?')) {
                      clearCart();
                    }
                  }}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                    <span>₦{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-gray-500">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="text-gray-500">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>₦{totalPrice.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Final amount will be calculated at checkout
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/checkout" className="block">
                    <Button 
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl text-lg font-semibold"
                      disabled={totalItems === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/" className="block sm:hidden">
                    <Button
                      variant="outline"
                      className="w-full py-3 rounded-xl"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 flex-shrink-0"></div>
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 flex-shrink-0"></div>
                    <span>Quality guaranteed products</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 flex-shrink-0"></div>
                    <span>Easy returns within 30 days</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CartPage;