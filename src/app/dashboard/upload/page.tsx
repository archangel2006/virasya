
"use client";

import { useState, useEffect, Suspense } from 'react';
import { Camera, Sparkles, Check, Image as ImageIcon, Loader2, Save, Send, RefreshCw, Globe, ArrowRight, ArrowLeft, Megaphone } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { artisanAITypeDetection } from '@/ai/flows/artisan-ai-type-detection';
import { translateListing } from '@/ai/flows/translate-content-flow';
import { generateMarketingContent } from '@/ai/flows/artisan-ai-marketing-generator';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useUser } from '@/firebase';
import { collection, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRouter, useSearchParams } from 'next/navigation';

const CRAFT_CATEGORIES = [
  'Pottery', 
  'Textiles', 
  'Jewelry', 
  'Woodwork', 
  'Hand painting', 
  'Paper Mache', 
  'Metalwork', 
  'Leatherwork', 
  'Bamboo & Cane', 
  'Other'
];

type ProcessingStep = {
  id: number;
  label: string;
  status: 'pending' | 'loading' | 'complete';
};

function ProductUploadContent() {
  const [step, setStep] = useState(1); 
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isMarketingLoading, setIsMarketingLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: 1, label: 'Detecting Craft Category', status: 'pending' },
    { id: 2, label: 'Identifying Materials', status: 'pending' },
    { id: 3, label: 'Suggesting Product Title', status: 'pending' },
    { id: 4, label: 'Analyzing Craft Style', status: 'pending' },
    { id: 5, label: 'Generating Short Description', status: 'pending' },
    { id: 6, label: 'Creating Craft Story', status: 'pending' },
    { id: 7, label: 'Calculating Price Guidance', status: 'pending' },
  ]);

  const [details, setDetails] = useState({
    title: '',
    category: 'Pottery',
    materials: '',
    style: '',
    region: 'Rajasthan, India',
    description: '',
    story: '',
    price: 0,
    priceRange: { min: 0, max: 0, reasoning: '' },
    quantity: 1,
    marketing: null as any
  });

  // Load existing data if editing
  useEffect(() => {
    async function loadProduct() {
      if (!editId || !db) return;
      setIsLoadingDraft(true);
      try {
        const docRef = doc(db, 'products', editId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDetails({
            title: data.productName || '',
            category: data.craftType || 'Pottery',
            materials: data.materials || '',
            style: data.craftStyle || '',
            region: data.region || 'Rajasthan, India',
            description: data.description || '',
            story: data.story || '',
            price: data.price || 0,
            priceRange: data.priceRange || { min: 0, max: 0, reasoning: '' },
            quantity: data.availableQuantity || 1,
            marketing: data.marketing || null
          });
          if (data.images?.[0]) {
            setImage(data.images[0]);
          }
          setStep(3); // Go straight to edit step
        }
      } catch (error) {
        toast({ title: "Failed to load listing", variant: "destructive" });
      } finally {
        setIsLoadingDraft(false);
      }
    }
    loadProduct();
  }, [editId, db, toast]);

  const runSequentialProcessing = async (dataUri: string) => {
    setIsProcessing(true);
    setStep(2);
    
    try {
      const aiResult = await artisanAITypeDetection({ 
        productImageDataUri: dataUri,
        location: details.region
      });

      for (let i = 0; i < processingSteps.length; i++) {
        setProcessingSteps(prev => prev.map(s => s.id === i + 1 ? { ...s, status: 'loading' } : s));
        await new Promise(r => setTimeout(r, 600)); 
        setProcessingSteps(prev => prev.map(s => s.id === i + 1 ? { ...s, status: 'complete' } : s));
      }

      const midpoint = aiResult.pricing.suggestedMidpoint;
      setDetails({
        ...details,
        title: aiResult.suggestedTitle,
        category: aiResult.craftType as any,
        materials: aiResult.suggestedMaterials,
        style: aiResult.craftStyle,
        description: aiResult.description,
        story: aiResult.craftStory,
        price: midpoint,
        priceRange: {
          min: Math.round(midpoint * 0.9),
          max: Math.round(midpoint * 1.1),
          reasoning: aiResult.pricing.reasoning
        }
      });

      setTimeout(() => setStep(3), 400);
    } catch (error) {
      toast({ title: "AI Analysis failed", variant: "destructive", description: "Please try uploading a clearer photo." });
      setStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUri = reader.result as string;
        setImage(dataUri);
        runSequentialProcessing(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTranslate = async (lang: string) => {
    setIsTranslating(true);
    try {
      const result = await translateListing({
        title: details.title,
        description: details.description,
        story: details.story,
        targetLanguage: lang as any
      });
      setDetails({
        ...details,
        title: result.translatedTitle,
        description: result.translatedDescription,
        story: result.translatedStory
      });
      toast({ title: `Translated to ${lang}` });
    } catch (error) {
      toast({ title: "Translation failed", variant: "destructive" });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGenerateMarketing = async () => {
    setIsMarketingLoading(true);
    try {
      const result = await generateMarketingContent({
        productName: details.title,
        craftType: details.category,
        region: details.region,
        description: details.description
      });
      setDetails({ ...details, marketing: result });
      toast({ title: "Marketing posts generated!" });
    } catch (error) {
      toast({ title: "Generation failed", variant: "destructive" });
    } finally {
      setIsMarketingLoading(false);
    }
  };

  const handleSave = async (status: 'Draft' | 'Published') => {
    if (!user) {
      toast({ 
        title: "Authentication Required", 
        description: "Please log in to save your crafts.",
        variant: "destructive" 
      });
      router.push('/auth');
      return;
    }

    if (!db) return;
    setIsSaving(true);

    try {
      const productData: any = {
        artisanId: user.uid,
        artisanName: user.displayName || 'Authentic Artisan',
        productName: details.title,
        description: details.description,
        craftType: details.category,
        craftStyle: details.style,
        region: details.region,
        materials: details.materials,
        price: Number(details.price),
        availableQuantity: Number(details.quantity),
        images: image ? [image] : [],
        story: details.story,
        status: status,
        updatedAt: serverTimestamp(),
        marketing: details.marketing || null,
        priceRange: details.priceRange
      };

      if (editId) {
        const docRef = doc(db, 'products', editId);
        setDocumentNonBlocking(docRef, productData, { merge: true });
      } else {
        productData.createdAt = serverTimestamp();
        const productsRef = collection(db, 'products');
        addDocumentNonBlocking(productsRef, productData);
      }
      
      toast({ 
        title: status === 'Published' ? "Product Published!" : "Draft Saved!", 
        description: status === 'Published' ? "Your craft is now live on the marketplace." : "You can find your draft in the hub."
      });
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      setIsSaving(false);
      toast({ 
        title: "Save failed", 
        description: "An error occurred while saving. Please check your connection.",
        variant: "destructive" 
      });
    }
  };

  if (isLoadingDraft) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="font-headline text-lg">Retrieving your craft...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${step >= i ? 'bg-primary' : 'bg-secondary'}`} />
          ))}
        </div>
        <h1 className="text-4xl font-headline font-bold text-foreground">
          {step === 1 && "Step 1: Upload Craft Photo"}
          {step === 2 && "Virasya AI Analyzing..."}
          {step === 3 && (editId ? "Refine Your Listing" : "Step 2: Review & Edit Listing")}
          {step === 4 && "Step 3: Final Preview"}
        </h1>
      </div>

      {step === 1 && (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] shadow-sm border-2 border-dashed border-primary/20">
          <div className="bg-secondary/50 p-10 rounded-full mb-6">
            <Camera className="h-14 w-14 text-primary" />
          </div>
          <h2 className="text-2xl font-headline font-bold mb-2">Select a Product Photo</h2>
          <p className="text-muted-foreground mb-8 text-center max-w-md italic">"Our AI will detect the craft type, materials, and generate a factual heritage story automatically."</p>
          <label className="cursor-pointer">
            <Button size="lg" className="rounded-full px-14 h-14 shadow-lg text-lg" asChild>
              <span>Upload Image</span>
            </Button>
            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-md mx-auto space-y-4 py-12">
          {processingSteps.map(s => (
            <div key={s.id} className={`flex items-center justify-between p-5 rounded-2xl bg-white border transition-all duration-300 ${s.status === 'complete' ? 'border-primary/20 opacity-100 shadow-sm' : s.status === 'loading' ? 'border-primary/50 opacity-100 ring-2 ring-primary/10' : 'opacity-40'}`}>
              <span className="font-bold text-sm tracking-tight">{s.label}</span>
              {s.status === 'loading' && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
              {s.status === 'complete' && <Check className="h-5 w-5 text-primary" />}
              {s.status === 'pending' && <div className="h-5 w-5 rounded-full border-2 border-dashed border-muted" />}
            </div>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden border-none shadow-sm rounded-3xl bg-white aspect-[3/4] relative">
              {image && <img src={image} alt="Uploaded Craft" className="w-full h-full object-cover" />}
              <label className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-secondary transition-colors">
                <RefreshCw className="h-5 w-5 text-primary" />
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            </Card>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
              <h3 className="font-headline font-bold text-primary mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> AI Pricing Guidance
              </h3>
              <p className="text-2xl font-headline font-bold text-primary mb-2 flex items-baseline">
                  <span className="text-lg mr-1 font-sans">₹</span>
                  {details.priceRange.min} - {details.priceRange.max}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed italic">"{details.priceRange.reasoning}"</p>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full rounded-full h-12 gap-2 border-2 hover:bg-primary/5" 
              onClick={handleGenerateMarketing}
              disabled={isMarketingLoading}
            >
              {isMarketingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Megaphone className="h-4 w-4" />}
              Generate Marketing Content
            </Button>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm rounded-[40px] bg-white p-8">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-headline font-bold">Listing Details</h2>
                <div className="flex gap-2">
                  {['Hindi', 'Tamil', 'Bengali', 'Marathi'].map(l => (
                    <Button key={l} variant="ghost" size="sm" className="h-8 rounded-full text-[10px] bg-secondary/30" onClick={() => handleTranslate(l)} disabled={isTranslating}>
                      {isTranslating ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Globe className="h-3 w-3 mr-1" />}
                      {l}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Product Title</Label>
                    <Input value={details.title} onChange={e => setDetails({...details, title: e.target.value})} className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={details.category} onValueChange={v => setDetails({...details, category: v})}>
                      <SelectTrigger className="rounded-xl h-12"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CRAFT_CATEGORIES.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Materials Used</Label>
                    <Input value={details.materials} onChange={e => setDetails({...details, materials: e.target.value})} className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label>Craft Style</Label>
                    <Input value={details.style} onChange={e => setDetails({...details, style: e.target.value})} className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label>Selling Price (INR)</Label>
                    <Input type="number" value={details.price} onChange={e => setDetails({...details, price: Number(e.target.value)})} className="rounded-xl h-12 font-bold text-primary font-sans" />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock Quantity</Label>
                    <Input type="number" value={details.quantity} onChange={e => setDetails({...details, quantity: Number(e.target.value)})} className="rounded-xl h-12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Short Description</Label>
                  <Textarea value={details.description} onChange={e => setDetails({...details, description: e.target.value})} className="rounded-xl min-h-[100px] leading-relaxed" />
                </div>

                <div className="space-y-2">
                  <Label>Authentic Craft Story</Label>
                  <Textarea value={details.story} onChange={e => setDetails({...details, story: e.target.value})} className="rounded-xl min-h-[120px] italic text-muted-foreground bg-secondary/10 border-none" />
                  <p className="text-[10px] text-primary/60 italic">*Generated based on verified cultural context. Max 4 sentences.</p>
                </div>
              </div>

              <div className="flex gap-4 pt-12">
                <Button variant="outline" className="flex-1 rounded-full h-14 border-2" onClick={() => setStep(1)}>
                  Discard
                </Button>
                <Button className="flex-1 rounded-full h-14 shadow-lg text-lg gap-2" onClick={() => setStep(4)}>
                  Preview Listing <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="max-w-4xl mx-auto space-y-8 pb-24 animate-in zoom-in-95">
          <div className="bg-white rounded-[50px] overflow-hidden shadow-xl border-none">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-square">
                {image && <img src={image} alt="Product Preview" className="w-full h-full object-cover" />}
              </div>
              <div className="p-10 space-y-6">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold">{details.category}</Badge>
                  <Badge variant="outline" className="border-primary/20">{details.style}</Badge>
                </div>
                <h2 className="text-4xl font-headline font-bold leading-tight">{details.title}</h2>
                <p className="text-3xl font-bold text-primary font-sans flex items-baseline">
                  <span className="text-xl mr-1">₹</span>{details.price}
                </p>
                <p className="text-muted-foreground leading-relaxed font-body">{details.description}</p>
                <div className="pt-6 border-t border-primary/10">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Heritage Story</p>
                  <p className="italic text-sm leading-relaxed text-muted-foreground font-headline">"{details.story}"</p>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <p className="text-xs font-medium text-muted-foreground">{details.quantity} units available in {details.region}</p>
                </div>
              </div>
            </div>
          </div>

          {details.marketing && (
            <Card className="border-none shadow-sm rounded-[40px] bg-secondary/20 p-8 border-2 border-primary/5">
              <h3 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-primary" /> Promotional Content
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-xs font-bold uppercase tracking-widest text-primary">Instagram Post</Label>
                    <div className="bg-white/60 p-5 rounded-2xl italic text-sm leading-relaxed border border-white">
                      {details.marketing.instagram}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {details.marketing.hashtags.map((tag: string) => (
                          <span key={tag} className="text-primary font-bold">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-xs font-bold uppercase tracking-widest text-primary">WhatsApp Message</Label>
                    <p className="text-sm bg-white/60 p-5 rounded-2xl leading-relaxed border border-white">{details.marketing.whatsapp}</p>
                    <div className="bg-primary/10 p-4 rounded-xl">
                      <p className="text-[10px] font-bold uppercase text-primary mb-1">Catchy Promo Line</p>
                      <p className="text-sm font-bold">"{details.marketing.promoLine}"</p>
                    </div>
                  </div>
              </div>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button variant="outline" className="flex-1 rounded-full h-16 border-2 gap-2 text-lg" onClick={() => setStep(3)}>
              <ArrowLeft className="h-5 w-5" /> Back to Edit
            </Button>
            <Button 
              variant="secondary"
              className="flex-1 rounded-full h-16 border-2 gap-2 text-lg bg-white" 
              onClick={() => handleSave('Draft')}
              disabled={isSaving}
            >
              <Save className="h-5 w-5" /> Save as Draft
            </Button>
            <Button 
              className="flex-[2] rounded-full h-16 shadow-2xl text-xl gap-2" 
              onClick={() => handleSave('Published')}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
              {isSaving ? "Publishing..." : "Publish to Marketplace"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default function ProductUploadPage() {
  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow max-w-5xl">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        }>
          <ProductUploadContent />
        </Suspense>
      </main>
    </div>
  );
}
