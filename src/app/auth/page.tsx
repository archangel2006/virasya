
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Store, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useFirestore } from '@/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const [role, setRole] = useState<'artisan' | 'buyer' | null>(null);
  const [isEmailForm, setIsEmailForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const handleProfileSync = async (user: any, selectedRole: string) => {
    if (!db) return;
    const userRef = doc(db, 'userProfiles', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create new profile if it doesn't exist
      await setDoc(userRef, {
        id: user.uid,
        name: name || user.displayName || 'Anonymous User',
        email: user.email,
        role: selectedRole,
        location: 'Not Specified',
        preferredLanguage: 'en',
        profilePhotoUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/200/200`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !role) return;
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await handleProfileSync(result.user, role);
      toast({ title: "Welcome to Virasya", description: "Successfully signed in with Google." });
      router.push(role === 'artisan' ? '/dashboard' : '/marketplace');
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Authentication Failed", 
        description: error.message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !role) return;
    setIsLoading(true);
    
    try {
      let userCredential;
      // Try to sign in first, if it fails because user doesn't exist, we could try signup
      // But usually it's better to have separate login/signup. 
      // For this prototype, we'll try to sign in, if it fails, we try to create account.
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (signInError: any) {
        if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
        } else {
          throw signInError;
        }
      }

      await handleProfileSync(userCredential.user, role);
      toast({ title: "Account Ready", description: "You have been successfully authenticated." });
      router.push(role === 'artisan' ? '/dashboard' : '/marketplace');
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: error.message 
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <Button variant="ghost" size="sm" onClick={() => { setRole(null); setIsEmailForm(false); }} className="rounded-full">Back</Button>
            <div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden">
               <div className={`h-full bg-primary transition-all duration-500 ${isEmailForm ? 'w-full' : 'w-1/2'}`} />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Register as {role === 'artisan' ? 'Artisan' : 'Buyer'}</h2>
            <p className="text-sm text-muted-foreground">Complete your profile to unlock features.</p>
          </div>

          {!isEmailForm ? (
            <div className="space-y-4">
              <Button 
                onClick={handleGoogleSignIn} 
                disabled={isLoading}
                className="w-full h-12 rounded-full font-bold shadow-md gap-2"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue with Google"}
              </Button>
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">Or with Email</span></div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsEmailForm(true)}
                className="w-full h-12 rounded-full font-bold gap-2 group"
              >
                Sign Up Manually <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="rounded-xl"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 rounded-full font-bold shadow-md mt-4"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account / Sign In"}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsEmailForm(false)} 
                className="w-full text-xs text-muted-foreground"
              >
                Use Google instead
              </Button>
            </form>
          )}

          <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 p-4 rounded-2xl">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Your identity is verified and secured by Firebase Authentication.
          </div>
        </Card>
      )}
    </div>
  );
}
