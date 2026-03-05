
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.productId}`}>
      <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-white">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={product.images[0] || "https://picsum.photos/seed/default/600/800"}
            alt={product.productName}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            data-ai-hint="artisan craft"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge className="bg-white/90 text-primary hover:bg-white/100 backdrop-blur-sm border-none shadow-sm">
              {product.craftType}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="font-headline text-lg font-semibold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
              {product.productName}
            </h3>
            <span className="font-bold text-primary">₹{product.price}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
            <MapPin className="h-3 w-3" />
            {product.region}
          </div>
          <div className="flex items-center gap-1 text-accent font-medium text-sm group/btn">
            View Story
            <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
