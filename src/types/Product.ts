export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  imageUrl?: string;
  category: string;
  stock?: number;
  active?: boolean;
  medium?: string;
  dimensions?: string;
}
