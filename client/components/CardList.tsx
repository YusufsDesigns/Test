// Fixed CardList Component
"use client"

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SanityProduct } from '../lib/sanity';
import Card from "./kits/Card";

interface CardListProps {
  products: SanityProduct[];
  limit?: number;
}

const CardList: React.FC<CardListProps> = ({ products, limit }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentScroll, setCurrentScroll] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [showNavigation, setShowNavigation] = useState(false);

  // Get limited data or all data
  const displayData = limit ? products.slice(0, limit) : products;

  // Check if we should show navigation (tablet and mobile)
  useEffect(() => {
    const checkScreenSize = () => {
      setShowNavigation(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Calculate scroll position and max scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateScrollInfo = () => {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const maxScrollLeft = scrollWidth - clientWidth;

      setCurrentScroll(scrollLeft);
      setMaxScroll(maxScrollLeft);
    };

    updateScrollInfo();
    container.addEventListener('scroll', updateScrollInfo);
    window.addEventListener('resize', updateScrollInfo);

    return () => {
      container.removeEventListener('scroll', updateScrollInfo);
      window.removeEventListener('resize', updateScrollInfo);
    };
  }, [displayData]);

  // Calculate current position indicator
  const getScrollPosition = () => {
    if (maxScroll === 0) return 1;
    const cardWidth = 280;
    const totalScrollSteps = Math.ceil(maxScroll / cardWidth);
    const currentStep = Math.floor(currentScroll / cardWidth);
    return Math.min(currentStep + 1, totalScrollSteps + 1);
  };

  const getTotalScrollSteps = () => {
    if (maxScroll === 0) return 1;
    const cardWidth = 280;
    return Math.ceil(maxScroll / cardWidth) + 1;
  };

  // Navigation functions with smooth scrolling
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 280;
    const newScrollLeft = Math.max(0, container.scrollLeft - cardWidth);
    container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 280;
    const newScrollLeft = Math.min(maxScroll, container.scrollLeft + cardWidth);
    container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  };

  const canScrollLeft = currentScroll > 0;
  const canScrollRight = currentScroll < maxScroll;

  return (
    <div className="relative w-full">
      {/* Scrollable container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-1 lg:gap-2 overflow-x-auto scrollbar-hide pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {displayData.map((product, index) => (
          <motion.div 
            key={product._id} 
            className="flex-shrink-0 w-40 md:w-[320px] lg:w-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { 
                delay: index * 0.15, 
                duration: 0.6,
                ease: "easeOut"
              }
            }}
            viewport={{ once: true }}
          >
            <Card product={product} />
          </motion.div>
        ))}
      </div>

      {/* Navigation arrows and scroll indicator - only on tablet and mobile */}
      {showNavigation && displayData.length > 0 && maxScroll > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.4, ease: "easeOut", delay: 0.8 }
          }}
          className="flex items-center justify-center gap-3 mt-4"
        >
          {/* Left arrow */}
          <motion.button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-full border transition-all duration-300 ${
              canScrollLeft
                ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md'
                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Scroll left"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </motion.button>

          {/* Scroll position indicator */}
          <motion.div 
            className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-full shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <span className="font-medium">{getScrollPosition()}</span>
            <span>/</span>
            <span>{getTotalScrollSteps()}</span>
          </motion.div>

          {/* Right arrow */}
          <motion.button
            onClick={scrollRight}
            disabled={!canScrollRight}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-full border transition-all duration-300 ${
              canScrollRight
                ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md'
                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Scroll right"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </motion.button>
        </motion.div>
      )}

      {/* Hide scrollbar with CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scroll-smooth {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default CardList;