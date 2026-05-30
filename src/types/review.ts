export interface Review {
  id: string;
  name: string;
  rating: number;
  review: string;
  role?: string;
  image?: string;
  source: 'google' | 'internal';
}
