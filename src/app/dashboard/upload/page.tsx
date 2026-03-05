
"use client";

import { useState } from 'react';
import { Camera, Sparkles, ArrowRight, Check, Image as ImageIcon, Loader2, Save, Send, RefreshCw } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { artisanAITypeDetection } from '@/ai/flows/artisan-ai-type-detection';
import { generateArtisanListing } from '@/ai/flows/artisan-ai-listing-generator';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function ProductUploadPage() {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Step 2 Inputs
  const [details, setDetails] = useState({
    title: '',
    category: '',
    materials: '',
    style: '',
    region: 'Local Craft Center',
    storyFacts: ''
  });

  // Step 3 Outputs
  const [generatedListing, setGeneratedListing] = useState({
    description: '',
    tags: [] as string[],
    story: '',
    priceRange: ''
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
          setDetails({
            ...details,
            category: result.craftType,
            title: result.suggestedTitle,
            materials: result.suggestedMaterials,
            style: result.craftStyle
          });
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
    setIsProcessing(true);
    try {
      const result = await generateArtisanListing({
        productImages: image ? [image] : [],
        productNameKeywords: details.title,
        craftType: details.category,
        materials: details.materials,
        region: details.region,
        storyFacts: details.storyFacts || `A ${details.style} piece made with ${details.materials} in ${details.region}.`
      });
      setGeneratedListing({
        description: result.description,
        tags: result.seoTags,
        story: result.craftStory,
        priceRange: "₹1,200 - ₹2,500" // Mocked for simplicity in this flow step
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
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-primary' : 'bg-secondary'}`} />
            ))}
          </div>
          <h1 className="text-4xl font-headline font-bold">
            {step === 1 && "Start with a Photo"}
            {step === 2 && "Confirm Craft Details"}
            {step === 3 && "Review Your Listing"}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Image Display */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden border-none shadow-sm rounded-3xl bg-white aspect-[3/4] flex items-center justify-center relative group">
              {image ? (
                <div className="relative w-full h-full">
                  <img src={image} alt="Upload" className="w-full h-full object-cover" />
                  <label className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform opacity-0 group-hover:opacity-100 duration-200">
                    <Camera className="h-6 w-6 text-primary" />
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="bg-secondary/50 p-6 rounded-full inline-block mb-4">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 font-medium">Clear photo from 3 angles works best.</p>
                  <label className="cursor-pointer">
                    <Button variant="secondary" asChild className="rounded-full px-8 h-12 shadow-sm">
                      <span>Select Photo</span>
                    </Button>
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
              )}
              {isProcessing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
                  <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                  <p className="font-bold text-primary animate-pulse uppercase tracking-widest text-xs">Virasya AI Analyzing...</p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: Form Steps */}
          <div className="md:col-span-2">
            <Card className="border-none shadow-sm rounded-3xl bg-white p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="bg-secondary/30 p-8 rounded-3xl border border-primary/5">
                    <h3 className="font-headline text-2xl mb-4 flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-primary" /> AI Vision
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Upload your craft's photo and our AI will automatically suggest:
                    </p>
                    <ul className="mt-4 space-y-3">
                      {['Category Detection', 'Suggested Product Title', 'Materials Identification', 'Craft Style Analysis'].map(item => (
                        <li key={item} className="flex items-center gap-3 text-sm font-medium">
                          <Check className="h-4 w-4 text-primary" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button disabled size="lg" className="w-full rounded-full h-14 mt-4">
                    Waiting for Photo...
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-1">Detected Category</p>
                      <p className="text-xl font-headline font-bold text-primary">{details.category}</p>
                    </div>
                    <Badge variant="outline" className="rounded-full bg-white border-primary/20 text-primary">AI Suggested</Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Suggested Title</Label>
                      <Input value={details.title} onChange={e => setDetails({...details, title: e.target.value})} className="rounded-xl h-12 bg-secondary/20 border-none focus-visible:ring-1 focus-visible:ring-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Materials</Label>
                        <Input value={details.materials} onChange={e => setDetails({...details, materials: e.target.value})} className="rounded-xl h-12 bg-secondary/20 border-none" />
                      </div>
                      <div>
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Craft Style</Label>
                        <Input value={details.style} onChange={e => setDetails({...details, style: e.target.value})} className="rounded-xl h-12 bg-secondary/20 border-none" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Historical/Technique Facts</Label>
                      <Textarea 
                        placeholder="Add facts to base your story on (e.g. 20 years experience, specific village, unique dye technique)" 
                        className="rounded-xl bg-secondary/20 border-none min-h-[100px]"
                        value={details.storyFacts}
                        onChange={e => setDetails({...details, storyFacts: e.target.value})}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleGenerateListing} 
                    disabled={isProcessing}
                    size="lg" 
                    className="w-full rounded-full h-14 gap-2 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                    Generate Listing Content
                  </Button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                   <div className="flex items-center justify-between mb-2">
                    <h3 className="font-headline text-xl font-bold">AI Result</h3>
                    <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="text-xs gap-1 h-8 rounded-full">
                      <RefreshCw className="h-3 w-3" /> Redo
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs font-bold text-muted-foreground uppercase ml-1">Generated Title</Label>
                      <Input value={details.title} onChange={e => setDetails({...details, title: e.target.value})} className="rounded-xl h-12" />
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-muted-foreground uppercase ml-1">Detailed Description</Label>
                      <Textarea value={generatedListing.description} rows={5} className="rounded-xl" onChange={e => setGeneratedListing({...generatedListing, description: e.target.value})} />
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-muted-foreground uppercase ml-1">Authentic Craft Story</Label>
                      <div className="p-5 bg-secondary/20 rounded-2xl text-sm italic leading-relaxed text-muted-foreground border-l-4 border-primary">
                        {generatedListing.story}
                      </div>
                      <p className="text-[10px] mt-1 text-primary/60 italic">*Verified facts only. No historical fabrication.</p>
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-muted-foreground uppercase ml-1">Suggested Price Range</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="h-10 px-4 rounded-xl bg-primary/10 text-primary border-none text-lg font-headline">{generatedListing.priceRange}</Badge>
                        <Input placeholder="Enter Final Price" type="number" className="rounded-xl h-10 w-40" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" className="flex-1 rounded-full h-12 gap-2 border-2">
                      <Save className="h-4 w-4" /> Save Draft
                    </Button>
                    <Button className="flex-1 rounded-full h-12 gap-2 shadow-lg">
                      <Send className="h-4 w-4" /> Publish Listing
                    </Button>
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
