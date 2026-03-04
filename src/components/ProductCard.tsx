'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  href?: string;
  badge?: string;
  className?: string;
}

export function ProductCard({
  id,
  title,
  price,
  originalPrice,
  image,
  href,
  badge,
  className = '',
}: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);

  const formattedOriginalPrice = originalPrice
    ? new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
      }).format(originalPrice)
    : null;

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const CardContent = () => (
    <div className={`group ${className}`}>
      {/* Image Container - 4:5 Ratio */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#EAE6DF]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Badge */}
        {badge && (
          <span className="absolute top-3 left-3 bg-[#0F2E4F] text-white text-xs font-medium px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
        
        {/* Discount Badge */}
        {discount && !badge && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-4">
        <h3 className="text-[#111111] font-medium text-base line-clamp-2 group-hover:text-[#0F2E4F] transition-colors">
          {title}
        </h3>
        
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[#111111] font-semibold text-lg">
            {formattedPrice}
          </span>
          
          {formattedOriginalPrice && (
            <span className="text-[#A9A39A] line-through text-sm">
              {formattedOriginalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}

export default ProductCard;
