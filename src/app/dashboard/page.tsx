
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { 
  Plus, Package, BarChart3, Settings, Sparkles, Megaphone, Trash2, Edit2, 
  Coins, LayoutDashboard, Share2, Loader2, ArrowRight 
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { artisanAiPriceAdvisor } from '@/ai/flows/artisan-ai-price-advisor';
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
    region: 'Khurja'
  },
  {
    id: '2',
    name: 'Silk Embroidered Saree',
    status: 'Draft',
    price: 8500,
    sales: 0,
    image: 'https://picsum.photos/seed/saree/100/100',
    craftType: 'Textiles',
    region: 'Kutch'
  }
];

export default function ArtisanDashboard() {
  const { toast } = useToast();
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const [pricingResult, setPricingResult] = useState<any>(null);
  
  const [isMarketingLoading, setIsMarketingLoading] = useState(false);
  const [marketingResult, setMarketingResult] = useState<any>(null);

  const handlePriceAdvisor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPricingLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await artisanAiPriceAdvisor({
        craftCategory: formData.get('category') as string,
        materialsUsed: formData.get('materials') as string,
        hoursOfWork: Number(formData.get('hours')),
        complexity: formData.get('complexity') as 'Low' | 'Medium' | 'High',
      });
      setPricingResult(result);
    } catch (error) {
      toast({ title: "Pricing Advisor failed", variant: "destructive" });
    } finally {
      setIsPricingLoading(false);
    }
  };

  const handleMarketingGen = async (product: typeof MOCK_LISTINGS[0]) => {
    setIsMarketingLoading(true);
    try {
      const result = await generateMarketingContent({
        productName: product.name,
        craftType: product.craftType,
        region: product.region,
        storySnippet: "Handmade with love using centuries-old traditions.",
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
            { label: 'AI Price Checks', value: '28', icon: <Coins className="h-5 w-5 text-primary" /> },
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary" onClick={() => handleMarketingGen(item)}>
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl rounded-[40px] border-none">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-headline">Social Promotion for {item.name}</DialogTitle>
                            <DialogDescription>AI-generated content to help you sell on social platforms.</DialogDescription>
                          </DialogHeader>
                          {isMarketingLoading ? (
                            <div className="flex flex-col items-center py-12">
                              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                              <p className="font-bold text-primary">Creating posts...</p>
                            </div>
                          ) : marketingResult && (
                            <div className="space-y-6">
                              <div className="bg-secondary/20 p-6 rounded-3xl">
                                <h4 className="font-bold mb-2 flex items-center gap-2">Instagram Caption</h4>
                                <p className="text-sm italic mb-4">{marketingResult.instagram.caption}</p>
                                <div className="flex flex-wrap gap-2">
                                  {marketingResult.instagram.hashtags.map((tag: string) => (
                                    <Badge key={tag} variant="secondary" className="rounded-full">{tag}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-secondary/20 p-6 rounded-3xl">
                                <h4 className="font-bold mb-2">WhatsApp Message</h4>
                                <p className="text-sm">{marketingResult.whatsapp.message}</p>
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

          {/* AI Tools & Actions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-headline font-bold">Artisan Toolkit</h2>
            
            {/* Price Advisor Tool */}
            <Dialog>
              <DialogTrigger asChild>
                <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-primary text-white cursor-pointer hover:bg-primary/95 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Coins className="h-5 w-5" /> 
                      AI Price Advisor
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/70">Get market-accurate pricing suggestions.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white/10 p-4 rounded-2xl flex items-center justify-between">
                      <span className="text-sm">Start an Audit</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="rounded-[40px] border-none max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline">Pricing Guidance</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePriceAdvisor} className="space-y-4">
                  <div>
                    <Label>Craft Category</Label>
                    <Select name="category" required>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select Type" /></SelectTrigger>
                      <SelectContent>
                        {['Pottery', 'Textiles', 'Jewelry', 'Woodwork', 'Other'].map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Materials Used</Label>
                    <Input name="materials" placeholder="e.g. Terracotta clay, natural dyes" className="rounded-xl" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Labor (Hours)</Label>
                      <Input name="hours" type="number" className="rounded-xl" required />
                    </div>
                    <div>
                      <Label>Complexity</Label>
                      <Select name="complexity" defaultValue="Medium">
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full rounded-full h-12 gap-2" disabled={isPricingLoading}>
                    {isPricingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Get Suggested Price
                  </Button>
                </form>

                {pricingResult && (
                  <div className="mt-6 p-6 bg-primary/5 rounded-3xl border border-primary/20">
                    <p className="text-xs font-bold text-primary uppercase mb-2">Recommended Range</p>
                    <p className="text-3xl font-headline font-bold text-primary mb-4">₹{pricingResult.recommendedMin} - ₹{pricingResult.recommendedMax}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">"{pricingResult.reasoning}"</p>
                  </div>
                )}
              </DialogContent>
            </Dialog>

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
