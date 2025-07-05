"use client"

import React from 'react';
import ProductListingPage from '../../components/ProductListingPage';
import { getOutfitsByBrand } from '../../lib/sanity';

const OutfitsPage: React.FC = () => {
  const pageConfig = {
    title: "Outfits by Brand",
    description: "Discover our curated collection of premium ready-made outfits, crafted with attention to detail and designed for the modern individual.",
    headerGradient: "bg-gradient-to-r from-gray-50 to-gray-100"
  };

  return (
    <ProductListingPage 
      pageConfig={pageConfig}
      fetchProducts={getOutfitsByBrand}
    />
  );
};

export default OutfitsPage;