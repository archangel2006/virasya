
export type UserRole = 'artisan' | 'buyer';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  preferredLanguage: 'en' | 'hi' | 'ta' | 'bn';
  profilePhoto?: string;
}

export interface Product {
  productId: string;
  artisanId: string;
  artisanName?: string;
  productName: string;
  description: string;
  craftType: 'Pottery' | 'Textiles' | 'Jewelry' | 'Woodwork' | 'Hand painting' | 'Other';
  craftStyle?: string;
  region: string;
  materials: string;
  price: number;
  priceRange?: { min: number; max: number; reasoning: string };
  currency: string;
  images: string[];
  story: string;
  culturalNote?: string;
  tags: string[];
  createdAt: Date;
}

export interface BrowsingHistory {
  userId: string;
  viewedProductIds: string[];
  searchQueries: string[];
  timestamp: Date;
}
