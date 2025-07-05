"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Share2, Mail } from "lucide-react";
import { SanityProduct } from "@/lib/sanity";

interface ProductActionsProps {
  product: SanityProduct;
  isWishlisted: boolean;
  selectedSize: string;
  selectedColor: string;
  availableStock: number;
  currentVariantStock: number;
  quantity: number;
  onAddToCart: () => void;
  onWishlistToggle: () => void;
  onShare: () => void;
  className?: string;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  isWishlisted,
  selectedSize,
  selectedColor,
  availableStock,
  currentVariantStock,
  quantity,
  onAddToCart,
  onWishlistToggle,
  onShare,
  className = "",
}) => {
  const isMadeToOrder = selectedSize === 'made_to_order';
  const hasColors = product.category === 'outfits' || product.category === 'shoes';
  const isVariantOutOfStock = !isMadeToOrder && currentVariantStock === 0;
  const isQuantityExceeded = !isMadeToOrder && quantity > availableStock;
  const noVariantSelected = !selectedSize || (!isMadeToOrder && hasColors && !selectedColor);

  const getButtonText = () => {
    if (isMadeToOrder) return "Add Custom Order to Cart";
    if (noVariantSelected) {
      if (hasColors) return "Select Size & Color";
      return "Select Size";
    }
    if (isVariantOutOfStock) return "Out of Stock";
    if (isQuantityExceeded) return "Insufficient Stock";
    return "Add to Cart";
  };

  const getButtonIcon = () => {
    if (isMadeToOrder) return <Mail className="w-4 h-4 mr-2 inline" />;
    return <ShoppingCart className="w-4 h-4 mr-2 inline" />;
  };

  const getButtonStyle = () => {
    if (noVariantSelected || isVariantOutOfStock || isQuantityExceeded) {
      return "bg-gray-300 text-gray-500 cursor-not-allowed";
    }
    if (isMadeToOrder) {
      return "bg-blue-600 hover:bg-blue-700 text-white";
    }
    return "bg-gray-900 hover:bg-gray-800 text-white";
  };

  const isButtonDisabled = noVariantSelected || isVariantOutOfStock || isQuantityExceeded;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className={`space-y-4 ${className}`}
    >
      {/* Selection Status */}
      {noVariantSelected && !isMadeToOrder && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <ShoppingCart className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="font-medium text-gray-700">Select Your Preferences</p>
              <p className="text-sm text-gray-600">
                {hasColors ? "Choose both size and color to add to cart" : "Choose a size to add to cart"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Made to Order Info */}
      {isMadeToOrder && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Mail className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-blue-900">Custom Made to Order</p>
              <p className="text-sm text-blue-700">
                This will be added to your cart as a custom order item.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Variant Out of Stock Warning */}
      {isVariantOutOfStock && selectedSize && (hasColors ? selectedColor : true) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-5 h-5 text-red-600 mr-3 text-center">❌</div>
            <div>
              <p className="font-medium text-red-900">Variant Out of Stock</p>
              <p className="text-sm text-red-700">
                {hasColors 
                  ? `${selectedColor} in ${selectedSize} is currently unavailable.`
                  : `Size ${selectedSize} is currently unavailable.`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Low Stock Warning */}
      {!isMadeToOrder && !isVariantOutOfStock && currentVariantStock > 0 && currentVariantStock <= 5 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <p className="text-orange-800 text-sm font-medium">
            ⚠️ Only {currentVariantStock} item{currentVariantStock !== 1 ? 's' : ''} left for this variant!
          </p>
        </div>
      )}

      {/* Main Action Button */}
      <motion.button
        whileHover={{ scale: isButtonDisabled ? 1 : 1.01 }}
        whileTap={{ scale: isButtonDisabled ? 1 : 0.99 }}
        onClick={onAddToCart}
        disabled={isButtonDisabled}
        className={`w-full py-4 px-6 text-sm font-medium uppercase tracking-wide transition-all duration-200 ${getButtonStyle()}`}
      >
        {getButtonIcon()}
        {getButtonText()}
      </motion.button>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onWishlistToggle}
          className={`py-3 px-6 text-sm font-medium border transition-all duration-200 ${
            isWishlisted
              ? "border-red-600 bg-red-50 text-red-600"
              : "border-gray-300 hover:border-gray-500"
          }`}
        >
          <Heart
            className={`w-4 h-4 mr-2 inline ${isWishlisted ? "fill-current" : ""}`}
          />
          {isWishlisted ? "Wishlisted" : "Wishlist"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onShare}
          className="py-3 px-6 text-sm font-medium border border-gray-300 hover:border-gray-500 transition-all duration-200"
        >
          <Share2 className="w-4 h-4 mr-2 inline" />
          Share
        </motion.button>
      </div>

      {/* Additional Information */}
      {!isMadeToOrder && selectedSize && (hasColors ? selectedColor : true) && currentVariantStock > 0 && (
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium">Available:</span> {currentVariantStock} units for this variant
          </p>
          <p>
            <span className="font-medium">Delivery:</span> 2-5 business days
          </p>
          <p>
            <span className="font-medium">Returns:</span> 30-day return policy
          </p>
        </div>
      )}

      {isMadeToOrder && (
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium">Production Time:</span> 2-4 weeks
          </p>
          <p>
            <span className="font-medium">Custom Fitting:</span> Measurements required
          </p>
          <p>
            <span className="font-medium">Returns:</span> Custom orders are final sale
          </p>
        </div>
      )}

      {/* Variant Selection Help */}
      {!isMadeToOrder && (!selectedSize || (hasColors && !selectedColor)) && (
        <div className="text-sm text-gray-500 space-y-1">
          <p className="font-medium">Please select:</p>
          {!selectedSize && <p>• Size</p>}
          {hasColors && !selectedColor && <p>• Color</p>}
        </div>
      )}
    </motion.div>
  );
};

export default ProductActions;