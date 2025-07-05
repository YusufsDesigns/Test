"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SanityProduct } from '../lib/sanity';
import Card from '../components/kits/Card';
import CardSkeleton from '../components/skeletons/CardSkeleton';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const PRODUCTS_PER_PAGE = 16;

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

// Skeleton for filter controls
const FilterSkeleton: React.FC = () => (
  <div className="animate-pulse">
    {/* Desktop filters skeleton */}
    <div className="hidden lg:flex items-center justify-between gap-6 mb-6">
      <div className="flex items-center gap-4">
        <div className="h-10 w-40 bg-gray-200 rounded"></div>
        <div className="h-10 w-40 bg-gray-200 rounded"></div>
        <div className="h-10 w-40 bg-gray-200 rounded"></div>
        <div className="h-10 w-20 bg-gray-200 rounded"></div>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-10 w-40 bg-gray-200 rounded"></div>
      </div>
    </div>
    
    {/* Mobile filters skeleton */}
    <div className="lg:hidden space-y-4">
      <div className="text-center">
        <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
      </div>
      <div className="h-10 w-full bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Filter configuration interface
interface FilterConfig {
  showGenderFilter?: boolean;
  showTypeFilter?: boolean;
  genderOptions?: Array<{ value: string; label: string }>;
  typeOptions?: Array<{ value: string; label: string }>;
}

// Page configuration interface
interface PageConfig {
  title: string;
  description: string;
  headerGradient: string;
  customHeader?: React.ReactNode;
  filterConfig?: FilterConfig;
}

interface ProductListingPageProps {
  pageConfig: PageConfig;
  fetchProducts: () => Promise<SanityProduct[]>;
  searchQuery?: string;
}

const ProductListingPage: React.FC<ProductListingPageProps> = ({
  pageConfig,
  fetchProducts,
  searchQuery
}) => {
  const [allProducts, setAllProducts] = useState<SanityProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<SanityProduct[]>([]);
  const [displayProducts, setDisplayProducts] = useState<SanityProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter states
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>(searchQuery ? 'relevance' : 'newest');
  const [showFilters, setShowFilters] = useState(false);

  // Get price ranges
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-5000', label: '₦0 - ₦5,000' },
    { value: '5000-10000', label: '₦5,000 - ₦10,000' },
    { value: '10000-20000', label: '₦10,000 - ₦20,000' },
    { value: '20000-50000', label: '₦20,000 - ₦50,000' },
    { value: '50000+', label: '₦50,000+' }
  ];

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const products = await fetchProducts();
        setAllProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [fetchProducts]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...allProducts];

    // Filter by gender (for shoes)
    if (pageConfig.filterConfig?.showGenderFilter && selectedGender !== 'all') {
      filtered = filtered.filter(product => 
        product.subcategory === selectedGender
      );
    }

    // Filter by type (for accessories)
    if (pageConfig.filterConfig?.showTypeFilter && selectedType !== 'all') {
      filtered = filtered.filter(product => 
        product.subcategory === selectedType
      );
    }

    // Filter by price range
    if (priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = product.discountPrice || product.price;
        switch (priceRange) {
          case '0-5000':
            return price <= 5000;
          case '5000-10000':
            return price > 5000 && price <= 10000;
          case '10000-20000':
            return price > 10000 && price <= 20000;
          case '20000-50000':
            return price > 20000 && price <= 50000;
          case '50000+':
            return price > 50000;
          default:
            return true;
        }
      });
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b._createdAt || '').getTime() - new Date(a._createdAt || '').getTime());
        break;
      case 'relevance':
      default:
        // Keep original order for search relevance or newest for categories
        if (!searchQuery) {
          filtered.sort((a, b) => new Date(b._createdAt || '').getTime() - new Date(a._createdAt || '').getTime());
        }
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [allProducts, selectedGender, selectedType, priceRange, sortBy, pageConfig.filterConfig, searchQuery]);

  // Pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    setDisplayProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedGender('all');
    setSelectedType('all');
    setPriceRange('all');
    setSortBy(searchQuery ? 'relevance' : 'newest');
  };

  const formatSizeDisplay = (size: string) => {
    if (size === 'custom') return 'Custom';
    if (size === 'one_size') return 'One Size';
    return size;
  };

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen bg-white"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section Skeleton */}
        {!pageConfig.customHeader && (
          <motion.div 
            variants={itemVariants}
            className="py-16"
          >
            <div className="max-w-7xl mx-auto px-4 text-center animate-pulse">
              <div className="h-12 md:h-16 bg-gray-200 rounded w-96 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </motion.div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filter Controls Skeleton */}
          <motion.div variants={itemVariants} className="mb-8">
            <FilterSkeleton />
          </motion.div>

          {/* Products Grid Skeleton */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              {Array.from({ length: 16 }).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-full">
                  <div className="animate-pulse">
                    {/* Image skeleton */}
                    <div className="relative bg-gray-200 h-[241px] md:h-[350px] lg:h-[430px] w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
                      <div className="absolute top-3 right-3 w-9 h-9 bg-gray-300 rounded-full"></div>
                    </div>
                    {/* Product info skeleton */}
                    <div className="mt-3 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Custom CSS for shimmer effect */}
        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
        `}</style>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      {pageConfig.customHeader ? (
        pageConfig.customHeader
      ) : (
        <motion.div 
          variants={itemVariants}
          className={`py-16`}
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {pageConfig.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {pageConfig.description}
            </p>
            {searchQuery && allProducts.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Found {allProducts.length} product{allProducts.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {allProducts.length === 0 && !loading ? (
          <motion.div 
            variants={itemVariants}
            className="text-center py-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {searchQuery ? 'No results found' : 'No products available'}
            </h2>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? `Sorry, we couldn't find any products matching "${searchQuery}"`
                : 'Please check back later for new products.'
              }
            </p>
            {searchQuery && (
              <p className="text-sm text-gray-400">
                Try searching with different keywords or browse our categories
              </p>
            )}
          </motion.div>
        ) : (
          <>
            {/* Filters and Sort Section */}
            <motion.div 
              variants={itemVariants}
              className="mb-8"
            >
              {/* Desktop - All on one line */}
              <div className="hidden lg:flex items-center justify-between gap-6 mb-6">
                {/* Left side - Filters */}
                <div className="flex items-center gap-4">
                  
                  {/* Gender/Type Filter (conditional) */}
                  {pageConfig.filterConfig?.showGenderFilter && (
                    <div className="min-w-[160px]">
                      <Select value={selectedGender} onValueChange={setSelectedGender}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {pageConfig.filterConfig.genderOptions?.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {pageConfig.filterConfig?.showTypeFilter && (
                    <div className="min-w-[160px]">
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          {pageConfig.filterConfig.typeOptions?.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Price Filter */}
                  <div className="min-w-[160px]">
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Price Range" />
                      </SelectTrigger>
                      <SelectContent>
                        {priceRanges.map(range => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear Filters */}
                  <Button 
                    onClick={clearFilters}
                    variant="outline"
                    size="sm"
                    className="h-10"
                  >
                    Clear
                  </Button>
                </div>

                {/* Right side - Sort and Results */}
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600 whitespace-nowrap">
                    {filteredProducts.length} {searchQuery ? 'results' : 'products'}
                  </p>
                  
                  <div className="min-w-[160px]">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {searchQuery && <SelectItem value="relevance">Most Relevant</SelectItem>}
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="name">Name A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Mobile - Stacked layout */}
              <div className="lg:hidden space-y-4">
                {/* Results count */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {filteredProducts.length} {searchQuery ? 'results' : 'products'} found
                  </p>
                </div>

                {/* Filter Toggle */}
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  {showFilters ? 'Hide Filters' : 'Filter & Sort'}
                </Button>

                {/* Mobile Filters */}
                {showFilters && (
                  <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                    {/* Gender/Type Filter (conditional) */}
                    {pageConfig.filterConfig?.showGenderFilter && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <Select value={selectedGender} onValueChange={setSelectedGender}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {pageConfig.filterConfig.genderOptions?.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {pageConfig.filterConfig?.showTypeFilter && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {pageConfig.filterConfig.typeOptions?.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Price Filter */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Price Range
                      </label>
                      <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Prices" />
                        </SelectTrigger>
                        <SelectContent>
                          {priceRanges.map(range => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Sort By
                      </label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {searchQuery && <SelectItem value="relevance">Most Relevant</SelectItem>}
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="name">Name A-Z</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clear Filters */}
                    <Button 
                      onClick={clearFilters}
                      variant="outline"
                      className="w-full"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <motion.div 
                variants={itemVariants}
                className="text-center py-16"
              >
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <Button onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-12"
              >
                {displayProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    custom={index}
                  >
                    <Card product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div 
                variants={itemVariants}
                className="flex justify-center items-center gap-2 mt-12"
              >
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ProductListingPage;