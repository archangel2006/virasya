
"use client";

import Link from 'next/link';
import { Plus, Package, BarChart3, Settings, Sparkles, Megaphone, Trash2, Edit2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const MOCK_LISTINGS = [
  {
    id: '1',
    name: 'Blue Pottery Vase',
    status: 'Active',
    price: 1500,
    sales: 12,
    image: 'https://picsum.photos/seed/potv/100/100'
  },
  {
    id: '2',
    name: 'Silk Embroidered Saree',
    status: 'Draft',
    price: 8500,
    sales: 0,
    image: 'https://picsum.photos/seed/saree/100/100'
  }
];

export default function ArtisanDashboard() {
  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-headline font-bold">Artisan Hub</h1>
            <p className="text-muted-foreground">Welcome back, Rajesh! Manage your crafts and reach more buyers.</p>
          </div>
          <Link href="/dashboard/upload">
            <Button className="rounded-full gap-2 px-6 h-12 shadow-lg">
              <Plus className="h-5 w-5" />
              Add New Craft
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Sales', value: '₹42,500', icon: <BarChart3 className="h-5 w-5 text-primary" /> },
            { label: 'Live Products', value: '14', icon: <Package className="h-5 w-5 text-primary" /> },
            { label: 'Active Drafts', value: '3', icon: <Edit2 className="h-5 w-5 text-primary" /> },
            { label: 'Profile Views', value: '1,284', icon: <Megaphone className="h-5 w-5 text-primary" /> },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="bg-secondary/50 p-3 rounded-2xl">{stat.icon}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Listings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-headline font-bold">Your Listings</h2>
              <Button variant="ghost" className="text-primary font-bold">See All</Button>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="divide-y">
                {MOCK_LISTINGS.map(item => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-secondary/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 rounded-xl overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={item.status === 'Active' ? 'default' : 'secondary'} className="text-[10px] px-2 py-0">
                            {item.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">₹{item.price} • {item.sales} sold</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Tools & Actions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-headline font-bold">Artisan Toolkit</h2>
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-primary text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5" /> 
                  Virasya AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-primary-foreground/80 leading-relaxed">
                  Enhance your photos, generate SEO descriptions, or get pricing advice with one click.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="secondary" className="w-full justify-start gap-2 bg-white/10 text-white hover:bg-white/20 border-none">
                    <Megaphone className="h-4 w-4" /> Generate Marketing Post
                  </Button>
                  <Button variant="secondary" className="w-full justify-start gap-2 bg-white/10 text-white hover:bg-white/20 border-none">
                    <BarChart3 className="h-4 w-4" /> Smart Price Audit
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Need help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with our craft preservation team for guidance on digital marketing.
                </p>
                <Button variant="outline" className="w-full rounded-full">Contact Support</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
