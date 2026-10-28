import { Business, EstablishmentBranch } from './business.model';

export interface HomeCms {
  heroTitleEs: string;
  heroTitleEn: string;
  heroSubtitleEs: string;
  heroSubtitleEn: string;
  heroBannerUrl: string;
  heroCtaTextEs: string;
  heroCtaTextEn: string;
  featuredTitleEs: string;
  featuredTitleEn: string;
  newsTitleEs: string;
  newsTitleEn: string;
  contactTitleEs: string;
  contactTitleEn: string;
  contactSubtitleEs: string;
  contactSubtitleEn: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}

export interface ContactMessage {
  contactId: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  emailSent: boolean;
  isRead: boolean;
  createAt: string;
}

export interface BusinessAnalytics {
  businessId: number;
  businessName: string;
  ratingAvg: number;
  reviewCount: number;
  viewCount: number;
  searchAppearanceCount: number;
  whatsappClickCount: number;
  totalBranches: number;
  repliedReviewsCount: number;
  pendingReviewsCount: number;
  branchesPerformance: EstablishmentBranch[];
}

export interface GlobalAnalytics {
  totalVisits: number;
  totalActiveBusinesses: number;
  totalBusinesses: number;
  totalBranches: number;
  totalUsers: number;
  totalReviews: number;
  totalBlogPosts: number;
  totalSearchQueries: number;
  totalWhatsappClicks: number;
  totalContactMessages: number;
  recentSearches: string[];
  businessesByCategory: Record<string, number>;
  topBusinessesByWhatsapp: Business[];
}
