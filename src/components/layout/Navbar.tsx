
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Search, User, Store, Sparkles, Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-headline font-bold text-primary tracking-tight">Virasya</span>
          </Link>

          <div className="hidden md:flex items-center flex-1 max-w-md px-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search crafts, regions, artisans..." 
                className="pl-10 h-9 bg-secondary/50 border-none rounded-full"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/marketplace" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Store className="h-4 w-4" />
              Marketplace
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              Artisan Hub
            </Link>
            <div className="h-6 w-[1px] bg-border mx-2" />
            <Button variant="ghost" size="sm" className="gap-2">
              <Globe className="h-4 w-4" />
              EN
            </Button>
            <Link href="/auth">
              <Button size="sm" className="rounded-full px-6">Login</Button>
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-4 px-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search crafts..." 
                className="pl-10 h-10 bg-secondary/50 border-none rounded-full"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 border-t mt-2 flex flex-col gap-4 py-4 animate-in slide-in-from-top-2">
            <Link href="/marketplace" className="px-2 py-2 text-lg font-medium">Marketplace</Link>
            <Link href="/dashboard" className="px-2 py-2 text-lg font-medium">Artisan Hub</Link>
            <Link href="/profile" className="px-2 py-2 text-lg font-medium">My Profile</Link>
            <div className="flex items-center justify-between pt-4 border-t px-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                Language: EN
              </Button>
              <Link href="/auth">
                <Button size="sm" className="rounded-full">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
