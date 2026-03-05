
"use client";

import Link from 'next/link';
import { 
  Plus, Package, BarChart3, Megaphone, Trash2, 
  Coins, LayoutDashboard, Share2, Loader2, ArrowRight 
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';
import { useState } from 'react';
import { generateMarketingContent } from '@/ai/flows/artisan-ai-marketing-generator';
import { useToast } from '@/hooks/use-toast';

const MOCK_LISTINGS = [
  {
    id: '1',
    name: 'Blue Pottery Vase',
    status: 'Active',
    price: 1500,
    sales: 12,
    image: 'https://picsum.photos/seed/potv/100/100',
    craftType: 'Pottery',
    region: 'Khurja',
    description: 'A masterpiece of traditional pottery from Khurja.'
  },
  {
    id: '2',
    name: 'Silk Embroidered Saree',
    status: 'Draft',
    price: 8500,
    sales: 0,
    image: 'https://picsum.photos/seed/saree/100/100',
    craftType: 'Textiles',
    region: 'Kutch',
    description: 'Beautiful handwoven silk saree with intricate embroidery.'
  }
];

export default function ArtisanDashboard() {
  const { toast } = useToast();
  const [isMarketingLoading, setIsMarketingLoading] = useState(false);
  const [marketingResult, setMarketingResult] = useState<any>(null);

  const handleMarketingGen = async (product: typeof MOCK_LISTINGS[0]) => {
    setIsMarketingLoading(true);
    try {
      const result = await generateMarketingContent({
        productName: product.name,
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
            { label: 'Total Sales', value: '₹42,500', icon: <BarChart3 className="h-5 w-5 text-primary" /> },
            { label: 'Live Products', value: '14', icon: <Package className="h-5 w-5 text-primary" /> },
            { label: 'AI Listing Points', value: '120', icon: <LayoutDashboard className="h-5 w-5 text-primary" /> },
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary" onClick={() => handleMarketingGen(item)}>
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl rounded-[40px] border-none">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-headline text-primary">Marketing Post Generator</DialogTitle>
                            <DialogDescription>Get AI-crafted promotional content for {item.name}.</DialogDescription>
                          </DialogHeader>
                          {isMarketingLoading ? (
                            <div className="flex flex-col items-center py-12">
                              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                              <p className="font-bold text-primary">Crafting promotional content...</p>
                            </div>
                          ) : marketingResult && (
                            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                              <div className="bg-secondary/20 p-6 rounded-3xl border border-primary/10">
                                <h4 className="font-bold mb-3 text-primary flex items-center gap-2 uppercase tracking-widest text-xs">Instagram Caption</h4>
                                <p className="text-sm italic mb-4 leading-relaxed">{marketingResult.instagram}</p>
                                <div className="flex flex-wrap gap-2">
                                  {marketingResult.hashtags.map((tag: string) => (
                                    <Badge key={tag} variant="secondary" className="rounded-full bg-white/50">{tag}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-secondary/20 p-6 rounded-3xl border border-primary/10">
                                <h4 className="font-bold mb-2 text-primary uppercase tracking-widest text-xs">WhatsApp Message</h4>
                                <p className="text-sm leading-relaxed">{marketingResult.whatsapp}</p>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-headline font-bold">Quick Actions</h2>
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white p-6">
              <h3 className="font-bold mb-4">Artisan Tips</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">High-quality photos from multiple angles increase sales by up to 40%.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">Adding a verified craft story builds trust with global buyers.</p>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-full mt-6">View Seller Guide</Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
