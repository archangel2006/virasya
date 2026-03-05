
export type UserRole = 'artisan' | 'buyer';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  preferredLanguage: 'en' | 'hi';
  profilePhoto?: string;
}

export interface Product {
  productId: string;
  artisanId: string;
  artisanName?: string;
  productName: string;
  description: string;
  craftType: 'Pottery' | 'Textiles' | 'Jewelry' | 'Woodwork' | 'Hand painting' | 'Other';
  region: string;
  materials: string;
  price: number;
  currency: string;
  images: string[];
  story: string;
  tags: string[];
  createdAt: Date;
}

export interface BrowsingHistory {
  userId: string;
  viewedProductIds: string[];
  searchQueries: string[];
  timestamp: Date;
}
