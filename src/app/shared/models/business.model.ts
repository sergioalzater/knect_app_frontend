export interface EstablishmentType {
  establishmentTypeId: number;
  name: string;
  nameEn?: string;
  icon?: string;
  description?: string;
}

export interface EstablishmentBranch {
  id?: number;
  establishmentId?: number;
  businessId?: number;
  establishmentTypeId?: number;
  categoryName?: string;
  name: string;
  description?: string;
  schedules?: string;
  neighborhood?: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  isGhostKitchen?: boolean;
  hasDineIn?: boolean;
  isActive?: boolean;
  whatsappClicks?: number;
}

export interface Business {
  id: number;
  businessId?: number;
  ownerUserId?: number;
  ownerName?: string;
  ownerEmail?: string;
  establishmentTypeId?: number;
  category?: string;
  categoryEn?: string;
  categoryIcon?: string;
  name: string;
  legalName?: string;
  taxNumber?: string;
  description?: string;
  descriptionEn?: string;
  primaryColor?: string;
  logoUrl?: string;
  bannerUrl?: string;
  neighborhood?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  isGhostKitchen?: boolean;
  hasDineIn?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  ratingAvg?: number;
  reviewCount?: number;
  viewCount?: number;
  searchAppearanceCount?: number;
  whatsappClickCount?: number;
  establishments?: EstablishmentBranch[];
  createAt?: string;
  updateAt?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
