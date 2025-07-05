"use client";

import Image from "next/image";
import { CiHeart } from "react-icons/ci";
import { motion } from "framer-motion";
import { SanityProduct, getTotalStock } from "../../lib/sanity";
import Link from "next/link";
import { useWishlist } from "@/providers/WishlistProvider";

interface CardPropTypes {
  product: SanityProduct;
  classname?: string;
  cozy?: boolean;
}

const Card: React.FC<CardPropTypes> = ({ product, classname, cozy }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isLiked = isInWishlist(product._id);

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop event bubbling
    
    toggleWishlist({
      _id: product._id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      mainImage: product.mainImage,
      slug: product.slug,
      inStock: product.inStock
    });
  };

  // Calculate effective price (discount or regular)
  const effectivePrice = product?.discountPrice || product?.price;
  const hasDiscount =
    product?.discountPrice && product?.discountPrice < product?.price;

  // Get inventory information
  const totalStock = getTotalStock(product);
  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock <= 10;

  // Check if product supports made-to-order
  const supportsMadeToOrder = product.category === 'outfits_by_brand';

  // Determine availability status with priority
  const getAvailabilityStatus = () => {
    // Priority 1: Out of stock (but check made-to-order)
    if (isOutOfStock) {
      if (supportsMadeToOrder) {
        return { status: 'Made to Order', type: 'made-to-order' };
      }
      return { status: 'Out of Stock', type: 'out-of-stock' };
    }
    
    // Priority 2: Low stock warning
    if (isLowStock) {
      return { status: `${totalStock} left`, type: 'low-stock' };
    }
    
    // Priority 3: New arrival (only if in stock)
    if (product.isNew) {
      return { status: 'New', type: 'new' };
    }
    
    // Priority 4: Featured (only if in stock and not new)
    if (product.isFeatured) {
      return { status: 'Featured', type: 'featured' };
    }
    
    return null;
  };

  const availabilityInfo = getAvailabilityStatus();

  // Variants for parent motion component
  const parentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05,
      },
    },
  };

  // Variants for child motion components
  const childVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  };

  // Image variants for smooth transitions
  const imageVariants = {
    initial: { opacity: 0, scale: 1.1 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  // Heart animation variants
  const heartVariants = {
    initial: { scale: 1 },
    liked: {
      scale: [1, 1.3, 1],
      transition: { duration: 0.3, ease: "easeOut" },
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      variants={parentVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`flex-shrink-0 w-auto md:w-[320px] lg:w-auto lg:flex-shrink group cursor-pointer ${classname}`}
    >
      <Link href={`/product/${product.slug.current}`} className="block relative">
        {/* Image Container */}
        <div className="relative bg-[#f5f2f0] h-[241px] md:h-[350px] lg:h-[430px] w-full overflow-hidden">
          {/* Product Image */}
          <motion.div
            variants={imageVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="absolute inset-0"
          >
            <Image
              src={product?.mainImage.asset.url!}
              alt={product?.mainImage?.alt || product.name}
              fill
              className={`object-cover transition-all duration-300 ${
                isOutOfStock && !supportsMadeToOrder ? 'grayscale opacity-75' : ''
              }`}
              sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 350px"
              priority={false}
            />
          </motion.div>

          {/* Out of stock overlay */}
          {isOutOfStock && !supportsMadeToOrder && (
            <motion.div
              variants={childVariants}
              className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10"
            >
              <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                <span className="text-black font-semibold text-sm">Out of Stock</span>
              </div>
            </motion.div>
          )}

          {/* Heart icon - always visible */}
          <motion.button
            variants={heartVariants}
            animate={isLiked ? "liked" : "initial"}
            whileHover="hover"
            onClick={handleLikeToggle}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 z-20 ${
              isLiked
                ? "bg-red-500 text-white"
                : "bg-white/80 text-black hover:bg-white"
            }`}
          >
            <CiHeart className={`text-lg transition-all duration-200 ${isLiked ? 'fill-current' : ''}`} />
          </motion.button>

          {/* Top Left Badges - Single Priority Badge */}
          <div className="absolute top-3 left-3 z-10">
            {availabilityInfo && (
              <motion.div
                variants={childVariants}
                className={`px-2 py-1 text-xs font-bold rounded ${
                  availabilityInfo.type === 'made-to-order'
                    ? 'bg-blue-600 text-white'
                    : availabilityInfo.type === 'out-of-stock'
                    ? 'bg-gray-600 text-white'
                    : availabilityInfo.type === 'low-stock'
                    ? 'bg-orange-500 text-white'
                    : availabilityInfo.type === 'new'
                    ? 'bg-green-600 text-white'
                    : availabilityInfo.type === 'featured'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-500 text-white'
                }`}
              >
                {availabilityInfo.status === 'Featured' ? '⭐ Featured' : availabilityInfo.status}
              </motion.div>
            )}
          </div>

          {/* Bottom Right Badges - Only Sale Badge */}
          <div className="absolute bottom-3 right-3 z-10">
            {/* Sale Badge - Always show if there's a discount */}
            {hasDiscount && (
              <motion.div
                variants={childVariants}
                className="bg-red-600 text-white px-2 py-1 text-xs font-bold rounded"
              >
                Sale
              </motion.div>
            )}
          </div>
        </div>

        {/* Product Information with stagger animation */}
        <motion.div
          variants={childVariants}
          className="mt-3 text-[#13161a] space-y-1"
        >
          {/* Optional cozy label */}
          {cozy && (
            <motion.h3
              variants={childVariants}
              className="text-[#666666] text-xs mb-1"
            >
              Cozy
            </motion.h3>
          )}

          {/* Item name */}
          <motion.h2
            variants={childVariants}
            className="text-sm leading-tight mb-1 font-medium hover:text-gray-700 transition-colors duration-200"
          >
            {product.name}
          </motion.h2>

          {/* Item price */}
          <motion.div
            variants={childVariants}
            className="flex items-center gap-2"
          >
            {hasDiscount ? (
              <>
                <span className="text-base font-semibold text-red-600">
                  ₦{effectivePrice.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₦{product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-base font-semibold text-black">
                ₦{effectivePrice.toLocaleString()}
              </span>
            )}
          </motion.div>

          {/* Availability Status */}
          {availabilityInfo && (
            <motion.div
              variants={childVariants}
              className="flex items-center gap-1"
            >
              <span className={`text-xs font-medium ${
                availabilityInfo.type === 'made-to-order'
                  ? 'text-blue-600'
                  : availabilityInfo.type === 'out-of-stock'
                  ? 'text-gray-500'
                  : availabilityInfo.type === 'low-stock'
                  ? 'text-orange-600'
                  : availabilityInfo.type === 'new'
                  ? 'text-green-600'
                  : availabilityInfo.type === 'featured'
                  ? 'text-purple-600'
                  : 'text-gray-600'
              }`}>
                {availabilityInfo.status}
              </span>
            </motion.div>
          )}

          {/* Stock Status Indicator */}
          <motion.div
            variants={childVariants}
            className="flex items-center gap-1"
          >
            <div className={`w-2 h-2 rounded-full ${
              availabilityInfo?.type === 'made-to-order'
                ? 'bg-blue-500'
                : availabilityInfo?.type === 'out-of-stock'
                ? 'bg-gray-400'
                : availabilityInfo?.type === 'low-stock'
                ? 'bg-orange-500'
                : 'bg-green-500'
            }`} />
            <span className="text-xs text-gray-600">
              {availabilityInfo?.type === 'made-to-order'
                ? 'Custom orders available'
                : availabilityInfo?.type === 'out-of-stock'
                ? 'Currently unavailable'
                : availabilityInfo?.type === 'low-stock'
                ? `Limited stock (${totalStock})`
                : totalStock > 10
                ? 'In stock'
                : `${totalStock} available`
              }
            </span>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default Card;