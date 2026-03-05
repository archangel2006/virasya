
"use client";

import { use } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ProductCard';
import { MapPin, Sparkles, ShieldCheck, Heart, ShoppingBag, Share2 } from 'lucide-react';

const MOCK_PRODUCT = {
  productId: '1',
  artisanId: 'a1',
  artisanName: 'Rajesh Kumar',
  productName: 'Terracotta Blue Glaze Bowl',
  description: 'This masterfully crafted terracotta bowl represents the pinnacle of Khurja ceramic art. Each piece is hand-turned and painted with traditional floral motifs using minerals found in the local soil.',
  craftType: 'Pottery',
  region: 'Khurja, Uttar Pradesh',
  materials: 'Local Clay, Natural Mineral Dyes, High-Fire Glaze',
  price: 1200,
  images: ['https://picsum.photos/seed/pot1/800/800', 'https://picsum.photos/seed/pot2/800/800'],
  story: 'In the heart of Khurja, my family has breathed life into clay for five generations. This particular technique, known as "Neel-Mridu", was revived by my grandfather. The blue isn\'t just a color; it\'s a reflection of the morning sky over the Yamuna river. Each bowl takes four days to prepare, from the initial kneading of the clay to the final cooling of the kiln.',
  tags: ['Pottery', 'Authentic', 'Home Decor']
};

const RECOMMENDATIONS = [
  {
    productId: 'r1',
    artisanId: 'a4',
    productName: 'Hand-painted Tea Set',
    craftType: 'Pottery',
    region: 'Jaipur, Rajasthan',
    price: 3500,
    images: ['https://picsum.photos/seed/tea1/600/800']
  },
  {
    productId: 'r2',
    artisanId: 'a5',
    productName: 'Clay Ganesha Idol',
    craftType: 'Pottery',
    region: 'Kolkata, WB',
    price: 850,
    images: ['https://picsum.photos/seed/god1/600/800']
  },
  {
    productId: 'r3',
    artisanId: 'a6',
    productName: 'Matka Water Bottle',
    craftType: 'Pottery',
    region: 'Bhiwandi, Maharashtra',
    price: 450,
    images: ['https://picsum.photos/seed/bottle1/600/800']
  }
] as any[];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 lg:py-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Images Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-xl bg-white border-4 border-white">
              <Image src={MOCK_PRODUCT.images[0]} alt={MOCK_PRODUCT.productName} fill className="object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {MOCK_PRODUCT.images.map((img, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-sm border-2 border-white">
                  <Image src={img} alt={`${MOCK_PRODUCT.productName} ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-primary/10 text-primary border-none">{MOCK_PRODUCT.craftType}</Badge>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <MapPin className="h-3 w-3" />
                  {MOCK_PRODUCT.region}
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-headline font-bold mb-4">{MOCK_PRODUCT.productName}</h1>
              <p className="text-3xl font-bold text-primary mb-6">₹{MOCK_PRODUCT.price}</p>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {MOCK_PRODUCT.description}
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t">
              <p className="font-bold flex items-center gap-2">
                <span className="text-muted-foreground">Materials:</span> {MOCK_PRODUCT.materials}
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full relative overflow-hidden">
                  <Image src="https://picsum.photos/seed/rajesh/100/100" alt="Artisan" fill className="object-cover" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Created By</p>
                  <p className="font-bold text-primary">{MOCK_PRODUCT.artisanName}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button size="lg" className="flex-1 rounded-full h-14 gap-2 text-lg shadow-lg">
                <ShoppingBag className="h-5 w-5" /> Buy Now
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 w-14 p-0 border-2">
                <Heart className="h-6 w-6" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 w-14 p-0 border-2">
                <Share2 className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Craft Story Section */}
        <section className="mb-20">
          <div className="bg-white rounded-[50px] p-8 lg:p-16 shadow-xl border-none relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles className="h-64 w-64 text-primary" />
             </div>
             
             <div className="relative z-10 max-w-3xl">
                <div className="flex items-center gap-2 mb-6">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <span className="text-sm font-bold text-primary uppercase tracking-widest">Verified Craft Story</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-headline font-bold mb-8 italic">"The Clay Remembers"</h2>
                <div className="prose prose-stone prose-lg">
                  <p className="text-xl leading-relaxed text-foreground/80 font-serif italic">
                    {MOCK_PRODUCT.story}
                  </p>
                </div>
                <div className="mt-12 flex flex-wrap gap-2">
                  {MOCK_PRODUCT.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-secondary/50 rounded-full px-4 py-1">#{tag}</Badge>
                  ))}
                </div>
             </div>
          </div>
        </section>

        {/* Recommendations */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-2xl lg:text-3xl font-headline font-bold">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {RECOMMENDATIONS.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-12">
         <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Virasya — Authentic Art. Digital Heart.</p>
         </div>
      </footer>
    </div>
  );
}
