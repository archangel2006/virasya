
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { User, Store, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthPage() {
  const [role, setRole] = useState<'artisan' | 'buyer' | null>(null);

  return (
    <div className="min-h-screen flex flex-col paper-texture items-center justify-center p-4">
      <div className="max-w-xl w-full text-center mb-8">
        <Link href="/" className="text-4xl font-headline font-bold text-primary tracking-tight mb-4 inline-block">Virasya</Link>
        <h1 className="text-3xl font-headline font-bold mb-2">Join the Heritage Movement</h1>
        <p className="text-muted-foreground">Select your journey to begin preserving and discovering art.</p>
      </div>

      {!role ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
          <Card 
            className="group cursor-pointer border-2 hover:border-primary transition-all rounded-3xl overflow-hidden bg-white"
            onClick={() => setRole('artisan')}
          >
            <CardHeader className="text-center p-8 pb-4">
              <div className="mx-auto bg-primary/10 p-6 rounded-full w-fit group-hover:bg-primary group-hover:text-white transition-colors">
                <Store className="h-10 w-10" />
              </div>
              <CardTitle className="text-2xl mt-4">I am an Artisan</CardTitle>
            </CardHeader>
            <CardContent className="text-center p-8 pt-0">
              <p className="text-sm text-muted-foreground leading-relaxed">
                I create handcrafted products and want to reach a global audience with AI assistance.
              </p>
            </CardContent>
          </Card>

          <Card 
            className="group cursor-pointer border-2 hover:border-accent transition-all rounded-3xl overflow-hidden bg-white"
            onClick={() => setRole('buyer')}
          >
            <CardHeader className="text-center p-8 pb-4">
              <div className="mx-auto bg-accent/10 p-6 rounded-full w-fit group-hover:bg-accent group-hover:text-white transition-colors">
                <User className="h-10 w-10" />
              </div>
              <CardTitle className="text-2xl mt-4">I am a Buyer</CardTitle>
            </CardHeader>
            <CardContent className="text-center p-8 pt-0">
              <p className="text-sm text-muted-foreground leading-relaxed">
                I love handmade art and want to discover unique crafts with authentic heritage stories.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="max-w-md w-full border-none shadow-xl rounded-[40px] bg-white p-8 animate-in zoom-in-95">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="sm" onClick={() => setRole(null)} className="rounded-full">Back</Button>
            <div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden">
               <div className="h-full bg-primary w-1/2" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Register as {role === 'artisan' ? 'Artisan' : 'Buyer'}</h2>
            <p className="text-sm text-muted-foreground">Complete your profile to unlock features.</p>
          </div>

          <div className="space-y-4">
            <Button className="w-full h-12 rounded-full font-bold shadow-md gap-2">
               Continue with Google
            </Button>
            <div className="relative py-4">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t"></div></div>
               <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">Or with Email</span></div>
            </div>
            <Link href={role === 'artisan' ? '/dashboard' : '/marketplace'}>
               <Button variant="outline" className="w-full h-12 rounded-full font-bold gap-2 group">
                 Sign Up Manually <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
               </Button>
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 p-4 rounded-2xl">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Your identity is verified and secured by Firebase Authentication.
          </div>
        </Card>
      )}
    </div>
  );
}
