export interface Media {
  id: number;
  business_id: number;
  user_id: number;
  type: 'image' | 'video' | 'document';
  url: string;
  thumbnail_url?: string;
  title?: string;
  description?: string;
  created_at?: string;
}
