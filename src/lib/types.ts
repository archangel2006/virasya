
export type UserRole = 'artisan' | 'buyer';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  preferredLanguage: 'en' | 'hi' | 'ta' | 'bn' | 'mr';
  profilePhoto?: string;
}

export interface MarketingContent {
  instagram: string;
  whatsapp: string;
  hashtags: string[];
  promoLine: string;
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
  availableQuantity: number;
  priceRange?: { 
    min: number; 
    max: number; 
    reasoning: string 
  };
  currency: string;
  images: string[];
  story: string;
  culturalNote?: string;
  tags: string[];
  marketing?: MarketingContent;
  createdAt: Date;
}
