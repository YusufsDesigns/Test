"use client";

import React from "react";
import ProductListingPage from "../../components/ProductListingPage";
import { getHandMadeShoes } from "../../lib/sanity";

const ShoesPage: React.FC = () => {
  const pageConfig = {
    title: "Handmade Shoes",
    description:
      "Step into elegance with our collection of handcrafted shoes. Each pair is meticulously made with premium materials for comfort and style.",
    headerGradient: "bg-gradient-to-r from-amber-50 to-orange-50",
    filterConfig: {
      showGenderFilter: true,
      genderOptions: [
        { value: "his", label: "Men's Shoes" },
        { value: "hers", label: "Women's Shoes" },
      ],
    },
  };

  return (
    <ProductListingPage
      pageConfig={pageConfig}
      fetchProducts={() => getHandMadeShoes()} // Get all shoes
    />
  );
};

export default ShoesPage;
