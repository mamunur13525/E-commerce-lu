import { useEffect } from 'react';
import { useStore } from '../../context/StoreContext';

export function SEO() {
  const { currentPage, selectedProductId, products } = useStore();

  useEffect(() => {
    let title = 'Lumina Modern E-Commerce';
    let description = 'Minimalist, high-performance e-commerce platform featuring seasonal collections, interactive sticky categories, guest & profile checkout, reviews, order tracking, and full admin management.';
    let image = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80';
    let productSchema: any = null;

    if (currentPage === 'home') {
      title = 'Lumina — Modern Living, Knitwear & Artisanal Stoneware';
      description = 'Explore handcrafted organic knitwear, hand-thrown ceramics, and vegetable-tanned leather essentials with carbon-neutral delivery.';
    } else if (currentPage === 'shop') {
      title = 'Shop Full Collection — Lumina Modern Living';
      description = 'Browse curated essentials across apparel, home ceramics, and minimal leather goods. Filter by size, palette, and in-stock status.';
    } else if (currentPage === 'product-detail' && selectedProductId) {
      const product = products.find(p => p.id === selectedProductId);
      if (product) {
        title = `${product.name} — Lumina`;
        description = product.description;
        if (product.images && product.images[0]) {
          image = product.images[0];
        }

        // Generate schema.org/Product structured data
        productSchema = {
          '@context': 'https://schema.org/',
          '@type': 'Product',
          name: product.name,
          image: product.images,
          description: product.description,
          sku: product.sku,
          brand: {
            '@type': 'Brand',
            name: 'Lumina',
          },
          offers: {
            '@type': 'Offer',
            url: window.location.href,
            priceCurrency: 'USD',
            price: product.price,
            priceValidUntil: '2026-12-31',
            availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating || 5,
            reviewCount: product.reviewCount || 1,
          },
        };
      }
    } else if (currentPage === 'cart') {
      title = 'Your Shopping Bag — Lumina';
      description = 'Review your curated items, apply promotional codes, and view carbon-neutral shipping estimates.';
    } else if (currentPage === 'checkout') {
      title = 'Secure 256-Bit Checkout — Lumina';
      description = 'Complete your order securely with instant card authorization or mobile payment.';
    } else if (currentPage === 'orders') {
      title = 'Order History & Invoices — Lumina';
      description = 'View your recent purchases, track live shipments, and review digital receipts.';
    } else if (currentPage === 'track-order') {
      title = 'Live Real-Time Order Tracking — Lumina';
      description = 'Track your package journey from atelier inspection to your doorstep in real-time.';
    } else if (currentPage === 'wishlist') {
      title = 'Your Curated Wishlist — Lumina';
      description = 'Saved architectural pieces and limited edition favorites ready for your home.';
    } else if (currentPage === 'admin') {
      title = 'Atelier & Store Administration — Lumina';
      description = 'Manage product inventory, coupons, orders, and storefront configuration.';
    }

    // Update document title
    document.title = title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Update Open Graph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    let ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) ogImg.setAttribute('content', image);

    // Update Twitter Cards
    let twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', title);

    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', description);

    let twImg = document.querySelector('meta[name="twitter:image"]');
    if (twImg) twImg.setAttribute('content', image);

    // Dynamic Product JSON-LD injection
    const existingScript = document.getElementById('dynamic-product-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    if (productSchema) {
      const script = document.createElement('script');
      script.id = 'dynamic-product-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(productSchema);
      document.head.appendChild(script);
    }
  }, [currentPage, selectedProductId, products]);

  return null;
}
