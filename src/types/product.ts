export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'Computers' | 'Mobile Phones' | 'Accessories';
  description: string;
  image: string;
  images: string[];
  video?: string;
  videoThumbnail?: string;
  stock: number;
  verified: boolean;
  brand?: string;
  featured: boolean;
  isActive?: boolean;
  isArchived?: boolean;
  isUnique?: boolean;
  sizes?: string[];
  colors?: string[];
  createdAt?: string;
}
