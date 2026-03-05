
"use client";

import { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronDown, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types';

const MOCK_PRODUCTS: Product[] = [
  {
    productId: '1',
    artisanId: 'a1',
    artisanName: 'Rajesh K.',
    productName: 'Hand-carved Teak Box',
    description: 'Intricately carved wooden box for valuables.',
    craftType: 'Woodwork',
    region: 'Saharanpur, UP',
    materials: 'Teak Wood',
    price: 3200,
    currency: 'INR',
    images: ['https://picsum.photos/seed/wood1/600/800'],
    story: '...',
    tags: ['wood', 'carving'],
    createdAt: new Date()
  },
  {
    productId: '2',
    artisanId: 'a2',
    artisanName: 'Lata B.',
    productName: 'Kutch Embroidered Bag',
    description: 'Colorful hand-embroidered bag from Gujarat.',
    craftType: 'Textiles',
    region: 'Kutch, Gujarat',
    materials: 'Cotton, Mirrors',
    price: 1500,
    currency: 'INR',
    images: ['https://picsum.photos/seed/bag1/600/800'],
    story: '...',
    tags: ['kutch', 'embroidery'],
    createdAt: new Date()
  },
  {
    productId: '3',
    artisanId: 'a3',
    artisanName: 'Amit S.',
    productName: 'Kundan Earrings',
    description: 'Exquisite jewelry for special occasions.',
    craftType: 'Jewelry',
    region: 'Jaipur, Rajasthan',
    materials: 'Gold plated silver, Stones',
    price: 4500,
    currency: 'INR',
    images: ['https://picsum.photos/seed/jwel1/600/800'],
    story: '...',
    tags: ['kundan', 'jewelry'],
    createdAt: new Date()
  },
  {
    productId: '4',
    artisanId: 'a4',
    artisanName: 'Sita M.',
    productName: 'Dhokra Art Figurine',
    description: 'Ancient lost-wax casting metal art.',
    craftType: 'Other',
    region: 'Bastar, Chhattisgarh',
    materials: 'Brass',
    price: 1800,
    currency: 'INR',
    images: ['https://picsum.photos/seed/metal1/600/800'],
    story: '...',
    tags: ['dhokra', 'brass'],
    createdAt: new Date()
  }
];

const CATEGORIES = ['All', 'Pottery', 'Textiles', 'Jewelry', 'Woodwork', 'Hand painting'];

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.craftType === selectedCategory;
      const matchesSearch = p.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.region.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // AI Recommendations - Mocked for prototype
  const recommendedProducts = MOCK_PRODUCTS.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <header className="mb-12">
          <h1 className="text-5xl font-headline font-bold mb-4">Discover Heritage</h1>
          <p className="text-xl text-muted-foreground">Authentic handcrafted art curated for the modern soul.</p>
        </header>

        {/* AI Recommendations Section */}
        <section className="mb-16 bg-white/50 p-8 rounded-[40px] border-none shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-headline font-bold">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedProducts.map(p => (
              <ProductCard key={`rec-${p.productId}`} product={p} />
            ))}
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 space-y-10">
            <div>
              <h3 className="text-lg font-headline font-bold mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" /> Categories
              </h3>
              <div className="flex flex-col gap-1">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      selectedCategory === cat 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-muted-foreground hover:bg-secondary hover:text-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-primary/10">
              <h3 className="text-lg font-headline font-bold mb-4">Regions</h3>
              <div className="flex flex-wrap gap-2">
                {['Rajasthan', 'Gujarat', 'UP', 'Bihar', 'Assam'].map(region => (
                  <Badge key={region} variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors py-1.5 px-3 rounded-full border-primary/20">
                    {region}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-primary/10">
              <h3 className="text-lg font-headline font-bold mb-4">Price</h3>
              <div className="space-y-3">
                {['Under ₹1000', '₹1000 - ₹3000', '₹3000+'].map(range => (
                  <label key={range} className="flex items-center gap-3 text-sm cursor-pointer group">
                    <div className="h-5 w-5 rounded-md border-2 border-primary/20 flex items-center justify-center group-hover:border-primary transition-colors">
                      <div className="h-2 w-2 rounded-sm bg-primary opacity-0 group-has-[:checked]:opacity-100" />
                    </div>
                    <input type="checkbox" className="hidden" />
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">{range}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex-1">
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search by craft, region, or keyword..." 
                  className="pl-12 h-14 rounded-2xl shadow-sm border-none bg-white text-lg focus-visible:ring-1 focus-visible:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="lg:hidden gap-2 h-14 rounded-2xl bg-white border-none shadow-sm">
                <SlidersHorizontal className="h-5 w-5" />
                Filters
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 h-14 text-sm bg-white shadow-sm border-none rounded-2xl px-6">
                    {sortBy} <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-xl border-none shadow-xl">
                  {['Newest', 'Price: Low to High', 'Price: High to Low', 'Popularity'].map(sort => (
                    <DropdownMenuItem key={sort} onClick={() => setSortBy(sort)} className="cursor-pointer">
                      {sort}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map(p => (
                  <ProductCard key={p.productId} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white/50 rounded-[40px] shadow-sm">
                <p className="text-xl text-muted-foreground font-headline">No crafts found in this segment.</p>
                <Button variant="link" onClick={() => {setSelectedCategory('All'); setSearchQuery('');}} className="mt-2 text-primary text-lg">
                  View all collections
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
