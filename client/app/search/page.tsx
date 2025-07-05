// app/search/page.tsx
"use client"

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ProductListingPage from '../../components/ProductListingPage';
import { client, SanityProduct } from '../../lib/sanity';
import { Search, X } from 'lucide-react';

// Search function - only fetch card data
const searchProducts = async (query: string): Promise<SanityProduct[]> => {
  if (!query.trim()) return [];
  
  const searchQuery = `
    *[_type == "product" && (
      name match $query ||
      category match $query ||
      subcategory match $query ||
      colors[] match $query ||
      sizes[] match $query
    )] | order(_createdAt desc) {
      _id,
      _createdAt,
      name,
      slug,
      price,
      discountPrice,
      category,
      subcategory,
      mainImage {
        asset -> {
          _ref,
          url
        },
        alt
      },
      inStock
    }
  `;
  
  try {
    const products = await client.fetch(searchQuery, { 
      query: `*${query.trim()}*` 
    });
    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

// Simple Search Input Component (styled like ExpandableSearch)
const SearchInput: React.FC<{ 
  initialQuery: string;
  placeholder?: string;
  onSearch: (query: string) => void;
}> = ({ initialQuery, placeholder = "Search Aleebansparks...", onSearch }) => {
  const [searchValue, setSearchValue] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const clearSearch = () => {
    setSearchValue('');
    onSearch('');
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-md mx-auto"
    >
      <div className={`
        relative flex items-center bg-white border-2 rounded-full transition-all duration-300 ease-out
        ${isFocused ? 'border-gray-400 shadow-lg' : 'border-gray-200 shadow-sm'}
      `}>
        <Search className="absolute left-4 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400"
        />
        {searchValue && (
          <motion.button
            type="button"
            onClick={clearSearch}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.form>
  );
};

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const router = useRouter();

  const handleSearch = (query: string): void => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  };

  // If no search query, show search input with empty state
  if (!searchQuery.trim()) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header with Search */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16"
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Search Products
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
            >
              Discover our complete collection of outfits, handmade shoes, and accessories
            </motion.p>
            
            {/* Search Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <SearchInput
                initialQuery=""
                placeholder="Search for products..."
                onSearch={handleSearch}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Empty State */}
        <div className="flex items-center justify-center py-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Your Search</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Enter keywords to find products by name, category, color, or size. 
              Discover our latest fashion collections and accessories.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Custom header component for search page with search input
  const SearchPageHeader: React.FC = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-12"
    >
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
        >
          Search Results
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mb-6"
        >
          Results for "<span className="font-semibold text-gray-900">{searchQuery}</span>"
        </motion.p>
        
        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SearchInput
            initialQuery={searchQuery}
            onSearch={handleSearch}
          />
        </motion.div>
      </div>
    </motion.div>
  );

  const pageConfig = {
    title: "", // Empty since we're using custom header
    description: "",
    headerGradient: "",
    customHeader: <SearchPageHeader />,
    filterConfig: {
      showGenderFilter: true,
      showTypeFilter: true,
      genderOptions: [
        { value: "his", label: "Men's Shoes" },
        { value: "hers", label: "Women's Shoes" }
      ],
      typeOptions: [
        { value: "outfits_by_brand", label: "Outfits by Brand" },
        { value: "handmade_shoes", label: "Handmade Shoes" },
        { value: "accessories", label: "Accessories" },
        { value: "headties_scarves", label: "Headties & Scarves" },
        { value: "perfumes", label: "Perfumes" }
      ]
    }
  };

  return (
    <ProductListingPage 
      pageConfig={pageConfig}
      fetchProducts={() => searchProducts(searchQuery)}
      searchQuery={searchQuery}
    />
  );
};

export default SearchPage;