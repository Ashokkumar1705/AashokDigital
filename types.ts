
export type Category = 'eBook' | 'Course' | 'Template' | 'Tool';

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  category: Category;
  rating: number;
  reviewsCount: number;
  image: string;
  features: string[];
  longDescription: string;
  fileSize: string;
  reviews: Review[];
  // Enhanced metadata
  downloadUrl?: string;
  author?: string;
  pageCount?: number;
}

export interface Bundle {
  id: string;
  title: string;
  description: string;
  productIds: string[];
  price: number;
  originalPrice: number;
  image: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: 'user' | 'owner';
  purchases: string[]; // Array of product IDs or Bundle IDs
}
