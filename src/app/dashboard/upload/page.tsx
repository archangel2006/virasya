
"use client";

import { useState } from 'react';
import { Camera, Sparkles, ArrowRight, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { artisanAITypeDetection } from '@/ai/flows/artisan-ai-type-detection';
import { generateArtisanListing } from '@/ai/flows/artisan-ai-listing-generator';
import { useToast } from '@/hooks/use-toast';

export default function ProductUploadPage() {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // AI Generated Data
  const [detectedType, setDetectedType] = useState<string>('');
  const [generatedListing, setGeneratedListing] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    story: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUri = reader.result as string;
        setImage(dataUri);
        
        setIsProcessing(true);
        try {
          const result = await artisanAITypeDetection({ productImageDataUri: dataUri });
          setDetectedType(result.craftType);
          setStep(2);
        } catch (error) {
          toast({ title: "Detection failed", description: "Try another photo.", variant: "destructive" });
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateListing = async () => {
    if (!image) return;
    setIsProcessing(true);
    try {
      const result = await generateArtisanListing({
        productImages: [image],
        productNameKeywords: "Handmade artisanal craft",
        craftType: detectedType,
        materials: "Natural and sustainable materials",
        region: "Local Craft Center",
        storyFacts: "Created using age-old traditional methods passed through generations."
      });
      setGeneratedListing({
        title: result.productTitle,
        description: result.description,
        tags: result.seoTags,
        story: result.craftStory
      });
      setStep(3);
    } catch (error) {
      toast({ title: "Generation failed", description: "Could not generate content.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow max-w-4xl">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${step >= i ? 'bg-primary' : 'bg-secondary'}`} />
            ))}
          </div>
          <h1 className="text-4xl font-headline font-bold">
            {step === 1 && "Start with a Photo"}
            {step === 2 && "Refine the Details"}
            {step === 3 && "Review Your Listing"}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Image Display */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden border-none shadow-sm rounded-3xl bg-white aspect-[3/4] flex items-center justify-center relative">
              {image ? (
                <div className="relative w-full h-full">
                  <img src={image} alt="Upload" className="w-full h-full object-cover" />
                  <label className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform">
                    <Camera className="h-6 w-6 text-primary" />
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="bg-secondary/50 p-6 rounded-full inline-block mb-4">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Clear photo from 3 angles works best.</p>
                  <label className="cursor-pointer">
                    <Button variant="secondary" asChild className="rounded-full px-6">
                      <span>Select Photo</span>
                    </Button>
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
              )}
              {isProcessing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                  <p className="font-bold text-primary animate-pulse">Virasya AI Analyzing...</p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: Form Steps */}
          <div className="md:col-span-2">
            <Card className="border-none shadow-sm rounded-3xl bg-white p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="bg-secondary/30 p-6 rounded-2xl">
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" /> Why start with a photo?
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Our AI will automatically detect the craft category and help generate professional 
                      titles and descriptions so you don't have to type everything.
                    </p>
                  </div>
                  <Button disabled size="lg" className="w-full rounded-full mt-4">
                    Continue to Details
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-primary/60 font-bold uppercase tracking-wider">AI Detected Category</p>
                      <p className="text-lg font-headline font-bold text-primary">{detectedType}</p>
                    </div>
                    <Check className="h-6 w-6 text-primary" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-bold block mb-1">Keywords</label>
                      <Input placeholder="e.g. Blue, Pottery, Floral, Khurja" className="rounded-xl h-12" />
                    </div>
                    <div>
                      <label className="text-sm font-bold block mb-1">Materials Used</label>
                      <Input placeholder="e.g. Clay, Natural Dyes" className="rounded-xl h-12" />
                    </div>
                  </div>

                  <Button 
                    onClick={handleGenerateListing} 
                    disabled={isProcessing}
                    size="lg" 
                    className="w-full rounded-full h-14 gap-2"
                  >
                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                    Generate AI Content
                  </Button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-bold block mb-1">Generated Title</label>
                    <Input value={generatedListing.title} onChange={(e) => setGeneratedListing({...generatedListing, title: e.target.value})} className="rounded-xl h-12" />
                  </div>
                  <div>
                    <label className="text-sm font-bold block mb-1">Description</label>
                    <Textarea value={generatedListing.description} rows={6} className="rounded-xl" />
                  </div>
                  <div>
                    <label className="text-sm font-bold block mb-1">Cultural Craft Story (Verified)</label>
                    <div className="p-4 bg-secondary/20 rounded-xl text-sm italic leading-relaxed text-muted-foreground">
                      {generatedListing.story}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1 rounded-full h-12">Edit Facts</Button>
                    <Button className="flex-1 rounded-full h-12 shadow-lg">Publish Listing</Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
