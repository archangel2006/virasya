
"use client";

import Link from 'next/link';
import { 
  Plus, Package, BarChart3, Megaphone, Trash2, 
  Coins, LayoutDashboard, Share2, Loader2, ArrowRight 
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
            <p className="text-muted-foreground">Manage your crafts and reach global buyers with AI power.</p>
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
            { label: 'Total Listings', value: listings?.length || '0', icon: <Package className="h-5 w-5 text-primary" /> },
            { label: 'Active Status', value: 'Live', icon: <BarChart3 className="h-5 w-5 text-primary" /> },
            { label: 'AI Credits', value: 'Unlimited', icon: <LayoutDashboard className="h-5 w-5 text-primary" /> },
            { label: 'Platform Reach', value: 'Global', icon: <Megaphone className="h-5 w-5 text-primary" /> },
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
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-headline font-bold">Your Listings</h2>
              <Badge variant="outline" className="border-primary/20">{listings?.length || 0} Products</Badge>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden min-h-[200px]">
              {isListingsLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : listings && listings.length > 0 ? (
                <div className="divide-y">
                  {listings.map(item => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-secondary/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-secondary">
                          {item.images?.[0] && <Image src={item.images[0]} alt={item.productName} fill className="object-cover" />}
                        </div>
                        <div>
                          <h3 className="font-bold">{item.productName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="text-[10px] px-2 py-0">{item.status}</Badge>
                            <span className="text-xs text-muted-foreground">₹{item.price} • {item.availableQuantity} in stock</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary" onClick={() => handleMarketingGen(item)}>
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
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                  <Package className="h-12 w-12 text-muted mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't added any crafts yet.</p>
                  <Link href="/dashboard/upload">
                    <Button variant="outline" className="rounded-full">Start Your First Listing</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-headline font-bold">Seller Tools</h2>
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white p-6">
              <h3 className="font-bold mb-4">AI Capabilities</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">Vision Analysis: Upload photos and let AI detect materials and categories.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">Smart Pricing: Get competitive range guidance based on Indian handicraft data.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">Multi-Lang: Translate your listings to reach regional buyers across India.</p>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-full mt-6 h-12">Documentation</Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
