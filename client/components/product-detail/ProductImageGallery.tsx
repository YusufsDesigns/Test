// components/product/ProductImageGallery.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize2, X } from "lucide-react";
import { SanityProduct } from "@/lib/sanity";

interface ProductImageGalleryProps {
  product: SanityProduct;
  className?: string;
}

interface MediaItem {
  type: 'image' | 'video';
  asset: {
    url: string;
  };
  alt?: string;
}

const imageVariants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  product,
  className = "",
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [fullscreenVideoRef, setFullscreenVideoRef] = useState<HTMLVideoElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Create media items array (images first, then videos)
  const createMediaItems = (): MediaItem[] => {
    const mediaItems: MediaItem[] = [];
    
    // Add main image
    if (product.mainImage?.asset?.url) {
      mediaItems.push({
        type: 'image',
        asset: { url: product.mainImage.asset.url },
        alt: product.mainImage.alt || product.name
      });
    }
    
    // Add gallery images
    if (product.gallery) {
      product.gallery.forEach(image => {
        if (image?.asset?.url) {
          mediaItems.push({
            type: 'image',
            asset: { url: image.asset.url },
            alt: image.alt || product.name
          });
        }
      });
    }
    
    // Add videos as last slides
    if (product.videoGallery) {
      product.videoGallery.forEach((video, index) => {
        if (video?.asset?.url) {
          mediaItems.push({
            type: 'video',
            asset: { url: video.asset.url },
            alt: `${product.name} Video ${index + 1}`
          });
        }
      });
    }
    
    return mediaItems;
  };

  const allMediaItems = createMediaItems();
  const currentMedia = allMediaItems[currentMediaIndex];

  const handleVideoPlay = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoMute = () => {
    if (videoRef) {
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreenToggle = () => {
    if (currentMedia?.type === 'video') {
      setIsFullscreen(!isFullscreen);
      
      // Sync video state when entering fullscreen
      if (!isFullscreen && videoRef && fullscreenVideoRef) {
        fullscreenVideoRef.currentTime = videoRef.currentTime;
        fullscreenVideoRef.muted = videoRef.muted;
        if (isPlaying) {
          fullscreenVideoRef.play();
        }
      }
      
      // Sync back when exiting fullscreen
      if (isFullscreen && videoRef && fullscreenVideoRef) {
        videoRef.currentTime = fullscreenVideoRef.currentTime;
        videoRef.muted = fullscreenVideoRef.muted;
        if (fullscreenVideoRef.paused) {
          videoRef.pause();
          setIsPlaying(false);
        } else {
          videoRef.play();
          setIsPlaying(true);
        }
      }
    }
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    // Pause video when navigating away
    if (currentMedia?.type === 'video' && videoRef) {
      videoRef.pause();
      setIsPlaying(false);
    }

    if (direction === 'prev') {
      setCurrentMediaIndex(Math.max(0, currentMediaIndex - 1));
    } else {
      setCurrentMediaIndex(Math.min(allMediaItems.length - 1, currentMediaIndex + 1));
    }
    setImageLoading(true);
  };

  const selectMedia = (index: number) => {
    // Pause current video when switching
    if (currentMedia?.type === 'video' && videoRef) {
      videoRef.pause();
      setIsPlaying(false);
    }
    
    setCurrentMediaIndex(index);
    setImageLoading(true);
  };

  if (!currentMedia) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="relative aspect-[4/5] bg-gray-100 border border-gray-200 overflow-hidden rounded-lg flex items-center justify-center">
          <p className="text-gray-400">No media available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* Main Media Display */}
        <div className="relative group">
          <div className="relative aspect-[4/5] bg-gray-50 border border-gray-200 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMediaIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full"
              >
                {currentMedia.type === 'image' ? (
                  <>
                    <Image
                      src={currentMedia.asset.url}
                      alt={currentMedia.alt || product.name}
                      fill
                      className="object-cover"
                      priority
                      onLoad={() => setImageLoading(false)}
                      onError={() => setImageLoading(false)}
                    />
                    {imageLoading && (
                      <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                    )}
                  </>
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      ref={setVideoRef}
                      src={currentMedia.asset.url}
                      className="w-full h-full object-cover"
                      muted={isMuted}
                      loop
                      onLoadedData={() => setImageLoading(false)}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onError={() => setImageLoading(false)}
                    />
                    
                    {/* Video Controls Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {/* Play/Pause Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleVideoPlay}
                          className="p-4 bg-white bg-opacity-90 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6 text-gray-800" />
                          ) : (
                            <Play className="w-6 h-6 text-gray-800 ml-1" />
                          )}
                        </motion.button>
                        
                        {/* Mute/Unmute Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleVideoMute}
                          className="p-3 bg-white bg-opacity-90 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5 text-gray-800" />
                          ) : (
                            <Volume2 className="w-5 h-5 text-gray-800" />
                          )}
                        </motion.button>

                        {/* Fullscreen Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleFullscreenToggle}
                          className="p-3 bg-white bg-opacity-90 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
                        >
                          <Maximize2 className="w-5 h-5 text-gray-800" />
                        </motion.button>
                      </div>
                    </div>

                    {imageLoading && (
                      <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                        <Play className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {allMediaItems.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateMedia('prev')}
                  disabled={currentMediaIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white bg-opacity-90 backdrop-blur-sm border border-gray-200 rounded-full disabled:opacity-30 hover:bg-opacity-100 transition-all duration-200 shadow-lg z-10"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateMedia('next')}
                  disabled={currentMediaIndex === allMediaItems.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white bg-opacity-90 backdrop-blur-sm border border-gray-200 rounded-full disabled:opacity-30 hover:bg-opacity-100 transition-all duration-200 shadow-lg z-10"
                >
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </motion.button>
              </>
            )}

            {/* Media Indicator */}
            {allMediaItems.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {allMediaItems.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => selectMedia(index)}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      currentMediaIndex === index
                        ? "bg-white w-6 shadow-lg"
                        : "bg-white bg-opacity-60 w-2 hover:bg-opacity-80"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Media Type Indicator */}
            {currentMedia.type === 'video' && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-medium z-10">
                VIDEO
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {allMediaItems.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-4 gap-2"
          >
            {allMediaItems.map((media, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => selectMedia(index)}
                className={`relative aspect-square bg-gray-50 border overflow-hidden transition-all duration-200 ${
                  currentMediaIndex === index
                    ? "border-gray-800 border-2"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                {media.type === 'image' ? (
                  <Image
                    src={media.asset.url}
                    alt={media.alt || `${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={media.asset.url}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                    
                    {/* Video Indicator */}
                    <div className="absolute top-1 right-1 p-1 bg-black bg-opacity-60 rounded-full">
                      <Play className="w-3 h-3 text-white" />
                    </div>
                    
                    {/* Video Badge */}
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white px-1 py-0.5 rounded text-xs font-medium">
                      VIDEO
                    </div>
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Media Counter */}
        {allMediaItems.length > 1 && (
          <div className="text-center text-sm text-gray-500">
            {currentMediaIndex + 1} of {allMediaItems.length}
            {currentMedia.type === 'video' && ' (Video)'}
          </div>
        )}
      </div>

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {isFullscreen && currentMedia?.type === 'video' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
            onClick={handleFullscreenToggle}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFullscreenToggle}
                className="absolute top-4 right-4 p-3 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-80 transition-all z-10"
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Fullscreen Video */}
              <video
                ref={setFullscreenVideoRef}
                src={currentMedia.asset.url}
                className="w-full h-full object-contain max-h-[90vh]"
                controls
                autoPlay={isPlaying}
                muted={isMuted}
                loop
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductImageGallery;