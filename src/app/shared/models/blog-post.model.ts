export interface BlogPost {
  postId?: number;
  id?: number;
  title: string;
  titleEn?: string;
  slug: string;
  summary?: string;
  summaryEn?: string;
  content: string;
  contentEn?: string;
  imageUrl?: string;
  authorName?: string;
  publishedAt?: string;
  isActive?: boolean;
  createAt?: string;
}
