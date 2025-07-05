// components/shared/Navbar.tsx
"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, Heart, User } from "lucide-react";
import { Poppins, Sacramento } from "next/font/google";
import { cn } from "@/lib/utils";
import ExpandableSearch from "@/components/ExpandableSearch";
import { useCart } from "@/providers/CartProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import Logo from "../../public/Aleeban_logo-removebg-preview.png";

const playball = Poppins({ weight: "400", subsets: ["latin"] });

// Counter animation variants
const counterVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    }
  },
  exit: { 
    scale: 0, 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems: cartItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSearch = (query: string): void => {
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-[#202124] text-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src={Logo} 
                alt="Aleebansparks Logo" 
                className="w-10 h-10 lg:w-12 lg:h-12" 
              />
              <h1 className={cn(playball.className, "text-lg font-bold")}>
                Aleebansparks
              </h1>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link href="/outfits" className="text-sm font-medium hover:text-gray-300 transition-colors">
                Outfits by Brand
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link href="/shoes" className="text-sm font-medium hover:text-gray-300 transition-colors">
                Handmade Shoes
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link href="/accessories" className="text-sm font-medium hover:text-gray-300 transition-colors">
                Accessories
              </Link>
            </motion.div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Search */}
            <div className="hidden lg:block">
              <ExpandableSearch 
                onSearch={handleSearch}
                placeholder="Search Aleebansparks..."
              />
            </div>

            {/* Wishlist Icon with Counter */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link href="/wishlist" className="p-2 rounded-full transition-colors relative">
                <Heart className="w-5 h-5" />
                <AnimatePresence>
                  {wishlistItems > 0 && (
                    <motion.p
                      variants={counterVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute bottom-6 -right-4 bg-white text-black text-xs font-bold rounded-full w-1 h-1 p-2 flex items-center justify-center"
                    >
                      {wishlistItems > 99 ? '99+' : wishlistItems}
                    </motion.p>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>

            {/* Cart Icon with Counter */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link href="/cart" className="p-2 rounded-full transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {cartItems > 0 && (
                    <motion.p
                      variants={counterVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute bottom-6 -right-4 bg-white text-black text-xs font-bold rounded-full w-1 h-1 p-2 flex items-center justify-center"
                    >
                      {cartItems > 99 ? '99+' : cartItems}
                    </motion.p>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-600 py-4 space-y-4"
            >
              {/* Mobile Search */}
              <div>
                <ExpandableSearch 
                  onSearch={handleSearch}
                  placeholder="Search products..."
                  className="!relative !w-full"
                />
              </div>

              {/* Mobile Navigation Links */}
              <Link 
                href="/outfits" 
                className="block py-2 text-sm font-medium hover:text-gray-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Outfits by Brand
              </Link>
              
              <Link 
                href="/shoes" 
                className="block py-2 text-sm font-medium hover:text-gray-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Handmade Shoes
              </Link>
              
              <Link 
                href="/accessories" 
                className="block py-2 text-sm font-medium hover:text-gray-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Accessories
              </Link>

              {/* Mobile Action Links */}
              <div className="border-t border-gray-600 pt-4">
                <Link 
                  href="/wishlist" 
                  className="flex items-center justify-between py-2 text-sm font-medium hover:text-gray-300 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </span>
                  {wishlistItems > 0 && (
                    <span className="text-red-500 text-xs font-bold w-4 h-4 flex items-center justify-center">
                      {wishlistItems > 99 ? '99+' : wishlistItems}
                    </span>
                  )}
                </Link>

                <Link 
                  href="/cart" 
                  className="flex items-center justify-between py-2 text-sm font-medium hover:text-gray-300 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Shopping Cart
                  </span>
                  {cartItems > 0 && (
                    <span className="text-amber-500 text-xs font-bold w-4 h-4 flex items-center justify-center">
                      {cartItems > 99 ? '99+' : cartItems}
                    </span>
                  )}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;