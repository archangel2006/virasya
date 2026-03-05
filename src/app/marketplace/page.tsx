
"use client";

import { useState } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
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
    productName: 'Traditional Kundan Earrings',
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

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.craftType === selectedCategory;
    const matchesSearch = p.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <header className="mb-8">
          <h1 className="text-4xl font-headline font-bold mb-2">Explore Heritage</h1>
          <p className="text-muted-foreground">Discovery authentic handcrafted art from every corner of the country.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 space-y-8">
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4" /> Categories
              </h3>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat ? 'bg-primary text-white' : 'hover:bg-secondary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t">
              <h3 className="font-bold mb-4">Region</h3>
              <div className="flex flex-wrap gap-2">
                {['Rajasthan', 'Gujarat', 'UP', 'Bihar', 'Madhya Pradesh'].map(region => (
                  <Badge key={region} variant="outline" className="cursor-pointer hover:bg-secondary">
                    {region}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t">
              <h3 className="font-bold mb-4">Price Range</h3>
              <div className="space-y-2">
                {['Under ₹1000', '₹1000 - ₹3000', '₹3000+'].map(range => (
                  <label key={range} className="flex items-center gap-2 text-sm cursor-pointer group">
                    <input type="checkbox" className="rounded-sm border-primary" />
                    <span className="group-hover:text-primary transition-colors">{range}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex-1">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by craft, region, or keyword..." 
                  className="pl-10 h-11 rounded-xl shadow-sm border-none bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="lg:hidden gap-2 h-11 rounded-xl bg-white border-none shadow-sm">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
                <Button variant="ghost" className="gap-2 h-11 text-sm bg-white shadow-sm border-none rounded-xl">
                  Newest <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(p => (
                  <ProductCard key={p.productId} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                <p className="text-muted-foreground">No products found matching your filters.</p>
                <Button variant="link" onClick={() => {setSelectedCategory('All'); setSearchQuery('');}} className="mt-2 text-primary">
                  Clear all filters
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
