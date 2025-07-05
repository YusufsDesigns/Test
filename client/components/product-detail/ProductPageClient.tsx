// app/product/[slug]/ProductPageClient.tsx - Client Component
"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SanityProduct, getStockForVariant, getAvailableColorsForSize, getAvailableSizesForColor } from '@/lib/sanity';
import { Button } from '../../components/ui/button';
import { ChevronRight, ShoppingCart, ArrowLeft, CheckCircle, Heart, Plus, Minus, AlertTriangle, Mail, X, User, Phone } from 'lucide-react';
import { useCart } from '../../providers/CartProvider';
import { useWishlist } from '../../providers/WishlistProvider';

// Import components
import ProductImageGallery from '../../components/product-detail/ProductImageGallery';
import ProductInfo from '../../components/product-detail/ProductInfo';
import ProductOptions from '../../components/product-detail/ProductOptions';
import ProductActions from '../../components/product-detail/ProductActions';
import ProductDescription from '../../components/product-detail/ProductDescription';
import RelatedProducts from '../../components/product-detail/RelatedProducts';

// Animation variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Alert Component
const Alert: React.FC<{ 
  message: string; 
  type: 'success' | 'error'; 
  icon: React.ReactNode; 
  onClose: () => void 
}> = ({ message, type, icon, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border ${
        type === 'success' 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-red-50 border-red-200 text-red-800'
      }`}
    >
      <div className="flex items-center">
        {icon}
        <span className="ml-2 font-medium">{message}</span>
      </div>
    </motion.div>
  );
};

// Consultation Modal Component
const ConsultationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerMessage: string;
  }) => void;
  productName: string;
  productPrice: number;
  selectedColor: string;
}> = ({ isOpen, onClose, onSubmit, productName, productPrice, selectedColor }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerMessage: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerEmail) return;
    
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerMessage: ''
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Custom Order Consultation</h2>
                <p className="text-gray-600 mt-1">Let's create something perfect for you</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6 bg-blue-50 border-b border-gray-200">
            <h3 className="font-semibold text-blue-900 mb-2">Product Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Product:</span>
                <p className="text-blue-800">{productName}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Base Price:</span>
                <p className="text-blue-800">₦{productPrice.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Color:</span>
                <p className="text-blue-800">{selectedColor || 'To be discussed'}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Additional Requirements */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Additional Requirements
              </h3>
              
              <div>
                <label htmlFor="customerMessage" className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests or Questions (Optional)
                </label>
                <textarea
                  id="customerMessage"
                  name="customerMessage"
                  value={formData.customerMessage}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Tell us about your preferences, measurements, or any special requirements..."
                />
              </div>
            </div>

            {/* What Happens Next */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Our team will contact you within 24 hours</li>
                <li>• We'll schedule a consultation to discuss your requirements</li>
                <li>• Professional measurements will be arranged</li>
                <li>• You'll receive a detailed quote and timeline</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 py-3"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
                disabled={isSubmitting || !formData.customerName || !formData.customerEmail}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Send Consultation Request
                  </div>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface ProductPageClientProps {
  initialProduct: SanityProduct | null;
  initialRelatedProducts: SanityProduct[];
  slug: string;
}

const ProductPageClient: React.FC<ProductPageClientProps> = ({
  initialProduct,
  initialRelatedProducts,
  slug
}) => {
  const [product] = useState<SanityProduct | null>(initialProduct);
  const [relatedProducts] = useState<SanityProduct[]>(initialRelatedProducts);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error'; icon: React.ReactNode } | null>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  const { addToCart, getCartItemCount } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Set default selections when product loads
  useEffect(() => {
    if (product && product.inventory) {
      const hasColors = product.category === 'outfits' || product.category === 'shoes';
      
      if (hasColors) {
        // Find the first available color
        const availableColors = product.colors || [];
        if (availableColors.length > 0) {
          setSelectedColor(availableColors[0]);
          
          // Find the first available size for this color
          const availableSizes = getAvailableSizesForColor(product, availableColors[0]);
          if (availableSizes.length > 0) {
            setSelectedSize(availableSizes[0]);
          }
        }
      } else {
        // For accessories without colors, just select the first available size
        const availableSizes = product.sizes || [];
        if (availableSizes.length > 0) {
          setSelectedSize(availableSizes[0]);
          setSelectedColor(''); // No color needed
        }
      }
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Product not found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const effectivePrice = product.discountPrice || product.price;
  const isWishlisted = isInWishlist(product._id);
  const cartItemCount = getCartItemCount(product._id);
  
  // Get current variant stock
  const hasColors = product.category === 'outfits' || product.category === 'shoes';
  const currentVariantStock = selectedSize && selectedSize !== 'made_to_order' 
    ? hasColors 
      ? (selectedColor ? getStockForVariant(product, selectedSize, selectedColor) : 0)
      : getStockForVariant(product, selectedSize) // No color needed for accessories
    : 0;
  
  const availableStock = Math.max(0, currentVariantStock - cartItemCount);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= availableStock) {
      setQuantity(newQuantity);
    }
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    // Reset quantity when size changes
    setQuantity(1);
    
    // If switching to a regular size and product has colors, check if current color is available for this size
    if (size !== 'made_to_order' && hasColors && selectedColor) {
      const availableColors = getAvailableColorsForSize(product, size);
      if (!availableColors.includes(selectedColor)) {
        // Switch to first available color for this size
        if (availableColors.length > 0) {
          setSelectedColor(availableColors[0]);
        }
      }
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    // Reset quantity when color changes
    setQuantity(1);
    
    // Check if current size is available for this color
    if (selectedSize !== 'made_to_order') {
      const availableSizes = getAvailableSizesForColor(product, color);
      if (!availableSizes.includes(selectedSize)) {
        // Switch to first available size for this color
        if (availableSizes.length > 0) {
          setSelectedSize(availableSizes[0]);
        }
      }
    }
  };

  // Modal-based consultation request
  const handleConsultationSubmit = async (formData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerMessage: string;
  }) => {
    try {
      const response = await fetch('/api/send-consultation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: product.name,
          productPrice: effectivePrice,
          selectedColor: selectedColor || 'To be discussed',
          ...formData,
        }),
      });

      if (response.ok) {
        setAlert({
          message: `Consultation request sent! We'll contact you within 24 hours.`,
          type: 'success',
          icon: <Mail className="w-4 h-4" />
        });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending consultation email:', error);
      setAlert({
        message: 'Failed to send consultation request. Please try again.',
        type: 'error',
        icon: <AlertTriangle className="w-4 h-4" />
      });
    }
  };

  const handleAddToCart = () => {
    if (selectedSize === 'made_to_order') {
      // Open modal instead of sending email directly
      setIsConsultationModalOpen(true);
      return;
    }

    if (quantity > availableStock) {
      setAlert({
        message: `Only ${availableStock} items available for this variant`,
        type: 'error',
        icon: <ShoppingCart className="w-4 h-4" />
      });
      return;
    }

    if (availableStock === 0) {
      setAlert({
        message: `This variant is out of stock`,
        type: 'error',
        icon: <AlertTriangle className="w-4 h-4" />
      });
      return;
    }

    addToCart({
      _id: product._id,
      name: product.name,
      price: effectivePrice,
      mainImage: product.mainImage,
      slug: product.slug,
      inStock: product.inStock,
      size: selectedSize,
      color: hasColors ? selectedColor : 'N/A',
      quantity
    });

    setAlert({
      message: `${product.name} added to cart!`,
      type: 'success',
      icon: <CheckCircle className="w-4 h-4" />
    });
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product._id);
      setAlert({
        message: `${product.name} removed from wishlist`,
        type: 'success',
        icon: <Heart className="w-4 h-4" />
      });
    } else {
      addToWishlist({
        _id: product._id,
        name: product.name,
        price: effectivePrice,
        discountPrice: product.discountPrice,
        mainImage: product.mainImage,
        slug: product.slug,
        inStock: product.inStock
      });
      setAlert({
        message: `${product.name} added to wishlist!`,
        type: 'success',
        icon: <Heart className="w-4 h-4 fill-current" />
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${product.name} | Aleebansparks`,
      text: `Check out this amazing ${product.name} for ₦${effectivePrice.toLocaleString()} at Aleebansparks!`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setAlert({
          message: 'Product shared successfully!',
          type: 'success',
          icon: <CheckCircle className="w-4 h-4" />
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setAlert({
          message: 'Product link copied to clipboard!',
          type: 'success',
          icon: <CheckCircle className="w-4 h-4" />
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      setAlert({
        message: 'Failed to share product',
        type: 'error',
        icon: <AlertTriangle className="w-4 h-4" />
      });
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Alert */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          icon={alert.icon}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        onSubmit={handleConsultationSubmit}
        productName={product.name}
        productPrice={effectivePrice}
        selectedColor={selectedColor}
      />

      {/* Clean Breadcrumb */}
      <motion.div 
        variants={sectionVariants}
        className="border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-600 flex items-center">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            {product.category && (
              <>
                <Link href={`/${product.category.replace('_', '-')}`} className="hover:text-gray-900 transition-colors capitalize">
                  {product.category.replace('_', ' ')}
                </Link>
                <ChevronRight className="w-4 h-4 mx-2" />
              </>
            )}
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Product Image Gallery */}
          <motion.div variants={sectionVariants}>
            <ProductImageGallery product={product} />
          </motion.div>

          {/* Product Details */}
          <motion.div variants={sectionVariants} className="space-y-10">
            {/* Product Info */}
            <ProductInfo product={product} />

            {/* Product Options */}
            <ProductOptions
              product={product}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              quantity={quantity}
              cartItemCount={cartItemCount}
              maxQuantity={availableStock}
              currentVariantStock={currentVariantStock}
              onSizeChange={handleSizeChange}
              onColorChange={handleColorChange}
              onQuantityChange={handleQuantityChange}
            />

            {/* Product Actions */}
            <ProductActions
              product={product}
              isWishlisted={isWishlisted}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              availableStock={availableStock}
              currentVariantStock={currentVariantStock}
              quantity={quantity}
              onAddToCart={handleAddToCart}
              onWishlistToggle={handleWishlistToggle}
              onShare={handleShare}
            />

            {/* Product Description */}
            <ProductDescription product={product} />
          </motion.div>
        </div>

        {/* Related Products */}
        <RelatedProducts 
          products={relatedProducts}
          categorySlug={product.category?.replace('_', '-')}
        />
      </div>
    </motion.div>
  );
};

export default ProductPageClient;