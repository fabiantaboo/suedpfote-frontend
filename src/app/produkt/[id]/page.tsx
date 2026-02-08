'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';
import { useCart } from '@/context/CartContext';
import Navigation from '@/components/Navigation';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';

const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID || '';

const bgColors = [
  'bg-zinc-50',
  'bg-amber-50/50',
  'bg-emerald-50/50',
  'bg-sky-50/50',
  'bg-rose-50/50',
  'bg-violet-50/50',
];

type Product = {
  id: string;
  title: string;
  description: string;
  subtitle: string | null;
  handle: string;
  thumbnail: string | null;
  variants: {
    id: string;
    calculated_price?: {
      calculated_amount: number;
      currency_code: string;
    };
  }[];
};

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const identifier = params.id as string;
        let url: string;
        
        // Use the API proxy to avoid CORS issues
        if (identifier.startsWith('prod_')) {
          url = `/api/medusa/products/${identifier}?region_id=${REGION_ID}`;
        } else {
          url = `/api/medusa/products?handle=${identifier}&region_id=${REGION_ID}`;
        }

        const res = await fetch(url);
        
        if (res.ok) {
          const data = await res.json();
          // Handle both single product and list response
          const productData = data.product || data.products?.[0];
          setProduct(productData);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  // SEO: Dynamic Meta Tags
  useEffect(() => {
    if (product) {
      // Title
      document.title = `${product.title} | Südpfote - Linkshänder Shop`;
      
      // Meta Description
      const metaDesc = document.querySelector('meta[name="description"]');
      const descContent = product.subtitle || product.description?.substring(0, 160) || '';
      if (metaDesc) {
        metaDesc.setAttribute('content', descContent);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = descContent;
        document.head.appendChild(meta);
      }

      // Open Graph Tags
      const ogTags = [
        { property: 'og:title', content: product.title },
        { property: 'og:description', content: descContent },
        { property: 'og:type', content: 'product' },
        { property: 'og:image', content: product.thumbnail || '' },
        { property: 'og:url', content: window.location.href },
        { property: 'product:price:amount', content: String(product.variants?.[0]?.calculated_price?.calculated_amount || 0) },
        { property: 'product:price:currency', content: 'EUR' },
      ];

      ogTags.forEach(({ property, content }) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (tag) {
          tag.setAttribute('content', content);
        } else {
          const meta = document.createElement('meta');
          meta.setAttribute('property', property);
          meta.content = content;
          document.head.appendChild(meta);
        }
      });
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-zinc-200 border-t-zinc-900 mb-4"></div>
          <p className="text-zinc-500">Lade Produkt...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-4">Produkt nicht gefunden</h1>
          <Link href="/" className="text-zinc-600 hover:text-zinc-900 underline">
            Zurück zum Shop
          </Link>
        </div>
      </div>
    );
  }

  const price = product.variants?.[0]?.calculated_price?.calculated_amount || 0;
  const colorIndex = product.id.charCodeAt(product.id.length - 1) % bgColors.length;

  const handleAddToCart = () => {
    if (!product) return;
    
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setShowCart(true);
    }, 400);
    
    addToCart(
      product.variants?.[0]?.id || product.id,
      product.title,
      price,
      quantity,
      product.thumbnail
    );
  };

  // Schema.org JSON-LD for SEO
  const schemaData = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.subtitle || product.description?.substring(0, 500),
    "image": product.thumbnail ? `https://suedpfote.de${product.thumbnail}` : undefined,
    "brand": {
      "@type": "Brand",
      "name": "Südpfote"
    },
    "offers": {
      "@type": "Offer",
      "url": typeof window !== 'undefined' ? window.location.href : '',
      "priceCurrency": "EUR",
      "price": product.variants?.[0]?.calculated_price?.calculated_amount || 0,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Südpfote"
      }
    },
    "category": "Linkshänder-Produkte",
    "audience": {
      "@type": "PeopleAudience",
      "suggestedGender": "unisex",
      "audienceType": "Linkshänder"
    }
  } : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Schema.org JSON-LD */}
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}

      {/* Navigation */}
      <Navigation onCartClick={() => setShowCart(true)} />
      
      {/* Cart Drawer */}
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />

      {/* Product */}
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Image */}
            <div className={`aspect-square rounded-3xl ${bgColors[colorIndex]} flex items-center justify-center p-12`}>
              {product.thumbnail ? (
                <img 
                  src={product.thumbnail}
                  alt={`${product.title} - Linkshänder Produkt von Südpfote`}
                  title={product.title}
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-8xl">🤚</div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-2">
                Linkshänder
              </p>
              <h1 className="text-4xl font-bold text-zinc-900 mb-4">
                {product.title}
              </h1>
              <p className="text-xl text-zinc-600 leading-relaxed mb-8">
                {product.subtitle || product.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1.5 bg-zinc-100 text-zinc-700 text-sm rounded-full">
                  Für Linkshänder
                </span>
                <span className="px-3 py-1.5 bg-zinc-100 text-zinc-700 text-sm rounded-full">
                  Premium Qualität
                </span>
                <span className="px-3 py-1.5 bg-zinc-100 text-zinc-700 text-sm rounded-full">
                  Schneller Versand
                </span>
              </div>

              {/* Price & Add to Cart */}
              <div className="flex items-center gap-6 mb-8">
                <span className="text-3xl font-bold text-zinc-900">
                  €{price.toFixed(2)}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 cursor-pointer transition text-lg"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 cursor-pointer transition text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-full font-medium text-lg cursor-pointer transition-all duration-300 ${
                  added 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-zinc-900 text-white hover:bg-zinc-700'
                }`}
              >
                {added ? '✓ Hinzugefügt!' : `In den Warenkorb · €${(price * quantity).toFixed(2)}`}
              </button>

              {/* Info */}
              <div className="mt-12 pt-8 border-t border-zinc-100">
                <h3 className="font-semibold text-zinc-900 mb-4">Warum Südpfote?</h3>
                <ul className="space-y-3 text-zinc-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">✓</span>
                    <span>Speziell für Linkshänder entwickelt</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">✓</span>
                    <span>Kostenloser Versand ab 50 €</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">✓</span>
                    <span>30 Tage Rückgaberecht</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ausführliche Produktbeschreibung */}
          {product.description && (product.description.includes('---') || product.description.includes('—')) && (
            <div className="mt-20 pt-12 border-t border-zinc-200">
              <h2 className="text-2xl font-bold text-zinc-900 mb-8">Produktdetails</h2>
              <div className="prose prose-zinc max-w-none">
                {product.description.split('\n\n').map((section, index) => {
                  if ((section.startsWith('---') && section.endsWith('---')) || (section.startsWith('—') && section.endsWith('—'))) {
                    // Section header
                    const title = section.replace(/---/g, '').replace(/—/g, '').trim();
                    return (
                      <h3 key={index} className="text-lg font-semibold text-zinc-900 mt-8 mb-4 flex items-center gap-2">
                        <span className="w-8 h-0.5 bg-zinc-900"></span>
                        {title}
                      </h3>
                    );
                  } else if (section.includes('\n-') || section.includes('\n•')) {
                    // List
                    const items = section.split('\n').filter(line => line.startsWith('-') || line.startsWith('•'));
                    return (
                      <ul key={index} className="space-y-2 mb-6">
                        {items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-zinc-600">
                            <span className="text-emerald-500 mt-1">✓</span>
                            <span>{item.replace(/^[-•]\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  } else if (section.startsWith("'") || section.includes('" -')) {
                    // Quote/Review
                    return (
                      <blockquote key={index} className="border-l-4 border-zinc-200 pl-4 italic text-zinc-600 my-4">
                        {section}
                      </blockquote>
                    );
                  } else {
                    // Regular paragraph
                    return (
                      <p key={index} className="text-zinc-600 leading-relaxed mb-4">
                        {section}
                      </p>
                    );
                  }
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
