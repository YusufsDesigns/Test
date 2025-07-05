// components/product-detail/ProductOptions.tsx
"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { SanityProduct, getStockForVariant, getAvailableColorsForSize, getAvailableSizesForColor } from '@/lib/sanity';
import { Plus, Minus, Sparkles } from 'lucide-react';

const ProductOptions: React.FC<{
  product: SanityProduct;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  cartItemCount: number;
  maxQuantity: number;
  currentVariantStock: number;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onQuantityChange: (change: number) => void;
}> = ({
  product,
  selectedSize,
  selectedColor,
  quantity,
  cartItemCount,
  maxQuantity,
  currentVariantStock,
  onSizeChange,
  onColorChange,
  onQuantityChange,
}) => {
  const formatSize = (size: string) => {
    if (size === 'custom') return 'Custom Size';
    if (size === 'one_size') return 'One Size';
    if (size.includes('ml')) return size;
    return `Size ${size}`;
  };

  // Check if this product category supports made-to-order
  const supportsMadeToOrder = product.category === 'outfits';

  // Get available sizes for the selected color
  const availableSizesForColor = selectedColor ? getAvailableSizesForColor(product, selectedColor) : [];
  
  // Get available colors for the selected size
  const availableColorsForSize = selectedSize && selectedSize !== 'made_to_order' 
    ? getAvailableColorsForSize(product, selectedSize) 
    : product.colors || [];

  // Get stock for each size-color combination to show availability
  const getSizeAvailability = (size: string) => {
    if (size === 'made_to_order') return { available: true, stock: 0 };
    if (!selectedColor) return { available: false, stock: 0 };
    
    const stock = getStockForVariant(product, size, selectedColor);
    return { available: stock > 0, stock };
  };

  const getColorAvailability = (color: string) => {
    if (selectedSize === 'made_to_order') return { available: true, stock: 0 };
    if (!selectedSize || selectedSize === '') return { available: true, stock: 0 }; // Show all colors when no size selected
    
    const stock = getStockForVariant(product, selectedSize, color);
    return { available: stock > 0, stock };
  };

  return (
    <div className="space-y-8">
      {/* Size Selection */}
      {((product.sizes && product.sizes.length > 0) || supportsMadeToOrder) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">Select Size</h3>
          <div className="space-y-3">
            {/* Regular Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.sizes.map((size) => {
                  const { available, stock } = getSizeAvailability(size);
                  const isSelected = selectedSize === size;
                  
                  return (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSizeChange(size)}
                      className={`py-3 px-4 text-sm font-medium border transition-all duration-200 relative ${
                        isSelected
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div>
                        {formatSize(size)}
                      </div>
                      {selectedColor && stock > 0 && stock <= 5 && (
                        <div className="text-xs mt-1 opacity-75">
                          {stock} left
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Made to Order Option - Always shown separately if supported */}
            {supportsMadeToOrder && (
              <div className="border-t border-gray-200 pt-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSizeChange('made_to_order')}
                  className={`w-full py-4 px-6 text-sm font-medium border-2 transition-all duration-200 relative overflow-hidden ${
                    selectedSize === 'made_to_order'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 hover:from-blue-100 hover:to-purple-100'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold">Made to Order</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-xs mt-1 opacity-90">
                    Custom sizing & measurements
                  </div>
                  {selectedSize !== 'made_to_order' && (
                    <div className="absolute top-1 right-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                        Popular
                      </span>
                    </div>
                  )}
                </motion.button>
              </div>
            )}

            {/* Made to Order Info */}
            {selectedSize === 'made_to_order' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-900">Custom Made Just for You</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Professional measurements consultation</li>
                      <li>• Perfect fit guarantee</li>
                      <li>• 2-3 weeks delivery time</li>
                      <li>• Premium quality materials</li>
                    </ul>
                    <p className="text-xs text-blue-600 mt-2">
                      💡 Our team will contact you within 24 hours to discuss measurements and customization options.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">Select Color</h3>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => {
              const { available, stock } = getColorAvailability(color);
              const isSelected = selectedColor === color;
              
              return (
                <motion.button
                  key={color}
                  whileHover={{ scale: available ? 1.02 : 1 }}
                  whileTap={{ scale: available ? 0.98 : 1 }}
                  onClick={() => available && onColorChange(color)}
                  disabled={!available}
                  className={`py-2 px-4 text-sm font-medium border transition-all duration-200 relative ${
                    isSelected
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : available
                      ? 'border-gray-300 hover:border-gray-500'
                      : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div>
                    {color}
                  </div>
                  {selectedSize !== 'made_to_order' && selectedSize && stock > 0 && stock <= 5 && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {stock}
                    </div>
                  )}

                </motion.button>
              );
            })}
          </div>
          
          {/* Stock info for selected variant */}
          {selectedSize !== 'made_to_order' && selectedColor && currentVariantStock > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">{currentVariantStock}</span> available for {selectedColor} in {formatSize(selectedSize)}
            </div>
          )}
        </motion.div>
      )}

      {/* Quantity Selector - Hidden for Made to Order */}
      {selectedSize !== 'made_to_order' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
              Quantity
            </h3>
            <div className="text-xs text-gray-600 space-y-1 text-right">
              {cartItemCount > 0 && (
                <p>{cartItemCount} in cart</p>
              )}
              {currentVariantStock > 0 && (
                <p className={`font-medium ${currentVariantStock <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                  {currentVariantStock} available
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center border border-gray-300 w-fit rounded-lg overflow-hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onQuantityChange(-1)}
              disabled={quantity <= 1}
              className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            <span className="px-6 py-3 min-w-[80px] text-center font-medium border-x border-gray-300">
              {quantity}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onQuantityChange(1)}
              disabled={quantity >= maxQuantity}
              className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
          
          {quantity >= maxQuantity && maxQuantity > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-orange-600 mt-2 flex items-center gap-1"
            >
              ⚠️ Maximum available quantity reached
            </motion.p>
          )}

          {currentVariantStock === 0 && selectedSize && selectedColor && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-600 mt-2 flex items-center gap-1"
            >
              ❌ This variant is out of stock
            </motion.p>
          )}
        </motion.div>
      )}

      {/* Made to Order Quantity Info */}
      {selectedSize === 'made_to_order' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <p className="text-sm text-blue-800">
            <strong>Custom Order:</strong> Quantity and final pricing will be discussed during consultation.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ProductOptions;