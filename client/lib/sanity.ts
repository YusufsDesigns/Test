// lib/sanity.ts
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    useCdn: false, // Set to false to avoid caching issues during development
    apiVersion: '2024-12-01',
    perspective: 'published', // or 'previewDrafts' for preview mode
    stega: false,
    token: process.env.SANITY_API_TOKEN // Required for write operations
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
    return builder.image(source)
}

// Inventory item interface - Updated to handle accessories without colors
export interface InventoryItem {
    size: string;
    color?: string; // Optional for accessories
    quantity: number;
}

// Updated TypeScript interface to match your current schema with inventory
export interface SanityProduct {
    _id: string;
    name: string;
    slug: {
        current: string;
    };
    price: number;
    discountPrice?: number;
    mainImage: {
        asset: {
            _ref: string;
            url?: string;
        };
        alt?: string;
    };
    inventory?: InventoryItem[];
    inStock: boolean;
    stockQuantity?: number;
    sizes?: string[];
    colors?: string[];
    _createdAt?: string;
    _updatedAt?: string;
    category?: 'outfits' | 'shoes' | 'accessories';
    subcategory?: 'his' | 'hers' | 'headties_scarves' | 'perfumes';
    gallery?: Array<{
        asset: {
            _ref: string;
            url?: string;
        };
        alt?: string;
    }>;
    videoGallery?: Array<{
        asset: {
            _ref: string;
            url?: string;
        };
    }>;
    description?: any[];
    isFeatured?: boolean;
    isNew?: boolean;
}

// Utility functions for inventory management - Updated to handle all categories properly
export function getStockForVariant(product: SanityProduct, size: string, color?: string): number {
    if (!product.inventory) return 0;
    
    // For accessories (category === 'accessories'), only match by size since they don't have colors
    if (product.category === 'accessories') {
        const inventoryItem = product.inventory.find(item => item.size === size);
        return inventoryItem?.quantity || 0;
    }
    
    // For outfits and shoes, we need both size and color
    if (!color) return 0; // Color is required for outfits and shoes
    
    const inventoryItem = product.inventory.find(
        item => item.size === size && item.color === color
    );
    
    return inventoryItem?.quantity || 0;
}

export function getTotalStock(product: SanityProduct): number {
    if (!product.inventory) return 0;
    
    return product.inventory.reduce((total, item) => total + item.quantity, 0);
}

export function isVariantInStock(product: SanityProduct, size: string, color?: string): boolean {
    return getStockForVariant(product, size, color) > 0;
}

export function getAvailableVariants(product: SanityProduct): InventoryItem[] {
    if (!product.inventory) return [];
    
    return product.inventory.filter(item => item.quantity > 0);
}

export function getAvailableSizes(product: SanityProduct): string[] {
    if (!product.inventory) return [];
    
    const sizes = new Set(
        product.inventory
            .filter(item => item.quantity > 0)
            .map(item => item.size)
    );
    
    return Array.from(sizes);
}

export function getAvailableColors(product: SanityProduct): string[] {
    if (!product.inventory) return [];
    
    const colors = new Set(
        product.inventory
            .filter(item => item.quantity > 0 && item.color) // Only include items with colors
            .map(item => item.color!)
    );
    
    return Array.from(colors);
}

export function getAvailableColorsForSize(product: SanityProduct, size: string): string[] {
    if (!product.inventory || product.category === 'accessories') return [];
    
    return product.inventory
        .filter(item => item.size === size && item.quantity > 0 && item.color)
        .map(item => item.color!)
        .filter((color, index, arr) => arr.indexOf(color) === index); // Remove duplicates
}

export function getAvailableSizesForColor(product: SanityProduct, color: string): string[] {
    if (!product.inventory || product.category === 'accessories') return [];
    
    return product.inventory
        .filter(item => item.color === color && item.quantity > 0)
        .map(item => item.size)
        .filter((size, index, arr) => arr.indexOf(size) === index); // Remove duplicates
}

// INVENTORY MANAGEMENT FUNCTIONS

// Function to update inventory after successful payment
export async function updateInventoryAfterPurchase(items: any[]): Promise<boolean> {
  try {
    // Process each item in the order
    for (const item of items) {
      // Skip made-to-order items as they don't reduce inventory
      if (item.size === 'made_to_order') {
        console.log(`Skipping inventory update for made-to-order item: ${item.name}`);
        continue;
      }
      
      const success = await reduceInventoryQuantity(
        item._id,
        item.size,
        item.color,
        item.quantity
      );
      
      if (!success) {
        console.error(`Failed to update inventory for item: ${item.name}`);
        // Continue with other items even if one fails
      }
    }
    return true;
  } catch (error) {
    console.error('Error updating inventory:', error);
    return false;
  }
}

// Function to reduce inventory quantity for a specific product variant
export async function reduceInventoryQuantity(
  productId: string,
  size: string,
  color: string | undefined,
  quantityToReduce: number
): Promise<boolean> {
  try {
    // 1. Fetch the complete product document with inventory and category
    const product = await client.fetch(
      `*[_type == "product" && _id == $productId][0] {
        _id,
        _rev,  // CRITICAL: Include revision ID for patching
        inventory,
        category
      }`,
      { productId }
    );

    if (!product) {
      console.error('❌ Product not found:', productId);
      return false;
    }

    if (!product.inventory || product.inventory.length === 0) {
      console.error('📦 Product has no inventory items:', productId);
      return false;
    }

    // 2. Find the exact inventory item to update
    const inventoryItem = product.inventory.find((item: any) => {
      // Convert both sizes to strings for reliable comparison
      const sizeMatches = String(item.size) === String(size);
      
      // Handle color based on category
      if (product.category === 'accessories') {
        return sizeMatches;
      } else {
        return sizeMatches && 
               (!color || item.color?.toLowerCase() === color.toLowerCase());
      }
    });

    if (!inventoryItem) {
      console.error(
        '🔍 Inventory item not found:',
        `Product: ${productId}`,
        `Size: ${size}`,
        color ? `Color: ${color}` : ''
      );
      return false;
    }

    // 3. Validate sufficient stock
    if (inventoryItem.quantity < quantityToReduce) {
      console.error(
        '⚠️ Insufficient stock:',
        `Current: ${inventoryItem.quantity}`,
        `Requested: ${quantityToReduce}`
      );
      return false;
    }

    // 4. Calculate new quantity
    const newQuantity = inventoryItem.quantity - quantityToReduce;

    // 5. Create the updated inventory array
    const updatedInventory = product.inventory.map((item: any) => 
      item === inventoryItem ? { ...item, quantity: newQuantity } : item
    );

    // 6. Execute the patch with explicit revision
    const result = await client
      .patch(productId)
      .setIfMissing({ inventory: [] })  // Safety check
      .set({ inventory: updatedInventory })
      .commit({ autoGenerateArrayKeys: true });

    console.log(
      '✅ Successfully updated inventory:',
      `Product: ${productId}`,
      `Size: ${size}`,
      color ? `Color: ${color}` : '',
      `New Qty: ${newQuantity}`
    );

    return true;
  } catch (error) {
    console.error('💥 Failed to update inventory:', error);
    return false;
  }
}

// Function to check if there's enough stock before processing payment
export async function validateInventoryBeforePayment(
  items: any[]
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  try {
    // First fetch all products in one query for better performance
    const productIds = items.map(item => item._id);
    const products = await client.fetch(
      `*[_type == "product" && _id in $productIds] {
        _id,
        inventory,
        category
      }`,
      { productIds }
    );

    const productMap = new Map(products.map((p: any) => [p._id, p]));

    for (const item of items) {
      // Skip validation for made-to-order items
      if (item.size === 'made_to_order') continue;

      const product = productMap.get(item._id);
      if (!product) {
        errors.push(`Product ${item.name} not found`);
        continue;
      }

      const currentStock = getStockForVariantFromProduct(
        product,
        item.size,
        item.color
      );

      console.log(
        `Stock check for ${item.name}: ` +
        `size ${item.size}${item.color ? `, color ${item.color}` : ''} ` +
        `- Available: ${currentStock}, Requested: ${item.quantity}`
      );

      if (currentStock < item.quantity) {
        errors.push(
          `Insufficient stock for ${item.name} ` +
          `(${item.size}${item.color ? `, ${item.color}` : ''}). ` +
          `Available: ${currentStock}, Requested: ${item.quantity}`
        );
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  } catch (error) {
    console.error('Error validating inventory:', error);
    return {
      valid: false,
      errors: ['Error validating inventory availability']
    };
  }
}

// Helper function to get stock from already fetched product
function getStockForVariantFromProduct(
  product: any,
  size: string,
  color?: string
): number {
  if (!product.inventory) return 0;

  const inventoryItem = product.inventory.find((item: any) => {
    if (String(item.size) !== String(size)) return false;

    if (product.category === 'accessories') {
      return true; // No color needed for accessories
    } else {
      return color 
        ? item.color?.toLowerCase() === color.toLowerCase()
        : false;
    }
  });

  return inventoryItem?.quantity || 0;
}

// Helper function to get current stock for a specific variant
async function getCurrentStock(productId: string, size: string, color?: string): Promise<number> {
  try {
    // Fetch both inventory and category to properly handle color logic
    const product = await client.fetch(
      `*[_type == "product" && _id == $productId][0] {
        inventory,
        category
      }`,
      { productId }
    );

    if (!product || !product.inventory) {
      return 0;
    }

    const inventoryItem = product.inventory.find((item: any) => {
      // First check if size matches (convert both to string for comparison)
      if (String(item.size) !== String(size)) {
        return false;
      }

      // Handle color based on product category
      if (product.category === 'accessories') {
        // No color needed for accessories
        return true;
      } else {
        // For other categories, check color if provided
        if (color) {
          return item.color?.toLowerCase() === color.toLowerCase();
        }
        // If color isn't provided but required, don't match
        return false;
      }
    });

    return inventoryItem?.quantity || 0;
  } catch (error) {
    console.error('Error getting current stock:', error);
    return 0;
  }
}

// Function to restore inventory if payment fails (optional but recommended)
export async function restoreInventoryAfterFailedPayment(items: any[]): Promise<boolean> {
  try {
    for (const item of items) {
      // Skip made-to-order items
      if (item.size === 'made_to_order') {
        continue;
      }
      
      const success = await increaseInventoryQuantity(
        item._id,
        item.size,
        item.color,
        item.quantity
      );
      
      if (!success) {
        console.error(`Failed to restore inventory for item: ${item.name}`);
      }
    }
    return true;
  } catch (error) {
    console.error('Error restoring inventory:', error);
    return false;
  }
}

// Helper function to increase inventory (for refunds or failed payments)
async function increaseInventoryQuantity(
  productId: string,
  size: string,
  color: string | undefined,
  quantityToAdd: number
): Promise<boolean> {
  try {
    const product = await client.fetch(
      `*[_type == "product" && _id == $productId][0] { inventory }`,
      { productId }
    );

    if (!product || !product.inventory) {
      console.error(`Product ${productId} not found or has no inventory`);
      return false;
    }

    const inventoryIndex = product.inventory.findIndex((item: InventoryItem) => {
      if (!color) {
        return item.size === size;
      }
      return item.size === size && item.color === color;
    });

    if (inventoryIndex === -1) {
      console.error(`Inventory item not found for size: ${size}, color: ${color || 'N/A'}`);
      return false;
    }

    const currentQuantity = product.inventory[inventoryIndex].quantity;
    const newQuantity = currentQuantity + quantityToAdd;

    const updatedInventory = [...product.inventory];
    updatedInventory[inventoryIndex] = {
      ...updatedInventory[inventoryIndex],
      quantity: newQuantity
    };

    await client
      .patch(productId)
      .set({ inventory: updatedInventory })
      .commit();

    console.log(`Successfully restored inventory for product ${productId}: ${size}${color ? `, ${color}` : ''} by ${quantityToAdd}. New quantity: ${newQuantity}`);
    return true;
  } catch (error) {
    console.error('Error restoring inventory quantity:', error);
    return false;
  }
}

// Updated data fetching functions with complete inventory data
export async function getOutfitsByBrand(limit?: number): Promise<SanityProduct[]> {
    const query = `
    *[_type == "product" && category == "outfits"] | order(_createdAt desc) ${limit ? `[0...${limit}]` : ''} {
      _id,
      name,
      slug,
      price,
      discountPrice,
      category,
      mainImage {
        asset -> {
          _ref,
          url
        },
        alt
      },
      inventory,
      "inStock": count(inventory[quantity > 0]) > 0,
      "stockQuantity": math::sum(inventory[].quantity),
      "sizes": inventory[].size,
      "colors": inventory[].color,
      isFeatured,
      isNew
    }
  `

    try {
        const products = await client.fetch(query)
        // Process the arrays to remove duplicates and nulls on the client side
        return products.map((product: SanityProduct) => ({
            ...product,
            sizes: product.sizes ? Array.from(new Set(product.sizes.filter(Boolean))) : [],
            colors: product.colors ? Array.from(new Set(product.colors.filter(Boolean))) : []
        }))
    } catch (error) {
        console.error('Error fetching outfits by brand:', error)
        return []
    }
}

export async function getHandMadeShoes(gender?: 'his' | 'hers', limit?: number): Promise<SanityProduct[]> {
    const genderFilter = gender ? `&& subcategory == "${gender}"` : '';

    const query = `
    *[_type == "product" && category == "shoes" ${genderFilter}] | order(_createdAt desc) ${limit ? `[0...${limit}]` : ''} {
      _id,
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
      inventory,
      "inStock": count(inventory[quantity > 0]) > 0,
      "stockQuantity": math::sum(inventory[].quantity),
      "sizes": inventory[].size,
      "colors": inventory[].color,
      isFeatured,
      isNew
    }
  `

    try {
        const products = await client.fetch(query)
        return products.map((product: SanityProduct) => ({
            ...product,
            sizes: product.sizes ? Array.from(new Set(product.sizes.filter(Boolean))) : [],
            colors: product.colors ? Array.from(new Set(product.colors.filter(Boolean))) : []
        }))
    } catch (error) {
        console.error('Error fetching handmade shoes:', error)
        return []
    }
}

export async function getAccessories(type?: 'headties_scarves' | 'perfumes', limit?: number): Promise<SanityProduct[]> {
    const typeFilter = type ? `&& subcategory == "${type}"` : `&& (subcategory == "headties_scarves" || subcategory == "perfumes")`;

    const query = `
    *[_type == "product" && category == "accessories" ${typeFilter}] | order(_createdAt desc) ${limit ? `[0...${limit}]` : ''} {
      _id,
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
      inventory,
      "inStock": count(inventory[quantity > 0]) > 0,
      "stockQuantity": math::sum(inventory[].quantity),
      "sizes": inventory[].size,
      "colors": inventory[].color,
      isFeatured,
      isNew
    }
  `

    try {
        const products = await client.fetch(query)
        return products.map((product: SanityProduct) => ({
            ...product,
            sizes: product.sizes ? Array.from(new Set(product.sizes.filter(Boolean))) : [],
            colors: product.colors ? Array.from(new Set(product.colors.filter(Boolean))) : []
        }))
    } catch (error) {
        console.error('Error fetching accessories:', error)
        return []
    }
}

export async function getFeaturedProducts(limit?: number): Promise<SanityProduct[]> {
    const query = `
    *[_type == "product" && isFeatured == true] | order(_createdAt desc) ${limit ? `[0...${limit}]` : ''} {
      _id,
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
      inventory,
      "inStock": count(inventory[quantity > 0]) > 0,
      "stockQuantity": math::sum(inventory[].quantity),
      "sizes": inventory[].size,
      "colors": inventory[].color,
      isFeatured,
      isNew
    }
  `

    try {
        const products = await client.fetch(query)
        return products.map((product: SanityProduct) => ({
            ...product,
            sizes: product.sizes ? Array.from(new Set(product.sizes.filter(Boolean))) : [],
            colors: product.colors ? Array.from(new Set(product.colors.filter(Boolean))) : []
        }))
    } catch (error) {
        console.error('Error fetching featured products:', error)
        return []
    }
}

export async function getNewArrivals(limit?: number): Promise<SanityProduct[]> {
    const query = `
    *[_type == "product" && isNew == true] | order(_createdAt desc) ${limit ? `[0...${limit}]` : ''} {
      _id,
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
      inventory,
      "inStock": count(inventory[quantity > 0]) > 0,
      "stockQuantity": math::sum(inventory[].quantity),
      "sizes": inventory[].size,
      "colors": inventory[].color,
      isFeatured,
      isNew
    }
  `

    try {
        const products = await client.fetch(query)
        return products.map((product: SanityProduct) => ({
            ...product,
            sizes: product.sizes ? Array.from(new Set(product.sizes.filter(Boolean))) : [],
            colors: product.colors ? Array.from(new Set(product.colors.filter(Boolean))) : []
        }))
    } catch (error) {
        console.error('Error fetching new arrivals:', error)
        return []
    }
}

export async function getProductBySlug(slug: string): Promise<SanityProduct | null> {
    const query = `
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      _createdAt,
      _updatedAt,
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
      gallery[] {
        asset -> {
          _ref,
          url
        },
        alt
      },
      videoGallery[] {
        asset -> {
          _ref,
          url
        }
      },
      description,
      inventory,
      "inStock": count(inventory[quantity > 0]) > 0,
      "stockQuantity": math::sum(inventory[].quantity),
      "sizes": inventory[].size,
      "colors": inventory[].color,
      isFeatured,
      isNew
    }
  `

    try {
        const product = await client.fetch(query, { slug })
        if (!product) return null;
        
        // Process the arrays to remove duplicates and nulls
        return {
            ...product,
            sizes: product.sizes ? Array.from(new Set(product.sizes.filter(Boolean))) : [],
            colors: product.colors ? Array.from(new Set(product.colors.filter(Boolean))) : []
        }
    } catch (error) {
        console.error('Error fetching product by slug:', error)
        return null
    }
}

// Helper functions for backward compatibility
export const getReadyMadeWears = (limit?: number) => getOutfitsByBrand(limit);