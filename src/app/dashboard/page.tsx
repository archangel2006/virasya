"use client";

import Link from 'next/link';
import { 
  Plus, Package, Trash2, Share2, Loader2, 
  TrendingUp, Eye, Globe, PackageCheck
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';
import { useState } from 'react';
import { generateMarketingContent } from '@/ai/flows/artisan-ai-marketing-generator';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, deleteDoc, doc } from 'firebase/firestore';

export default function ArtisanDashboard() {
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();
  const [isMarketingLoading, setIsMarketingLoading] = useState(false);
  const [marketingResult, setMarketingResult] = useState<any>(null);

  const productsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'products'), where('artisanId', '==', user.uid));
  }, [db, user]);

  const { data: listings, isLoading: isListingsLoading } = useCollection(productsQuery);

  const stats = [
    { 
      label: 'Total Sales', 
      value: '45,800', 
      isCurrency: true, 
      trend: '+12.5%', 
      icon: <TrendingUp className="h-5 w-5" /> 
    },
    { 
      label: 'Live Products', 
      value: listings?.filter(l => l.status === 'Published').length || '12', 
      trend: null, 
      icon: <PackageCheck className="h-5 w-5" /> 
    },
    { 
      label: 'Profile Views', 
      value: '1,240', 
      trend: '+5.2%', 
      icon: <Eye className="h-5 w-5" /> 
    },
    { 
      label: 'Marketplace Reach', 
      value: 'Global', 
      trend: null, 
      icon: <Globe className="h-5 w-5" /> 
    },
  ];

  const handleMarketingGen = async (product: any) => {
    setIsMarketingLoading(true);
    try {
      const result = await generateMarketingContent({
        productName: product.productName,
        craftType: product.craftType,
        region: product.region,
        description: product.description,
      });
      setMarketingResult(result);
    } catch (error) {
      toast({ title: "Marketing Generator failed", variant: "destructive" });
    } finally {
      setIsMarketingLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
      toast({ title: "Listing deleted" });
    } catch (error) {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-headline font-bold">Artisan Hub</h1>
            <p className="text-muted-foreground">
              Welcome back, <span className="text-primary font-bold">{user?.displayName || 'Artisan'}</span>. Here's your shop performance.
            </p>
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
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-primary/5 p-2.5 rounded-2xl text-primary">
                    {stat.icon}
                  </div>
                  {stat.trend && (
                    <Badge variant="secondary" className="bg-green-50 text-green-600 hover:bg-green-50 border-none px-2 py-0.5 text-[10px] font-bold">
                      {stat.trend}
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm font-headline text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-sans font-bold text-foreground flex items-baseline">
                    {stat.isCurrency && (
                      <span className="font-sans text-xl mr-1 text-primary">₹</span>
                    )}
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-headline font-bold text-primary">Your Listings</h2>
              <Badge variant="outline" className="border-primary/20 rounded-full">{listings?.length || 0} Products</Badge>
            </div>
            
            <div className="bg-white rounded-[32px] shadow-sm overflow-hidden min-h-[200px]">
              {isListingsLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : listings && listings.length > 0 ? (
                <div className="divide-y">
                  {listings.map(item => (
                    <div key={item.id} className="p-5 flex items-center justify-between hover:bg-secondary/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-secondary">
                          {item.images?.[0] && <Image src={item.images[0]} alt={item.productName} fill className="object-cover" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg font-headline">{item.productName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="text-[10px] px-2 py-0 rounded-full">{item.status}</Badge>
                            <span className="text-xs text-muted-foreground font-medium">
                              <span className="font-sans">₹</span>{item.price} • {item.availableQuantity} in stock
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5" onClick={() => handleMarketingGen(item)}>
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl rounded-[40px] border-none shadow-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-headline text-primary">Social Media Generator</DialogTitle>
                              <DialogDescription>AI-crafted posts for {item.productName}.</DialogDescription>
                            </DialogHeader>
                            {isMarketingLoading ? (
                              <div className="flex flex-col items-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                                <p className="font-bold text-primary">Crafting content...</p>
                              </div>
                            ) : marketingResult && (
                              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                                <div className="bg-secondary/20 p-6 rounded-3xl border border-primary/10">
                                  <h4 className="font-bold mb-3 text-primary flex items-center gap-2 uppercase tracking-widest text-xs">Instagram</h4>
                                  <p className="text-sm italic mb-4 leading-relaxed">{marketingResult.instagram}</p>
                                  <div className="flex flex-wrap gap-2">
                                    {marketingResult.hashtags.map((tag: string) => (
                                      <Badge key={tag} variant="secondary" className="rounded-full bg-white/50">{tag}</Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="bg-secondary/20 p-6 rounded-3xl border border-primary/10">
                                  <h4 className="font-bold mb-2 text-primary uppercase tracking-widest text-xs">WhatsApp</h4>
                                  <p className="text-sm leading-relaxed">{marketingResult.whatsapp}</p>
                                </div>
                                <div className="bg-primary/5 p-4 rounded-2xl">
                                  <p className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">Promo Line</p>
                                  <p className="text-sm font-medium">"{marketingResult.promoLine}"</p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                  <div className="bg-secondary/30 p-8 rounded-full mb-6">
                    <Package className="h-12 w-12 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-xl font-headline font-bold mb-2">No Crafts Yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-xs">Your digital gallery is empty. Start by adding your first handcrafted masterpiece.</p>
                  <Link href="/dashboard/upload">
                    <Button className="rounded-full px-8">Create Your First Listing</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-headline font-bold text-primary">Seller Tools</h2>
            <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white p-8">
              <h3 className="font-bold font-headline text-lg mb-4 text-foreground">AI Power-ups</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-bold text-foreground block mb-0.5">Smart Pricing</span>
                    Get competitive range guidance based on Indian handicraft market data.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-bold text-foreground block mb-0.5">Global Reach</span>
                    Instantly translate your listings to reach buyers in multiple regional languages.
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-full mt-8 h-12 border-primary/20 hover:bg-primary/5 text-primary">View Seller Guide</Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}