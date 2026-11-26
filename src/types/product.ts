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
  /** Set when a sale automatically deactivated the product (out of stock / unique). */
  autoDeactivated?: boolean;
  /** No on-site stock: show "Check availability" on WhatsApp instead of checkout. */
  requiresAvailabilityCheck?: boolean;
  /** Price is an estimate, not a firm price. */
  priceIsEstimate?: boolean;
  /** Stable delivery option value (see lib/delivery.ts). */
  deliveryEstimate?: string;
  sizes?: string[];
  colors?: string[];
  createdAt?: string;
}
