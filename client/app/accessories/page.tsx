"use client";

import React from "react";
import ProductListingPage from "../../components/ProductListingPage";
import { getAccessories } from "../../lib/sanity";

const AccessoriesPage: React.FC = () => {
  const pageConfig = {
    title: "Accessories",
    description:
      "Complete your look with our exquisite collection of accessories. From elegant scarves to premium perfumes, find the perfect finishing touch.",
    headerGradient: "bg-gradient-to-r from-purple-50 to-pink-50",
    filterConfig: {
      showTypeFilter: true,
      typeOptions: [
        { value: "headties_scarves", label: "Headties & Scarves" },
        { value: "perfumes", label: "Perfumes" },
      ],
    },
  };

  return (
    <ProductListingPage
      pageConfig={pageConfig}
      fetchProducts={() => getAccessories()} // Get all accessories
    />
  );
};

export default AccessoriesPage;
