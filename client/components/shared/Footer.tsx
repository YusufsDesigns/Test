
"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, Truck, Package, Headphones, MapPin, Phone, Mail, Instagram, Facebook, Send, CheckCircle, Sparkles, Star, Gift } from "lucide-react";
import Logo from "../../public/Aleeban_logo-removebg-preview.png";
import { Sacramento } from "next/font/google";
import { cn } from "../../lib/utils";
import { useEmailSubscription } from "@/hooks/useEmailSubscription";

const playball = Sacramento({ weight: "400", subsets: ["latin"] });

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const iconVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.1,
    transition: { duration: 0.2 }
  }
};

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { state, submitEmail, reset } = useEmailSubscription();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    await submitEmail(email.trim());
    
    // Clear form on success
    if (!state.error) {
      setTimeout(() => {
        setEmail('');
        reset();
      }, 3000);
    }
  };

  return (
    <motion.div 
      className="bg-[#202124] text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Elegant Newsletter Section */}
      <motion.div 
        variants={itemVariants}
        className="border-b border-b-gray-600 relative overflow-hidden"
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-gradient-to-tl from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 py-16 lg:py-20 relative z-10">
          <div className="text-center">
            <motion.div
              variants={itemVariants}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-sm font-medium">Exclusive Access</span>
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                Join Our Fashion Circle
              </h3>
              <p className="text-gray-300 text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
                Be part of an exclusive community that gets early access to collections, 
                insider styling tips, and special member privileges.
              </p>
            </motion.div>
            
            {/* Elegant Email Form */}
            <motion.div 
              variants={itemVariants}
              className="max-w-md mx-auto"
            >
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="relative group">
                  {/* Glowing border effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 via-blue-500 to-purple-500 rounded-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 blur-sm"></div>
                  
                  <div className="relative flex rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
                    <div className="flex items-center pl-4">
                      <Mail className="w-5 h-5 text-gray-300 group-focus-within:text-amber-400 transition-colors" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email for exclusive access"
                      className="flex-1 px-4 py-4 bg-transparent text-white placeholder-gray-400 border-none focus:ring-0 focus:outline-none"
                      required
                    />
                    <motion.button
                      type="submit"
                      disabled={state.isSubmitting || !email.trim() || state.isSuccess}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-semibold hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 relative overflow-hidden group"
                    >
                      {/* Button shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      
                      <span className="relative z-10 flex items-center gap-2">
                        {state.isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="hidden sm:inline">Joining...</span>
                          </>
                        ) : state.isSuccess ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Joined!</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span className="hidden sm:inline">Join Circle</span>
                          </>
                        )}
                      </span>
                    </motion.button>
                  </div>
                </div>

                {/* Enhanced Success/Error Messages */}
                <AnimatePresence mode="wait">
                  {state.error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 backdrop-blur-sm"
                    >
                      <p className="text-red-300 text-sm">{state.error}</p>
                    </motion.div>
                  )}
                  
                  {state.isSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg p-4 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-2 justify-center">
                        <Gift className="w-5 h-5 text-green-400" />
                        <p className="text-green-300 font-medium">Welcome to our exclusive fashion circle!</p>
                      </div>
                      <p className="text-green-200 text-sm mt-1 opacity-90">
                        Check your inbox for your welcome gift and first insider updates.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
              
              {/* Elegant footer text */}
              <motion.div 
                variants={itemVariants}
                className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>2,500+ Members</span>
                </div>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>No Spam Policy</span>
                </div>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <span>Unsubscribe Anytime</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Trust Badges Section */}
      <motion.div 
        variants={itemVariants}
        className="border-b border-b-gray-600"
      >
        <div className="flex items-center justify-between flex-wrap py-12 lg:py-16 max-w-7xl mx-auto px-4 gap-6">
          <motion.div 
            variants={iconVariants}
            whileHover="hover"
            className="flex items-center gap-4 text-center lg:text-left"
          >
            <CreditCard className="w-8 h-8 text-amber-400" />
            <span className="text-sm lg:text-base font-medium">100% SECURE PAYMENT</span>
          </motion.div>
          
          <motion.div 
            variants={iconVariants}
            whileHover="hover"
            className="flex items-center gap-4 text-center lg:text-left"
          >
            <Truck className="w-8 h-8 text-green-400" />
            <span className="text-sm lg:text-base font-medium">FAST DELIVERY</span>
          </motion.div>
          
          <motion.div 
            variants={iconVariants}
            whileHover="hover"
            className="flex items-center gap-4 text-center lg:text-left"
          >
            <Package className="w-8 h-8 text-blue-400" />
            <span className="text-sm lg:text-base font-medium">FREE & EASY RETURNS</span>
          </motion.div>
          
          <motion.div 
            variants={iconVariants}
            whileHover="hover"
            className="flex items-center gap-4 text-center lg:text-left"
          >
            <Headphones className="w-8 h-8 text-purple-400" />
            <span className="text-sm lg:text-base font-medium">24/7 CUSTOMER SUPPORT</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Footer Content */}
      <motion.div 
        variants={itemVariants}
        className="py-12 lg:py-16 max-w-7xl mx-auto px-4"
      >
        <div className="flex flex-col md:flex-row justify-between gap-12 lg:gap-16">
          
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="flex-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image src={Logo} alt="Aleebansparks Logo" className="w-12 h-12" />
              <h3 className={cn(playball.className, "text-2xl font-bold text-white")}>
                Aleebansparks
              </h3>
            </Link>
            <p className="text-gray-300 mb-8 text-base leading-relaxed max-w-md">
              Crafting elegance through premium fashion. From ready-made outfits to handcrafted shoes and accessories, 
              we bring you quality that speaks volumes.
            </p>
            
            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span className="text-gray-300">Abuja, FCT, Nigeria</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">+234 (0) 123 456 7890</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">hello@aleebansparks.com</span>
              </div>
            </div>
          </motion.div>

          {/* Shop Categories */}
          <motion.div variants={itemVariants} className="flex-1">
            <h3 className="text-xl font-semibold mb-8">SHOP</h3>
            <div className="grid grid-cols-1 gap-y-4 gap-x-8">
              <Link href="/outfits" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-block">
                Outfits by Brand
              </Link>
              <Link href="/shoes" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-block">
                Handmade Shoes
              </Link>
              <Link href="/accessories" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 inline-block">
                Accessories
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div 
        variants={itemVariants}
        className="border-t border-gray-600 py-6"
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p 
            variants={itemVariants}
            className="text-gray-400 text-sm text-center md:text-left"
          >
            © 2025 Aleebansparks. All rights reserved. | Made with ❤️ in Nigeria
          </motion.p>
          
          {/* Social Media */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-4"
          >
            <motion.a
              href="https://www.instagram.com/aleebansparks_rtw"
              target="_blank"
              rel="noopener noreferrer"
              variants={iconVariants}
              whileHover="hover"
              className="text-gray-400 hover:text-pink-400 transition-colors relative group"
              title="RTW Collection"
            >
              <Instagram className="w-5 h-5" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                RTW @aleebansparks_rtw
              </span>
            </motion.a>
            <motion.a
              href="https://www.instagram.com/aleebansparks_wears"
              target="_blank"
              rel="noopener noreferrer"
              variants={iconVariants}
              whileHover="hover"
              className="text-gray-400 hover:text-pink-400 transition-colors relative group"
              title="Wears Collection"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <Instagram className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
              </div>
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Wears @aleebansparks_wears
              </span>
            </motion.a>
            <motion.a
              href="https://www.instagram.com/aleebansparks_"
              target="_blank"
              rel="noopener noreferrer"
              variants={iconVariants}
              whileHover="hover"
              className="text-gray-400 hover:text-pink-400 transition-colors relative group"
              title="Main Account"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <Instagram className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full"></span>
              </div>
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Main @aleebansparks_
              </span>
            </motion.a>
            <motion.a
              href="https://www.facebook.com/share/1YGwfLhSj3/"
              target="_blank"
              rel="noopener noreferrer"
              variants={iconVariants}
              whileHover="hover"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="https://www.tiktok.com/@aleebansparks_rtw"
              target="_blank"
              rel="noopener noreferrer"
              variants={iconVariants}
              whileHover="hover"
              className="text-gray-400 hover:text-black transition-colors"
              title="@aleebansparks_rtw"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-.1z"/>
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Footer;