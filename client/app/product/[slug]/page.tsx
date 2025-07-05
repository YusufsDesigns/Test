// app/product/[slug]/page.tsx - Server Component
import ProductPageClient from '@/components/product-detail/ProductPageClient';
import { SanityProduct, getProductBySlug, client } from '@/lib/sanity';

// Force dynamic rendering to avoid caching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Metadata generation function (works in server components)
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const product = await getProductBySlug(params.slug);
    
    if (!product) {
      return {
        title: 'Product Not Found | Aleebansparks',
        description: 'The product you are looking for could not be found.',
      };
    }

    const effectivePrice = product.discountPrice || product.price;
    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    
    // Create rich description
    const description = product.description 
      ? `${product.name} - ₦${effectivePrice.toLocaleString()}. ${
          Array.isArray(product.description) 
            ? product.description.find(block => block._type === 'block')?.children?.[0]?.text || ''
            : product.description
        }`.slice(0, 160)
      : `${product.name} available for ₦${effectivePrice.toLocaleString()} at Aleebansparks. ${
          hasDiscount ? `Save ₦${(product.price - effectivePrice).toLocaleString()}!` : ''
        } Shop premium quality products with fast delivery.`;

    // Get high-quality image URL
    const imageUrl = product.mainImage?.asset?.url 
      ? `${product.mainImage.asset.url}?w=1200&h=630&fit=crop&crop=center`
      : '/images/aleebansparks-default-product.jpg';

    const productUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://aleebansparks.com'}/product/${params.slug}`;
    
    return {
      title: `${product.name} | Aleebansparks`,
      description,
      keywords: [
        product.name,
        product.category,
        product.subcategory,
        'Aleebansparks',
        'Nigerian fashion',
        'online shopping',
        'premium quality',
        ...(product.colors || []),
        ...(product.sizes || [])
      ].filter(Boolean).join(', '),
      
      // Open Graph metadata for social sharing
      openGraph: {
        title: `${product.name} | Aleebansparks`,
        description,
        url: productUrl,
        siteName: 'Aleebansparks',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.mainImage?.alt || product.name,
          },
          ...(product.gallery?.slice(0, 3).map(img => ({
            url: `${img.asset?.url}?w=1200&h=630&fit=crop&crop=center`,
            width: 1200,
            height: 630,
            alt: img.alt || product.name,
          })) || [])
        ],
        locale: 'en_NG',
        type: 'website',
      },
      
      // Twitter Card metadata
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | Aleebansparks`,
        description,
        images: [imageUrl],
        creator: '@aleebansparks',
        site: '@aleebansparks',
      },
      
      // Additional structured data
      other: {
        'product:price:amount': effectivePrice.toString(),
        'product:price:currency': 'NGN',
        'product:availability': product.inStock ? 'in stock' : 'out of stock',
        'product:condition': 'new',
        'product:brand': 'Aleebansparks',
        'product:category': product.category,
        ...(product.subcategory && { 'product:type': product.subcategory }),
        ...(hasDiscount && { 
          'product:sale_price': effectivePrice.toString(),
          'product:regular_price': product.price.toString()
        }),
      },

      // Canonical URL
      alternates: {
        canonical: productUrl,
      },

      // Robots
      robots: {
        index: product.inStock,
        follow: true,
        googleBot: {
          index: product.inStock,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product | Aleebansparks',
      description: 'Discover premium quality products at Aleebansparks.',
    };
  }
}

// Get related products with complete inventory data
const getRelatedProducts = async (category: string, currentProductId: string): Promise<SanityProduct[]> => {
  const query = `
    *[_type == "product" && category == $category && _id != $currentProductId] | order(_createdAt desc) [0...4] {
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
  `;
  
  try {
    const products = await client.fetch(query, { category, currentProductId });
    // Process the arrays to remove duplicates and nulls
    return products.map((product: SanityProduct) => ({
      ...product,
      sizes: product.sizes ? Array.from(new Set(product.sizes.filter(Boolean))) : [],
      colors: product.colors ? Array.from(new Set(product.colors.filter(Boolean))) : []
    }));
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
};

// Server Component - handles data fetching and metadata
export default async function ProductPage({ params }: { params: { slug: string } }) {
  console.log('Fetching product for slug:', params.slug);
  
  const product = await getProductBySlug(params.slug);
  console.log('Fetched product:', product ? `${product.name} (${product._id})` : 'Product not found');
  
  let relatedProducts: SanityProduct[] = [];

  if (product?.category) {
    console.log('Fetching related products for category:', product.category);
    relatedProducts = await getRelatedProducts(product.category, product._id);
    console.log('Fetched related products:', relatedProducts.length);
  }

  // Pass data to client component
  return (
    <ProductPageClient 
      initialProduct={product}
      initialRelatedProducts={relatedProducts}
      slug={params.slug}
    />
  );
}