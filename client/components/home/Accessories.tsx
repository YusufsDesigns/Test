// Fixed Accessories Component with Skeleton
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { getAccessories, SanityProduct } from '../../lib/sanity';
import CardList from '../CardList';
import CardSkeleton from '../skeletons/CardSkeleton';
import { Button } from '../ui/button';
import Link from 'next/link';

// Container variants for stagger animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

// Item variants for individual elements
const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const Accessories: React.FC = () => {
  const [products, setProducts] = useState<SanityProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    amount: 0.2
  });

  // Fetch data when component comes into view
  useEffect(() => {
    if (isInView && !dataFetched) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await getAccessories(undefined, 4);
          setProducts(data);
          setDataFetched(true);
        } catch (error) {
          console.error('Error fetching accessories:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isInView, dataFetched]);

  return (
    <motion.div 
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="max-w-7xl mx-auto px-4 py-10"
    >
      {/* Animated title */}
      <motion.h1 
        variants={itemVariants}
        className="text-2xl text-center mb-10 tracking-wide"
      >
        ACCESSORIES
      </motion.h1>

      {/* Loading state with skeleton */}
      {loading && (
        <motion.div variants={itemVariants}>
          <CardSkeleton count={4} />
        </motion.div>
      )}

      {/* Products grid */}
      {!loading && products.length > 0 && (
        <motion.div variants={itemVariants}>
          <CardList products={products} />
        </motion.div>
      )}

      {/* View More Button */}
      {!loading && (
        <motion.div 
          variants={itemVariants}
          className="flex justify-center mt-7"
        >
          <Link href="/accessories">
            <Button
              size="lg"
              className="px-8 py-3 text-sm rounded-none font-medium bg-[#202124] hover:bg-black/90 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              VIEW ALL
            </Button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Accessories;